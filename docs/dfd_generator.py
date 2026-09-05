import os
import subprocess

def build_svg_level0():
    return """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 950" width="100%" height="100%" style="background:#ffffff; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
      <defs>
        <marker id="arr0-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb" />
        </marker>
        <marker id="arr0-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
        </marker>
        <marker id="arr0-purple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#7c3aed" />
        </marker>
        <marker id="arr0-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#d97706" />
        </marker>
        <marker id="arr0-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#e11d48" />
        </marker>
        <filter id="shadow0" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="3" dy="3" stdDeviation="4" flood-opacity="0.10" />
        </filter>
        <linearGradient id="grad-core" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <linearGradient id="grad-entity0" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#f1f5f9" />
        </linearGradient>
      </defs>

      <!-- Background Grid -->
      <pattern id="grid0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
      <rect width="1400" height="950" fill="url(#grid0)" />

      <!-- TITLE -->
      <text x="700" y="38" text-anchor="middle" font-size="22" font-weight="800" fill="#0f172a" letter-spacing="0.5">
        LEVEL 0 DATA FLOW DIAGRAM: SYSTEM CONTEXT DIAGRAM
      </text>
      <text x="700" y="60" text-anchor="middle" font-size="12.5" fill="#64748b" font-weight="500">
        High-Level Environmental Boundary: External Entities, Primary System Boundary (0.0), and Major Information Ingestion &amp; Egress Flows
      </text>

      <!-- ================= CENTRAL PROCESS 0.0 ================= -->
      <g filter="url(#shadow0)">
        <!-- Outer container -->
        <rect x="470" y="275" width="460" height="375" rx="20" fill="#ffffff" stroke="#3b82f6" stroke-width="2.5"/>
        <rect x="470" y="275" width="460" height="65" rx="20" fill="url(#grad-core)" />
        
        <text x="700" y="302" text-anchor="middle" fill="#38bdf8" font-size="11.5" font-weight="800" letter-spacing="1">PRIMARY CONTEXT BOUNDARY: PROCESS 0.0</text>
        <text x="700" y="325" text-anchor="middle" fill="#ffffff" font-size="15.5" font-weight="800">Industrial Workforce &amp; Payroll Platform</text>
        
        <!-- Inner description container -->
        <rect x="490" y="355" width="420" height="275" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
        <text x="700" y="382" text-anchor="middle" fill="#0f172a" font-size="12.5" font-weight="700">Central Operational Capabilities</text>
        
        <text x="510" y="415" fill="#1e293b" font-size="11" font-weight="600">• Multi-Tenant Auth &amp; Role-Based Access Control</text>
        <text x="510" y="445" fill="#059669" font-size="11" font-weight="600">• pgvector Biometric Face Recognition &amp; Liveness</text>
        <text x="510" y="475" fill="#2563eb" font-size="11" font-weight="600">• Haversine GPS Geofencing (100m Factory Radius)</text>
        <text x="510" y="505" fill="#7c3aed" font-size="11" font-weight="600">• Deterministic 1.5x Overtime &amp; Tax Payroll Engine</text>
        <text x="510" y="535" fill="#d97706" font-size="11" font-weight="600">• 7-Day Moving Average Predictive Staffing</text>
        <text x="510" y="565" fill="#e11d48" font-size="11" font-weight="600">• Forensic Anomaly &amp; Z-Score Outlier Scanner</text>
        <text x="510" y="595" fill="#0284c7" font-size="11" font-weight="600">• RAG Knowledge Base Policy Assistant (Chatbot)</text>
      </g>

      <!-- ================= EXTERNAL ENTITY 1: WORKER (TOP-LEFT) ================= -->
      <g filter="url(#shadow0)">
        <rect x="50" y="100" width="280" height="145" rx="10" fill="url(#grad-entity0)" stroke="#334155" stroke-width="2"/>
        <rect x="50" y="100" width="280" height="32" rx="10" fill="#1e293b"/>
        <text x="190" y="122" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="800">EXTERNAL ENTITY: E1</text>
        <text x="190" y="156" text-anchor="middle" fill="#0f172a" font-size="15" font-weight="800">Floor Worker</text>
        <text x="190" y="178" text-anchor="middle" fill="#475569" font-size="10">Mobile App / Personal Dashboard</text>
        <text x="190" y="198" text-anchor="middle" fill="#059669" font-size="10" font-weight="600">Roles: Self-Service, Attendance, Swaps</text>
        <text x="190" y="218" text-anchor="middle" fill="#64748b" font-size="9.5">Example: Faria Sultana</text>
      </g>

      <!-- ================= EXTERNAL ENTITY 2: FLOOR MANAGER (BOTTOM-LEFT) ================= -->
      <g filter="url(#shadow0)">
        <rect x="50" y="680" width="280" height="145" rx="10" fill="url(#grad-entity0)" stroke="#334155" stroke-width="2"/>
        <rect x="50" y="680" width="280" height="32" rx="10" fill="#1e293b"/>
        <text x="190" y="702" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="800">EXTERNAL ENTITY: E2</text>
        <text x="190" y="736" text-anchor="middle" fill="#0f172a" font-size="15" font-weight="800">Floor Manager</text>
        <text x="190" y="758" text-anchor="middle" fill="#475569" font-size="10">Floor Console &amp; Roster Management</text>
        <text x="190" y="778" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="600">Roles: Shift Roster, Swap Approvals, Leaves</text>
        <text x="190" y="798" text-anchor="middle" fill="#64748b" font-size="9.5">Example: Nazmul Hasan</text>
      </g>

      <!-- ================= EXTERNAL ENTITY 4: GATE KIOSK (TOP-RIGHT) ================= -->
      <g filter="url(#shadow0)">
        <rect x="1070" y="100" width="280" height="145" rx="10" fill="url(#grad-entity0)" stroke="#334155" stroke-width="2"/>
        <rect x="1070" y="100" width="280" height="32" rx="10" fill="#1e293b"/>
        <text x="1210" y="122" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="800">EXTERNAL ENTITY: E4</text>
        <text x="1210" y="156" text-anchor="middle" fill="#0f172a" font-size="15" font-weight="800">Factory Gate Kiosk</text>
        <text x="1210" y="178" text-anchor="middle" fill="#475569" font-size="10">Physical Tablet / Edge Gateway</text>
        <text x="1210" y="198" text-anchor="middle" fill="#059669" font-size="10" font-weight="600">Webcam Optical Scan, IndexedDB Sync</text>
        <text x="1210" y="218" text-anchor="middle" fill="#64748b" font-size="9.5">Main Factory Entrance (23.81° N, 90.41° E)</text>
      </g>

      <!-- ================= EXTERNAL ENTITY 3: HR ADMIN (BOTTOM-RIGHT) ================= -->
      <g filter="url(#shadow0)">
        <rect x="1070" y="680" width="280" height="145" rx="10" fill="url(#grad-entity0)" stroke="#334155" stroke-width="2"/>
        <rect x="1070" y="680" width="280" height="32" rx="10" fill="#1e293b"/>
        <text x="1210" y="702" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="800">EXTERNAL ENTITY: E3</text>
        <text x="1210" y="736" text-anchor="middle" fill="#0f172a" font-size="15" font-weight="800">HR Administrator</text>
        <text x="1210" y="758" text-anchor="middle" fill="#475569" font-size="10">Enterprise Administration Console</text>
        <text x="1210" y="778" text-anchor="middle" fill="#e11d48" font-size="10" font-weight="600">Roles: Payroll Execution, Fraud Triage, Staffing</text>
        <text x="1210" y="798" text-anchor="middle" fill="#64748b" font-size="9.5">Example: Prithula</text>
      </g>

      <!-- ================= EXTERNAL ENTITY 5: AI SERVICES (TOP-CENTER) ================= -->
      <g filter="url(#shadow0)">
        <rect x="540" y="85" width="320" height="110" rx="10" fill="url(#grad-entity0)" stroke="#7c3aed" stroke-width="2"/>
        <rect x="540" y="85" width="320" height="28" rx="10" fill="#4c1d95"/>
        <text x="700" y="104" text-anchor="middle" fill="#c084fc" font-size="10.5" font-weight="800">EXTERNAL AI ENGINE: E5</text>
        <text x="700" y="133" text-anchor="middle" fill="#0f172a" font-size="14" font-weight="800">Groq (Llama 3.3) / Gemini 2.0</text>
        <text x="700" y="155" text-anchor="middle" fill="#6b21a8" font-size="10" font-weight="600">Dual-Provider Automated Cascade &amp; Fallback</text>
        <text x="700" y="175" text-anchor="middle" fill="#64748b" font-size="9.5">Generates Briefings, Digests &amp; Conversational Responses</text>
      </g>

      <!-- ================= STEPPED ORTHOGONAL FLOWS WITH HORIZONTAL PILL BADGES ================= -->

      <!-- --- 1. E1 (Worker) -> System 0.0 --- -->
      <path d="M 330 145 L 400 145 L 400 320 L 470 320" stroke="#2563eb" stroke-width="2" fill="none" marker-end="url(#arr0-blue)" />
      <!-- Pill Badge -->
      <g filter="url(#shadow0)">
        <rect x="180" y="255" width="215" height="42" rx="6" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
        <text x="287" y="272" text-anchor="middle" font-size="8.5" font-weight="700" fill="#1e40af">Worker Ingestion Stream</text>
        <text x="287" y="287" text-anchor="middle" font-size="7.5" font-weight="600" fill="#3b82f6">Credentials, Swaps, Leaves, Chat</text>
      </g>

      <!-- --- 2. System 0.0 -> E1 (Worker) --- -->
      <path d="M 470 360 L 360 360 L 360 190 L 330 190" stroke="#059669" stroke-width="2" fill="none" marker-end="url(#arr0-green)" />
      <!-- Pill Badge -->
      <g filter="url(#shadow0)">
        <rect x="180" y="380" width="215" height="42" rx="6" fill="#ffffff" stroke="#059669" stroke-width="1.5"/>
        <text x="287" y="397" text-anchor="middle" font-size="8.5" font-weight="700" fill="#065f46">Worker Egress Stream</text>
        <text x="287" y="412" text-anchor="middle" font-size="7.5" font-weight="600" fill="#059669">Rosters, Digital Payslips, AI Answers</text>
      </g>

      <!-- --- 3. E2 (Floor Manager) -> System 0.0 --- -->
      <path d="M 330 720 L 400 720 L 400 560 L 470 560" stroke="#2563eb" stroke-width="2" fill="none" marker-end="url(#arr0-blue)" />
      <!-- Pill Badge -->
      <g filter="url(#shadow0)">
        <rect x="180" y="520" width="215" height="42" rx="6" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
        <text x="287" y="537" text-anchor="middle" font-size="8.5" font-weight="700" fill="#1e40af">Manager Operations Stream</text>
        <text x="287" y="552" text-anchor="middle" font-size="7.5" font-weight="600" fill="#3b82f6">Roster Assigns, Swap/Leave Approvals</text>
      </g>

      <!-- --- 4. System 0.0 -> E2 (Floor Manager) --- -->
      <path d="M 470 600 L 360 600 L 360 765 L 330 765" stroke="#059669" stroke-width="2" fill="none" marker-end="url(#arr0-green)" />
      <!-- Pill Badge -->
      <g filter="url(#shadow0)">
        <rect x="180" y="640" width="215" height="42" rx="6" fill="#ffffff" stroke="#059669" stroke-width="1.5"/>
        <text x="287" y="657" text-anchor="middle" font-size="8.5" font-weight="700" fill="#065f46">Manager Intelligence Stream</text>
        <text x="287" y="672" text-anchor="middle" font-size="7.5" font-weight="600" fill="#059669">Live Floor Roster, Predictive Staffing</text>
      </g>

      <!-- --- 5. E4 (Gate Kiosk) -> System 0.0 --- -->
      <path d="M 1070 145 L 1000 145 L 1000 320 L 930 320" stroke="#059669" stroke-width="2" fill="none" marker-end="url(#arr0-green)" />
      <!-- Pill Badge -->
      <g filter="url(#shadow0)">
        <rect x="1005" y="255" width="215" height="42" rx="6" fill="#ffffff" stroke="#059669" stroke-width="1.5"/>
        <text x="1112" y="272" text-anchor="middle" font-size="8.5" font-weight="700" fill="#065f46">Edge Telemetry Stream</text>
        <text x="1112" y="287" text-anchor="middle" font-size="7.5" font-weight="600" fill="#059669">128d Vectors, GPS, Offline Batch Logs</text>
      </g>

      <!-- --- 6. System 0.0 -> E4 (Gate Kiosk) --- -->
      <path d="M 930 360 L 1040 360 L 1040 190 L 1070 190" stroke="#2563eb" stroke-width="2" fill="none" marker-end="url(#arr0-blue)" />
      <!-- Pill Badge -->
      <g filter="url(#shadow0)">
        <rect x="1005" y="380" width="215" height="42" rx="6" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
        <text x="1112" y="397" text-anchor="middle" font-size="8.5" font-weight="700" fill="#1e40af">Edge Verification Feedback</text>
        <text x="1112" y="412" text-anchor="middle" font-size="7.5" font-weight="600" fill="#3b82f6">200 OK / 403 Reject, Sync Ack</text>
      </g>

      <!-- --- 7. E3 (HR Admin) -> System 0.0 --- -->
      <path d="M 1070 720 L 1000 720 L 1000 560 L 930 560" stroke="#e11d48" stroke-width="2" fill="none" marker-end="url(#arr0-rose)" />
      <!-- Pill Badge -->
      <g filter="url(#shadow0)">
        <rect x="1005" y="520" width="215" height="42" rx="6" fill="#ffffff" stroke="#e11d48" stroke-width="1.5"/>
        <text x="1112" y="537" text-anchor="middle" font-size="8.5" font-weight="700" fill="#9f1239">Enterprise Management Stream</text>
        <text x="1112" y="552" text-anchor="middle" font-size="7.5" font-weight="600" fill="#e11d48">Onboarding, Trigger Payroll, Triage</text>
      </g>

      <!-- --- 8. System 0.0 -> E3 (HR Admin) --- -->
      <path d="M 930 600 L 1040 600 L 1040 765 L 1070 765" stroke="#059669" stroke-width="2" fill="none" marker-end="url(#arr0-green)" />
      <!-- Pill Badge -->
      <g filter="url(#shadow0)">
        <rect x="1005" y="640" width="215" height="42" rx="6" fill="#ffffff" stroke="#059669" stroke-width="1.5"/>
        <text x="1112" y="657" text-anchor="middle" font-size="8.5" font-weight="700" fill="#065f46">Executive Reporting Stream</text>
        <text x="1112" y="672" text-anchor="middle" font-size="7.5" font-weight="600" fill="#059669">Payroll Ledgers, Fraud Flags &amp; Digests</text>
      </g>

      <!-- --- 9. System 0.0 <-> E5 (AI Inference Engine) --- -->
      <path d="M 640 275 L 640 195" stroke="#7c3aed" stroke-width="2" fill="none" marker-end="url(#arr0-purple)" />
      <g filter="url(#shadow0)">
        <rect x="420" y="215" width="210" height="38" rx="6" fill="#ffffff" stroke="#7c3aed" stroke-width="1.5"/>
        <text x="525" y="231" text-anchor="middle" font-size="8" font-weight="700" fill="#6d28d9">AI Context &amp; Prompts</text>
        <text x="525" y="244" text-anchor="middle" font-size="7.5" font-weight="600" fill="#7c3aed">Attendance, Anomalies, RAG Chunks</text>
      </g>

      <path d="M 760 195 L 760 275" stroke="#7c3aed" stroke-width="2" fill="none" marker-end="url(#arr0-purple)" />
      <g filter="url(#shadow0)">
        <rect x="770" y="215" width="210" height="38" rx="6" fill="#ffffff" stroke="#7c3aed" stroke-width="1.5"/>
        <text x="875" y="231" text-anchor="middle" font-size="8" font-weight="700" fill="#6d28d9">AI Inference Deliverables</text>
        <text x="875" y="244" text-anchor="middle" font-size="7.5" font-weight="600" fill="#7c3aed">Briefings, Forensic Digest, RAG Stream</text>
      </g>

      <!-- FOOTER -->
      <rect x="50" y="905" width="1300" height="30" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="70" y="924" font-size="11" font-weight="700" fill="#0f172a">SYSTEM CONTEXT CONVENTIONS:</text>
      <text x="260" y="924" font-size="10" fill="#475569">Process 0.0: Single System Boundary</text>
      <text x="500" y="924" font-size="10" fill="#475569">External Entities: E1 – E4 (Users &amp; Edge Hardware)</text>
      <text x="830" y="924" font-size="10" fill="#475569">External Service: E5 (Groq / Gemini AI Inference)</text>
      <text x="1140" y="924" font-size="10" font-weight="600" fill="#2563eb">Gane &amp; Sarson Standard</text>
    </svg>
    """

