import os
import sys
from playwright.sync_api import sync_playwright

def generate_pdf():
    # Target directory and file path
    target_dir = r"e:\Faria\indurstrial-workforce-inteligence-platform\test_pdf"
    os.makedirs(target_dir, exist_ok=True)
    pdf_path = os.path.join(target_dir, "Industrial_Intel_Complete_Testing_Guide.pdf")

    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Industrial Intel v2.0 - Detailed Manual Testing & QA Execution Guide</title>
<style>
  @page {
    size: A4;
    margin: 14mm 10mm 14mm 10mm;
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 9pt;
    line-height: 1.45;
    color: #0f172a;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
  }

  /* Header Banner */
  .header-banner {
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #4338ca 100%);
    color: #ffffff;
    padding: 22px 24px;
    border-radius: 12px;
    margin-bottom: 18px;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
  }

  .header-banner h1 {
    font-size: 19pt;
    font-weight: 800;
    margin: 0 0 6px 0;
    letter-spacing: -0.5px;
    color: #ffffff;
  }

  .header-banner p {
    font-size: 9.5pt;
    margin: 0;
    color: #c7d2fe;
    line-height: 1.35;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.18);
    font-size: 8pt;
  }

  .meta-item {
    background: rgba(255,255,255,0.08);
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.12);
  }

  .meta-label {
    color: #a5b4fc;
    font-size: 7pt;
    text-transform: uppercase;
    font-weight: 700;
    display: block;
    margin-bottom: 2px;
  }

  .meta-val {
    font-weight: 600;
    color: #ffffff;
  }

  /* Section Title */
  .section-header {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-left: 5px solid #4338ca;
    padding: 8px 12px;
    margin-top: 20px;
    margin-bottom: 12px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    page-break-after: avoid;
  }

  .section-title-text {
    font-size: 11pt;
    font-weight: 800;
    color: #1e1b4b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .badge-admin { background: #ede9fe; color: #5b21b6; border: 1px solid #ddd6fe; }
  .badge-manager { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
  .badge-worker { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
  .badge-all { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; }

  /* Info / Alert Box */
  .callout-box {
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-left: 4px solid #0284c7;
    border-radius: 6px;
    padding: 10px 12px;
    margin-bottom: 14px;
    font-size: 8.5pt;
  }

  .callout-box h4 {
    margin: 0 0 4px 0;
    color: #0369a1;
    font-size: 9pt;
    font-weight: 700;
  }

  /* Detailed Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 16px;
    font-size: 8.2pt;
  }

  th {
    background: #1e293b;
    color: #f8fafc;
    text-align: left;
    padding: 7px 8px;
    font-weight: 700;
    border: 1px solid #334155;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  td {
    padding: 7px 8px;
    border: 1px solid #cbd5e1;
    vertical-align: top;
    line-height: 1.35;
  }

  tr:nth-child(even) {
    background: #f8fafc;
  }

  .step-id {
    font-weight: 800;
    color: #4338ca;
    width: 45px;
    text-align: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
  }

  .chk-col {
    width: 32px;
    text-align: center;
  }

  .chk-box {
    display: inline-block;
    width: 13px;
    height: 13px;
    border: 1.5px solid #475569;
    border-radius: 2px;
    background: #ffffff;
  }

  .code-tag {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    background: #f1f5f9;
    padding: 1px 5px;
    border-radius: 3px;
    color: #0f172a;
    font-size: 7.8pt;
    border: 1px solid #cbd5e1;
    word-break: break-all;
  }

  .instruction-text {
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 3px;
  }

  .detail-text {
    color: #475569;
    font-size: 7.8pt;
  }

  .result-text {
    color: #15803d;
    font-weight: 600;
  }

  .page-break {
    page-break-before: always;
  }
</style>
</head>
<body>

  <!-- Cover Header -->
  <div class="header-banner">
    <h1>Industrial Intel v2.0</h1>
    <p>Comprehensive Manual QA & Interactive Execution Guide — Detailed Step-by-Step Instructions for All Roles, Pages, Controls & Features</p>

    <div class="meta-grid">
      <div class="meta-item">
        <span class="meta-label">Target Workspace URL</span>
        <span class="meta-val">http://localhost:3000</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Target Architecture</span>
        <span class="meta-val">Next.js 16 + SQLite + Tailwind</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Document Purpose</span>
        <span class="meta-val">Full End-to-End QA Testing</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Document Revision</span>
        <span class="meta-val">v2.0 Detailed Edition</span>
      </div>
    </div>
  </div>

  <!-- SECTION 1: PREPARATION & DEMO CREDENTIALS -->
  <div class="section-header">
    <span class="section-title-text">1. Test Setup & Role Credentials Reference</span>
    <span class="badge badge-all">Preparation</span>
  </div>

  <div class="callout-box">
    <h4>Pre-Test Checklist & Local Environment Setup:</h4>
    <ol style="margin: 4px 0 0 14px; padding: 0;">
      <li>Ensure local dev server is active: Run <span class="code-tag">npm run dev</span> inside <span class="code-tag">e:\Faria\indurstrial-workforce-inteligence-platform</span>. Confirm output displays <span class="code-tag">Ready in http://localhost:3000</span>.</li>
      <li>Database state: SQLite database will automatically create missing tables and insert seed data on startup (<span class="code-tag">lib/init-db.ts</span>).</li>
      <li>Open Google Chrome, Microsoft Edge, or Firefox in normal or Incognito window. Clear cookies if testing clean session creation.</li>
    </ol>
  </div>

  <table>
    <thead>
      <tr>
        <th>Role Name</th>
        <th>Demo Email Credential</th>
        <th>Demo Password</th>
        <th>Accessible Navigation Tabs</th>
        <th>Permission Constraints</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="badge badge-admin">HR Admin</span></td>
        <td><span class="code-tag">admin@industrialintel.com</span></td>
        <td><span class="code-tag">admin123</span></td>
        <td>Overview, Kiosk, Employees, Scheduler, Leave, Payroll, Fraud Queue, AI Assistant</td>
        <td>Unrestricted system-wide access to all tables, algorithms, and audit queues.</td>
      </tr>
      <tr>
        <td><span class="badge badge-manager">Floor Manager</span></td>
        <td><span class="code-tag">manager@industrialintel.com</span></td>
        <td><span class="code-tag">manager123</span></td>
        <td>Overview, Kiosk, Employees, Scheduler, Leave, AI Assistant</td>
        <td>Restricted from Payroll Center and Fraud Queue forensic audit triage.</td>
      </tr>
      <tr>
        <td><span class="badge badge-worker">Worker</span></td>
        <td><span class="code-tag">worker@industrialintel.com</span></td>
        <td><span class="code-tag">worker123</span></td>
        <td>Overview, Kiosk, Scheduler, Leave, Payroll (Personal), AI Assistant</td>
        <td>Restricted from Employee Directory roster, Fraud Queue, and managerial approvals.</td>
      </tr>
      <tr>
        <td><span class="badge badge-all">Visitor</span></td>
        <td>Unauthenticated</td>
        <td>N/A</td>
        <td>Landing Page (<span class="code-tag">/</span>), Registration (<span class="code-tag">/signup</span>), Login (<span class="code-tag">/login</span>)</td>
        <td>Restricted from all internal factory console pages and API endpoints.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 2: PUBLIC VISITOR & AUTHENTICATION -->
  <div class="section-header">
    <span class="section-title-text">2. Public Visitor & Account Authentication Test Suite</span>
    <span class="badge badge-all">Visitor Flow</span>
  </div>

  <table>
    <thead>
      <tr>
        <th class="chk-col">Pass</th>
        <th class="step-id">Step ID</th>
        <th>Step Name & Exact Actions to Perform</th>
        <th>Where to Look & Visual Checklist</th>
        <th>Expected Technical & Functional Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-01</td>
        <td>
          <div class="instruction-text">Landing Page Hero & Public Navigation</div>
          <div class="detail-text">Open browser and navigate to <span class="code-tag">http://localhost:3000/</span>. Scroll down past Hero section to Features and Pricing.</div>
        </td>
        <td>
          <div class="detail-text">• Header bar shows Terminal logo and "Industrial Intel".<br>• Hero title: "AI-Powered Intelligence for the Factory Floor".<br>• 4 Bento Grid feature cards render cleanly.</div>
        </td>
        <td>
          <div class="result-text">Page loads in &lt; 500ms without JavaScript errors. Sticky navigation header remains blurred at top during scroll.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-02</td>
        <td>
          <div class="instruction-text">Anchor Navigation & Demo Sandbox CTA</div>
          <div class="detail-text">1. Click top navbar link <span class="code-tag">Features</span>.<br>2. Click <span class="code-tag">Sign In with Seed Account</span> button inside the Hero interactive sandbox card.</div>
        </td>
        <td>
          <div class="detail-text">• Page smoothly scrolls to <span class="code-tag">#features</span> anchor.<br>• Browser URL changes to <span class="code-tag">http://localhost:3000/login</span>.</div>
        </td>
        <td>
          <div class="result-text">Smooth scroll behavior executes. Login page mounts with full authentication options card.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-03</td>
        <td>
          <div class="instruction-text">Company Registration Portal (<span class="code-tag">/signup</span>)</div>
          <div class="detail-text">1. Navigate to <span class="code-tag">http://localhost:3000/signup</span>.<br>2. Enter Company: <span class="code-tag">Titan Aerospace</span>.<br>3. Select Industry: <span class="code-tag">Aerospace</span>.<br>4. Enter Admin: <span class="code-tag">Sarah Connor</span>, Email: <span class="code-tag">sarah@titan.com</span>, Password: <span class="code-tag">titan123</span>.<br>5. Click <span class="code-tag">Complete Registration</span>.</div>
        </td>
        <td>
          <div class="detail-text">• Registration card renders with two distinct sections: Company Details & Admin Credentials.<br>• Password field masks characters.<br>• Success alert banner pops up.</div>
        </td>
        <td>
          <div class="result-text">POST request sent to <span class="code-tag">/api/auth/signup</span>. New company tenant and admin account created in SQLite DB. Redirects to <span class="code-tag">/login</span>.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-04</td>
        <td>
          <div class="instruction-text">Quick-Fill Demo Account & Custom Authentication</div>
          <div class="detail-text">1. On <span class="code-tag">/login</span>, click the <span class="code-tag">HR Admin</span> Quick Demo button.<br>2. Verify email autofills to <span class="code-tag">admin@industrialintel.com</span> and password autofills.<br>3. Click <span class="code-tag">Sign In to Console</span>.</div>
        </td>
        <td>
          <div class="detail-text">• Quick fill buttons display role badges.<br>• Input fields animate with filled values.<br>• Loading spinner displays on button during POST call.</div>
        </td>
        <td>
          <div class="result-text">NextAuth JWT session cookie generated. Browser redirects to Authenticated Factory Console Dashboard at <span class="code-tag">/</span>.</div>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- SECTION 3: FIXED SIDEBAR & WORKSPACE LAYOUT -->
  <div class="section-header">
    <span class="section-title-text">3. Workspace Layout & Fixed Collapsible Sidebar Test Suite</span>
    <span class="badge badge-all">All Authenticated Roles</span>
  </div>

  <table>
    <thead>
      <tr>
        <th class="chk-col">Pass</th>
        <th class="step-id">Step ID</th>
        <th>Step Name & Exact Actions to Perform</th>
        <th>Where to Look & Visual Checklist</th>
        <th>Expected Technical & Functional Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-05</td>
        <td>
          <div class="instruction-text">Stationary Fixed Sidebar Scroll Verification</div>
          <div class="detail-text">1. Ensure user is logged in and on the Overview tab.<br>2. Use mouse wheel or scrollbar to scroll down to the bottom of the Overview dashboard content pane.</div>
        </td>
        <td>
          <div class="detail-text"><strong>CRITICAL LAYOUT CHECK:</strong><br>• Look at left sidebar: Sidebar stays 100% stationary and pinned to left edge.<br>• Look at right main content: Content scrolls smoothly inside <span class="code-tag">&lt;main&gt;</span>.</div>
        </td>
        <td>
          <div class="result-text">Sidebar does NOT move or scroll out of view. Container uses viewport height <span class="code-tag">h-screen w-screen overflow-hidden</span> with isolated scroll.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-06</td>
        <td>
          <div class="instruction-text">Sidebar Collapse & Expand Animation</div>
          <div class="detail-text">1. Click the <span class="code-tag">ChevronLeft</span> collapse button in the sidebar brand header or top bar <span class="code-tag">PanelLeft</span> icon button.<br>2. Observe width animation.<br>3. Click <span class="code-tag">ChevronRight</span> button to expand.</div>
        </td>
        <td>
          <div class="detail-text">• Sidebar width transitions smoothly from 264px (<span class="code-tag">w-64</span>) to 80px (<span class="code-tag">w-20</span>).<br>• Brand title text "Industrial Intel" fades out.<br>• Navigation item icons center cleanly in 80px frame.</div>
        </td>
        <td>
          <div class="result-text">Smooth 300ms CSS transition. Dashboard layout recalculates main content width dynamically without overflow breaks.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-07</td>
        <td>
          <div class="instruction-text">Collapsed Icon Floating Tooltips</div>
          <div class="detail-text">1. While sidebar is collapsed (<span class="code-tag">w-20</span>), hover cursor over each navigation icon (Employees, Scheduler, Leave, AI Assistant).</div>
        </td>
        <td>
          <div class="detail-text">• A crisp floating tooltip box pops out to the right of each icon.<br>• Tooltip text displays tab name e.g. "Employees", "Payroll Center".</div>
        </td>
        <td>
          <div class="result-text">Tooltips render with high z-index (<span class="code-tag">z-50</span>) floating over main dashboard area, enabling full navigation in collapsed state.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-08</td>
        <td>
          <div class="instruction-text">Top Bar Widgets: Clock, Notifications & Dark Mode</div>
          <div class="detail-text">1. Observe Top Bar clock widget.<br>2. Click Bell icon (Notification Center).<br>3. Click Moon/Sun icon (Theme toggle).</div>
        </td>
        <td>
          <div class="detail-text">• Clock ticks live in HH:MM:SS format with pulsing indicator.<br>• Notifications Popover opens showing 3 operational alerts.<br>• Theme switches smoothly between Dark & Light modes.</div>
        </td>
        <td>
          <div class="result-text">Popover mounts inside backdrop blur overlay. Theme toggle updates root <span class="code-tag">&lt;html class="dark"&gt;</span> class instantly.</div>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 4: DASHBOARD OVERVIEW & AI FORECAST -->
  <div class="section-header">
    <span class="section-title-text">4. Executive Dashboard Overview & AI Forecast Engine</span>
    <span class="badge badge-all">All Roles</span>
  </div>

  <table>
    <thead>
      <tr>
        <th class="chk-col">Pass</th>
        <th class="step-id">Step ID</th>
        <th>Step Name & Exact Actions to Perform</th>
        <th>Where to Look & Visual Checklist</th>
        <th>Expected Technical & Functional Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-09</td>
        <td>
          <div class="instruction-text">Executive KPI Summary Cards Inspection</div>
          <div class="detail-text">1. Click "Overview" tab in sidebar.<br>2. Inspect 4 top KPI cards: Active Workers, Shift Attendance, Flagged Anomalies, Total Payroll.</div>
        </td>
        <td>
          <div class="detail-text">• Active Workers card displays headcount count e.g. "42 / 50".<br>• Shift Attendance shows percentage e.g. "94.2%".<br>• Anomalies card highlights flagged count in amber/red.</div>
        </td>
        <td>
          <div class="result-text">Data fetched dynamically from <span class="code-tag">/api/performance</span> and <span class="code-tag">/api/attendance</span> APIs upon tab mount.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-10</td>
        <td>
          <div class="instruction-text">AI Staffing Forecast Generation</div>
          <div class="detail-text">1. On Overview page, click <span class="code-tag">Generate AI Staffing Forecast</span> button.<br>2. Observe loading animation & AI briefing text update.</div>
        </td>
        <td>
          <div class="detail-text">• Button displays spinning loader icon.<br>• Confidence score badge updates e.g. "92% Confidence".<br>• LLM Briefing text box populates operational narrative.</div>
        </td>
        <td>
          <div class="result-text">POST request sent to <span class="code-tag">/api/forecast</span>. AI engine processes historical shift metrics and returns JSON briefing text.</div>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- SECTION 5: BIOMETRIC GEOFENCE KIOSK MODE -->
  <div class="section-header">
    <span class="section-title-text">5. Biometric Geofence Kiosk Gate Mode Test Suite</span>
    <span class="badge badge-all">All Roles</span>
  </div>

  <table>
    <thead>
      <tr>
        <th class="chk-col">Pass</th>
        <th class="step-id">Step ID</th>
        <th>Step Name & Exact Actions to Perform</th>
        <th>Where to Look & Visual Checklist</th>
        <th>Expected Technical & Functional Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-11</td>
        <td>
          <div class="instruction-text">Kiosk Gate Mode Initialization & Camera Overlay</div>
          <div class="detail-text">1. Click "Kiosk Mode" tab in sidebar.<br>2. Inspect Gate Station header badge and camera preview window.</div>
        </td>
        <td>
          <div class="detail-text">• Camera viewport renders glowing green facial alignment frame.<br>• Station status displays "GATE KIOSK #01 - ACTIVE".</div>
        </td>
        <td>
          <div class="result-text">Kiosk component mounts web camera canvas simulation and fetches active employee roster for biometric matching.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-12</td>
        <td>
          <div class="instruction-text">Biometric Face Distance Match Simulation ($L_2 \le 0.05$)</div>
          <div class="detail-text">1. Select Employee from dropdown e.g. <span class="code-tag">John Doe</span>.<br>2. Click <span class="code-tag">Simulate Facial Distance Scan</span> button.<br>3. Observe vector match score output.</div>
        </td>
        <td>
          <div class="detail-text">• L2 vector match distance displays value e.g. "0.038".<br>• Green badge pops up: "FACE MATCH VERIFIED (L2 <= 0.05)".</div>
        </td>
        <td>
          <div class="result-text">Euclidean L2 vector distance calculated against employee's stored pgvector embedding array. Threshold validation passes.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-13</td>
        <td>
          <div class="instruction-text">GPS Geofence Perimeter Range Check</div>
          <div class="detail-text">1. Click <span class="code-tag">Check GPS Geofence Range</span> button.<br>2. Verify calculated distance from facility coordinates.</div>
        </td>
        <td>
          <div class="detail-text">• Distance displays: "0.12 km from perimeter (Max: 0.50 km)".<br>• Status badge highlights "GEOFENCE PASS".</div>
        </td>
        <td>
          <div class="result-text">Haversine formula calculates GPS range between kiosk terminal coordinates and worker mobile ping.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-14</td>
        <td>
          <div class="instruction-text">Shift Clock-In / Clock-Out Submission</div>
          <div class="detail-text">1. Click <span class="code-tag">Clock In Shift</span> button.<br>2. Confirm clock-in log entry.<br>3. Click <span class="code-tag">Clock Out Shift</span>.</div>
        </td>
        <td>
          <div class="detail-text">• Green checkmark confirmation card appears.<br>• Shift timer starts tracking duration.<br>• Clock-out displays total hours logged.</div>
        </td>
        <td>
          <div class="result-text">POST call to <span class="code-tag">/api/attendance</span> inserts attendance record into SQLite database with timestamp & GPS payload.</div>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 6: EMPLOYEE DIRECTORY -->
  <div class="section-header">
    <span class="section-title-text">6. Employee Directory & Access Control Test Suite</span>
    <span class="badge badge-admin">HR Admin</span> <span class="badge badge-manager">Floor Manager</span>
  </div>

  <table>
    <thead>
      <tr>
        <th class="chk-col">Pass</th>
        <th class="step-id">Step ID</th>
        <th>Step Name & Exact Actions to Perform</th>
        <th>Where to Look & Visual Checklist</th>
        <th>Expected Technical & Functional Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-15</td>
        <td>
          <div class="instruction-text">Employee Directory Roster Table & Search Filter</div>
          <div class="detail-text">1. Click "Employees" tab in sidebar.<br>2. Type <span class="code-tag">Alice</span> into search filter box.<br>3. Clear filter input.</div>
        </td>
        <td>
          <div class="detail-text">• Table renders columns: ID, Name, Role, Department, Hourly Wage, Biometric Status, Actions.<br>• Search input filters rows instantly.</div>
        </td>
        <td>
          <div class="result-text">GET call to <span class="code-tag">/api/employees</span> populates table. Client-side state filter updates table view without page reload.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-16</td>
        <td>
          <div class="instruction-text">Add New Employee Profile Modal</div>
          <div class="detail-text">1. Click <span class="code-tag">Add Employee</span> button.<br>2. Fill Name: <span class="code-tag">Marcus Vance</span>, Email: <span class="code-tag">marcus@industrialintel.com</span>, Role: <span class="code-tag">Worker</span>, Department: <span class="code-tag">Quality Inspection</span>, Wage: <span class="code-tag">28.50</span>.<br>3. Click <span class="code-tag">Save Employee</span>.</div>
        </td>
        <td>
          <div class="detail-text">• Add Employee dialog modal opens cleanly.<br>• Department select dropdown functions.<br>• Toast notification pops up: "Employee Created Successfully".</div>
        </td>
        <td>
          <div class="result-text">POST call to <span class="code-tag">/api/employees</span> creates new worker record and appends row to active table.</div>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- SECTION 7: SHIFT SCHEDULER -->
  <div class="section-header">
    <span class="section-title-text">7. Shift Scheduler & Roster Management Test Suite</span>
    <span class="badge badge-all">All Roles</span>
  </div>

  <table>
    <thead>
      <tr>
        <th class="chk-col">Pass</th>
        <th class="step-id">Step ID</th>
        <th>Step Name & Exact Actions to Perform</th>
        <th>Where to Look & Visual Checklist</th>
        <th>Expected Technical & Functional Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-17</td>
        <td>
          <div class="instruction-text">Weekly Shift Grid Calendar Inspection</div>
          <div class="detail-text">1. Click "Scheduler" tab in sidebar.<br>2. Inspect weekly calendar grid across Morning (06:00-14:00), Afternoon (14:00-22:00), and Night (22:00-06:00) shifts.</div>
        </td>
        <td>
          <div class="detail-text">• Shift cards display assigned worker name, department badge, and status tags.<br>• Unassigned shift slots display "Empty Slot".</div>
        </td>
        <td>
          <div class="result-text">GET call to <span class="code-tag">/api/shifts</span> retrieves roster schedule array for current calendar week.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-18</td>
        <td>
          <div class="instruction-text">Assign New Shift Modal & Roster Allocation</div>
          <div class="detail-text">1. Click <span class="code-tag">Assign Shift</span> button.<br>2. Select Employee: <span class="code-tag">John Doe</span>.<br>3. Select Shift Type: <span class="code-tag">Morning Shift</span>.<br>4. Click <span class="code-tag">Confirm Assignment</span>.</div>
        </td>
        <td>
          <div class="detail-text">• Assign Shift modal opens with employee list.<br>• Newly assigned shift card renders on calendar grid.</div>
        </td>
        <td>
          <div class="result-text">POST request sent to <span class="code-tag">/api/shifts</span> inserting shift record in database. Grid view re-renders automatically.</div>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 8: LEAVE & ABSENCE MANAGEMENT -->
  <div class="section-header">
    <span class="section-title-text">8. Leave & Absence Management Test Suite</span>
    <span class="badge badge-all">All Roles</span>
  </div>

  <table>
    <thead>
      <tr>
        <th class="chk-col">Pass</th>
        <th class="step-id">Step ID</th>
        <th>Step Name & Exact Actions to Perform</th>
        <th>Where to Look & Visual Checklist</th>
        <th>Expected Technical & Functional Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-19</td>
        <td>
          <div class="instruction-text">Leave Balance Cards & Request History Table</div>
          <div class="detail-text">1. Click "Leave & Absence" tab in sidebar.<br>2. Review 3 balance cards: Casual Leave (4 days), Sick Leave (7 days), Earned Leave (12 days).</div>
        </td>
        <td>
          <div class="detail-text">• Balance cards render numeric counts and progress bars.<br>• Leave history table displays prior requests and status badges.</div>
        </td>
        <td>
          <div class="result-text">GET call to <span class="code-tag">/api/leave</span> fetches leave quota metrics and past request history.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-20</td>
        <td>
          <div class="instruction-text">File New Leave Application Form</div>
          <div class="detail-text">1. Click <span class="code-tag">Apply for Leave</span> button.<br>2. Select Type: <span class="code-tag">Casual Leave</span>, Start Date, End Date, Reason: <span class="code-tag">Family obligation</span>.<br>3. Click <span class="code-tag">Submit Application</span>.</div>
        </td>
        <td>
          <div class="detail-text">• Application dialog submits form.<br>• New row appears in History table with yellow <span class="badge badge-manager">PENDING</span> status badge.</div>
        </td>
        <td>
          <div class="result-text">POST request sent to <span class="code-tag">/api/leave</span> creating leave application entry awaiting manager review.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-21</td>
        <td>
          <div class="instruction-text">Manager / HR Admin Approval Workflow</div>
          <div class="detail-text">1. While logged in as HR Admin/Manager, locate pending leave application in table.<br>2. Click <span class="code-tag">Approve</span> action button.</div>
        </td>
        <td>
          <div class="detail-text">• Status badge instantly changes from PENDING to green <span class="badge badge-worker">APPROVED</span>.<br>• Casual leave balance decrements accordingly.</div>
        </td>
        <td>
          <div class="result-text">PUT call to <span class="code-tag">/api/leave</span> updates status column in database and recalculates available quota.</div>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- SECTION 9: PAYROLL CENTER -->
  <div class="section-header">
    <span class="section-title-text">9. Payroll Center & Automated Compensation Test Suite</span>
    <span class="badge badge-admin">HR Admin</span> <span class="badge badge-worker">Worker (Personal)</span>
  </div>

  <table>
    <thead>
      <tr>
        <th class="chk-col">Pass</th>
        <th class="step-id">Step ID</th>
        <th>Step Name & Exact Actions to Perform</th>
        <th>Where to Look & Visual Checklist</th>
        <th>Expected Technical & Functional Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-22</td>
        <td>
          <div class="instruction-text">Payroll Summary & Hour Breakdown Table</div>
          <div class="detail-text">1. Click "Payroll Center" tab in sidebar.<br>2. Inspect Regular Hours, Overtime Hours (1.5x rate), Deductions, and Net Payout columns.</div>
        </td>
        <td>
          <div class="detail-text">• Summary cards render Gross Payroll Total and Tax Withholdings.<br>• Table renders worker pay slips cleanly formatted.</div>
        </td>
        <td>
          <div class="result-text">GET call to <span class="code-tag">/api/payroll</span> aggregates verified clock-in shift hours and hourly rates.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-23</td>
        <td>
          <div class="instruction-text">Run Automated Payroll Calculation & Anomaly Check</div>
          <div class="detail-text">1. Click <span class="code-tag">Run Automated Payroll</span> button.<br>2. Confirm calculation toast alert.</div>
        </td>
        <td>
          <div class="detail-text">• Loading indicator spins during calculation.<br>• Net payout totals recalculate dynamically.<br>• Toast alerts "Payroll Calculated & Verified".</div>
        </td>
        <td>
          <div class="result-text">POST request sent to <span class="code-tag">/api/payroll</span> running hour math and z-score anomaly check for inflated hours.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-24</td>
        <td>
          <div class="instruction-text">Export Payroll CSV Report Download</div>
          <div class="detail-text">1. Click <span class="code-tag">Export Payroll CSV</span> button.<br>2. Check browser downloads folder.</div>
        </td>
        <td>
          <div class="detail-text">• Browser triggers file download prompt.<br>• Downloaded CSV file contains headers: Employee, Hours, OT, Net Pay.</div>
        </td>
        <td>
          <div class="result-text">Client generates formatted Blob string and triggers automatic file download <span class="code-tag">payroll-report.csv</span>.</div>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 10: FRAUD QUEUE -->
  <div class="section-header">
    <span class="section-title-text">10. Fraud Queue & Forensic Audit Triage Test Suite</span>
    <span class="badge badge-admin">HR Admin</span>
  </div>

  <table>
    <thead>
      <tr>
        <th class="chk-col">Pass</th>
        <th class="step-id">Step ID</th>
        <th>Step Name & Exact Actions to Perform</th>
        <th>Where to Look & Visual Checklist</th>
        <th>Expected Technical & Functional Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-25</td>
        <td>
          <div class="instruction-text">Fraud Queue Audit Table & Anomaly Inspection</div>
          <div class="detail-text">1. Click "Fraud Queue" tab in sidebar.<br>2. Review Audit Flag table listing Double Punches, Geofence Distance Breaches, and Z-Score Overtime Outliers ($z > 2.5$).</div>
        </td>
        <td>
          <div class="detail-text">• Flagged entries display Severity Badges: CRITICAL (Red), WARNING (Amber).<br>• Z-Score metric highlighted e.g. "z = +3.12".</div>
        </td>
        <td>
          <div class="result-text">GET call to <span class="code-tag">/api/fraud</span> queries flagged attendance logs exceeding statistical variance limits.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-26</td>
        <td>
          <div class="instruction-text">Run Forensic Audit Scan Engine</div>
          <div class="detail-text">1. Click <span class="code-tag">Run Forensic Audit Scan</span> button.<br>2. Observe scan progress bar and audit summary.</div>
        </td>
        <td>
          <div class="detail-text">• Progress bar fills during scan.<br>• Scan log stream displays evaluated attendance records.</div>
        </td>
        <td>
          <div class="result-text">POST request sent to <span class="code-tag">/api/fraud</span> analyzing recent shifts for double punches & location jumps.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-27</td>
        <td>
          <div class="instruction-text">Audit Flag Triage: Dismiss vs Escalate</div>
          <div class="detail-text">1. Click <span class="code-tag">Dismiss</span> button on a false positive flag row.<br>2. Click <span class="code-tag">Escalate to HR</span> on a critical flag row.</div>
        </td>
        <td>
          <div class="detail-text">• Dismissed row status updates to "RESOLVED (FALSE POSITIVE)".<br>• Escalated row status updates to "ESCALATED TO AUDIT COMMITTEE".</div>
        </td>
        <td>
          <div class="result-text">PUT call updates flag status in database, maintaining immutable audit trail in system log.</div>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 11: AI CHATBOT DRAWER -->
  <div class="section-header">
    <span class="section-title-text">11. AI Assistant Chatbot Drawer Test Suite</span>
    <span class="badge badge-all">All Roles</span>
  </div>

  <table>
    <thead>
      <tr>
        <th class="chk-col">Pass</th>
        <th class="step-id">Step ID</th>
        <th>Step Name & Exact Actions to Perform</th>
        <th>Where to Look & Visual Checklist</th>
        <th>Expected Technical & Functional Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-28</td>
        <td>
          <div class="instruction-text">Trigger Floating AI Assistant Chatbot Drawer</div>
          <div class="detail-text">1. Click <span class="code-tag">AI Assistant Chat</span> button in sidebar or header.<br>2. Inspect slide-out drawer from right side of viewport.</div>
        </td>
        <td>
          <div class="detail-text">• Chatbot Sheet slides out smoothly from right.<br>• Displays AI header, suggestion chips, and message history.</div>
        </td>
        <td>
          <div class="result-text">Sheet component opens backdrop container with full interactive chat interface.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-29</td>
        <td>
          <div class="instruction-text">Quick Suggestion Chip & Natural Language Query</div>
          <div class="detail-text">1. Click suggestion chip <span class="code-tag">Analyze payroll anomalies</span>.<br>2. Type custom message: <span class="code-tag">Summarize active shifts today</span> and hit Enter.</div>
        </td>
        <td>
          <div class="detail-text">• Suggestion text populates input box and auto-sends.<br>• Animated typing indicator shows AI is generating response.<br>• Response bubble streams AI operational answer.</div>
        </td>
        <td>
          <div class="result-text">POST request sent to <span class="code-tag">/api/chatbot</span>. Gemini LLM engine streams role-aware answer back to chat window.</div>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- SECTION 12: ROLE-BASED ACCESS SECURITY VERIFICATION -->
  <div class="section-header">
    <span class="section-title-text">12. Role-Based Access Control (RBAC) Security Verification</span>
    <span class="badge badge-admin">Security Audit</span>
  </div>

  <table>
    <thead>
      <tr>
        <th class="chk-col">Pass</th>
        <th class="step-id">Step ID</th>
        <th>Step Name & Exact Actions to Perform</th>
        <th>Where to Look & Visual Checklist</th>
        <th>Expected Technical & Functional Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-30</td>
        <td>
          <div class="instruction-text">Floor Manager Role Restriction Check</div>
          <div class="detail-text">1. Log out of HR Admin.<br>2. Log in as Floor Manager (<span class="code-tag">manager@industrialintel.com</span> / <span class="code-tag">manager123</span>).<br>3. Inspect sidebar navigation items.</div>
        </td>
        <td>
          <div class="detail-text">• Sidebar shows: Overview, Kiosk, Employees, Scheduler, Leave, AI Assistant.<br>• <strong>Payroll Center and Fraud Queue tabs are completely hidden from sidebar.</strong></div>
        </td>
        <td>
          <div class="result-text"><span class="code-tag">NAV_ITEMS</span> filter restricts visibility based on session role string, enforcing privilege separation.</div>
        </td>
      </tr>
      <tr>
        <td class="chk-col"><span class="chk-box"></span></td>
        <td class="step-id">T-31</td>
        <td>
          <div class="instruction-text">Worker Role Restriction Check</div>
          <div class="detail-text">1. Log out of Floor Manager.<br>2. Log in as Worker (<span class="code-tag">worker@industrialintel.com</span> / <span class="code-tag">worker123</span>).<br>3. Inspect sidebar and open Payroll tab.</div>
        </td>
        <td>
          <div class="detail-text">• Employee Directory and Fraud Queue are hidden.<br>• Payroll tab displays personal salary details only without admin calculation controls.</div>
        </td>
        <td>
          <div class="result-text">Worker session strictly scoped to personal record IDs, preventing unauthorized access to factory-wide salary data.</div>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 13: QA SIGN-OFF SCORECARD -->
  <div class="section-header">
    <span class="section-title-text">13. Manual QA Verification & Sign-Off Scorecard</span>
    <span class="badge badge-all">Final Verification</span>
  </div>

  <table>
    <thead>
      <tr>
        <th>Total Test Suites</th>
        <th>Total Test Cases</th>
        <th>Passed Count</th>
        <th>Failed Count</th>
        <th>QA Lead Signature</th>
        <th>Execution Date</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>12 Operational Suites</td>
        <td>31 Detailed Test Cases</td>
        <td>______ / 31</td>
        <td>______ / 31</td>
        <td>__________________________</td>
        <td>____ / ____ / 2026</td>
      </tr>
    </tbody>
  </table>

  <div class="callout-box" style="margin-top: 10px; background: #eef2ff; border-left-color: #4f46e5;">
    <strong>QA Verification Statement:</strong> This manual test document provides end-to-end execution guidelines for Industrial Intel v2.0. All step-by-step instructions reflect the exact UI components, API routes, database schemas, and statistical thresholds built into the platform.
  </div>

</body>
</html>"""

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_content(html_content)
        page.pdf(
            path=pdf_path,
            format="A4",
            print_background=True,
            margin={"top": "14mm", "bottom": "14mm", "left": "10mm", "right": "10mm"}
        )
        browser.close()

    print(f"Detailed PDF generated successfully at: {pdf_path}")

if __name__ == "__main__":
    generate_pdf()
