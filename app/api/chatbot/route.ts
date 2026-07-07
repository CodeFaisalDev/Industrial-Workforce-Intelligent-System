import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callAIWithFallback } from '@/lib/ai-provider';

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = (session.user as any).company_id;
    const sessionUserId = parseInt((session.user as any).id);
    const sessionRole = (session.user as any).role;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'user_id is required' }, { status: 400 });
    }

    const userIdNum = parseInt(userId);

    // Verify target employee belongs to the same company
    const empCheck = await db.query('SELECT company_id FROM employees WHERE id = $1', [userIdNum]);
    if (empCheck.rows.length === 0 || empCheck.rows[0].company_id !== companyId) {
      return NextResponse.json({ success: false, error: 'Access denied: employee not found in your company.' }, { status: 403 });
    }

    // Workers can only read their own chat history
    if (sessionRole === 'Worker' && sessionUserId !== userIdNum) {
      return NextResponse.json({ success: false, error: 'Access denied: workers can only view their own history.' }, { status: 403 });
    }

    const result = await db.query(
      `SELECT * FROM chatbot_conversations
       WHERE user_id = $1
       ORDER BY timestamp ASC
       LIMIT 50`,
      [userIdNum]
    );

    return NextResponse.json({ success: true, history: result.rows });
  } catch (error: any) {
    console.error('Failed to load chat history:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = (session.user as any).company_id;
    const sessionUserId = parseInt((session.user as any).id);
    const sessionRole = (session.user as any).role;

    const body = await request.json();
    const { message, user_id } = body;

    if (!message || !user_id) {
      return NextResponse.json(
        { success: false, error: 'message and user_id are required.' },
        { status: 400 }
      );
    }

    const userIdNum = parseInt(user_id);

    // 1. Query employee details & verify tenant matching
    const empRes = await db.query(
      `SELECT e.id, e.name, e.email, e.role, e.company_id, d.name as department_name
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.id
       WHERE e.id = $1`,
      [userIdNum]
    );

    if (empRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Employee not found.' }, { status: 404 });
    }

    const employee = empRes.rows[0];

    if (employee.company_id !== companyId) {
      return NextResponse.json({ success: false, error: 'Access denied: employee not in your company.' }, { status: 403 });
    }

    // Workers can only post in their own chat session
    if (sessionRole === 'Worker' && sessionUserId !== userIdNum) {
      return NextResponse.json({ success: false, error: 'Access denied.' }, { status: 403 });
    }

    console.log(`Processing chatbot query for user ${userIdNum} (Company ${companyId}): "${message}"`);

    // 2. Query worker's recent shifts (last 5)
    const shiftsRes = await db.query(
      `SELECT date, start_time, end_time, status
       FROM shifts
       WHERE employee_id = $1
       ORDER BY date DESC
       LIMIT 5`,
      [userIdNum]
    );
    const shifts = shiftsRes.rows;

    // 3. Query worker's latest payroll ledger
    const payrollRes = await db.query(
      `SELECT period_start, period_end, regular_hours, overtime_hours, gross_pay, deductions, net_pay, status
       FROM payroll_ledgers
       WHERE employee_id = $1
       ORDER BY period_start DESC
       LIMIT 1`,
      [userIdNum]
    );
    const payroll = payrollRes.rows[0] || null;

    // 4. Retrieve matching policy documents via Postgres trigram similarity, restricted to active company context
    const docsRes = await db.query(
      `SELECT chunk_text, source_doc, chunk_text <-> $1 as distance
       FROM chatbot_knowledge_base
       WHERE company_id = $2 OR company_id IS NULL
       ORDER BY distance ASC
       LIMIT 3`,
      [message, companyId]
    );
    const policies = docsRes.rows;

    // 5. Query chat history (last 6 messages) for context
    const historyRes = await db.query(
      `SELECT message, role FROM chatbot_conversations
       WHERE user_id = $1
       ORDER BY timestamp DESC
       LIMIT 6`,
      [userIdNum]
    );
    const chatHistory = historyRes.rows.reverse();

    // 6. Build the prompt for Groq
    let context = `Active User Details:
Name: ${employee.name}
Email: ${employee.email}
Role: ${employee.role}
Department: ${employee.department_name || 'N/A'}

Recent Shifts:
${shifts.map(s => `- Date: ${s.date.toISOString().split('T')[0]}, Hours: ${s.start_time} - ${s.end_time}, Status: ${s.status}`).join('\n') || 'No shifts found.'}

Latest Payslip Data:
${payroll ? `- Period: ${payroll.period_start.toISOString().split('T')[0]} to ${payroll.period_end.toISOString().split('T')[0]}
  - Regular Hours: ${payroll.regular_hours}
  - Overtime Hours: ${payroll.overtime_hours}
  - Gross Pay: $${payroll.gross_pay}
  - Deductions: $${payroll.deductions}
  - Net Pay: $${payroll.net_pay}
  - Status: ${payroll.status}` : 'No payroll record generated yet.'}

Relevant Company Policies (RAG Context):
${policies.map((p, idx) => `[Policy ${idx + 1} (${p.source_doc})]: ${p.chunk_text}`).join('\n\n')}
`;

    // Connect to AI (Groq -> Gemini fallback)
    const messages = [
      {
        role: 'system',
        content: `You are an intelligent, empathetic, and professional AI Assistant on the factory floor.
You help workers and managers answer questions about schedules, payslips, company policies, and general inquiries.
You have access to the user's data (shifts, payroll) and verified company policies.

Guidelines:
1. Ground your answers strictly in the provided User Details, Recent Shifts, Payslip Data, and Company Policies.
2. If the user asks a question about their pay or shifts, calculate/reference the exact numbers shown in the data.
3. If the data is missing or doesn't answer their query, explain that you don't have that information and suggest contacting their HR Admin or Floor Manager. Do not make up answers.
4. Keep replies clear, polite, and relatively concise.
5. Address the user directly as ${employee.name}.`
      },
      ...chatHistory.map(h => ({ role: h.role, content: h.message })),
      { role: 'user', content: `Context:\n${context}\n\nUser Question: ${message}` }
    ];

    const reply = await callAIWithFallback({
      prompt: message,
      messages,
      temperature: 0.3,
      maxTokens: 500,
    });

    const finalReply = reply || `Hello ${employee.name}, I am currently running in offline mode (all AI providers exhausted). Here is your shift count: ${shifts.length} recent shifts. Please contact HR for assistance.`;

    // 7. Save user message and bot reply to database
    await db.query(
      `INSERT INTO chatbot_conversations (user_id, message, role) VALUES ($1, $2, 'user')`,
      [userIdNum, message]
    );

    await db.query(
      `INSERT INTO chatbot_conversations (user_id, message, role) VALUES ($1, $2, 'assistant')`,
      [userIdNum, finalReply]
    );

    return NextResponse.json({ success: true, reply: finalReply });
  } catch (error: any) {
    console.error('Failed to process chat:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