def build_svg_level1():
    return """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 950" width="100%" height="100%" style="background:#ffffff; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
        </marker>
        <marker id="arrow-emerald" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
        </marker>
        <marker id="arrow-purple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#8b5cf6" />
        </marker>
        <marker id="arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#d97706" />
        </marker>
        <marker id="arrow-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#e11d48" />
        </marker>
        <filter id="drop-shadow" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.08" />
        </filter>
        <linearGradient id="grad-entity" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <linearGradient id="grad-proc" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#f1f5f9" />
        </linearGradient>
      </defs>

      <!-- Grid pattern background subtle -->
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
      <rect width="1400" height="950" fill="url(#grid)" />

      <!-- TITLE -->
      <text x="700" y="35" text-anchor="middle" font-size="20" font-weight="800" fill="#0f172a" letter-spacing="0.5">
        LEVEL 1 DATA FLOW DIAGRAM: COMPLETE WORKFORCE MANAGEMENT SYSTEM
      </text>
      <text x="700" y="55" text-anchor="middle" font-size="12" fill="#64748b" font-weight="500">
        Decomposition of System 0.0 into 8 Interconnected Subsystems, 5 External Entities, and 9 Normalized Data Stores
      </text>

      <!-- ================= EXTERNAL ENTITIES (LEFT & RIGHT & BOTTOM) ================= -->
      <!-- E1: Worker -->
      <g filter="url(#drop-shadow)">
        <rect x="40" y="100" width="140" height="70" rx="6" fill="url(#grad-entity)" stroke="#334155" stroke-width="2"/>
        <text x="110" y="130" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">ENTITY: E1</text>
        <text x="110" y="150" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700">Floor Worker</text>
      </g>

      <!-- E2: Floor Manager -->
      <g filter="url(#drop-shadow)">
        <rect x="40" y="440" width="140" height="70" rx="6" fill="url(#grad-entity)" stroke="#334155" stroke-width="2"/>
        <text x="110" y="470" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">ENTITY: E2</text>
        <text x="110" y="490" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700">Floor Manager</text>
      </g>

      <!-- E3: HR Administrator -->
      <g filter="url(#drop-shadow)">
        <rect x="40" y="770" width="140" height="70" rx="6" fill="url(#grad-entity)" stroke="#334155" stroke-width="2"/>
        <text x="110" y="800" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">ENTITY: E3</text>
        <text x="110" y="820" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700">HR Administrator</text>
      </g>

      <!-- E4: Factory Gate Kiosk -->
      <g filter="url(#drop-shadow)">
        <rect x="1220" y="100" width="140" height="70" rx="6" fill="url(#grad-entity)" stroke="#334155" stroke-width="2"/>
        <text x="1290" y="130" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">ENTITY: E4</text>
        <text x="1290" y="150" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700">Gate Kiosk Terminal</text>
      </g>

      <!-- E5: AI Providers (Groq / Gemini) -->
      <g filter="url(#drop-shadow)">
        <rect x="1220" y="770" width="140" height="70" rx="6" fill="url(#grad-entity)" stroke="#334155" stroke-width="2"/>
        <text x="1290" y="800" text-anchor="middle" fill="#c084fc" font-size="11" font-weight="700">EXTERNAL SERVICE: E5</text>
        <text x="1290" y="820" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700">Groq / Gemini AI</text>
      </g>

      <!-- ================= PROCESSES (CENTER COLUMNS) ================= -->
      <!-- P1.0: Auth & Access -->
      <g filter="url(#drop-shadow)">
        <rect x="250" y="80" width="220" height="85" rx="8" fill="url(#grad-proc)" stroke="#3b82f6" stroke-width="1.8"/>
        <path d="M 250 80 Q 250 80 250 105 L 470 105 Q 470 80 470 80 Z" fill="#3b82f6"/>
        <text x="360" y="98" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">PROCESS 1.0</text>
        <text x="360" y="125" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="700">Authentication &amp; RBAC</text>
        <text x="360" y="142" text-anchor="middle" fill="#64748b" font-size="10">Session &amp; Tenant Gatekeeper</text>
      </g>

      <!-- P2.0: Biometric Attendance -->
      <g filter="url(#drop-shadow)">
        <rect x="940" y="80" width="230" height="85" rx="8" fill="url(#grad-proc)" stroke="#059669" stroke-width="1.8"/>
        <path d="M 940 80 Q 940 80 940 105 L 1170 105 Q 1170 80 1170 80 Z" fill="#059669"/>
        <text x="1055" y="98" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">PROCESS 2.0</text>
        <text x="1055" y="125" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="700">Biometric Attendance</text>
        <text x="1055" y="142" text-anchor="middle" fill="#64748b" font-size="10">Face Match &amp; Geofence Validation</text>
      </g>

      <!-- P3.0: Shift & Swap Scheduling -->
      <g filter="url(#drop-shadow)">
        <rect x="250" y="270" width="220" height="85" rx="8" fill="url(#grad-proc)" stroke="#3b82f6" stroke-width="1.8"/>
        <path d="M 250 270 Q 250 270 250 295 L 470 295 Q 470 270 470 270 Z" fill="#3b82f6"/>
        <text x="360" y="288" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">PROCESS 3.0</text>
        <text x="360" y="315" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="700">Shift &amp; Swap Scheduling</text>
        <text x="360" y="332" text-anchor="middle" fill="#64748b" font-size="10">Roster Assignment &amp; Swaps</text>
      </g>

      <!-- P4.0: Deterministic Payroll -->
      <g filter="url(#drop-shadow)">
        <rect x="940" y="270" width="230" height="85" rx="8" fill="url(#grad-proc)" stroke="#059669" stroke-width="1.8"/>
        <path d="M 940 270 Q 940 270 940 295 L 1170 295 Q 1170 270 1170 270 Z" fill="#059669"/>
        <text x="1055" y="288" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">PROCESS 4.0</text>
        <text x="1055" y="315" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="700">Deterministic Payroll Engine</text>
        <text x="1055" y="332" text-anchor="middle" fill="#64748b" font-size="10">Log Pairing, 1.5x OT &amp; Taxes</text>
      </g>

      <!-- P8.0: Leave Management -->
      <g filter="url(#drop-shadow)">
        <rect x="250" y="460" width="220" height="85" rx="8" fill="url(#grad-proc)" stroke="#3b82f6" stroke-width="1.8"/>
        <path d="M 250 460 Q 250 460 250 485 L 470 485 Q 470 460 470 460 Z" fill="#3b82f6"/>
        <text x="360" y="478" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">PROCESS 8.0</text>
        <text x="360" y="505" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="700">Leave &amp; Absence Manager</text>
        <text x="360" y="522" text-anchor="middle" fill="#64748b" font-size="10">Request, Review &amp; Quota Audit</text>
      </g>

      <!-- P5.0: Predictive Staffing -->
      <g filter="url(#drop-shadow)">
        <rect x="940" y="460" width="230" height="85" rx="8" fill="url(#grad-proc)" stroke="#8b5cf6" stroke-width="1.8"/>
        <path d="M 940 460 Q 940 460 940 485 L 1170 485 Q 1170 460 1170 460 Z" fill="#8b5cf6"/>
        <text x="1055" y="478" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">PROCESS 5.0</text>
        <text x="1055" y="505" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="700">AI Predictive Staffing</text>
        <text x="1055" y="522" text-anchor="middle" fill="#64748b" font-size="10">7-Day Moving Avg &amp; AI Briefing</text>
      </g>

      <!-- P7.0: RAG Chatbot -->
      <g filter="url(#drop-shadow)">
        <rect x="250" y="650" width="220" height="85" rx="8" fill="url(#grad-proc)" stroke="#8b5cf6" stroke-width="1.8"/>
        <path d="M 250 650 Q 250 650 250 675 L 470 675 Q 470 650 470 650 Z" fill="#8b5cf6"/>
        <text x="360" y="668" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">PROCESS 7.0</text>
        <text x="360" y="695" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="700">RAG AI Assistant Chatbot</text>
        <text x="360" y="712" text-anchor="middle" fill="#64748b" font-size="10">Trigram Retrieval &amp; Conversing</text>
      </g>

      <!-- P6.0: Forensic Fraud Engine -->
      <g filter="url(#drop-shadow)">
        <rect x="940" y="650" width="230" height="85" rx="8" fill="url(#grad-proc)" stroke="#e11d48" stroke-width="1.8"/>
        <path d="M 940 650 Q 940 650 940 675 L 1170 675 Q 1170 650 1170 650 Z" fill="#e11d48"/>
        <text x="1055" y="668" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">PROCESS 6.0</text>
        <text x="1055" y="695" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="700">Fraud Detection Engine</text>
        <text x="1055" y="712" text-anchor="middle" fill="#64748b" font-size="10">Z-Score Outliers &amp; GPS Forensics</text>
      </g>

      <!-- ================= DATA STORES (CENTER COLUMN) ================= -->
      <!-- D1: Companies & Employees -->
      <g>
        <rect x="560" y="75" width="280" height="40" fill="#f8fafc" stroke="#64748b" stroke-dasharray="0" stroke-width="1.5"/>
        <path d="M 560 75 L 560 115 M 610 75 L 610 115" stroke="#3b82f6" stroke-width="2"/>
        <text x="585" y="98" text-anchor="middle" font-size="11" font-weight="800" fill="#3b82f6">D1</text>
        <text x="720" y="98" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">companies, employees, depts</text>
      </g>

      <!-- D2: Face Embeddings -->
      <g>
        <rect x="560" y="145" width="280" height="40" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 560 145 L 560 185 M 610 145 L 610 185" stroke="#059669" stroke-width="2"/>
        <text x="585" y="168" text-anchor="middle" font-size="11" font-weight="800" fill="#059669">D2</text>
        <text x="720" y="168" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">face_embeddings (pgvector 128d)</text>
      </g>

      <!-- D3: Biometric Logs -->
      <g>
        <rect x="560" y="215" width="280" height="40" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 560 215 L 560 255 M 610 215 L 610 255" stroke="#059669" stroke-width="2"/>
        <text x="585" y="238" text-anchor="middle" font-size="11" font-weight="800" fill="#059669">D3</text>
        <text x="720" y="238" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">biometric_logs, attempts</text>
      </g>

      <!-- D4: Shifts & Swaps -->
      <g>
        <rect x="560" y="285" width="280" height="40" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 560 285 L 560 325 M 610 285 L 610 325" stroke="#3b82f6" stroke-width="2"/>
        <text x="585" y="308" text-anchor="middle" font-size="11" font-weight="800" fill="#3b82f6">D4</text>
        <text x="720" y="308" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">shifts, shift_swaps, access</text>
      </g>

      <!-- D5: Payroll Ledgers -->
      <g>
        <rect x="560" y="355" width="280" height="40" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 560 355 L 560 395 M 610 355 L 610 395" stroke="#059669" stroke-width="2"/>
        <text x="585" y="378" text-anchor="middle" font-size="11" font-weight="800" fill="#059669">D5</text>
        <text x="720" y="378" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">payroll_ledgers</text>
      </g>

      <!-- D6: Staffing Forecasts -->
      <g>
        <rect x="560" y="425" width="280" height="40" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 560 425 L 560 465 M 610 425 L 610 465" stroke="#8b5cf6" stroke-width="2"/>
        <text x="585" y="448" text-anchor="middle" font-size="11" font-weight="800" fill="#8b5cf6">D6</text>
        <text x="720" y="448" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">staffing_forecasts</text>
      </g>

      <!-- D7: Fraud Flags -->
      <g>
        <rect x="560" y="495" width="280" height="40" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 560 495 L 560 535 M 610 495 L 610 535" stroke="#e11d48" stroke-width="2"/>
        <text x="585" y="518" text-anchor="middle" font-size="11" font-weight="800" fill="#e11d48">D7</text>
        <text x="720" y="518" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">fraud_flags</text>
      </g>

      <!-- D8: Chatbot Knowledge Base -->
      <g>
        <rect x="560" y="565" width="280" height="40" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 560 565 L 560 605 M 610 565 L 610 605" stroke="#8b5cf6" stroke-width="2"/>
        <text x="585" y="588" text-anchor="middle" font-size="11" font-weight="800" fill="#8b5cf6">D8</text>
        <text x="720" y="588" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">chatbot_kb, conversations</text>
      </g>

      <!-- D9: Leave Requests -->
      <g>
        <rect x="560" y="635" width="280" height="40" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 560 635 L 560 675 M 610 635 L 610 675" stroke="#3b82f6" stroke-width="2"/>
        <text x="585" y="658" text-anchor="middle" font-size="11" font-weight="800" fill="#3b82f6">D9</text>
        <text x="720" y="658" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">leave_requests</text>
      </g>

      <!-- ================= CONNECTING DATA FLOW LINES ================= -->
      <!-- E1 -> P1.0 (Credentials) -->
      <path d="M 180 120 L 250 120" stroke="#3b82f6" stroke-width="1.8" fill="none" marker-end="url(#arrow)" />
      <text x="215" y="112" text-anchor="middle" font-size="9" font-weight="600" fill="#1e40af">Login Ctx</text>

      <!-- P1.0 -> D1 (Read/Verify User) -->
      <path d="M 470 100 L 560 90" stroke="#3b82f6" stroke-width="1.8" fill="none" marker-end="url(#arrow)" />
      <text x="515" y="88" text-anchor="middle" font-size="8.5" font-weight="600" fill="#1e40af">Verify User</text>

      <!-- E4 (Kiosk) -> P2.0 (Vector Embedding + GPS) -->
      <path d="M 1220 120 L 1170 120" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arrow-emerald)" />
      <text x="1195" y="112" text-anchor="middle" font-size="9" font-weight="600" fill="#065f46">Vector + GPS</text>

      <!-- P2.0 <-> D2 (pgvector distance comparison) -->
      <path d="M 940 110 L 840 155" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arrow-emerald)" />
      <text x="890" y="125" text-anchor="middle" font-size="8.5" font-weight="600" fill="#065f46">Query Vector</text>

      <!-- P2.0 -> D3 (Insert Biometric Log) -->
      <path d="M 940 140 L 840 225" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arrow-emerald)" />
      <text x="890" y="195" text-anchor="middle" font-size="8.5" font-weight="600" fill="#065f46">Write Log</text>

      <!-- P2.0 -> D7 (Trigger Fraud Flag on Distance Mismatch / Geo Breach) -->
      <path d="M 1030 165 L 1030 220 L 840 505" stroke="#e11d48" stroke-width="1.8" fill="none" marker-end="url(#arrow-rose)" />
      <text x="965" y="240" text-anchor="middle" font-size="8.5" font-weight="600" fill="#9f1239">Geo/Buddy Flag</text>

      <!-- E2 (Manager) -> P3.0 (Roster Assignments) -->
      <path d="M 180 460 L 210 460 L 210 330 L 250 330" stroke="#3b82f6" stroke-width="1.8" fill="none" marker-end="url(#arrow)" />
      <text x="210" y="375" text-anchor="middle" font-size="9" font-weight="600" fill="#1e40af" transform="rotate(-90 205 375)">Assign Shifts</text>

      <!-- E1 (Worker) -> P3.0 (Swap Proposals) -->
      <path d="M 180 150 L 210 150 L 210 290 L 250 290" stroke="#3b82f6" stroke-width="1.8" fill="none" marker-end="url(#arrow)" />
      <text x="210" y="210" text-anchor="middle" font-size="9" font-weight="600" fill="#1e40af" transform="rotate(-90 205 210)">Swap Request</text>

      <!-- P3.0 <-> D4 (Roster CRUD) -->
      <path d="M 470 305 L 560 305" stroke="#3b82f6" stroke-width="1.8" fill="none" marker-end="url(#arrow)" />
      <text x="515" y="298" text-anchor="middle" font-size="8.5" font-weight="600" fill="#1e40af">Read/Write Shifts</text>

      <!-- D3 & D4 -> P4.0 (Compute Payroll from Clock Logs) -->
      <path d="M 840 245 L 940 285" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arrow-emerald)" />
      <text x="890" y="260" text-anchor="middle" font-size="8.5" font-weight="600" fill="#065f46">Clock In/Out Pairs</text>

      <!-- P4.0 -> D5 (Save Payroll Ledger) -->
      <path d="M 940 330 L 840 365" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arrow-emerald)" />
      <text x="890" y="340" text-anchor="middle" font-size="8.5" font-weight="600" fill="#065f46">Write Ledger</text>

      <!-- E3 (HR) -> P4.0 (Trigger Run Calculation) -->
      <path d="M 180 820 L 1150 820 L 1150 355" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arrow-emerald)" />
      <text x="650" y="812" text-anchor="middle" font-size="9" font-weight="600" fill="#065f46">Trigger Calculation Period</text>

      <!-- D3 & D4 -> P5.0 (Predictive Staffing Input) -->
      <path d="M 840 315 L 890 315 L 890 485 L 940 485" stroke="#8b5cf6" stroke-width="1.8" fill="none" marker-end="url(#arrow-purple)" />
      <text x="890" y="420" text-anchor="middle" font-size="8.5" font-weight="600" fill="#6d28d9" transform="rotate(-90 885 420)">7-Day Attendance History</text>

      <!-- P5.0 <-> E5 (AI Briefing Request/Response) -->
      <path d="M 1170 500 L 1220 500 L 1220 770" stroke="#8b5cf6" stroke-width="1.8" fill="none" marker-end="url(#arrow-purple)" />
      <text x="1235" y="630" text-anchor="middle" font-size="8.5" font-weight="600" fill="#6d28d9" transform="rotate(90 1235 630)">Forecast Briefing Prompt</text>

      <!-- P5.0 -> D6 (Store Forecast) -->
      <path d="M 940 515 L 840 455" stroke="#8b5cf6" stroke-width="1.8" fill="none" marker-end="url(#arrow-purple)" />
      <text x="890" y="465" text-anchor="middle" font-size="8.5" font-weight="600" fill="#6d28d9">Save Headcount Forecast</text>

      <!-- D5 & D3 -> P6.0 (Outlier Z-Score & Audit Engine) -->
      <path d="M 840 385 L 910 385 L 910 670 L 940 670" stroke="#e11d48" stroke-width="1.8" fill="none" marker-end="url(#arrow-rose)" />
      <text x="905" y="580" text-anchor="middle" font-size="8.5" font-weight="600" fill="#9f1239" transform="rotate(-90 900 580)">OT Hours &amp; Punch Pairs</text>

      <!-- P6.0 <-> E5 (AI Fraud Digest) -->
      <path d="M 1170 700 L 1220 785" stroke="#e11d48" stroke-width="1.8" fill="none" marker-end="url(#arrow-rose)" />
      <text x="1200" y="735" text-anchor="middle" font-size="8.5" font-weight="600" fill="#9f1239">Triage Prompt</text>

      <!-- P6.0 -> D7 (Write Flags) -->
      <path d="M 940 710 L 840 525" stroke="#e11d48" stroke-width="1.8" fill="none" marker-end="url(#arrow-rose)" />
      <text x="880" y="625" text-anchor="middle" font-size="8.5" font-weight="600" fill="#9f1239">Write Anomaly Flags</text>

      <!-- E3 (HR) -> P6.0 (Resolve Flags) -->
      <path d="M 180 800 L 980 800 L 980 735" stroke="#e11d48" stroke-width="1.8" fill="none" marker-end="url(#arrow-rose)" />
      <text x="500" y="792" text-anchor="middle" font-size="9" font-weight="600" fill="#9f1239">Resolve Anomaly Action (Confirm/Dismiss)</text>

      <!-- E1 (Worker) -> P7.0 (Chat Query) -->
      <path d="M 110 170 L 110 680 L 250 680" stroke="#8b5cf6" stroke-width="1.8" fill="none" marker-end="url(#arrow-purple)" />
      <text x="125" y="320" text-anchor="middle" font-size="8.5" font-weight="600" fill="#6d28d9" transform="rotate(90 125 320)">Natural Language Query</text>

      <!-- P7.0 <-> D8 (Trigram Similarity Query & Convo History) -->
      <path d="M 470 680 L 560 595" stroke="#8b5cf6" stroke-width="1.8" fill="none" marker-end="url(#arrow-purple)" />
      <text x="515" y="625" text-anchor="middle" font-size="8.5" font-weight="600" fill="#6d28d9">Retrieve Policies &amp; History</text>

      <!-- P7.0 <-> D4 & D5 (Worker Shift & Payslip Context Injection) -->
      <path d="M 470 660 L 520 660 L 520 380 L 560 380" stroke="#8b5cf6" stroke-width="1.8" fill="none" marker-end="url(#arrow-purple)" />
      <text x="525" y="520" text-anchor="middle" font-size="8.5" font-weight="600" fill="#6d28d9" transform="rotate(-90 525 520)">Fetch Worker Payslip/Shifts</text>

      <!-- P7.0 <-> E5 (Chat LLM Completion) -->
      <path d="M 360 735 L 360 880 L 1260 880 L 1260 840" stroke="#8b5cf6" stroke-width="1.8" fill="none" marker-end="url(#arrow-purple)" />
      <text x="800" y="872" text-anchor="middle" font-size="9" font-weight="600" fill="#6d28d9">RAG Context + User Prompt to Conversational Response</text>

      <!-- E1 (Worker) -> P8.0 (Apply Leave) -->
      <path d="M 130 170 L 130 480 L 250 480" stroke="#3b82f6" stroke-width="1.8" fill="none" marker-end="url(#arrow)" />
      <text x="145" y="320" text-anchor="middle" font-size="8.5" font-weight="600" fill="#1e40af" transform="rotate(90 145 320)">Apply Leave</text>

      <!-- E2 (Manager) -> P8.0 (Authorize Leave) -->
      <path d="M 180 495 L 250 495" stroke="#3b82f6" stroke-width="1.8" fill="none" marker-end="url(#arrow)" />
      <text x="215" y="488" text-anchor="middle" font-size="8.5" font-weight="600" fill="#1e40af">Approve/Reject</text>

      <!-- P8.0 <-> D9 (Leave Requests CRUD) -->
      <path d="M 470 515 L 560 645" stroke="#3b82f6" stroke-width="1.8" fill="none" marker-end="url(#arrow)" />
      <text x="515" y="570" text-anchor="middle" font-size="8.5" font-weight="600" fill="#1e40af">Read/Update Leaves</text>

      <!-- PROCESS BOUNDARY FOOTER -->
      <rect x="40" y="905" width="1320" height="30" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="60" y="924" font-size="11" font-weight="700" fill="#475569">LEGEND &amp; CONVENTIONS:</text>
      <rect x="230" y="912" width="14" height="14" fill="#0f172a" rx="2"/>
      <text x="250" y="924" font-size="10" fill="#475569">External Entity</text>
      <rect x="360" y="912" width="14" height="14" fill="#f1f5f9" stroke="#3b82f6" stroke-width="1.5" rx="2"/>
      <text x="380" y="924" font-size="10" fill="#475569">Subsystem Process</text>
      <rect x="520" y="912" width="20" height="14" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
      <text x="545" y="924" font-size="10" fill="#475569">Data Store (Gane &amp; Sarson)</text>
      <line x1="720" y1="919" x2="745" y2="919" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="755" y="924" font-size="10" fill="#475569">Synchronous Data Flow</text>
      <text x="1220" y="924" font-size="10" font-weight="600" fill="#059669">PostgreSQL pgvector Engine</text>
    </svg>
    """

