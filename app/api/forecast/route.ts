import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.groq_api_key;
const GROQ_MODEL = 'llama-3.3-70b-specdec';

async function fetchGroqBriefing(deptName: string, date: string, scheduled: number, predicted: number, attendanceRate: number) {
  if (!GROQ_API_KEY) {
    return `AI Summary unavailable (no Groq key configured). Scheduled: ${scheduled}, Predicted: ${predicted} (${Math.round(attendanceRate * 100)}% attendance rate).`;
  }

  const prompt = `
You are an expert AI Workforce Operations Analyst. Write a highly concise, professional, and action-oriented staffing briefing for the manager of the "${deptName}" department for the date: ${date}.
Data:
- Scheduled workers: ${scheduled}
- Predicted attendance: ${predicted} (based on a ${Math.round(attendanceRate * 100)}% attendance rate over the last 7 days)
- Staffing gap: ${scheduled - predicted} worker(s) short.

Instructions:
1. Write a maximum of 2 sentences.
2. Be direct and actionable.
3. Suggest clear next steps (e.g. requesting standby swaps or reorganizing lines).
4. Do not include any greeting or conversational filler. Start directly with the operational status.
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
      const errorText = await response.text();
      throw new Error(`Groq API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error('Groq briefing API error:', error);
    return `Operational Alert: The ${deptName} shift for ${date} is forecast at ${predicted}/${scheduled} active headcount (${Math.round(attendanceRate * 100)}% historical attendance). Consider activating standby cover.`;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const query = `
      SELECT f.*, d.name as department_name
      FROM staffing_forecasts f
      JOIN departments d ON f.department_id = d.id
      WHERE f.shift_date = $1
      ORDER BY d.name ASC
    `;
    const result = await db.query(query, [dateStr]);
    return NextResponse.json({ success: true, forecasts: result.rows });
  } catch (error: any) {
    console.error('Failed to retrieve forecasts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date } = body;
    const targetDate = date || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Default to tomorrow

    console.log(`Computing staffing forecast for date ${targetDate}...`);

    // 1. Get all departments
    const departmentsRes = await db.query(`SELECT id, name FROM departments`);
    const departments = departmentsRes.rows;

    const forecasts = [];

    for (const dept of departments) {
      // 2. Find scheduled headcount for target date in this department
      const scheduledRes = await db.query(
        `SELECT COUNT(*) as count
         FROM shifts s
         JOIN employees e ON s.employee_id = e.id
         WHERE e.department_id = $1 AND s.date = $2 AND s.status = 'Scheduled'`,
        [dept.id, targetDate]
      );
      const scheduledCount = parseInt(scheduledRes.rows[0].count, 10);

      // If nothing is scheduled, skip or write a zero-forecast
      if (scheduledCount === 0) {
        continue;
      }

      // 3. Compute historical attendance rate for this department in the last 7 days
      // Completed / (Completed + Absent)
      const historicalRes = await db.query(
        `SELECT 
           COUNT(CASE WHEN s.status = 'Completed' THEN 1 END) as completed_count,
           COUNT(CASE WHEN s.status = 'Absent' THEN 1 END) as absent_count
         FROM shifts s
         JOIN employees e ON s.employee_id = e.id
         WHERE e.department_id = $1 AND s.date >= CURRENT_DATE - interval '7 days' AND s.date < CURRENT_DATE`,
        [dept.id]
      );
      
      const completed = parseInt(historicalRes.rows[0].completed_count, 10) || 0;
      const absent = parseInt(historicalRes.rows[0].absent_count, 10) || 0;
      const totalShifts = completed + absent;

      let attendanceRate = 1.0; // Default if no history
      let confidenceBand = 'Low';

      if (totalShifts > 0) {
        attendanceRate = completed / totalShifts;
        if (totalShifts >= 15) {
          confidenceBand = 'High';
        } else if (totalShifts >= 5) {
          confidenceBand = 'Medium';
        }
      }

      // 4. Calculate predicted attendance headcount
      const predictedHeadcount = Math.max(0, Math.round(scheduledCount * attendanceRate));

      // 5. Generate AI Briefing narrative
      const aiBriefingText = await fetchGroqBriefing(
        dept.name,
        targetDate,
        scheduledCount,
        predictedHeadcount,
        attendanceRate
      );

      // 6. Save or update database forecast
      const existingRes = await db.query(
        `SELECT id FROM staffing_forecasts WHERE department_id = $1 AND shift_date = $2`,
        [dept.id, targetDate]
      );

      if (existingRes.rows.length > 0) {
        await db.query(
          `UPDATE staffing_forecasts
           SET predicted_headcount = $1, confidence_band = $2, ai_briefing_text = $3
           WHERE id = $4`,
          [predictedHeadcount, confidenceBand, aiBriefingText, existingRes.rows[0].id]
        );
      } else {
        await db.query(
          `INSERT INTO staffing_forecasts (department_id, shift_date, predicted_headcount, confidence_band, ai_briefing_text)
           VALUES ($1, $2, $3, $4, $5)`,
          [dept.id, targetDate, predictedHeadcount, confidenceBand, aiBriefingText]
        );
      }

      forecasts.push({
        department_id: dept.id,
        department_name: dept.name,
        shift_date: targetDate,
        scheduled_count: scheduledCount,
        predicted_headcount: predictedHeadcount,
        confidence_band: confidenceBand,
        ai_briefing_text: aiBriefingText,
      });
    }

    return NextResponse.json({ success: true, forecasts });
  } catch (error: any) {
    console.error('Failed to generate forecast:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
