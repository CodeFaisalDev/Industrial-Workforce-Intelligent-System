import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const FACTORY_LAT = 23.8103;
const FACTORY_LNG = 90.4125;

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
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

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employee_id');

    let query = `
      SELECT b.*, e.name as employee_name, e.role as employee_role
      FROM biometric_logs b
      JOIN employees e ON b.employee_id = e.id
    `;
    const params: any[] = [];

    if (role === 'Floor Manager') {
      query += `
        INNER JOIN manager_worker_access mwa ON e.id = mwa.worker_id
        WHERE mwa.manager_id = $1
      `;
      params.push(userId);
      if (employeeId) {
        query += ` AND b.employee_id = $2`;
        params.push(employeeId);
      }
    } else if (role === 'Worker') {
      query += `
        WHERE b.employee_id = $1
      `;
      params.push(userId);
    } else {
      // HR Admin
      if (employeeId) {
        query += ` WHERE b.employee_id = $1`;
        params.push(employeeId);
      }
    }

    query += ` ORDER BY b.timestamp DESC LIMIT 100`;

    const result = await db.query(query, params);
    return NextResponse.json({ success: true, logs: result.rows });
  } catch (error: any) {
    console.error('Failed to query biometric logs:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      employee_id,
      log_type, // 'Check_In', 'Check_Out'
      gps_lat,
      gps_lng,
      verified_by_face,
      device_id,
      confidence_score, // optional from face-api.js match
      device_type, // 'Kiosk' or 'Mobile'
    } = body;

    if (!employee_id || !log_type || !device_id) {
      return NextResponse.json(
        { success: false, error: 'employee_id, log_type, and device_id are required.' },
        { status: 400 }
      );
    }

    console.log(`Processing ${log_type} for employee ${employee_id}...`);

    // Verify employee exists
    const empRes = await db.query(`SELECT id, name FROM employees WHERE id = $1`, [employee_id]);
    if (empRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Employee not found.' }, { status: 404 });
    }
    const employeeName = empRes.rows[0].name;

    const timestamp = new Date().toISOString();

    // 1. Geofence Distance validation
    let isGeofenceViolation = false;
    let distance = 0;

    if (gps_lat && gps_lng) {
      distance = haversineDistance(FACTORY_LAT, FACTORY_LNG, gps_lat, gps_lng);
      if (distance > 100) {
        isGeofenceViolation = true;
      }
    }

    // 2. Insert Biometric Log
    const logRes = await db.query(
      `INSERT INTO biometric_logs (employee_id, timestamp, log_type, device_id, verified_by_face, gps_lat, gps_lng)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [employee_id, timestamp, log_type, device_id, !!verified_by_face, gps_lat || null, gps_lng || null]
    );

    // 3. Log Recognition Attempt for auditing
    if (verified_by_face || confidence_score !== undefined) {
      await db.query(
        `INSERT INTO recognition_attempts (employee_id, confidence_score, matched, device_type, gps_lat, gps_lng)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          employee_id,
          confidence_score || (verified_by_face ? 0.95 : 0.0),
          !!verified_by_face,
          device_type || 'Kiosk',
          gps_lat || null,
          gps_lng || null,
        ]
      );
    }

    // 4. If geofence is violated, immediately raise a fraud flag in real-time
    if (isGeofenceViolation) {
      const details = `Check-in recorded ${Math.round(distance)}m away from factory geofence boundary. Coordinates: (${gps_lat}, ${gps_lng})`;
      
      // Prevent duplicate flags for identical coordinate violations
      const existingFlag = await db.query(
        `SELECT id FROM fraud_flags WHERE employee_id = $1 AND flag_type = 'geofence' AND details = $2`,
        [employee_id, details]
      );

      if (existingFlag.rows.length === 0) {
        await db.query(
          `INSERT INTO fraud_flags (employee_id, flag_type, status, details, ai_digest_text)
           VALUES ($1, 'geofence', 'Pending', $2, 'Geofence alert: employee registered attendance outside factory perimeter.')`,
          [employee_id, details]
        );
      }
    }

    // 5. Update the shift status if it is a Check_In or Check_Out
    // Let's find today's shift for the employee
    const todayStr = new Date().toISOString().split('T')[0];
    const shiftRes = await db.query(
      `SELECT id, status FROM shifts WHERE employee_id = $1 AND date = $2`,
      [employee_id, todayStr]
    );

    if (shiftRes.rows.length > 0) {
      const shiftId = shiftRes.rows[0].id;
      // If checking in, mark completed. (Simplification: completed once checked in)
      if (log_type === 'Check_In') {
        await db.query(`UPDATE shifts SET status = 'Completed' WHERE id = $1`, [shiftId]);
      }
    } else {
      // If no shift was scheduled, insert an unscheduled shift (or completed shift) so payroll handles it
      await db.query(
        `INSERT INTO shifts (employee_id, date, start_time, end_time, status)
         VALUES ($1, $2, '08:00:00', '16:00:00', 'Completed')`,
        [employee_id, todayStr]
      );
    }

    return NextResponse.json({
      success: true,
      message: `${log_type} recorded successfully!`,
      log_id: logRes.rows[0].id,
      geofence_distance_m: Math.round(distance),
      geofence_ok: !isGeofenceViolation,
      employee_name: employeeName,
    });
  } catch (error: any) {
    console.error('Failed to log attendance:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