def build_svg_level2_biometric():
    return """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 950" width="100%" height="100%" style="background:#ffffff; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
      <defs>
        <marker id="arr-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
        </marker>
        <marker id="arr-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#e11d48" />
        </marker>
        <marker id="arr-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
        </marker>
        <filter id="shadow2" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.08" />
        </filter>
        <linearGradient id="grad-entity2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <linearGradient id="grad-p2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f0fdf4" />
          <stop offset="100%" stop-color="#dcfce7" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
      <rect width="1400" height="950" fill="url(#grid2)" />

      <!-- TITLE -->
      <text x="700" y="35" text-anchor="middle" font-size="20" font-weight="800" fill="#065f46" letter-spacing="0.5">
        LEVEL 2 DATA FLOW DIAGRAM: SUBSYSTEM 2.0 (BIOMETRIC ATTENDANCE &amp; GEOFENCE INGESTION)
      </text>
      <text x="700" y="55" text-anchor="middle" font-size="12" fill="#64748b" font-weight="500">
        Detailed Subprocess Decomposition: Webcam Liveness Challenge, IndexedDB Offline Sync, pgvector Distance &amp; Geofencing
      </text>

      <!-- ================= EXTERNAL ENTITIES ================= -->
      <!-- E1: Floor Worker -->
      <g filter="url(#shadow2)">
        <rect x="40" y="120" width="150" height="75" rx="6" fill="url(#grad-entity2)" stroke="#334155" stroke-width="2"/>
        <text x="115" y="152" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">ENTITY: E1</text>
        <text x="115" y="174" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700">Floor Worker (Face/GPS)</text>
      </g>

      <!-- E4: Tablet / Kiosk Camera Device -->
      <g filter="url(#shadow2)">
        <rect x="40" y="320" width="150" height="75" rx="6" fill="url(#grad-entity2)" stroke="#334155" stroke-width="2"/>
        <text x="115" y="352" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">ENTITY: E4</text>
        <text x="115" y="374" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700">Gate Kiosk Terminal</text>
      </g>

      <!-- E3: HR Admin (Audit Flag Review) -->
      <g filter="url(#shadow2)">
        <rect x="1210" y="720" width="150" height="75" rx="6" fill="url(#grad-entity2)" stroke="#334155" stroke-width="2"/>
        <text x="1285" y="752" text-anchor="middle" fill="#f43f5e" font-size="11" font-weight="700">ENTITY: E3</text>
        <text x="1285" y="774" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700">HR Administrator</text>
      </g>

      <!-- ================= LEVEL 2 SUBPROCESSES (2.1 to 2.5) ================= -->
      <!-- P2.1: Webcam & Liveness -->
      <g filter="url(#shadow2)">
        <rect x="270" y="110" width="250" height="95" rx="8" fill="url(#grad-p2)" stroke="#059669" stroke-width="2"/>
        <path d="M 270 110 Q 270 110 270 135 L 520 135 Q 520 110 520 110 Z" fill="#059669"/>
        <text x="395" y="128" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">SUBPROCESS 2.1</text>
        <text x="395" y="158" text-anchor="middle" fill="#065f46" font-size="12" font-weight="700">Webcam Capture &amp; Liveness Challenge</text>
        <text x="395" y="176" text-anchor="middle" fill="#047857" font-size="10">Head-Tilt/Blink Validation &amp; 128d Extraction</text>
      </g>

      <!-- P2.2: IndexedDB Offline Sync -->
      <g filter="url(#shadow2)">
        <rect x="270" y="310" width="250" height="95" rx="8" fill="url(#grad-p2)" stroke="#059669" stroke-width="2"/>
        <path d="M 270 310 Q 270 310 270 335 L 520 335 Q 520 310 520 310 Z" fill="#059669"/>
        <text x="395" y="328" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">SUBPROCESS 2.2</text>
        <text x="395" y="358" text-anchor="middle" fill="#065f46" font-size="12" font-weight="700">Offline Caching &amp; Auto-Sync Manager</text>
        <text x="395" y="376" text-anchor="middle" fill="#047857" font-size="10">IndexedDB Buffer &amp; Reconnection Sync</text>
      </g>

      <!-- P2.3: pgvector Similarity Matching -->
      <g filter="url(#shadow2)">
        <rect x="620" y="210" width="260" height="95" rx="8" fill="url(#grad-p2)" stroke="#059669" stroke-width="2"/>
        <path d="M 620 210 Q 620 210 620 235 L 880 235 Q 880 210 880 210 Z" fill="#059669"/>
        <text x="750" y="228" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">SUBPROCESS 2.3</text>
        <text x="750" y="258" text-anchor="middle" fill="#065f46" font-size="12" font-weight="700">pgvector Euclidean Distance Matcher</text>
        <text x="750" y="276" text-anchor="middle" fill="#047857" font-size="10">&lt;-&gt; Operator (Threshold: distance &lt;= 0.05)</text>
      </g>

      <!-- P2.4: Haversine Geofence Validator -->
      <g filter="url(#shadow2)">
        <rect x="970" y="210" width="250" height="95" rx="8" fill="url(#grad-p2)" stroke="#059669" stroke-width="2"/>
        <path d="M 970 210 Q 970 210 970 235 L 1220 235 Q 1220 210 1220 210 Z" fill="#059669"/>
        <text x="1095" y="228" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">SUBPROCESS 2.4</text>
        <text x="1095" y="258" text-anchor="middle" fill="#065f46" font-size="12" font-weight="700">Haversine GPS Geofence Validator</text>
        <text x="1095" y="276" text-anchor="middle" fill="#047857" font-size="10">Radius Check: &lt;= 100m from Factory Gate</text>
      </g>

      <!-- P2.5: Attendance Log & Shift Finalizer -->
      <g filter="url(#shadow2)">
        <rect x="620" y="520" width="260" height="95" rx="8" fill="url(#grad-p2)" stroke="#059669" stroke-width="2"/>
        <path d="M 620 520 Q 620 520 620 545 L 880 545 Q 880 520 880 520 Z" fill="#059669"/>
        <text x="750" y="538" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">SUBPROCESS 2.5</text>
        <text x="750" y="568" text-anchor="middle" fill="#065f46" font-size="12" font-weight="700">Attendance Logger &amp; Shift Finalizer</text>
        <text x="750" y="586" text-anchor="middle" fill="#047857" font-size="10">Records Punch &amp; Updates Shift Status</text>
      </g>

      <!-- ================= LOCAL DATA STORES ================= -->
      <!-- D2.1: Client IndexedDB (kiosk_offline_db) -->
      <g>
        <rect x="270" y="470" width="250" height="42" fill="#f8fafc" stroke="#059669" stroke-width="1.5"/>
        <path d="M 270 470 L 270 512 M 320 470 L 320 512" stroke="#059669" stroke-width="2"/>
        <text x="295" y="496" text-anchor="middle" font-size="11" font-weight="800" fill="#059669">L-DB</text>
        <text x="420" y="496" text-anchor="middle" font-size="10.5" font-weight="600" fill="#1e293b">Client IndexedDB (kiosk_offline_db)</text>
      </g>

      <!-- D2: Face Embeddings -->
      <g>
        <rect x="620" y="80" width="260" height="42" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 620 80 L 620 122 M 670 80 L 670 122" stroke="#059669" stroke-width="2"/>
        <text x="645" y="106" text-anchor="middle" font-size="11" font-weight="800" fill="#059669">D2</text>
        <text x="770" y="106" text-anchor="middle" font-size="10.5" font-weight="600" fill="#1e293b">face_embeddings (pgvector 128d)</text>
      </g>

      <!-- D3: Biometric Logs & Attempts -->
      <g>
        <rect x="620" y="730" width="260" height="42" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 620 730 L 620 772 M 670 730 L 670 772" stroke="#059669" stroke-width="2"/>
        <text x="645" y="756" text-anchor="middle" font-size="11" font-weight="800" fill="#059669">D3</text>
        <text x="770" y="756" text-anchor="middle" font-size="10.5" font-weight="600" fill="#1e293b">biometric_logs, attempts</text>
      </g>

      <!-- D4: Shifts -->
      <g>
        <rect x="270" y="730" width="250" height="42" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 270 730 L 270 772 M 320 730 L 320 772" stroke="#3b82f6" stroke-width="2"/>
        <text x="295" y="756" text-anchor="middle" font-size="11" font-weight="800" fill="#3b82f6">D4</text>
        <text x="420" y="756" text-anchor="middle" font-size="10.5" font-weight="600" fill="#1e293b">shifts (Roster Status)</text>
      </g>

      <!-- D7: Fraud Flags -->
      <g>
        <rect x="970" y="730" width="250" height="42" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 970 730 L 970 772 M 1020 730 L 1020 772" stroke="#e11d48" stroke-width="2"/>
        <text x="995" y="756" text-anchor="middle" font-size="11" font-weight="800" fill="#e11d48">D7</text>
        <text x="1120" y="756" text-anchor="middle" font-size="10.5" font-weight="600" fill="#1e293b">fraud_flags (Geofence / Buddy)</text>
      </g>

      <!-- ================= DATA FLOWS ================= -->
      <!-- E1 -> P2.1: Face Image Video Stream -->
      <path d="M 190 145 L 270 145" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arr-green)" />
      <text x="230" y="138" text-anchor="middle" font-size="9" font-weight="600" fill="#065f46">Webcam Frames</text>

      <!-- P2.1 -> P2.2: Verified 128d Descriptor + GPS -->
      <path d="M 395 205 L 395 310" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arr-green)" />
      <text x="405" y="255" text-anchor="start" font-size="9" font-weight="600" fill="#065f46">Liveness OK: [128-float, Lat, Lng]</text>

      <!-- P2.2 <-> L-DB: Save if offline, read on connect -->
      <path d="M 395 405 L 395 470" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arr-green)" />
      <text x="405" y="440" text-anchor="start" font-size="9" font-weight="600" fill="#065f46">Buffer Unsynced Punch (synced:0)</text>

      <!-- P2.2 -> P2.3: Transmit payload to Server API -->
      <path d="M 520 350 L 570 350 L 570 255 L 620 255" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arr-green)" />
      <text x="575" y="295" text-anchor="middle" font-size="9" font-weight="600" fill="#065f46" transform="rotate(-90 570 295)">HTTP POST /api/attendance</text>

      <!-- P2.3 <-> D2: Execute SQL Distance Query -->
      <path d="M 750 210 L 750 122" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arr-green)" />
      <text x="760" y="165" text-anchor="start" font-size="8.5" font-weight="600" fill="#065f46">SELECT embedding &lt;-&gt; $1::vector</text>

      <!-- P2.3 -> D7: Match Mismatch / Buddy Punch Flag -->
      <path d="M 880 240 L 930 240 L 930 650 L 1030 730" stroke="#e11d48" stroke-width="1.8" fill="none" marker-end="url(#arr-red)" />
      <text x="940" y="450" text-anchor="middle" font-size="8.5" font-weight="600" fill="#9f1239" transform="rotate(90 940 450)">Distance &gt; 0.05 (Biometric Mismatch)</text>

      <!-- P2.3 -> P2.4: Valid Biometric -> Evaluate GPS Coordinates -->
      <path d="M 880 270 L 970 270" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arr-green)" />
      <text x="925" y="262" text-anchor="middle" font-size="8.5" font-weight="600" fill="#065f46">Match Confirmed</text>

      <!-- P2.4 -> D7: Haversine &gt; 100m -> Geofence Violation Flag -->
      <path d="M 1095 305 L 1095 730" stroke="#e11d48" stroke-width="1.8" fill="none" marker-end="url(#arr-red)" />
      <text x="1105" y="480" text-anchor="start" font-size="8.5" font-weight="600" fill="#9f1239">Distance &gt; 100m (Geofence Breach)</text>

      <!-- P2.4 -> P2.5: Geofence OK / Log Validated -->
      <path d="M 1040 305 L 1040 480 L 800 480 L 800 520" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arr-green)" />
      <text x="920" y="472" text-anchor="middle" font-size="9" font-weight="600" fill="#065f46">Validated Attendance Packet</text>

      <!-- P2.5 -> D3: Insert Verified Biometric Log -->
      <path d="M 750 615 L 750 730" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arr-green)" />
      <text x="760" y="675" text-anchor="start" font-size="8.5" font-weight="600" fill="#065f46">INSERT biometric_logs</text>

      <!-- P2.5 -> D4: Update Shift Status to 'Completed' -->
      <path d="M 680 615 L 680 690 L 450 690 L 450 730" stroke="#3b82f6" stroke-width="1.8" fill="none" marker-end="url(#arr-blue)" />
      <text x="565" y="682" text-anchor="middle" font-size="8.5" font-weight="600" fill="#1e40af">UPDATE shifts SET status='Completed'</text>

      <!-- D7 -> E3: Dispatch Anomaly Alert to HR Admin -->
      <path d="M 1220 750 L 1210 750" stroke="#e11d48" stroke-width="1.8" fill="none" marker-end="url(#arr-red)" />
      <text x="1215" y="742" text-anchor="middle" font-size="8.5" font-weight="600" fill="#9f1239">Alert Dispatch</text>

      <!-- P2.5 -> E4: Return Success Status to Terminal -->
      <path d="M 620 570 L 115 570 L 115 395" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arr-green)" />
      <text x="240" y="562" text-anchor="middle" font-size="9" font-weight="600" fill="#065f46">200 OK: Attendance Registered Confirmation</text>

      <!-- FOOTER -->
      <rect x="40" y="905" width="1320" height="30" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="60" y="924" font-size="11" font-weight="700" fill="#065f46">SUBPROCESS DETAILS:</text>
      <text x="210" y="924" font-size="10" fill="#475569">2.1: Face Node Extraction &amp; Challenge</text>
      <text x="470" y="924" font-size="10" fill="#475569">2.2: IndexedDB Transactional Sync</text>
      <text x="710" y="924" font-size="10" fill="#475569">2.3: pgvector Vector Distance Check</text>
      <text x="960" y="924" font-size="10" fill="#475569">2.4: Haversine Geofence</text>
      <text x="1140" y="924" font-size="10" font-weight="600" fill="#059669">2.5: Shift State Transition</text>
    </svg>
    """

