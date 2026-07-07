import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callAIWithFallback } from '@/lib/ai-provider';

// Factory GPS Coordinates
const FACTORY_LAT = 23.8103;
const FACTORY_LNG = 90.4125;

// Haversine formula to compute distance in meters between two GPS coordinates
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Radius of Earth in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Generate natural language digest of flags using AI (Groq -> Gemini fallback)
async function fetchFraudDigest(flagCount: number, flagsSummary: string) {
  const prompt = `
You are an expert Forensic HR Auditor. Write a brief summary digest of the workforce anomalies flagged this week.
Anomalies detected:
${flagsSummary}

Instructions:
1. Write a maximum of 2 sentences.
2. Direct, serious, and professional tone.
3. Classify the main risk and suggest whether this indicates training issues, systemic fraud, or hardware errors.
4. Do not include greetings or boilerplate.
`;

  const result = await callAIWithFallback({ prompt, temperature: 0.4, maxTokens: 150 });

  return result || `Operational Digest: ${flagCount} items require review. Location checks indicate isolated GPS offsets; standard overtime checks show outliers in line baselines.`;
}

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = (session.user as any).company_id;

    const result = await db.query(`
      SELECT f.*, e.name as employee_name, e.role as employee_role
      FROM fraud_flags f
      LEFT JOIN employees e ON f.employee_id = e.id
      WHERE e.company_id = $1
      ORDER BY f.raised_at DESC
    `, [companyId]);
    return NextResponse.json({ success: true, flags: result.rows });
  } catch (error: any) {
    console.error('Failed to get fraud flags:', error);
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
    console.log(`Running fraud detection engine for company ${companyId}...`);

    const newFlagsCount = { geofence: 0, overtime: 0, buddy: 0 };
    const flagsListForDigest: string[] = [];

    // 1. Geofence Check: Scan check-ins in the last 7 days for GPS deviations
    const geofenceLogs = await db.query(`
      SELECT b.id, b.employee_id, b.timestamp, b.gps_lat, b.gps_lng, e.name
      FROM biometric_logs b
      JOIN employees e ON b.employee_id = e.id
      WHERE b.timestamp >= NOW() - interval '7 days'
        AND b.gps_lat IS NOT NULL 
        AND b.gps_lng IS NOT NULL
        AND e.company_id = $1
    `, [companyId]);

    for (const log of geofenceLogs.rows) {
      const distance = haversineDistance(FACTORY_LAT, FACTORY_LNG, log.gps_lat, log.gps_lng);
      if (distance > 100) { // Distance exceeding 100 meters
        const details = `Check-in recorded ${Math.round(distance)}m away from factory geofence boundary. Coordinates: (${log.gps_lat}, ${log.gps_lng})`;
        
        // Check if flag already exists
        const exists = await db.query(
          `SELECT id FROM fraud_flags WHERE employee_id = $1 AND flag_type = 'geofence' AND details = $2`,
          [log.employee_id, details]
        );

        if (exists.rows.length === 0) {
          await db.query(
            `INSERT INTO fraud_flags (employee_id, flag_type, status, details)
             VALUES ($1, 'geofence', 'Pending', $2)`,
            [log.employee_id, details]
          );
          newFlagsCount.geofence++;
          flagsListForDigest.push(`- ${log.name}: Geofence violation (${Math.round(distance)}m out of bounds)`);
        }
      }
    }

    // 2. Overtime Outliers: Compute z-score of overtime hours in current month
    const period = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
    const year = parseInt(period.split('-')[0], 10);
    const month = parseInt(period.split('-')[1], 10);
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const overtimeRes = await db.query(
      `SELECT employee_id, e.name, SUM(overtime_hours) as ot_hours
       FROM payroll_ledgers p
       JOIN employees e ON p.employee_id = e.id
       WHERE period_start >= $1 AND period_end <= $2 AND e.company_id = $3
       GROUP BY employee_id, e.name`,
      [startDate, endDate, companyId]
    );

    const ots = overtimeRes.rows.map(r => ({
      empId: r.employee_id,
      name: r.name,
      hours: parseFloat(r.ot_hours) || 0
    }));

    if (ots.length > 1) {
      const count = ots.length;
      const mean = ots.reduce((sum, item) => sum + item.hours, 0) / count;
      const variance = ots.reduce((sum, item) => sum + Math.pow(item.hours - mean, 2), 0) / count;
      const stdDev = Math.sqrt(variance);

      if (stdDev > 0) {
        for (const item of ots) {
          const zScore = (item.hours - mean) / stdDev;
          // Flag if employee's overtime is significantly higher than peers (Z-score > 1.5) and they did > 2 hours
          if (zScore > 1.5 && item.hours > 2) {
            const details = `Overtime outlier: Z-score is ${zScore.toFixed(2)} (Worked ${item.hours.toFixed(1)} hrs overtime vs average peer of ${mean.toFixed(1)} hrs).`;
            
            const exists = await db.query(
              `SELECT id FROM fraud_flags WHERE employee_id = $1 AND flag_type = 'overtime_outlier' AND details = $2`,
              [item.empId, details]
            );

            if (exists.rows.length === 0) {
              await db.query(
                `INSERT INTO fraud_flags (employee_id, flag_type, status, details)
                 VALUES ($1, 'overtime_outlier', 'Pending', $2)`,
                [item.empId, details]
              );
              newFlagsCount.overtime++;
              flagsListForDigest.push(`- ${item.name}: Overtime outlier (${item.hours.toFixed(1)} hrs worked)`);
            }
          }
        }
      }
    }

    // 3. Buddy punch / face mismatch checks (simulate from low confidence matches or double punches)
    const doublePunches = await db.query(`
      SELECT b1.employee_id, e.name, b1.timestamp
      FROM biometric_logs b1
      JOIN biometric_logs b2 ON b1.timestamp = b2.timestamp AND b1.employee_id != b2.employee_id
      JOIN employees e ON b1.employee_id = e.id
      WHERE b1.timestamp >= NOW() - interval '7 days'
        AND e.company_id = $1
    `, [companyId]);

    for (const dp of doublePunches.rows) {
      const details = `Simultaneous login flagged: Different employee IDs clocked in at exactly the same time (${new Date(dp.timestamp).toLocaleString()}).`;
      
      const exists = await db.query(
        `SELECT id FROM fraud_flags WHERE employee_id = $1 AND flag_type = 'buddy_punch' AND details = $2`,
        [dp.employee_id, details]
      );

      if (exists.rows.length === 0) {
        await db.query(
          `INSERT INTO fraud_flags (employee_id, flag_type, status, details)
           VALUES ($1, 'buddy_punch', 'Pending', $2)`,
          [dp.employee_id, details]
        );
        newFlagsCount.buddy++;
        flagsListForDigest.push(`- ${dp.name}: Simultaneous punch check`);
      }
    }

    const totalFlagsCreated = newFlagsCount.geofence + newFlagsCount.overtime + newFlagsCount.buddy;
    let aiDigestText = '';

    if (totalFlagsCreated > 0) {
      const summaryString = flagsListForDigest.join('\n');
      aiDigestText = await fetchFraudDigest(totalFlagsCreated, summaryString);

      // Save AI digest text on the newly created flags belonging to this company
      await db.query(
        `UPDATE fraud_flags 
         SET ai_digest_text = $1 
         WHERE ai_digest_text IS NULL 
           AND employee_id IN (SELECT id FROM employees WHERE company_id = $2)`,
        [aiDigestText, companyId]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Fraud engine run complete.',
      flags_raised: totalFlagsCreated,
      summary: newFlagsCount,
      ai_digest: aiDigestText
    });
  } catch (error: any) {
    console.error('Failed to run fraud engine:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = (session.user as any).company_id;
    const body = await request.json();
    const { flag_id, status, resolved_by } = body;

    if (!flag_id || !status) {
      return NextResponse.json({ success: false, error: 'flag_id and status are required.' }, { status: 400 });
    }

    // Verify flag belongs to an employee in this company
    const flagCheck = await db.query(
      `SELECT f.id FROM fraud_flags f 
       JOIN employees e ON f.employee_id = e.id 
       WHERE f.id = $1 AND e.company_id = $2`,
      [flag_id, companyId]
    );

    if (flagCheck.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Access denied: flag not found in your company.' }, { status: 403 });
    }

    await db.query(
      `UPDATE fraud_flags
       SET status = $1, resolved_by = $2
       WHERE id = $3`,
      [status, resolved_by || null, flag_id]
    );

    return NextResponse.json({ success: true, message: 'Fraud flag updated successfully!' });
  } catch (error: any) {
    console.error('Failed to update fraud flag:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
