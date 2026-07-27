const http = require('http');

async function apiRequest(path, method = 'GET', body = null, headers = {}) {
  const url = `http://localhost:3000${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (err) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING ENDPOINT FUNCTIONALITY TESTS ===\n');

  // 1. Test Company Registration
  console.log('1. Testing POST /api/auth/signup (Company Registration)...');
  const testCompany = `Test Factory ${Date.now()}`;
  const testEmail = `admin_${Date.now()}@factory.com`;
  const signupRes = await apiRequest('/api/auth/signup', 'POST', {
    company_name: testCompany,
    admin_name: 'Test Admin',
    admin_email: testEmail,
    admin_password: 'adminpassword123',
  });
  console.log('Signup Status:', signupRes.status, signupRes.data);

  // 2. Test Duplicate Company Name Error Handling
  console.log('\n2. Testing Duplicate Company Signup Handling...');
  const dupCompanyRes = await apiRequest('/api/auth/signup', 'POST', {
    company_name: testCompany,
    admin_name: 'Test Admin 2',
    admin_email: `other_${Date.now()}@factory.com`,
    admin_password: 'adminpassword123',
  });
  console.log('Duplicate Signup Status:', dupCompanyRes.status, dupCompanyRes.data);

  // 3. Test Attendance Check-In (Public / Kiosk Punch)
  console.log('\n3. Testing POST /api/attendance (Kiosk Punch Check-In)...');
  const checkInRes = await apiRequest('/api/attendance', 'POST', {
    employee_id: 3, // Faria Sultana (Worker)
    log_type: 'Check_In',
    gps_lat: 23.81031,
    gps_lng: 90.41252,
    verified_by_face: true,
    device_id: 'kiosk_gate_1',
    device_type: 'Kiosk',
    confidence_score: 0.98,
    face_embedding: Array(128).fill(0.1),
  });
  console.log('Check-In Status:', checkInRes.status, checkInRes.data);

  // 4. Test Attendance Check-Out
  console.log('\n4. Testing POST /api/attendance (Kiosk Punch Check-Out)...');
  const checkOutRes = await apiRequest('/api/attendance', 'POST', {
    employee_id: 3,
    log_type: 'Check_Out',
    gps_lat: 23.81032,
    gps_lng: 90.41251,
    verified_by_face: true,
    device_id: 'kiosk_gate_1',
    device_type: 'Kiosk',
    confidence_score: 0.97,
    face_embedding: Array(128).fill(0.1),
  });
  console.log('Check-Out Status:', checkOutRes.status, checkOutRes.data);

  // 5. Test Geofence Violation Check-In (Triggers Fraud Flag)
  console.log('\n5. Testing Geofence Violation (250m offsite punch)...');
  const geofenceRes = await apiRequest('/api/attendance', 'POST', {
    employee_id: 4, // Worker 2
    log_type: 'Check_In',
    gps_lat: 23.8150, // > 100m away
    gps_lng: 90.4200,
    verified_by_face: true,
    device_id: 'mobile_app',
    device_type: 'Mobile',
    confidence_score: 0.95,
  });
  console.log('Geofence Violation Status:', geofenceRes.status, geofenceRes.data);

  // 6. Test DB Init Endpoint
  console.log('\n6. Testing GET /api/init (Database Reset & Seeding)...');
  const initRes = await apiRequest('/api/init');
  console.log('Init DB Status:', initRes.status, initRes.data);

  console.log('\n=== ENDPOINT TESTS COMPLETED ===');
}

runTests().catch(console.error);