def build_svg_level2_payroll():
    return """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 950" width="100%" height="100%" style="background:#ffffff; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
      <defs>
        <marker id="arr-p-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
        </marker>
        <marker id="arr-p-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#e11d48" />
        </marker>
        <marker id="arr-p-purple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#8b5cf6" />
        </marker>
        <marker id="arr-p-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
        </marker>
        <filter id="shadow3" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.08" />
        </filter>
        <linearGradient id="grad-entity3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <linearGradient id="grad-p3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#eff6ff" />
          <stop offset="100%" stop-color="#dbeafe" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <pattern id="grid3" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
      <rect width="1400" height="950" fill="url(#grid3)" />

      <!-- TITLE -->
      <text x="700" y="35" text-anchor="middle" font-size="20" font-weight="800" fill="#1e40af" letter-spacing="0.5">
        LEVEL 2 DATA FLOW DIAGRAM: SUBSYSTEM 4.0 &amp; 6.0 (PAYROLL CALCULATION &amp; FRAUD FORENSICS)
      </text>
      <text x="700" y="55" text-anchor="middle" font-size="12" fill="#64748b" font-weight="500">
        Detailed Subprocess Decomposition: Log Pairing, 1.5x Overtime Multiplier, Statistical Z-Scores &amp; AI Digest
      </text>

      <!-- ================= EXTERNAL ENTITIES ================= -->
      <!-- E3: HR Administrator -->
      <g filter="url(#shadow3)">
        <rect x="40" y="100" width="150" height="75" rx="6" fill="url(#grad-entity3)" stroke="#334155" stroke-width="2"/>
        <text x="115" y="132" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">ENTITY: E3</text>
        <text x="115" y="154" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700">HR Administrator</text>
      </g>

      <!-- E1: Floor Worker (Payslip Inquirer) -->
      <g filter="url(#shadow3)">
        <rect x="40" y="520" width="150" height="75" rx="6" fill="url(#grad-entity3)" stroke="#334155" stroke-width="2"/>
        <text x="115" y="552" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">ENTITY: E1</text>
        <text x="115" y="574" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700">Floor Worker</text>
      </g>

      <!-- E5: AI Providers (Groq / Gemini) -->
      <g filter="url(#shadow3)">
        <rect x="1210" y="680" width="150" height="75" rx="6" fill="url(#grad-entity3)" stroke="#334155" stroke-width="2"/>
        <text x="1285" y="712" text-anchor="middle" fill="#c084fc" font-size="11" font-weight="700">EXTERNAL SERVICE: E5</text>
        <text x="1285" y="734" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700">Groq / Gemini AI</text>
      </g>

      <!-- ================= LEVEL 2 PROCESSES ================= -->
      <!-- P4.1: Log Pairing & Hours -->
      <g filter="url(#shadow3)">
        <rect x="270" y="90" width="260" height="95" rx="8" fill="url(#grad-p3)" stroke="#3b82f6" stroke-width="2"/>
        <path d="M 270 90 Q 270 90 270 115 L 530 115 Q 530 90 530 90 Z" fill="#3b82f6"/>
        <text x="400" y="108" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">SUBPROCESS 4.1</text>
        <text x="400" y="138" text-anchor="middle" fill="#1e40af" font-size="12" font-weight="700">Clock Log Pairing &amp; Hours Aggregator</text>
        <text x="400" y="156" text-anchor="middle" fill="#3b82f6" font-size="10">Pairs Check_In &amp; Check_Out per Worker</text>
      </g>

      <!-- P4.2: Overtime & Wage Calculator -->
      <g filter="url(#shadow3)">
        <rect x="620" y="90" width="260" height="95" rx="8" fill="url(#grad-p3)" stroke="#3b82f6" stroke-width="2"/>
        <path d="M 620 90 Q 620 90 620 115 L 880 115 Q 880 90 880 90 Z" fill="#3b82f6"/>
        <text x="750" y="108" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">SUBPROCESS 4.2</text>
        <text x="750" y="138" text-anchor="middle" fill="#1e40af" font-size="12" font-weight="700">Overtime Split &amp; Wage Multiplier</text>
        <text x="750" y="156" text-anchor="middle" fill="#3b82f6" font-size="10">8h Base + (Hours - 8) * 1.5 * Hourly Rate</text>
      </g>

      <!-- P4.3: Tax & Deductions Engine -->
      <g filter="url(#shadow3)">
        <rect x="970" y="90" width="260" height="95" rx="8" fill="url(#grad-p3)" stroke="#3b82f6" stroke-width="2"/>
        <path d="M 970 90 Q 970 90 970 115 L 1230 115 Q 1230 90 1230 90 Z" fill="#3b82f6"/>
        <text x="1100" y="108" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">SUBPROCESS 4.3</text>
        <text x="1100" y="138" text-anchor="middle" fill="#1e40af" font-size="12" font-weight="700">Statutory Tax &amp; Net Ledger Finalizer</text>
        <text x="1100" y="156" text-anchor="middle" fill="#3b82f6" font-size="10">Applies 10% Deductions &amp; Generates Net Pay</text>
      </g>

      <!-- P6.1: Z-Score Overtime Anomaly Detector -->
      <g filter="url(#shadow3)">
        <rect x="620" y="440" width="260" height="95" rx="8" fill="url(#grad-p3)" stroke="#e11d48" stroke-width="2"/>
        <path d="M 620 440 Q 620 440 620 465 L 880 465 Q 880 440 880 440 Z" fill="#e11d48"/>
        <text x="750" y="458" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">SUBPROCESS 6.1</text>
        <text x="750" y="488" text-anchor="middle" fill="#9f1239" font-size="12" font-weight="700">Statistical Z-Score Outlier Scanner</text>
        <text x="750" y="506" text-anchor="middle" fill="#be123c" font-size="10">Z = (x - mean) / stddev (Flags Z &gt; 1.5 &amp; OT &gt; 2h)</text>
      </g>

      <!-- P6.2: Buddy Punch & Double-Log Scanner -->
      <g filter="url(#shadow3)">
        <rect x="270" y="440" width="260" height="95" rx="8" fill="url(#grad-p3)" stroke="#e11d48" stroke-width="2"/>
        <path d="M 270 440 Q 270 440 270 465 L 530 465 Q 530 440 530 440 Z" fill="#e11d48"/>
        <text x="400" y="458" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">SUBPROCESS 6.2</text>
        <text x="400" y="488" text-anchor="middle" fill="#9f1239" font-size="12" font-weight="700">Concurrent Punch / Buddy Scanner</text>
        <text x="400" y="506" text-anchor="middle" fill="#be123c" font-size="10">Identifies Identical Timestamp Clocks</text>
      </g>

      <!-- P6.3: AI Forensic Digest & Resolution -->
      <g filter="url(#shadow3)">
        <rect x="970" y="440" width="260" height="95" rx="8" fill="url(#grad-p3)" stroke="#8b5cf6" stroke-width="2"/>
        <path d="M 970 440 Q 970 440 970 465 L 1230 465 Q 1230 440 1230 440 Z" fill="#8b5cf6"/>
        <text x="1100" y="458" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">SUBPROCESS 6.3</text>
        <text x="1100" y="488" text-anchor="middle" fill="#6d28d9" font-size="12" font-weight="700">AI Forensic Digest &amp; Triage Manager</text>
        <text x="1100" y="506" text-anchor="middle" fill="#7c3aed" font-size="10">Generates Weekly Anomaly Briefing</text>
      </g>

      <!-- ================= DATA STORES ================= -->
      <!-- D1: Employees -->
      <g>
        <rect x="270" y="270" width="260" height="42" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 270 270 L 270 312 M 320 270 L 320 312" stroke="#3b82f6" stroke-width="2"/>
        <text x="295" y="296" text-anchor="middle" font-size="11" font-weight="800" fill="#3b82f6">D1</text>
        <text x="420" y="296" text-anchor="middle" font-size="10.5" font-weight="600" fill="#1e293b">employees (Hourly Rates by Role)</text>
      </g>

      <!-- D3: Biometric Logs -->
      <g>
        <rect x="40" y="270" width="150" height="42" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 40 270 L 40 312 M 80 270 L 80 312" stroke="#059669" stroke-width="2"/>
        <text x="60" y="296" text-anchor="middle" font-size="11" font-weight="800" fill="#059669">D3</text>
        <text x="135" y="296" text-anchor="middle" font-size="10" font-weight="600" fill="#1e293b">biometric_logs</text>
      </g>

      <!-- D5: Payroll Ledgers -->
      <g>
        <rect x="750" y="270" width="340" height="42" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 750 270 L 750 312 M 800 270 L 800 312" stroke="#059669" stroke-width="2"/>
        <text x="775" y="296" text-anchor="middle" font-size="11" font-weight="800" fill="#059669">D5</text>
        <text x="940" y="296" text-anchor="middle" font-size="10.5" font-weight="600" fill="#1e293b">payroll_ledgers (Regular, OT, Gross, Net)</text>
      </g>

      <!-- D7: Fraud Flags -->
      <g>
        <rect x="620" y="680" width="260" height="42" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 620 680 L 620 722 M 670 680 L 670 722" stroke="#e11d48" stroke-width="2"/>
        <text x="645" y="706" text-anchor="middle" font-size="11" font-weight="800" fill="#e11d48">D7</text>
        <text x="770" y="706" text-anchor="middle" font-size="10.5" font-weight="600" fill="#1e293b">fraud_flags (Audit Queue)</text>
      </g>

      <!-- ================= DATA FLOWS ================= -->
      <!-- E3 -> P4.1: Compute Request (Start/End Date) -->
      <path d="M 190 125 L 270 125" stroke="#3b82f6" stroke-width="1.8" fill="none" marker-end="url(#arr-p-blue)" />
      <text x="230" y="118" text-anchor="middle" font-size="9" font-weight="600" fill="#1e40af">Start &amp; End Period</text>

      <!-- D3 -> P4.1: Fetch Clock Logs for Period -->
      <path d="M 115 270 L 115 170 L 270 170" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arr-p-green)" />
      <text x="180" y="162" text-anchor="middle" font-size="8.5" font-weight="600" fill="#065f46">Timestamps &amp; Types</text>

      <!-- P4.1 -> P4.2: Computed Raw Hours per Employee -->
      <path d="M 530 138 L 620 138" stroke="#3b82f6" stroke-width="1.8" fill="none" marker-end="url(#arr-p-blue)" />
      <text x="575" y="130" text-anchor="middle" font-size="8.5" font-weight="600" fill="#1e40af">Total Work Hours</text>

      <!-- D1 -> P4.2: Fetch Role Rates ($30, $25, $15) -->
      <path d="M 530 290 L 680 290 L 680 185" stroke="#3b82f6" stroke-width="1.8" fill="none" marker-end="url(#arr-p-blue)" />
      <text x="610" y="282" text-anchor="middle" font-size="8.5" font-weight="600" fill="#1e40af">Role Hourly Rates</text>

      <!-- P4.2 -> P4.3: Gross Pay Breakdown (Base + 1.5x OT) -->
      <path d="M 880 138 L 970 138" stroke="#3b82f6" stroke-width="1.8" fill="none" marker-end="url(#arr-p-blue)" />
      <text x="925" y="130" text-anchor="middle" font-size="8.5" font-weight="600" fill="#1e40af">Gross &amp; OT Pay</text>

      <!-- P4.3 -> D5: Persist Payroll Ledger -->
      <path d="M 1100 185 L 1100 290 L 1090 290" stroke="#059669" stroke-width="1.8" fill="none" marker-end="url(#arr-p-green)" />
      <text x="1105" y="240" text-anchor="start" font-size="8.5" font-weight="600" fill="#065f46">INSERT / UPDATE Ledgers</text>

      <!-- E1 (Worker) <-> D5: Digital Payslip View & Print -->
      <path d="M 190 550 L 800 550 L 800 312" stroke="#3b82f6" stroke-width="1.8" fill="none" marker-end="url(#arr-p-blue)" />
      <text x="450" y="542" text-anchor="middle" font-size="9" font-weight="600" fill="#1e40af">Query &amp; Print Personal Monthly Payslip</text>

      <!-- D5 -> P6.1: Overtime Hours for Statistical Outlier Analysis -->
      <path d="M 820 312 L 820 440" stroke="#e11d48" stroke-width="1.8" fill="none" marker-end="url(#arr-p-rose)" />
      <text x="830" y="380" text-anchor="start" font-size="8.5" font-weight="600" fill="#9f1239">Monthly OT Hours Array</text>

      <!-- D3 -> P6.2: Timestamps for Concurrent Punch Scan -->
      <path d="M 115 312 L 115 480 L 270 480" stroke="#e11d48" stroke-width="1.8" fill="none" marker-end="url(#arr-p-rose)" />
      <text x="180" y="472" text-anchor="middle" font-size="8.5" font-weight="600" fill="#9f1239">7-Day Punch History</text>

      <!-- P6.2 -> D7: Write Buddy Punch Flags -->
      <path d="M 400 535 L 400 700 L 620 700" stroke="#e11d48" stroke-width="1.8" fill="none" marker-end="url(#arr-p-rose)" />
      <text x="490" y="692" text-anchor="middle" font-size="8.5" font-weight="600" fill="#9f1239">Simultaneous Punch Flag</text>

      <!-- P6.1 -> D7: Write Overtime Outlier Flags (Z > 1.5) -->
      <path d="M 750 535 L 750 680" stroke="#e11d48" stroke-width="1.8" fill="none" marker-end="url(#arr-p-rose)" />
      <text x="760" y="610" text-anchor="start" font-size="8.5" font-weight="600" fill="#9f1239">Overtime Outlier Flag</text>

      <!-- D7 -> P6.3: Aggregate Active Anomaly Summary -->
      <path d="M 880 700 L 970 700 L 970 535" stroke="#8b5cf6" stroke-width="1.8" fill="none" marker-end="url(#arr-p-purple)" />
      <text x="980" y="620" text-anchor="start" font-size="8.5" font-weight="600" fill="#6d28d9">Unresolved Anomaly List</text>

      <!-- P6.3 <-> E5: Request AI Forensic Summary -->
      <path d="M 1230 488 L 1285 488 L 1285 680" stroke="#8b5cf6" stroke-width="1.8" fill="none" marker-end="url(#arr-p-purple)" />
      <text x="1295" y="580" text-anchor="start" font-size="8.5" font-weight="600" fill="#6d28d9">Prompt with Anomaly Context</text>

      <!-- P6.3 -> D7: Update Flags with AI Digest Text -->
      <path d="M 1100 535 L 1100 710 L 880 710" stroke="#8b5cf6" stroke-width="1.8" fill="none" marker-end="url(#arr-p-purple)" />
      <text x="1000" y="725" text-anchor="middle" font-size="8.5" font-weight="600" fill="#6d28d9">Store AI Digest</text>

      <!-- E3 (HR) <-> D7: Review & Update Flag Status (Confirmed / Dismissed) -->
      <path d="M 190 145 L 230 145 L 230 750 L 620 750 L 620 722" stroke="#e11d48" stroke-width="1.8" fill="none" marker-end="url(#arr-p-rose)" />
      <text x="320" y="742" text-anchor="middle" font-size="9" font-weight="600" fill="#9f1239">Triage Anomaly: Confirm / Dismiss</text>

      <!-- FOOTER -->
      <rect x="40" y="905" width="1320" height="30" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="60" y="924" font-size="11" font-weight="700" fill="#1e40af">COMPLIANCE &amp; FORENSIC RULES:</text>
      <text x="250" y="924" font-size="10" fill="#475569">4.1: Pair Check_In &amp; Check_Out chronologically</text>
      <text x="560" y="924" font-size="10" fill="#475569">4.2: Hours &gt; 8.0 split into 1.5x Overtime Wage</text>
      <text x="890" y="924" font-size="10" fill="#475569">6.1: Z-Score &gt; 1.5 Standard Deviation Trigger</text>
      <text x="1180" y="924" font-size="10" font-weight="600" fill="#9f1239">6.3: AI Executive Digest</text>
    </svg>
    """

