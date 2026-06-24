import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.groq_api_key;
const GROQ_MODEL = 'llama-3.3-70b-specdec';

async function fetchGroqPerformanceSummary(
  empName: string,
  punctuality: number,
  adherence: number,
  overtimeHours: number,
  composite: number
) {
  if (!GROQ_API_KEY) {
    return `AI Summary unavailable. Composite Score: ${Math.round(composite)}% (Punctuality: ${Math.round(punctuality)}%, Adherence: ${Math.round(adherence)}%, Overtime: ${overtimeHours} hrs).`;
  }

  const prompt = `
You are an expert HR Performance Analyst. Write a brief, objective, and supportive narrative performance summary for the worker "${empName}" based on this month's stats:
- Punctuality Score: ${Math.round(punctuality)}% (how often they clock in on time)
- Shift Adherence Score: ${Math.round(adherence)}% (scheduled vs completed shifts)
- Overtime Hours Worked: ${overtimeHours.toFixed(1)} hours
- Overall Performance Rating: ${Math.round(composite)}%

Instructions:
1. Limit the response to 1-2 sentences.
2. Highlight areas of strength (e.g. high attendance, zero lateness) or note areas of concern (e.g. frequent lateness, high overtime burnout risk).
3. Do not use generic greetings or salutations. Write in third person.
`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq Performance API returned status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error('Groq performance summary error:', error);
    return `${empName} maintained a composite score of ${Math.round(composite)}% with ${overtimeHours.toFixed(1)} hours of overtime. Attendances are overall consistent.`;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || new Date().toISOString().slice(0, 7); // Default to current 'YYYY-MM'

    const query = `
      SELECT p.*, e.name as employee_name, e.role as employee_role, d.name as department_name
      FROM performance_scores p
      JOIN employees e ON p.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE p.period = $1
      ORDER BY p.composite_score DESC, e.name ASC
    `;
    const result = await db.query(query, [period]);
    return NextResponse.json({ success: true, scores: result.rows });
  } catch (error: any) {
    console.error('Failed to get performance scores:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { period } = body;
    const targetPeriod = period || new Date().toISOString().slice(0, 7); // Default to current month 'YYYY-MM'

    console.log(`Calculating performance scores for period ${targetPeriod}...`);

    const year = parseInt(targetPeriod.split('-')[0], 10);
    const month = parseInt(targetPeriod.split('-')[1], 10);
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // last day of month

    // Get all active workers
    const employeesRes = await db.query(`SELECT id, name, role FROM employees WHERE role = 'Worker' AND status = 'Active'`);
    const employees = employeesRes.rows;

    const scores = [];

    for (const emp of employees) {
      // 1. Get scheduled vs completed shifts
      const shiftsRes = await db.query(
        `SELECT status FROM shifts
         WHERE employee_id = $1 AND date >= $2 AND date <= $3`,
        [emp.id, startDate, endDate]
      );
      const shifts = shiftsRes.rows;
      const scheduledCount = shifts.length;

      if (scheduledCount === 0) continue;

      const completedCount = shifts.filter(s => s.status === 'Completed').length;

      // Adherence: (Completed / Scheduled) * 100
      const adherenceScore = (completedCount / scheduledCount) * 100;

      // 2. Compute punctuality: late clock-ins
      // Let's pair check-ins for this employee
      const checkInsRes = await db.query(
        `SELECT timestamp
         FROM biometric_logs
         WHERE employee_id = $1 AND log_type = 'Check_In' AND timestamp >= $2::timestamp AND timestamp <= $3::timestamp + interval '1 day'`,
        [emp.id, startDate, endDate]
      );
      const checkIns = checkInsRes.rows;

      let onTimeCount = 0;
      for (const ci of checkIns) {
        const time = new Date(ci.timestamp);
        // Let's check check-in time relative to shift start (usually 8:00 AM)
        const hour = time.getHours();
        const minute = time.getMinutes();
        
        // Late if clocked in after 8:10 AM
        if (hour < 8 || (hour === 8 && minute <= 10)) {
          onTimeCount++;
        }
      }

      const punctualityScore = checkIns.length > 0 ? (onTimeCount / checkIns.length) * 100 : 100;

      // 3. Overtime hours
      const overtimeRes = await db.query(
        `SELECT COALESCE(SUM(overtime_hours), 0) as ot_hours
         FROM payroll_ledgers
         WHERE employee_id = $1 AND period_start >= $2 AND period_end <= $3`,
        [emp.id, startDate, endDate]
      );
      const overtimeHours = parseFloat(overtimeRes.rows[0].ot_hours);

      // Composite Rating: 60% Punctuality, 40% Adherence
      const compositeScore = (0.6 * punctualityScore) + (0.4 * adherenceScore);

      // 4. Generate AI summary highlights
      const aiSummaryText = await fetchGroqPerformanceSummary(
        emp.name,
        punctualityScore,
        adherenceScore,
        overtimeHours,
        compositeScore
      );

      // 5. Save or update database
      const existingRes = await db.query(
        `SELECT id FROM performance_scores WHERE employee_id = $1 AND period = $2`,
        [emp.id, targetPeriod]
      );

      if (existingRes.rows.length > 0) {
        await db.query(
          `UPDATE performance_scores
           SET punctuality_score = $1, overtime_trend = $2, adherence_score = $3, composite_score = $4, ai_summary_text = $5
           WHERE id = $6`,
          [
            Math.round(punctualityScore * 10) / 10,
            overtimeHours,
            Math.round(adherenceScore * 10) / 10,
            Math.round(compositeScore * 10) / 10,
            aiSummaryText,
            existingRes.rows[0].id,
          ]
        );
      } else {
        await db.query(
          `INSERT INTO performance_scores (employee_id, period, punctuality_score, overtime_trend, adherence_score, composite_score, ai_summary_text)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            emp.id,
            targetPeriod,
            Math.round(punctualityScore * 10) / 10,
            overtimeHours,
            Math.round(adherenceScore * 10) / 10,
            Math.round(compositeScore * 10) / 10,
            aiSummaryText,
          ]
        );
      }

      scores.push({
        employee_id: emp.id,
        employee_name: emp.name,
        period: targetPeriod,
        punctuality_score: Math.round(punctualityScore * 10) / 10,
        adherence_score: Math.round(adherenceScore * 10) / 10,
        overtime_trend: overtimeHours,
        composite_score: Math.round(compositeScore * 10) / 10,
        ai_summary_text: aiSummaryText,
      });
    }

    return NextResponse.json({ success: true, scores });
  } catch (error: any) {
    console.error('Failed to calculate performance scores:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