def generate_html_document():
    svg_l0 = build_svg_level0()
    svg_l1 = build_svg_level1()
    svg_l2_bio = build_svg_level2_biometric()
    svg_l2_pay = build_svg_level2_payroll()

    html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Data Flow Architecture Specification (Level 0, Level 1 &amp; Level 2 DFDs)</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 12mm 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11pt;
      line-height: 1.45;
    }
    .page {
      page-break-after: always;
      position: relative;
      width: 100%;
      min-height: 185mm;
      padding-bottom: 2mm;
    }
    .page:last-child {
      page-break-after: avoid;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }
    .header-bar .title {
      font-size: 13pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.2px;
    }
    .header-bar .meta {
      font-size: 8pt;
      color: #64748b;
      font-weight: 600;
      text-align: right;
    }
    .diagram-container {
      width: 100%;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #ffffff;
      padding: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      margin-bottom: 6px;
    }
    .diagram-container svg {
      display: block;
      width: 100%;
      height: auto;
      max-height: 160mm;
    }
    .footer-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5pt;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 3px;
      margin-top: 2px;
    }
    h1 {
      font-size: 16pt;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 4px 0;
    }
    h2 {
      font-size: 11pt;
      font-weight: 700;
      color: #1e293b;
      margin: 8px 0 4px 0;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 2px;
    }
    h3 {
      font-size: 9.5pt;
      font-weight: 700;
      color: #334155;
      margin: 6px 0 2px 0;
    }
    p {
      margin: 0 0 4px 0;
      font-size: 8.5pt;
      color: #334155;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 4px 0 8px 0;
      font-size: 7.8pt;
    }
    th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      text-align: left;
      padding: 4px 6px;
      border: 1px solid #334155;
    }
    td {
      padding: 3.5px 6px;
      border: 1px solid #cbd5e1;
      color: #1e293b;
    }
    tr:nth-child(even) td {{
      background: #f8fafc;
    }}
    .badge {
      display: inline-block;
      padding: 1.5px 4px;
      font-size: 7pt;
      font-weight: 700;
      border-radius: 3px;
      text-transform: uppercase;
    }
    .badge-proc { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    .badge-store { background: #dcfce7; color: #065f46; border: 1px solid #bbf7d0; }
    .badge-entity { background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; }
    .badge-fraud { background: #ffe4e6; color: #9f1239; border: 1px solid #fecdd3; }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      padding: 6px 10px;
    }
  </style>
</head>
<body>

  <!-- ================= PAGE 1: LEVEL 0 DFD CONTEXT DIAGRAM ================= -->
  <div class="page">
    <div class="header-bar">
      <div>
        <div class="title">LEVEL 0 DATA FLOW DIAGRAM: SYSTEM CONTEXT DIAGRAM</div>
        <div style="font-size: 8pt; color: #0284c7; font-weight: 700;">AI-Powered Industrial Workforce &amp; Payroll Platform v2.0</div>
      </div>
      <div class="meta">
        <div>Notation: Gane &amp; Sarson / Yourdon-DeMarco Standard</div>
        <div>Scope: Overall System Environmental Boundary (Process 0.0)</div>
      </div>
    </div>

    <div class="diagram-container">
      """ + svg_l0 + """
    </div>

    <div class="footer-bar">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Document Ref: DFD-LVL0-CTX-V2.0 | Context Level Boundary</span>
      <span>Page 1 of 5</span>
    </div>
  </div>

  <!-- ================= PAGE 2: LEVEL 1 DFD DIAGRAM ================= -->
  <div class="page">
    <div class="header-bar">
      <div>
        <div class="title">LEVEL 1 DATA FLOW DIAGRAM: OVERALL SYSTEM ARCHITECTURE</div>
        <div style="font-size: 8pt; color: #3b82f6; font-weight: 700;">Decomposition of System 0.0 into 8 Interconnected Subsystems</div>
      </div>
      <div class="meta">
        <div>Notation: Gane &amp; Sarson / Yourdon-DeMarco Standard</div>
        <div>Scope: Subsystems 1.0 – 8.0 with 9 Normalized Data Stores</div>
      </div>
    </div>

    <div class="diagram-container">
      """ + svg_l1 + """
    </div>

    <div class="footer-bar">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Document Ref: DFD-LVL1-V2.0 | Complete Subsystem Decomposition</span>
      <span>Page 2 of 5</span>
    </div>
  </div>

  <!-- ================= PAGE 3: LEVEL 2 DFD DIAGRAM (BIOMETRIC ATTENDANCE) ================= -->
  <div class="page">
    <div class="header-bar">
      <div>
        <div class="title">LEVEL 2 DATA FLOW DIAGRAM: SUBSYSTEM 2.0 (BIOMETRIC ATTENDANCE)</div>
        <div style="font-size: 8pt; color: #059669; font-weight: 700;">Decomposition of Process 2.0: Face Recognition, Anti-Spoof Liveness, Offline Sync &amp; Geofence Validation</div>
      </div>
      <div class="meta">
        <div>Matching Engine: PostgreSQL pgvector Euclidean Distance (&lt;-&gt;)</div>
        <div>Scope: Subprocesses 2.1 through 2.5</div>
      </div>
    </div>

    <div class="diagram-container">
      """ + svg_l2_bio + """
    </div>

    <div class="footer-bar">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Document Ref: DFD-LVL2-BIO-V2.0 | Biometric Ingestion Layer</span>
      <span>Page 3 of 5</span>
    </div>
  </div>

  <!-- ================= PAGE 4: LEVEL 2 DFD DIAGRAM (PAYROLL & FORENSICS) ================= -->
  <div class="page">
    <div class="header-bar">
      <div>
        <div class="title">LEVEL 2 DATA FLOW DIAGRAM: SUBSYSTEM 4.0 &amp; 6.0 (PAYROLL &amp; FRAUD FORENSICS)</div>
        <div style="font-size: 8pt; color: #1e40af; font-weight: 700;">Decomposition of Process 4.0 &amp; 6.0: Log Pairing, 1.5x Overtime Multiplier, Statistical Z-Scores &amp; AI Digest</div>
      </div>
      <div class="meta">
        <div>Forensic Engine: Z-Score Outlier Analysis &amp; Groq/Gemini AI Triage</div>
        <div>Scope: Subprocesses 4.1 – 4.3 &amp; 6.1 – 6.3</div>
      </div>
    </div>

    <div class="diagram-container">
      """ + svg_l2_pay + """
    </div>

    <div class="footer-bar">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Document Ref: DFD-LVL2-PAY-V2.0 | Financial &amp; Anomaly Engine</span>
      <span>Page 4 of 5</span>
    </div>
  </div>

  <!-- ================= PAGE 5: FORMAL SPECIFICATIONS & DATA DICTIONARY ================= -->
  <div class="page">
    <div class="header-bar">
      <div>
        <div class="title">DFD DATA DICTIONARY, ENTITY SPECIFICATIONS &amp; PROCESS LOGIC</div>
        <div style="font-size: 8pt; color: #0f172a; font-weight: 700;">Complete Cross-Reference of Processes, Data Stores, Data Flows &amp; Algorithms</div>
      </div>
      <div class="meta">
        <div>Standard: IEEE Std 830 / ISO 5807 Software System Description</div>
        <div>Implementation: Next.js 16 + Neon PostgreSQL + Groq / Gemini</div>
      </div>
    </div>

    <div class="grid-2">
      <!-- Left Column: Data Stores & Entities -->
      <div>
        <h2>1. Normalized Data Stores (Database Schemas)</h2>
        <table>
          <thead>
            <tr>
              <th style="width: 12%;">Store</th>
              <th style="width: 38%;">Table Name</th>
              <th style="width: 50%;">Key Attributes &amp; Datatypes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="badge badge-store">D1</span></td>
              <td><strong>companies, employees, depts</strong></td>
              <td><code>id, name, email, role, password, company_id, dept_id</code></td>
            </tr>
            <tr>
              <td><span class="badge badge-store">D2</span></td>
              <td><strong>face_embeddings</strong></td>
              <td><code>id, employee_id, embedding vector(128), is_active</code></td>
            </tr>
            <tr>
              <td><span class="badge badge-store">D3</span></td>
              <td><strong>biometric_logs, attempts</strong></td>
              <td><code>id, employee_id, timestamp, log_type, gps_lat, gps_lng</code></td>
            </tr>
            <tr>
              <td><span class="badge badge-store">D4</span></td>
              <td><strong>shifts, shift_swaps, access</strong></td>
              <td><code>id, employee_id, date, start_time, end_time, status</code></td>
            </tr>
            <tr>
              <td><span class="badge badge-store">D5</span></td>
              <td><strong>payroll_ledgers</strong></td>
              <td><code>id, employee_id, period_start, regular_hours, ot_hours, net_pay</code></td>
            </tr>
            <tr>
              <td><span class="badge badge-store">D6</span></td>
              <td><strong>staffing_forecasts</strong></td>
              <td><code>id, department_id, shift_date, predicted_headcount, ai_briefing</code></td>
            </tr>
            <tr>
              <td><span class="badge badge-store">D7</span></td>
              <td><strong>fraud_flags</strong></td>
              <td><code>id, employee_id, flag_type, status, details, ai_digest_text</code></td>
            </tr>
            <tr>
              <td><span class="badge badge-store">D8</span></td>
              <td><strong>chatbot_kb, conversations</strong></td>
              <td><code>id, chunk_text, source_doc, user_id, message, role</code></td>
            </tr>
            <tr>
              <td><span class="badge badge-store">D9</span></td>
              <td><strong>leave_requests</strong></td>
              <td><code>id, employee_id, leave_type, start_date, end_date, status</code></td>
            </tr>
          </tbody>
        </table>

        <h2>2. External Entities (Sources / Sinks)</h2>
        <table>
          <thead>
            <tr>
              <th style="width: 12%;">Entity</th>
              <th style="width: 38%;">Name</th>
              <th style="width: 50%;">Data Input / Output Roles</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="badge badge-entity">E1</span></td>
              <td><strong>Floor Worker</strong></td>
              <td>Submits face scan, GPS coordinates, swap requests, leave forms; queries RAG bot; receives payslips.</td>
            </tr>
            <tr>
              <td><span class="badge badge-entity">E2</span></td>
              <td><strong>Floor Manager</strong></td>
              <td>Assigns shifts; authorizes swap proposals; reviews departmental staffing forecasts; approves leaves.</td>
            </tr>
            <tr>
              <td><span class="badge badge-entity">E3</span></td>
              <td><strong>HR Administrator</strong></td>
              <td>Onboards staff; enrolls face templates; executes payroll periods; reviews &amp; resolves fraud flags.</td>
            </tr>
            <tr>
              <td><span class="badge badge-entity">E4</span></td>
              <td><strong>Gate Kiosk Terminal</strong></td>
              <td>Webcam capture device; executes liveness challenges; buffers punches in IndexedDB during outages.</td>
            </tr>
            <tr>
              <td><span class="badge badge-entity">E5</span></td>
              <td><strong>Groq / Gemini AI</strong></td>
              <td>Inference API; generates natural language manager briefings, fraud digests, and conversational RAG answers.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Right Column: Process Specs & Math Formulas -->
      <div>
        <h2>3. Mathematical Transformation Algorithms</h2>
        
        <div class="card" style="margin-bottom: 6px;">
          <h3 style="color: #059669;">Subprocess 2.3: pgvector Vector Distance Matching</h3>
          <p>Calculates Euclidean (L2) distance between captured vector u and stored template v:</p>
          <code style="font-size: 7.8pt; background: #e2e8f0; padding: 2px 4px; border-radius: 3px; display: block; margin: 2px 0;">
            d(u, v) = sqrt( sum( (u_i - v_i)^2 ) ) &lt;= 0.05 ==&gt; MATCH_SUCCESS
          </code>
        </div>

        <div class="card" style="margin-bottom: 6px;">
          <h3 style="color: #059669;">Subprocess 2.4: Haversine Geofence Calculation</h3>
          <p>Calculates distance d between device (lat1, lng1) and factory perimeter (lat2, lng2):</p>
          <code style="font-size: 7.8pt; background: #e2e8f0; padding: 2px 4px; border-radius: 3px; display: block; margin: 2px 0;">
            a = sin^2(dLat/2) + cos(lat1)*cos(lat2)*sin^2(dLon/2); d = 2*R*atan2(sqrt(a), sqrt(1-a))
          </code>
          <p style="font-size: 7.5pt; margin: 2px 0 0 0; color: #b91c1c;">If d &gt; 100m, trigger <code>geofence</code> anomaly in <strong>D7</strong>.</p>
        </div>

        <div class="card" style="margin-bottom: 6px;">
          <h3 style="color: #1e40af;">Subprocess 4.2 &amp; 4.3: Deterministic Payroll Math</h3>
          <p>Given paired duration H, hourly wage W_role (HR: $30/hr, MGR: $25/hr, WKR: $15/hr):</p>
          <code style="font-size: 7.8pt; background: #e2e8f0; padding: 2px 4px; border-radius: 3px; display: block; margin: 2px 0;">
            H_reg = min(H, 8.0); H_ot = max(0, H - 8.0)<br>
            Gross = (H_reg * W) + (H_ot * W * 1.5); Net = Gross * 0.90 (10% Tax Deduction)
          </code>
        </div>

        <div class="card">
          <h3 style="color: #9f1239;">Subprocess 6.1: Statistical Z-Score Outlier Scanner</h3>
          <p>Computes population standard deviation of overtime hours across all active employees:</p>
          <code style="font-size: 7.8pt; background: #e2e8f0; padding: 2px 4px; border-radius: 3px; display: block; margin: 2px 0;">
            Z = (x - mean) / stddev; Flag if Z &gt; 1.5 and x &gt; 2.0 hours
          </code>
        </div>
      </div>
    </div>

    <div class="footer-bar" style="margin-top: 6px;">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Formal Specification Approved for Engineering &amp; Regulatory Compliance</span>
      <span>Page 5 of 5</span>
    </div>
  </div>

</body>
</html>
"""
    return html

def main():
    # Execute generate_master_specification to produce the comprehensive 11-page specification with UML diagrams
    try:
        import generate_master_specification
        generate_master_specification.main()
    except Exception as e:
        print(f"Master specification execution: {e}")

if __name__ == "__main__":
    main()

