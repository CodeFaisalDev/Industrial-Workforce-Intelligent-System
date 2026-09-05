import os
import subprocess
import sys
import shutil

# Import original DFD functions from dfd_generator if available
from dfd_generator import (
    build_svg_level0,
    build_svg_level1,
    build_svg_level2_biometric,
    build_svg_level2_payroll
)

def build_svg_usecase():
    return """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 950" width="100%" height="100%" style="background:#ffffff; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
      <defs>
        <marker id="uc-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
        </marker>
        <marker id="uc-arr-dashed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
        </marker>
        <filter id="uc-shadow" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.08" />
        </filter>
        <linearGradient id="uc-grad-sys" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#f8fafc" />
        </linearGradient>
      </defs>

      <!-- Background Grid -->
      <pattern id="uc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
      <rect width="1400" height="950" fill="url(#uc-grid)" />

      <!-- TITLE -->
      <text x="700" y="36" text-anchor="middle" font-size="22" font-weight="800" fill="#0f172a" letter-spacing="0.5">
        UML USE CASE SPECIFICATION: SYSTEM ACTORS &amp; BOUNDARIES
      </text>
      <text x="700" y="58" text-anchor="middle" font-size="12.5" fill="#64748b" font-weight="500">
        Formal Interaction Model: Human Actors, Hardware Gateways, AI Daemons &amp; Functional Service Boundaries
      </text>

      <!-- ================= SYSTEM BOUNDARY ================= -->
      <rect x="290" y="80" width="820" height="840" rx="16" fill="url(#uc-grad-sys)" stroke="#0f172a" stroke-width="2.5" filter="url(#uc-shadow)" />
      <rect x="290" y="80" width="820" height="34" rx="16" fill="#1e293b" />
      <text x="700" y="102" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="800" letter-spacing="1">
        SYSTEM BOUNDARY: INDUSTRIAL WORKFORCE INTELLIGENCE &amp; PAYROLL PLATFORM
      </text>

      <!-- SUB-PACKAGES (CONTAINERS) -->
      <!-- Package 1: Auth & Multi-Tenancy -->
      <rect x="310" y="125" width="380" height="115" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="4 2"/>
      <text x="325" y="142" font-size="10" font-weight="700" fill="#64748b">PACKAGE: AUTHENTICATION &amp; MULTI-TENANCY</text>

      <!-- Package 2: Biometrics & Edge Kiosk -->
      <rect x="310" y="250" width="380" height="235" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="4 2"/>
      <text x="325" y="267" font-size="10" font-weight="700" fill="#059669">PACKAGE: BIOMETRIC ATTENDANCE &amp; EDGE KIOSK</text>

      <!-- Package 3: Scheduling & Swaps -->
      <rect x="310" y="495" width="380" height="225" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="4 2"/>
      <text x="325" y="512" font-size="10" font-weight="700" fill="#2563eb">PACKAGE: ROSTER SCHEDULING &amp; PEER SWAPS</text>

      <!-- Package 4: Payroll & Compliance -->
      <rect x="710" y="125" width="380" height="240" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="4 2"/>
      <text x="725" y="142" font-size="10" font-weight="700" fill="#7c3aed">PACKAGE: DETERMINISTIC PAYROLL &amp; TAX ENGINE</text>

      <!-- Package 5: Fraud & Anomaly Audit -->
      <rect x="710" y="375" width="380" height="235" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="4 2"/>
      <text x="725" y="392" font-size="10" font-weight="700" fill="#e11d48">PACKAGE: FORENSIC AUDITING &amp; ANOMALY VAULT</text>

      <!-- Package 6: AI Staffing & RAG -->
      <rect x="710" y="620" width="380" height="190" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="4 2"/>
      <text x="725" y="637" font-size="10" font-weight="700" fill="#d97706">PACKAGE: PREDICTIVE STAFFING &amp; RAG ASSISTANT</text>

      <!-- Leave & Absences Package (Bottom-Left) -->
      <rect x="310" y="730" width="380" height="175" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="4 2"/>
      <text x="325" y="747" font-size="10" font-weight="700" fill="#0284c7">PACKAGE: LEAVE &amp; ABSENCE MANAGEMENT</text>

      <!-- ================= USE CASE OVALS ================= -->
      <!-- UC1: Sign In & Authenticate -->
      <g id="uc1">
        <ellipse cx="500" cy="180" rx="145" ry="24" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8"/>
        <text x="500" y="184" text-anchor="middle" font-size="11.5" font-weight="600" fill="#14532d">UC-01: Authenticate via NextAuth</text>
      </g>

      <!-- UC2: Face Biometric Clock-in -->
      <g id="uc2">
        <ellipse cx="500" cy="305" rx="145" ry="24" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>
        <text x="500" y="309" text-anchor="middle" font-size="11.5" font-weight="600" fill="#1e3a8a">UC-02: Scan Face &amp; Register Punch</text>
      </g>

      <!-- UC3: Geofence Validation (Included by UC2) -->
      <g id="uc3">
        <ellipse cx="500" cy="370" rx="135" ry="21" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3 2"/>
        <text x="500" y="374" text-anchor="middle" font-size="10.5" font-weight="600" fill="#334155">UC-03: Validate Haversine Geofence</text>
      </g>

      <!-- UC4: Offline Caching (Extended by UC2) -->
      <g id="uc4">
        <ellipse cx="500" cy="435" rx="135" ry="21" fill="#fefce8" stroke="#ca8a04" stroke-width="1.5" stroke-dasharray="3 2"/>
        <text x="500" y="439" text-anchor="middle" font-size="10.5" font-weight="600" fill="#854d0e">UC-04: Cache Offline (IndexedDB)</text>
      </g>

      <!-- UC5: View Schedule -->
      <g id="uc5">
        <ellipse cx="500" cy="550" rx="145" ry="22" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.8"/>
        <text x="500" y="554" text-anchor="middle" font-size="11" font-weight="600" fill="#1e3a8a">UC-05: View Weekly Roster Schedule</text>
      </g>

      <!-- UC6: Propose Shift Swap -->
      <g id="uc6">
        <ellipse cx="500" cy="610" rx="145" ry="22" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.8"/>
        <text x="500" y="614" text-anchor="middle" font-size="11" font-weight="600" fill="#1e3a8a">UC-06: Propose Peer Shift Swap</text>
      </g>

      <!-- UC7: Authorize Shift Swap -->
      <g id="uc7">
        <ellipse cx="500" cy="670" rx="145" ry="22" fill="#fdf4ff" stroke="#a855f7" stroke-width="1.8"/>
        <text x="500" y="674" text-anchor="middle" font-size="11" font-weight="600" fill="#581c87">UC-07: Authorize / Reject Swap Proposal</text>
      </g>

      <!-- UC8: Request Leave -->
      <g id="uc8">
        <ellipse cx="500" cy="780" rx="145" ry="22" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.8"/>
        <text x="500" y="784" text-anchor="middle" font-size="11" font-weight="600" fill="#0c4a6e">UC-08: Submit Formal Leave Request</text>
      </g>

      <!-- UC9: Approve Leave -->
      <g id="uc9">
        <ellipse cx="500" cy="840" rx="145" ry="22" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.8"/>
        <text x="500" y="844" text-anchor="middle" font-size="11" font-weight="600" fill="#0c4a6e">UC-09: Approve Department Absences</text>
      </g>

      <!-- UC10: Trigger Monthly Payroll -->
      <g id="uc10">
        <ellipse cx="900" cy="180" rx="150" ry="24" fill="#faf5ff" stroke="#7c3aed" stroke-width="1.8"/>
        <text x="900" y="184" text-anchor="middle" font-size="11.5" font-weight="600" fill="#4c1d95">UC-10: Execute Monthly Payroll Cycle</text>
      </g>

      <!-- UC11: Deterministic 1.5x OT Math -->
      <g id="uc11">
        <ellipse cx="900" cy="245" rx="140" ry="21" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3 2"/>
        <text x="900" y="249" text-anchor="middle" font-size="10.5" font-weight="600" fill="#334155">UC-11: Compute 1.5x OT &amp; 10% Tax</text>
      </g>

      <!-- UC12: View / Print Payslip -->
      <g id="uc12">
        <ellipse cx="900" cy="310" rx="145" ry="22" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.8"/>
        <text x="900" y="314" text-anchor="middle" font-size="11" font-weight="600" fill="#1e3a8a">UC-12: View &amp; Print Itemized Payslip</text>
      </g>

      <!-- UC13: Scan Z-Score Outliers -->
      <g id="uc13">
        <ellipse cx="900" cy="430" rx="145" ry="22" fill="#fff1f2" stroke="#e11d48" stroke-width="1.8"/>
        <text x="900" y="434" text-anchor="middle" font-size="11" font-weight="600" fill="#881337">UC-13: Scan Z-Score Overtime Outliers</text>
      </g>

      <!-- UC14: Review & Resolve Fraud Flags -->
      <g id="uc14">
        <ellipse cx="900" cy="495" rx="145" ry="22" fill="#fff1f2" stroke="#e11d48" stroke-width="1.8"/>
        <text x="900" y="499" text-anchor="middle" font-size="11" font-weight="600" fill="#881337">UC-14: Audit &amp; Resolve Security Flags</text>
      </g>

      <!-- UC15: Detect Perimeter Breach -->
      <g id="uc15">
        <ellipse cx="900" cy="555" rx="140" ry="20" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3 2"/>
        <text x="900" y="559" text-anchor="middle" font-size="10.5" font-weight="600" fill="#334155">UC-15: Flag GPS Perimeter Breach</text>
      </g>

      <!-- UC16: 7-Day Staffing Forecast -->
      <g id="uc16">
        <ellipse cx="900" cy="675" rx="145" ry="22" fill="#fffbeb" stroke="#d97706" stroke-width="1.8"/>
        <text x="900" y="679" text-anchor="middle" font-size="11" font-weight="600" fill="#78350f">UC-16: Forecast Staffing via 7-Day MA</text>
      </g>

      <!-- UC17: RAG Policy Assistant -->
      <g id="uc17">
        <ellipse cx="900" cy="740" rx="145" ry="22" fill="#fffbeb" stroke="#d97706" stroke-width="1.8"/>
        <text x="900" y="744" text-anchor="middle" font-size="11" font-weight="600" fill="#78350f">UC-17: Consult RAG Operations Bot</text>
      </g>

      <!-- ================= ACTORS (LEFT SIDE) ================= -->
      <!-- ACTOR 1: WORKER -->
      <g id="actor-worker" filter="url(#uc-shadow)">
        <rect x="40" y="240" width="190" height="155" rx="12" fill="#f8fafc" stroke="#3b82f6" stroke-width="2"/>
        <circle cx="135" cy="275" r="16" fill="#3b82f6" />
        <path d="M 135 291 L 135 325 M 115 305 L 155 305 M 135 325 L 115 355 M 135 325 L 155 355" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
        <text x="135" y="375" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a">Floor Worker</text>
        <text x="135" y="390" text-anchor="middle" font-size="10" fill="#64748b">Self-Service Profile (Faria)</text>
      </g>

      <!-- ACTOR 2: FLOOR MANAGER -->
      <g id="actor-manager" filter="url(#uc-shadow)">
        <rect x="40" y="580" width="190" height="155" rx="12" fill="#f8fafc" stroke="#7c3aed" stroke-width="2"/>
        <circle cx="135" cy="615" r="16" fill="#7c3aed" />
        <path d="M 135 631 L 135 665 M 115 645 L 155 645 M 135 665 L 115 695 M 135 665 L 155 695" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
        <text x="135" y="715" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a">Floor Manager</text>
        <text x="135" y="730" text-anchor="middle" font-size="10" fill="#64748b">Roster Authority (Nazmul)</text>
      </g>

      <!-- ================= ACTORS (RIGHT SIDE) ================= -->
      <!-- ACTOR 3: HR ADMIN -->
      <g id="actor-admin" filter="url(#uc-shadow)">
        <rect x="1170" y="140" width="190" height="155" rx="12" fill="#f8fafc" stroke="#059669" stroke-width="2"/>
        <circle cx="1265" cy="175" r="16" fill="#059669" />
        <path d="M 1265 191 L 1265 225 M 1245 205 L 1285 205 M 1265 225 L 1245 255 M 1265 225 L 1285 255" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
        <text x="1265" y="275" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a">HR Administrator</text>
        <text x="1265" y="290" text-anchor="middle" font-size="10" fill="#64748b">Executive Control (Prithula)</text>
      </g>

      <!-- ACTOR 4: GATE KIOSK (DEVICE) -->
      <g id="actor-kiosk" filter="url(#uc-shadow)">
        <rect x="1170" y="380" width="190" height="135" rx="12" fill="#1e293b" stroke="#0284c7" stroke-width="2"/>
        <rect x="1215" y="405" width="100" height="60" rx="6" fill="#38bdf8" />
        <circle cx="1265" cy="435" r="12" fill="#0f172a" />
        <text x="1265" y="485" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">&lt;&lt;Device&gt;&gt;</text>
        <text x="1265" y="502" text-anchor="middle" font-size="11" font-weight="700" fill="#38bdf8">Gate Kiosk Terminal</text>
      </g>

      <!-- ACTOR 5: AI DAEMON -->
      <g id="actor-daemon" filter="url(#uc-shadow)">
        <rect x="1170" y="600" width="190" height="135" rx="12" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="1265" cy="635" r="18" fill="#f59e0b" />
        <text x="1265" y="640" text-anchor="middle" font-size="14" font-weight="900" fill="#0f172a">AI</text>
        <text x="1265" y="685" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">&lt;&lt;Service Daemon&gt;&gt;</text>
        <text x="1265" y="702" text-anchor="middle" font-size="11" font-weight="700" fill="#fbbf24">Analytics &amp; RAG Engine</text>
      </g>

      <!-- ================= ACTOR LINKAGES ================= -->
      <!-- Worker Links -->
      <line x1="230" y1="280" x2="355" y2="180" stroke="#3b82f6" stroke-width="1.8"/>
      <line x1="230" y1="300" x2="355" y2="305" stroke="#3b82f6" stroke-width="1.8"/>
      <line x1="230" y1="320" x2="355" y2="550" stroke="#3b82f6" stroke-width="1.8"/>
      <line x1="230" y1="340" x2="355" y2="610" stroke="#3b82f6" stroke-width="1.8"/>
      <line x1="230" y1="355" x2="355" y2="780" stroke="#3b82f6" stroke-width="1.8"/>
      <line x1="230" y1="370" x2="755" y2="310" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 2"/>
      <line x1="230" y1="385" x2="755" y2="740" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 2"/>

      <!-- Floor Manager Links -->
      <line x1="230" y1="620" x2="355" y2="180" stroke="#7c3aed" stroke-width="1.8"/>
      <line x1="230" y1="640" x2="355" y2="550" stroke="#7c3aed" stroke-width="1.8"/>
      <line x1="230" y1="660" x2="355" y2="670" stroke="#7c3aed" stroke-width="1.8"/>
      <line x1="230" y1="680" x2="355" y2="840" stroke="#7c3aed" stroke-width="1.8"/>
      <line x1="230" y1="700" x2="755" y2="675" stroke="#7c3aed" stroke-width="1.5"/>
      <line x1="230" y1="715" x2="755" y2="740" stroke="#7c3aed" stroke-width="1.5"/>

      <!-- HR Admin Links -->
      <line x1="1170" y1="180" x2="645" y2="180" stroke="#059669" stroke-width="1.8"/>
      <line x1="1170" y1="200" x2="1050" y2="180" stroke="#059669" stroke-width="1.8"/>
      <line x1="1170" y1="220" x2="1045" y2="495" stroke="#059669" stroke-width="1.8"/>
      <line x1="1170" y1="240" x2="1045" y2="675" stroke="#059669" stroke-width="1.8"/>
      <line x1="1170" y1="260" x2="645" y2="840" stroke="#059669" stroke-width="1.8"/>

      <!-- Gate Kiosk Links -->
      <line x1="1170" y1="430" x2="645" y2="305" stroke="#0284c7" stroke-width="1.8"/>
      <line x1="1170" y1="445" x2="635" y2="435" stroke="#0284c7" stroke-width="1.8"/>

      <!-- AI Daemon Links -->
      <line x1="1170" y1="640" x2="1045" y2="430" stroke="#d97706" stroke-width="1.8"/>
      <line x1="1170" y1="660" x2="1045" y2="675" stroke="#d97706" stroke-width="1.8"/>
      <line x1="1170" y1="680" x2="1045" y2="740" stroke="#d97706" stroke-width="1.8"/>

      <!-- ================= <<include>> & <<extend>> RELATIONSHIPS ================= -->
      <!-- UC2 -> UC3 <<include>> -->
      <path d="M 500 329 L 500 349" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#uc-arr-dashed)"/>
      <rect x="505" y="331" width="60" height="15" fill="#ffffff" rx="3"/>
      <text x="535" y="342" text-anchor="middle" font-size="8" font-weight="700" fill="#64748b">&lt;&lt;include&gt;&gt;</text>

      <!-- UC4 -> UC2 <<extend>> -->
      <path d="M 500 414 L 500 391" stroke="#ca8a04" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#uc-arr-dashed)"/>
      <rect x="505" y="396" width="56" height="15" fill="#ffffff" rx="3"/>
      <text x="533" y="407" text-anchor="middle" font-size="8" font-weight="700" fill="#ca8a04">&lt;&lt;extend&gt;&gt;</text>

      <!-- UC10 -> UC11 <<include>> -->
      <path d="M 900 204 L 900 224" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#uc-arr-dashed)"/>
      <rect x="905" y="206" width="60" height="15" fill="#ffffff" rx="3"/>
      <text x="935" y="217" text-anchor="middle" font-size="8" font-weight="700" fill="#7c3aed">&lt;&lt;include&gt;&gt;</text>

      <!-- UC15 -> UC14 <<extend>> -->
      <path d="M 900 535 L 900 517" stroke="#e11d48" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#uc-arr-dashed)"/>
      <rect x="905" y="520" width="56" height="15" fill="#ffffff" rx="3"/>
      <text x="933" y="531" text-anchor="middle" font-size="8" font-weight="700" fill="#e11d48">&lt;&lt;extend&gt;&gt;</text>

      <!-- UC13 -> UC14 <<extend>> -->
      <path d="M 900 452 L 900 473" stroke="#e11d48" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#uc-arr-dashed)"/>
      <rect x="905" y="456" width="56" height="15" fill="#ffffff" rx="3"/>
      <text x="933" y="467" text-anchor="middle" font-size="8" font-weight="700" fill="#e11d48">&lt;&lt;extend&gt;&gt;</text>
    </svg>
    """

def build_svg_class_diagram():
    return """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 950" width="100%" height="100%" style="background:#ffffff; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
      <defs>
        <marker id="cls-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
        </marker>
        <marker id="comp-diamond" viewBox="0 0 12 12" refX="0" refY="6" markerWidth="9" markerHeight="9" orient="auto">
          <path d="M 0 6 L 6 0 L 12 6 L 6 12 z" fill="#0f172a" stroke="#0f172a" />
        </marker>
        <filter id="cls-shadow" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.08" />
        </filter>
      </defs>

      <!-- Background Grid -->
      <pattern id="cls-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
      <rect width="1400" height="950" fill="url(#cls-grid)" />

      <!-- TITLE -->
      <text x="700" y="34" text-anchor="middle" font-size="21" font-weight="800" fill="#0f172a" letter-spacing="0.5">
        UML CLASS SPECIFICATION: DOMAIN ENTITIES &amp; RELATIONAL ARCHITECTURE
      </text>
      <text x="700" y="54" text-anchor="middle" font-size="12" fill="#64748b" font-weight="500">
        Multi-Tenant Relational Schema, Object Multiplicities (1..*), Biometric Vector Types &amp; Service Interfaces
      </text>

      <!-- ================= ROW 1: TIER 1 - ORGANIZATION & CORE IDENTITY ================= -->
      <!-- 1. Company Class (Top-Left) -->
      <g id="cls-company" filter="url(#cls-shadow)">
        <rect x="40" y="80" width="220" height="135" rx="6" fill="#ffffff" stroke="#1e293b" stroke-width="1.8"/>
        <rect x="40" y="80" width="220" height="28" rx="6" fill="#1e293b"/>
        <text x="150" y="99" text-anchor="middle" font-size="12" font-weight="800" fill="#38bdf8">Company</text>
        <text x="50" y="124" font-size="10" fill="#0f172a">+ id : Integer [PK]</text>
        <text x="50" y="140" font-size="10" fill="#0f172a">+ name : String (unique)</text>
        <text x="50" y="156" font-size="10" fill="#0f172a">+ created_at : Timestamp</text>
        <line x1="40" y1="166" x2="260" y2="166" stroke="#e2e8f0" stroke-width="1"/>
        <text x="50" y="184" font-size="9.5" fill="#475569">+ getDepartments() : List</text>
        <text x="50" y="200" font-size="9.5" fill="#475569">+ getActiveHeadcount() : int</text>
      </g>

      <!-- 2. Department Class -->
      <g id="cls-department" filter="url(#cls-shadow)">
        <rect x="320" y="80" width="230" height="150" rx="6" fill="#ffffff" stroke="#1e293b" stroke-width="1.8"/>
        <rect x="320" y="80" width="230" height="28" rx="6" fill="#1e293b"/>
        <text x="435" y="99" text-anchor="middle" font-size="12" font-weight="800" fill="#38bdf8">Department</text>
        <text x="330" y="124" font-size="10" fill="#0f172a">+ id : Integer [PK]</text>
        <text x="330" y="140" font-size="10" fill="#0f172a">+ name : String</text>
        <text x="330" y="156" font-size="10" fill="#0f172a">+ manager_id : Integer [FK]</text>
        <text x="330" y="172" font-size="10" fill="#0f172a">+ company_id : Integer [FK]</text>
        <line x1="320" y1="182" x2="550" y2="182" stroke="#e2e8f0" stroke-width="1"/>
        <text x="330" y="200" font-size="9.5" fill="#475569">+ getAssignedWorkers() : List</text>
        <text x="330" y="216" font-size="9.5" fill="#475569">+ getStaffingForecast() : Forecast</text>
      </g>

      <!-- 3. Employee Class (Central Identity) -->
      <g id="cls-employee" filter="url(#cls-shadow)">
        <rect x="610" y="80" width="260" height="215" rx="6" fill="#ffffff" stroke="#2563eb" stroke-width="2.2"/>
        <rect x="610" y="80" width="260" height="30" rx="6" fill="#1e40af"/>
        <text x="740" y="100" text-anchor="middle" font-size="13" font-weight="800" fill="#ffffff">Employee</text>
        <text x="622" y="126" font-size="10" fill="#0f172a">+ id : Integer [PK]</text>
        <text x="622" y="142" font-size="10" fill="#0f172a">+ name : String</text>
        <text x="622" y="158" font-size="10" fill="#0f172a">+ email : String (unique)</text>
        <text x="622" y="174" font-size="10" fill="#0f172a">- password : String (bcrypt)</text>
        <text x="622" y="190" font-size="10" fill="#0f172a">+ role : RoleEnum [HR|MGR|WKR]</text>
        <text x="622" y="206" font-size="10" fill="#0f172a">+ department_id : Integer [FK]</text>
        <text x="622" y="222" font-size="10" fill="#0f172a">+ status : StatusEnum [Active|Inactive]</text>
        <line x1="610" y1="232" x2="870" y2="232" stroke="#e2e8f0" stroke-width="1"/>
        <text x="622" y="250" font-size="9.5" fill="#1e40af">+ verifyPassword(plain : String) : bool</text>
        <text x="622" y="266" font-size="9.5" fill="#1e40af">+ getBiometricLogs() : List&lt;Log&gt;</text>
        <text x="622" y="282" font-size="9.5" fill="#1e40af">+ getPayrollLedgers() : List&lt;Ledger&gt;</text>
      </g>

      <!-- 4. FaceEmbedding Class (pgvector) -->
      <g id="cls-embedding" filter="url(#cls-shadow)">
        <rect x="930" y="80" width="220" height="150" rx="6" fill="#ffffff" stroke="#059669" stroke-width="1.8"/>
        <rect x="930" y="80" width="220" height="28" rx="6" fill="#065f46"/>
        <text x="1040" y="99" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">FaceEmbedding (pgvector)</text>
        <text x="940" y="124" font-size="10" fill="#0f172a">+ id : Integer [PK]</text>
        <text x="940" y="140" font-size="10" fill="#0f172a">+ employee_id : Integer [FK]</text>
        <text x="940" y="156" font-size="10" fill="#059669" font-weight="700">+ embedding : vector(128)</text>
        <text x="940" y="172" font-size="10" fill="#0f172a">+ is_active : Boolean</text>
        <line x1="930" y1="182" x2="1150" y2="182" stroke="#e2e8f0" stroke-width="1"/>
        <text x="940" y="200" font-size="9.5" fill="#065f46">+ euclideanDist(q) : float</text>
        <text x="940" y="216" font-size="9.5" fill="#065f46">+ cosineSimilarity(q) : float</text>
      </g>

      <!-- 5. OfflinePunch Class (IndexedDB) -->
      <g id="cls-offline" filter="url(#cls-shadow)">
        <rect x="1180" y="80" width="190" height="150" rx="6" fill="#ffffff" stroke="#ca8a04" stroke-width="1.8"/>
        <rect x="1180" y="80" width="190" height="28" rx="6" fill="#854d0e"/>
        <text x="1275" y="99" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">&lt;&lt;Client Store&gt;&gt;</text>
        <text x="1190" y="124" font-size="10" fill="#0f172a">+ id : AutoIncrement</text>
        <text x="1190" y="140" font-size="10" fill="#0f172a">+ employee_id : int</text>
        <text x="1190" y="156" font-size="10" fill="#0f172a">+ log_type : String</text>
        <text x="1190" y="172" font-size="10" fill="#854d0e" font-weight="700">+ synced : int (0|1)</text>
        <line x1="1180" y1="182" x2="1370" y2="182" stroke="#e2e8f0" stroke-width="1"/>
        <text x="1190" y="200" font-size="9.5" fill="#854d0e">+ saveToIndexedDB()</text>
        <text x="1190" y="216" font-size="9.5" fill="#854d0e">+ syncBatchToServer()</text>
      </g>

      <!-- ================= ROW 2: TIER 2 - OPERATIONS & ATTENDANCE ================= -->
      <!-- 6. BiometricLog Class -->
      <g id="cls-biometric" filter="url(#cls-shadow)">
        <rect x="930" y="280" width="220" height="175" rx="6" fill="#ffffff" stroke="#059669" stroke-width="1.8"/>
        <rect x="930" y="280" width="220" height="28" rx="6" fill="#065f46"/>
        <text x="1040" y="299" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">BiometricLog</text>
        <text x="940" y="324" font-size="10" fill="#0f172a">+ id : Integer [PK]</text>
        <text x="940" y="340" font-size="10" fill="#0f172a">+ employee_id : Integer [FK]</text>
        <text x="940" y="356" font-size="10" fill="#0f172a">+ timestamp : Timestamp</text>
        <text x="940" y="372" font-size="10" fill="#0f172a">+ log_type : [Check_In|Out]</text>
        <text x="940" y="388" font-size="10" fill="#0f172a">+ device_id : String</text>
        <text x="940" y="404" font-size="10" fill="#0f172a">+ verified_by_face : Boolean</text>
        <line x1="930" y1="414" x2="1150" y2="414" stroke="#e2e8f0" stroke-width="1"/>
        <text x="940" y="432" font-size="9.5" fill="#065f46">+ validateHaversine() : bool</text>
        <text x="940" y="446" font-size="9.5" fill="#065f46">+ getPairedShift() : Shift</text>
      </g>

      <!-- 7. Shift Class -->
      <g id="cls-shift" filter="url(#cls-shadow)">
        <rect x="610" y="340" width="260" height="175" rx="6" fill="#ffffff" stroke="#2563eb" stroke-width="1.8"/>
        <rect x="610" y="340" width="260" height="28" rx="6" fill="#1e3a8a"/>
        <text x="740" y="359" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">Shift</text>
        <text x="622" y="384" font-size="10" fill="#0f172a">+ id : Integer [PK]</text>
        <text x="622" y="400" font-size="10" fill="#0f172a">+ employee_id : Integer [FK]</text>
        <text x="622" y="416" font-size="10" fill="#0f172a">+ date : Date</text>
        <text x="622" y="432" font-size="10" fill="#0f172a">+ start_time : Time</text>
        <text x="622" y="448" font-size="10" fill="#0f172a">+ end_time : Time</text>
        <text x="622" y="464" font-size="10" fill="#0f172a">+ status : [Scheduled|Completed|Absent]</text>
        <line x1="610" y1="474" x2="870" y2="474" stroke="#e2e8f0" stroke-width="1"/>
        <text x="622" y="492" font-size="9.5" fill="#1e3a8a">+ assignEmployee(empId)</text>
        <text x="622" y="506" font-size="9.5" fill="#1e3a8a">+ calculateDuration() : float</text>
      </g>

      <!-- 8. ShiftSwap Class -->
      <g id="cls-shiftswap" filter="url(#cls-shadow)">
        <rect x="320" y="340" width="230" height="175" rx="6" fill="#ffffff" stroke="#a855f7" stroke-width="1.8"/>
        <rect x="320" y="340" width="230" height="28" rx="6" fill="#581c87"/>
        <text x="435" y="359" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">ShiftSwap</text>
        <text x="330" y="384" font-size="10" fill="#0f172a">+ id : Integer [PK]</text>
        <text x="330" y="400" font-size="10" fill="#0f172a">+ employee_id : Integer [FK]</text>
        <text x="330" y="416" font-size="10" fill="#0f172a">+ employee_name : String</text>
        <text x="330" y="432" font-size="10" fill="#0f172a">+ date : String</text>
        <text x="330" y="448" font-size="10" fill="#0f172a">+ shift : String</text>
        <text x="330" y="464" font-size="10" fill="#581c87" font-weight="700">+ status : [Pending|Authorized|Rejected]</text>
        <line x1="320" y1="474" x2="550" y2="474" stroke="#e2e8f0" stroke-width="1"/>
        <text x="330" y="492" font-size="9.5" fill="#581c87">+ authorize(managerId)</text>
        <text x="330" y="506" font-size="9.5" fill="#581c87">+ reject(reason)</text>
      </g>

      <!-- 9. LeaveRequest Class -->
      <g id="cls-leave" filter="url(#cls-shadow)">
        <rect x="40" y="340" width="220" height="175" rx="6" fill="#ffffff" stroke="#0284c7" stroke-width="1.8"/>
        <rect x="40" y="340" width="220" height="28" rx="6" fill="#0369a1"/>
        <text x="150" y="359" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">LeaveRequest</text>
        <text x="50" y="384" font-size="10" fill="#0f172a">+ id : Integer [PK]</text>
        <text x="50" y="400" font-size="10" fill="#0f172a">+ employee_id : Integer [FK]</text>
        <text x="50" y="416" font-size="10" fill="#0f172a">+ leave_type : String</text>
        <text x="50" y="432" font-size="10" fill="#0f172a">+ start_date : Date</text>
        <text x="50" y="448" font-size="10" fill="#0f172a">+ end_date : Date</text>
        <text x="50" y="464" font-size="10" fill="#0369a1" font-weight="700">+ status : [Pending|Approved|Rejected]</text>
        <line x1="40" y1="474" x2="260" y2="474" stroke="#e2e8f0" stroke-width="1"/>
        <text x="50" y="492" font-size="9.5" fill="#0369a1">+ approve()</text>
        <text x="50" y="506" font-size="9.5" fill="#0369a1">+ reject()</text>
      </g>

      <!-- ================= ROW 3: TIER 3 - PAYROLL, FRAUD & INTELLIGENCE ================= -->
      <!-- 10. PayrollLedger Class -->
      <g id="cls-payroll" filter="url(#cls-shadow)">
        <rect x="610" y="560" width="260" height="215" rx="6" fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
        <rect x="610" y="560" width="260" height="30" rx="6" fill="#6d28d9"/>
        <text x="740" y="580" text-anchor="middle" font-size="13" font-weight="800" fill="#ffffff">PayrollLedger</text>
        <text x="622" y="606" font-size="10" fill="#0f172a">+ id : Integer [PK]</text>
        <text x="622" y="622" font-size="10" fill="#0f172a">+ employee_id : Integer [FK]</text>
        <text x="622" y="638" font-size="10" fill="#0f172a">+ period_start : Date; period_end: Date</text>
        <text x="622" y="654" font-size="10" fill="#0f172a">+ regular_hours : Double; overtime: Double</text>
        <text x="622" y="670" font-size="10" fill="#0f172a">+ gross_pay : Double; deductions: Double</text>
        <text x="622" y="686" font-size="10" fill="#7c3aed" font-weight="700">+ net_pay : Double</text>
        <text x="622" y="702" font-size="10" fill="#0f172a">+ status : [Draft|Approved|Paid]</text>
        <line x1="610" y1="712" x2="870" y2="712" stroke="#e2e8f0" stroke-width="1"/>
        <text x="622" y="730" font-size="9.5" fill="#6d28d9">+ computeDeterministicPay(hours, rate)</text>
        <text x="622" y="746" font-size="9.5" fill="#6d28d9">+ apply10PercentTax()</text>
        <text x="622" y="762" font-size="9.5" fill="#6d28d9">+ generatePDFPayslip()</text>
      </g>

      <!-- 11. FraudFlag Class -->
      <g id="cls-fraud" filter="url(#cls-shadow)">
        <rect x="930" y="560" width="220" height="195" rx="6" fill="#ffffff" stroke="#e11d48" stroke-width="1.8"/>
        <rect x="930" y="560" width="220" height="28" rx="6" fill="#9f1239"/>
        <text x="1040" y="579" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">FraudFlag</text>
        <text x="940" y="604" font-size="10" fill="#0f172a">+ id : Integer [PK]</text>
        <text x="940" y="620" font-size="10" fill="#0f172a">+ employee_id : Integer [FK]</text>
        <text x="940" y="636" font-size="10" fill="#e11d48" font-weight="700">+ flag_type : [geofence|z_score|ghost]</text>
        <text x="940" y="652" font-size="10" fill="#0f172a">+ raised_at : Timestamp</text>
        <text x="940" y="668" font-size="10" fill="#0f172a">+ status : [Pending|Dismissed|Confirmed]</text>
        <text x="940" y="684" font-size="10" fill="#0f172a">+ resolved_by : Integer [FK]</text>
        <line x1="930" y1="694" x2="1150" y2="694" stroke="#e2e8f0" stroke-width="1"/>
        <text x="940" y="712" font-size="9.5" fill="#9f1239">+ flagGeofenceBreach(dist)</text>
        <text x="940" y="728" font-size="9.5" fill="#9f1239">+ flagZScoreAnomaly(z)</text>
        <text x="940" y="744" font-size="9.5" fill="#9f1239">+ markResolved(adminId)</text>
      </g>

      <!-- 12. StaffingForecast Class -->
      <g id="cls-forecast" filter="url(#cls-shadow)">
        <rect x="320" y="560" width="230" height="175" rx="6" fill="#ffffff" stroke="#d97706" stroke-width="1.8"/>
        <rect x="320" y="560" width="230" height="28" rx="6" fill="#92400e"/>
        <text x="435" y="579" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">StaffingForecast</text>
        <text x="330" y="604" font-size="10" fill="#0f172a">+ id : Integer [PK]</text>
        <text x="330" y="620" font-size="10" fill="#0f172a">+ department_id : Integer [FK]</text>
        <text x="330" y="636" font-size="10" fill="#0f172a">+ shift_date : Date</text>
        <text x="330" y="652" font-size="10" fill="#0f172a">+ predicted_headcount : Integer</text>
        <text x="330" y="668" font-size="10" fill="#0f172a">+ confidence_band : String</text>
        <line x1="320" y1="678" x2="550" y2="678" stroke="#e2e8f0" stroke-width="1"/>
        <text x="330" y="696" font-size="9.5" fill="#92400e">+ compute7DayMovingAvg()</text>
        <text x="330" y="712" font-size="9.5" fill="#92400e">+ generateAIBriefing()</text>
      </g>

      <!-- 13. ChatbotKnowledgeBase Class -->
      <g id="cls-rag" filter="url(#cls-shadow)">
        <rect x="1180" y="280" width="190" height="175" rx="6" fill="#ffffff" stroke="#0284c7" stroke-width="1.8"/>
        <rect x="1180" y="280" width="190" height="28" rx="6" fill="#075985"/>
        <text x="1275" y="299" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">KnowledgeChunk (RAG)</text>
        <text x="1190" y="324" font-size="10" fill="#0f172a">+ id : Integer [PK]</text>
        <text x="1190" y="340" font-size="10" fill="#0f172a">+ chunk_text : Text</text>
        <text x="1190" y="356" font-size="10" fill="#0f172a">+ source_doc : String</text>
        <text x="1190" y="372" font-size="10" fill="#0f172a">+ company_id : Integer</text>
        <line x1="1180" y1="382" x2="1370" y2="382" stroke="#e2e8f0" stroke-width="1"/>
        <text x="1190" y="400" font-size="9.5" fill="#075985">+ searchKeywords()</text>
        <text x="1190" y="416" font-size="9.5" fill="#075985">+ rankByRelevance()</text>
      </g>

      <!-- 14. PerformanceScore Class (Bottom-Left) -->
      <g id="cls-perf" filter="url(#cls-shadow)">
        <rect x="40" y="560" width="220" height="175" rx="6" fill="#ffffff" stroke="#475569" stroke-width="1.8"/>
        <rect x="40" y="560" width="220" height="28" rx="6" fill="#334155"/>
        <text x="150" y="579" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">PerformanceScore</text>
        <text x="50" y="604" font-size="10" fill="#0f172a">+ id : Integer [PK]</text>
        <text x="50" y="620" font-size="10" fill="#0f172a">+ employee_id : Integer [FK]</text>
        <text x="50" y="636" font-size="10" fill="#0f172a">+ punctuality_score : Double</text>
        <text x="50" y="652" font-size="10" fill="#0f172a">+ composite_score : Double</text>
        <line x1="40" y1="662" x2="260" y2="662" stroke="#e2e8f0" stroke-width="1"/>
        <text x="50" y="680" font-size="9.5" fill="#334155">+ calculateComposite()</text>
        <text x="50" y="696" font-size="9.5" fill="#334155">+ generateAISummary()</text>
      </g>

      <!-- ================= RELATIONSHIP ARROWS & MULTIPLICITIES ================= -->
      <!-- Company to Department (1 to 1..*) -->
      <line x1="260" y1="140" x2="320" y2="140" stroke="#0f172a" stroke-width="1.8" marker-start="url(#comp-diamond)" marker-end="url(#cls-arr)"/>
      <text x="270" y="132" font-size="9" font-weight="700" fill="#0f172a">1</text>
      <text x="305" y="132" font-size="9" font-weight="700" fill="#0f172a">1..*</text>

      <!-- Department to Employee (1 to 0..*) -->
      <line x1="550" y1="140" x2="610" y2="140" stroke="#0f172a" stroke-width="1.8" marker-start="url(#comp-diamond)" marker-end="url(#cls-arr)"/>
      <text x="560" y="132" font-size="9" font-weight="700" fill="#0f172a">1</text>
      <text x="595" y="132" font-size="9" font-weight="700" fill="#0f172a">0..*</text>

      <!-- Employee to FaceEmbedding (1 to 0..1) -->
      <line x1="870" y1="140" x2="930" y2="140" stroke="#059669" stroke-width="1.8" marker-end="url(#cls-arr)"/>
      <text x="880" y="132" font-size="9" font-weight="700" fill="#059669">1</text>
      <text x="915" y="132" font-size="9" font-weight="700" fill="#059669">0..1</text>

      <!-- Employee to BiometricLog (1 to 0..*) -->
      <path d="M 870 200 L 910 200 L 910 320 L 930 320" fill="none" stroke="#059669" stroke-width="1.8" marker-end="url(#cls-arr)"/>
      <text x="880" y="194" font-size="9" font-weight="700" fill="#059669">1</text>
      <text x="915" y="314" font-size="9" font-weight="700" fill="#059669">0..*</text>

      <!-- Employee to Shift (1 to 0..*) -->
      <line x1="740" y1="295" x2="740" y2="340" stroke="#2563eb" stroke-width="1.8" marker-end="url(#cls-arr)"/>
      <text x="746" y="308" font-size="9" font-weight="700" fill="#2563eb">1</text>
      <text x="746" y="332" font-size="9" font-weight="700" fill="#2563eb">0..*</text>

      <!-- Employee to PayrollLedger (1 to 0..*) -->
      <line x1="740" y1="515" x2="740" y2="560" stroke="#7c3aed" stroke-width="1.8" marker-end="url(#cls-arr)"/>
      <text x="746" y="530" font-size="9" font-weight="700" fill="#7c3aed">1</text>
      <text x="746" y="552" font-size="9" font-weight="700" fill="#7c3aed">0..*</text>

      <!-- Employee to ShiftSwap (1 to 0..*) -->
      <path d="M 610 240 L 580 240 L 580 390 L 550 390" fill="none" stroke="#a855f7" stroke-width="1.8" marker-end="url(#cls-arr)"/>
      <text x="590" y="234" font-size="9" font-weight="700" fill="#a855f7">1</text>
      <text x="555" y="384" font-size="9" font-weight="700" fill="#a855f7">0..*</text>

      <!-- Employee to LeaveRequest (1 to 0..*) -->
      <path d="M 610 260 L 290 260 L 290 390 L 260 390" fill="none" stroke="#0284c7" stroke-width="1.8" marker-end="url(#cls-arr)"/>
      <text x="590" y="254" font-size="9" font-weight="700" fill="#0284c7">1</text>
      <text x="265" y="384" font-size="9" font-weight="700" fill="#0284c7">0..*</text>

      <!-- Employee to FraudFlag (1 to 0..*) -->
      <path d="M 870 230 L 900 230 L 900 580 L 930 580" fill="none" stroke="#e11d48" stroke-width="1.8" marker-end="url(#cls-arr)"/>
      <text x="880" y="224" font-size="9" font-weight="700" fill="#e11d48">1</text>
      <text x="915" y="574" font-size="9" font-weight="700" fill="#e11d48">0..*</text>

      <!-- Department to StaffingForecast (1 to 0..*) -->
      <path d="M 435" y1="230" x2="435" y2="560" stroke="#d97706" stroke-width="1.8" marker-end="url(#cls-arr)"/>
      <text x="442" y="245" font-size="9" font-weight="700" fill="#d97706">1</text>
      <text x="442" y="550" font-size="9" font-weight="700" fill="#d97706">0..*</text>

      <!-- SYSTEM ARCHITECTURE SUMMARY FOOTER -->
      <rect x="40" y="800" width="1320" height="100" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
      <text x="60" y="825" font-size="12" font-weight="800" fill="#0f172a">CLASS DESIGN PRINCIPLES &amp; EXTENSIBILITY</text>
      <text x="60" y="845" font-size="10" fill="#334155">• Multi-Tenant Scoping: All organizational entities (Company, Department, Employee, KnowledgeBase) enforce strict company_id database partitioning.</text>
      <text x="60" y="865" font-size="10" fill="#334155">• Biometric Vector Storage: 128-dimensional facial embedding vector indices leverage pgvector indexing with Euclidean (&lt;-&gt;) search operators.</text>
      <text x="60" y="885" font-size="10" fill="#334155">• Offline Resiliency: OfflinePunch mirrors client IndexedDB schema with monotonic synchronization state tracking (synced: 0 | 1) for seamless recovery.</text>
    </svg>
    """

def build_svg_activity_biometrics():
    return """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 950" width="100%" height="100%" style="background:#ffffff; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
      <defs>
        <marker id="act-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#0f172a" />
        </marker>
        <marker id="act-arr-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#16a34a" />
        </marker>
        <marker id="act-arr-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626" />
        </marker>
        <filter id="act-shadow" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.08" />
        </filter>
      </defs>

      <!-- Background Grid -->
      <pattern id="act-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
      <rect width="1400" height="950" fill="url(#act-grid)" />

      <!-- TITLE -->
      <text x="700" y="34" text-anchor="middle" font-size="21" font-weight="800" fill="#0f172a" letter-spacing="0.5">
        UML ACTIVITY SPECIFICATION: BIOMETRIC KIOSK PUNCH &amp; RESILIENT SYNC
      </text>
      <text x="700" y="54" text-anchor="middle" font-size="12" fill="#64748b" font-weight="500">
        Swimlane Execution: Edge Tablet Capture, pgvector Facial Euclidean Match, Haversine Geofencing &amp; Offline IndexedDB Caching
      </text>

      <!-- ================= SWIMLANES (5 PARTITIONS) ================= -->
      <!-- Lane 1: Worker -->
      <rect x="50" y="75" width="240" height="850" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="50" y="75" width="240" height="35" fill="#1e293b"/>
      <text x="170" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#38bdf8">SWIMLANE: WORKER</text>

      <!-- Lane 2: Kiosk Edge Device -->
      <rect x="290" y="75" width="280" height="850" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="290" y="75" width="280" height="35" fill="#1e293b"/>
      <text x="430" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#38bdf8">SWIMLANE: KIOSK TABLET (EDGE)</text>

      <!-- Lane 3: Local IndexedDB -->
      <rect x="570" y="75" width="240" height="850" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="570" y="75" width="240" height="35" fill="#1e293b"/>
      <text x="690" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#facc15">SWIMLANE: INDEXEDDB CACHE</text>

      <!-- Lane 4: Next.js Attendance API -->
      <rect x="810" y="75" width="280" height="850" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="810" y="75" width="280" height="35" fill="#1e293b"/>
      <text x="950" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#38bdf8">SWIMLANE: ATTENDANCE API</text>

      <!-- Lane 5: PostgreSQL & Vector DB -->
      <rect x="1090" y="75" width="260" height="850" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="1090" y="75" width="260" height="35" fill="#1e293b"/>
      <text x="1220" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#34d399">SWIMLANE: POSTGRESQL &amp; PGVECTOR</text>

      <!-- ================= ACTIVITIES & DECISIONS ================= -->
      <!-- START NODE -->
      <circle cx="170" cy="140" r="14" fill="#0f172a"/>
      <line x1="170" y1="154" x2="170" y2="185" stroke="#0f172a" stroke-width="2" marker-end="url(#act-arr)"/>

      <!-- Node 1: Worker approaches terminal -->
      <rect x="80" y="185" width="180" height="45" rx="8" fill="#ffffff" stroke="#3b82f6" stroke-width="1.8" filter="url(#act-shadow)"/>
      <text x="170" y="204" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Worker Approaches Kiosk</text>
      <text x="170" y="218" text-anchor="middle" font-size="9.5" fill="#64748b">Selects Name &amp; Punch Type</text>

      <!-- Link to Kiosk -->
      <path d="M 260 207 L 340 207" stroke="#0f172a" stroke-width="2" marker-end="url(#act-arr)"/>

      <!-- Node 2: Kiosk Activates Camera -->
      <rect x="340" y="185" width="180" height="45" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="1.8" filter="url(#act-shadow)"/>
      <text x="430" y="204" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Activate Camera &amp; Sensors</text>
      <text x="430" y="218" text-anchor="middle" font-size="9.5" fill="#64748b">Capture 128d Vector &amp; GPS</text>

      <!-- Link down to Decision: Online? -->
      <line x1="430" y1="230" x2="430" y2="265" stroke="#0f172a" stroke-width="2" marker-end="url(#act-arr)"/>

      <!-- Decision 1: Network Online? -->
      <polygon points="430,265 475,295 430,325 385,295" fill="#fffbeb" stroke="#d97706" stroke-width="1.8"/>
      <text x="430" y="299" text-anchor="middle" font-size="9" font-weight="700" fill="#92400e">Online?</text>

      <!-- Branch NO: Save to IndexedDB -->
      <path d="M 475 295 L 610 295" stroke="#dc2626" stroke-width="2" marker-end="url(#act-arr)"/>
      <text x="520" y="288" font-size="9" font-weight="700" fill="#dc2626">[No - Offline]</text>

      <rect x="610" y="270" width="160" height="50" rx="8" fill="#fefce8" stroke="#ca8a04" stroke-width="1.8" filter="url(#act-shadow)"/>
      <text x="690" y="291" text-anchor="middle" font-size="10" font-weight="700" fill="#854d0e">Store in IndexedDB</text>
      <text x="690" y="306" text-anchor="middle" font-size="9" fill="#a16207">synced = 0 (kiosk_offline_db)</text>

      <!-- Network Restoration Poller -->
      <path d="M 690 320 L 690 380 L 460 380 L 460 330" fill="none" stroke="#ca8a04" stroke-width="1.5" stroke-dasharray="3 3"/>
      <text x="560" y="372" font-size="8.5" font-weight="600" fill="#854d0e">Polls window.ononline</text>

      <!-- Branch YES: Dispatch to API -->
      <path d="M 430 325 L 430 430 L 860 430" fill="none" stroke="#16a34a" stroke-width="2" marker-end="url(#act-arr)"/>
      <text x="440" y="350" font-size="9" font-weight="700" fill="#16a34a">[Yes - Online]</text>

      <!-- Node 3: Next.js API Receives Punch -->
      <rect x="860" y="410" width="180" height="45" rx="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.8" filter="url(#act-shadow)"/>
      <text x="950" y="429" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">POST /api/attendance</text>
      <text x="950" y="443" text-anchor="middle" font-size="9.5" fill="#64748b">Verify Auth &amp; Multi-Tenancy</text>

      <!-- API to Postgres: Query Vector -->
      <path d="M 1040 432 L 1130 432" stroke="#0f172a" stroke-width="2" marker-end="url(#act-arr)"/>

      <!-- Node 4: Postgres pgvector Query -->
      <rect x="1130" y="410" width="180" height="45" rx="8" fill="#ffffff" stroke="#059669" stroke-width="1.8" filter="url(#act-shadow)"/>
      <text x="1220" y="429" text-anchor="middle" font-size="10.5" font-weight="700" fill="#065f46">pgvector Distance Query</text>
      <text x="1220" y="443" text-anchor="middle" font-size="9" fill="#047857">embedding &lt;-&gt; $1 (Euclidean)</text>

      <!-- Postgres returns distance to API -->
      <path d="M 1220 455 L 1220 505 L 1000 505" fill="none" stroke="#0f172a" stroke-width="2" marker-end="url(#act-arr)"/>

      <!-- Decision 2: Face Distance < 0.60? -->
      <polygon points="950,480 1000,505 950,530 900,505" fill="#fffbeb" stroke="#d97706" stroke-width="1.8"/>
      <text x="950" y="509" text-anchor="middle" font-size="8.5" font-weight="700" fill="#92400e">Dist &lt; 0.60?</text>

      <!-- Fail Face: Reject -->
      <path d="M 900 505 L 750 505 L 750 540" fill="none" stroke="#dc2626" stroke-width="2" marker-end="url(#act-arr)"/>
      <text x="800" y="498" font-size="9" font-weight="700" fill="#dc2626">[No - Mismatch]</text>

      <rect x="660" y="540" width="180" height="40" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.8"/>
      <text x="750" y="558" text-anchor="middle" font-size="10" font-weight="700" fill="#991b1b">Log Recognition Failure</text>
      <text x="750" y="571" text-anchor="middle" font-size="8.5" fill="#b91c1c">Return HTTP 401 Unauthorized</text>

      <!-- Pass Face: Check Geofence -->
      <path d="M 950 530 L 950 580" stroke="#16a34a" stroke-width="2" marker-end="url(#act-arr)"/>
      <text x="960" y="555" font-size="9" font-weight="700" fill="#16a34a">[Yes - Matched]</text>

      <!-- Node 5: Compute Haversine Distance -->
      <rect x="860" y="580" width="180" height="45" rx="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.8" filter="url(#act-shadow)"/>
      <text x="950" y="599" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Haversine Math Execution</text>
      <text x="950" y="613" text-anchor="middle" font-size="9" fill="#64748b">Factory: (23.8103, 90.4125)</text>

      <line x1="950" y1="625" x2="950" y2="655" stroke="#0f172a" stroke-width="2" marker-end="url(#act-arr)"/>

      <!-- Decision 3: Distance <= 100m? -->
      <polygon points="950,655 1000,680 950,705 900,680" fill="#fffbeb" stroke="#d97706" stroke-width="1.8"/>
      <text x="950" y="684" text-anchor="middle" font-size="8.5" font-weight="700" fill="#92400e">Dist &lt;= 100m?</text>

      <!-- Fail Geofence: Raise Fraud Flag -->
      <path d="M 1000 680 L 1130 680" stroke="#dc2626" stroke-width="2" marker-end="url(#act-arr)"/>
      <text x="1025" y="673" font-size="9" font-weight="700" fill="#dc2626">[No - Breach]</text>

      <rect x="1130" y="660" width="180" height="45" rx="8" fill="#fff1f2" stroke="#e11d48" stroke-width="1.8" filter="url(#act-shadow)"/>
      <text x="1220" y="679" text-anchor="middle" font-size="10" font-weight="700" fill="#881337">Insert into fraud_flags</text>
      <text x="1220" y="693" text-anchor="middle" font-size="8.5" fill="#9f1239">flag_type: 'geofence' (Pending)</text>

      <!-- Pass Geofence: Log Valid Attendance -->
      <path d="M 950 705 L 950 760 L 1130 760" fill="none" stroke="#16a34a" stroke-width="2" marker-end="url(#act-arr)"/>
      <text x="960" y="730" font-size="9" font-weight="700" fill="#16a34a">[Yes - Valid]</text>

      <rect x="1130" y="740" width="180" height="45" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8" filter="url(#act-shadow)"/>
      <text x="1220" y="759" text-anchor="middle" font-size="10" font-weight="700" fill="#14532d">Insert into biometric_logs</text>
      <text x="1220" y="773" text-anchor="middle" font-size="8.5" fill="#15803d">verified_by_face = TRUE</text>

      <!-- Success Return to Kiosk UI -->
      <path d="M 1220 785 L 1220 840 L 430 840" fill="none" stroke="#16a34a" stroke-width="2" marker-end="url(#act-arr)"/>

      <rect x="340" y="820" width="180" height="45" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8" filter="url(#act-shadow)"/>
      <text x="430" y="839" text-anchor="middle" font-size="10.5" font-weight="700" fill="#14532d">Display Green Success Card</text>
      <text x="430" y="853" text-anchor="middle" font-size="9" fill="#15803d">Chime Sound &amp; Return Home</text>

      <!-- End Node -->
      <path d="M 340 842 L 200 842" stroke="#0f172a" stroke-width="2" marker-end="url(#act-arr)"/>
      <circle cx="170" cy="842" r="14" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
      <circle cx="170" cy="842" r="8" fill="#0f172a"/>
    </svg>
    """

def build_svg_activity_shiftswap():
    return """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 950" width="100%" height="100%" style="background:#ffffff; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
      <defs>
        <marker id="swap-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#0f172a" />
        </marker>
        <filter id="swap-shadow" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.08" />
        </filter>
      </defs>

      <!-- Background Grid -->
      <pattern id="swap-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
      <rect width="1400" height="950" fill="url(#swap-grid)" />

      <!-- TITLE -->
      <text x="700" y="34" text-anchor="middle" font-size="21" font-weight="800" fill="#0f172a" letter-spacing="0.5">
        UML ACTIVITY SPECIFICATION: SHIFT SCHEDULING &amp; PEER SWAP WORKFLOW
      </text>
      <text x="700" y="54" text-anchor="middle" font-size="12" fill="#64748b" font-weight="500">
        Asynchronous Proposal, Floor Manager Authorization Gate &amp; Atomic Roster Schedule Swap Protocol
      </text>

      <!-- ================= SWIMLANES (4 PARTITIONS) ================= -->
      <!-- Lane 1: Proposing Worker -->
      <rect x="60" y="75" width="290" height="850" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="60" y="75" width="290" height="35" fill="#1e293b"/>
      <text x="205" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#38bdf8">SWIMLANE: PROPOSING WORKER (FARIA)</text>

      <!-- Lane 2: Next.js Scheduler Service -->
      <rect x="350" y="75" width="340" height="850" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="350" y="75" width="340" height="35" fill="#1e293b"/>
      <text x="520" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#38bdf8">SWIMLANE: SCHEDULER &amp; SWAP API</text>

      <!-- Lane 3: Floor Manager -->
      <rect x="690" y="75" width="330" height="850" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="690" y="75" width="330" height="35" fill="#1e293b"/>
      <text x="855" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#c084fc">SWIMLANE: FLOOR MANAGER (NAZMUL)</text>

      <!-- Lane 4: PostgreSQL Shifts Store -->
      <rect x="1020" y="75" width="320" height="850" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="1020" y="75" width="320" height="35" fill="#1e293b"/>
      <text x="1180" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#34d399">SWIMLANE: POSTGRESQL SHIFT STORE</text>

      <!-- ================= ACTIVITIES ================= -->
      <!-- Start Node -->
      <circle cx="205" cy="145" r="14" fill="#0f172a"/>
      <line x1="205" y1="159" x2="205" y2="195" stroke="#0f172a" stroke-width="2" marker-end="url(#swap-arr)"/>

      <!-- Worker views calendar -->
      <rect x="105" y="195" width="200" height="45" rx="8" fill="#ffffff" stroke="#3b82f6" stroke-width="1.8" filter="url(#swap-shadow)"/>
      <text x="205" y="214" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Inspect Weekly Schedule</text>
      <text x="205" y="228" text-anchor="middle" font-size="9" fill="#64748b">Identifies Conflict on Target Date</text>

      <line x1="205" y1="240" x2="205" y2="280" stroke="#0f172a" stroke-width="2" marker-end="url(#swap-arr)"/>

      <!-- Worker clicks Request Swap -->
      <rect x="105" y="280" width="200" height="50" rx="8" fill="#ffffff" stroke="#3b82f6" stroke-width="1.8" filter="url(#swap-shadow)"/>
      <text x="205" y="299" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Submit Swap Request Dialog</text>
      <text x="205" y="313" text-anchor="middle" font-size="9" fill="#64748b">Inputs Target Shift, Date &amp; Reason</text>

      <!-- Link to Scheduler API -->
      <path d="M 305 305 L 420 305" stroke="#0f172a" stroke-width="2" marker-end="url(#swap-arr)"/>

      <!-- API Validates -->
      <rect x="420" y="280" width="200" height="50" rx="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.8" filter="url(#swap-shadow)"/>
      <text x="520" y="299" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">POST /api/shifts/swap</text>
      <text x="520" y="313" text-anchor="middle" font-size="9" fill="#64748b">Validates Company Multi-Tenancy</text>

      <!-- API to DB: Insert Pending -->
      <path d="M 620 305 L 1100 305" stroke="#0f172a" stroke-width="2" marker-end="url(#swap-arr)"/>

      <rect x="1100" y="280" width="180" height="50" rx="8" fill="#ffffff" stroke="#059669" stroke-width="1.8" filter="url(#swap-shadow)"/>
      <text x="1190" y="299" text-anchor="middle" font-size="10.5" font-weight="700" fill="#065f46">INSERT INTO shift_swaps</text>
      <text x="1190" y="313" text-anchor="middle" font-size="9" fill="#047857">status = 'Pending'</text>

      <!-- Alert Floor Manager -->
      <path d="M 1190 330 L 1190 400 L 855 400" fill="none" stroke="#0f172a" stroke-width="2" marker-end="url(#swap-arr)"/>

      <!-- Manager Reviews in Scheduler -->
      <rect x="755" y="380" width="200" height="50" rx="8" fill="#ffffff" stroke="#a855f7" stroke-width="1.8" filter="url(#swap-shadow)"/>
      <text x="855" y="399" text-anchor="middle" font-size="10.5" font-weight="700" fill="#581c87">Manager Reviews Proposals</text>
      <text x="855" y="413" text-anchor="middle" font-size="9" fill="#6b21a8">Inspects Roster Coverage &amp; Standby</text>

      <line x1="855" y1="430" x2="855" y2="475" stroke="#0f172a" stroke-width="2" marker-end="url(#swap-arr)"/>

      <!-- Manager Decision -->
      <polygon points="855,475 905,505 855,535 805,505" fill="#fffbeb" stroke="#d97706" stroke-width="1.8"/>
      <text x="855" y="509" text-anchor="middle" font-size="9" font-weight="700" fill="#92400e">Authorize?</text>

      <!-- REJECT PATH -->
      <path d="M 805 505 L 520 505 L 520 560" fill="none" stroke="#dc2626" stroke-width="2" marker-end="url(#swap-arr)"/>
      <text x="660" y="498" font-size="9" font-weight="700" fill="#dc2626">[Rejected]</text>

      <rect x="420" y="560" width="200" height="50" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.8"/>
      <text x="520" y="579" text-anchor="middle" font-size="10.5" font-weight="700" fill="#991b1b">PUT status = 'Rejected'</text>
      <text x="520" y="593" text-anchor="middle" font-size="9" fill="#b91c1c">Notify Worker of Refusal</text>

      <path d="M 420 585 L 205 585 L 205 640" fill="none" stroke="#dc2626" stroke-width="2" marker-end="url(#swap-arr)"/>
      <rect x="105" y="640" width="200" height="40" rx="8" fill="#ffffff" stroke="#ef4444" stroke-width="1.8"/>
      <text x="205" y="658" text-anchor="middle" font-size="10" font-weight="700" fill="#991b1b">Worker Keeps Original Shift</text>
      <text x="205" y="671" text-anchor="middle" font-size="8.5" fill="#b91c1c">Proposal marked Rejected</text>

      <!-- AUTHORIZE PATH -->
      <path d="M 905 505 L 1190 505 L 1190 560" fill="none" stroke="#16a34a" stroke-width="2" marker-end="url(#swap-arr)"/>
      <text x="1040" y="498" font-size="9" font-weight="700" fill="#16a34a">[Authorized]</text>

      <!-- Atomic DB Transaction -->
      <rect x="1080" y="560" width="220" height="65" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8" filter="url(#swap-shadow)"/>
      <text x="1190" y="580" text-anchor="middle" font-size="10.5" font-weight="700" fill="#14532d">Execute Atomic SQL Transaction</text>
      <text x="1190" y="595" text-anchor="middle" font-size="9" fill="#15803d">1. Update shifts SET employee_id = peer</text>
      <text x="1190" y="610" text-anchor="middle" font-size="9" fill="#15803d">2. Update shift_swaps SET status = 'Authorized'</text>

      <!-- Broadcast to Workers -->
      <path d="M 1190 625 L 1190 730 L 205 730" fill="none" stroke="#16a34a" stroke-width="2" marker-end="url(#swap-arr)"/>

      <rect x="105" y="710" width="200" height="50" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8" filter="url(#swap-shadow)"/>
      <text x="205" y="729" text-anchor="middle" font-size="10.5" font-weight="700" fill="#14532d">Updated Calendar Rendered</text>
      <text x="205" y="743" text-anchor="middle" font-size="9" fill="#15803d">Both Personnel Synced Real-Time</text>

      <!-- End Node -->
      <line x1="205" y1="760" x2="205" y2="820" stroke="#0f172a" stroke-width="2" marker-end="url(#swap-arr)"/>
      <circle cx="205" cy="834" r="14" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
      <circle cx="205" cy="834" r="8" fill="#0f172a"/>
    </svg>
    """

def build_svg_activity_payroll():
    return """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 950" width="100%" height="100%" style="background:#ffffff; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
      <defs>
        <marker id="pay-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#0f172a" />
        </marker>
        <filter id="pay-shadow" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.08" />
        </filter>
      </defs>

      <!-- Background Grid -->
      <pattern id="pay-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
      <rect width="1400" height="950" fill="url(#pay-grid)" />

      <!-- TITLE -->
      <text x="700" y="34" text-anchor="middle" font-size="21" font-weight="800" fill="#0f172a" letter-spacing="0.5">
        UML ACTIVITY SPECIFICATION: DETERMINISTIC PAYROLL &amp; OVERTIME ENGINE
      </text>
      <text x="700" y="54" text-anchor="middle" font-size="12" fill="#64748b" font-weight="500">
        Execution Protocol: Biometric Pair Matching, 1.5x Overtime Segmentation, Statutory 10% Deduction &amp; Payslip Ledger
      </text>

      <!-- ================= SWIMLANES (4 PARTITIONS) ================= -->
      <!-- Lane 1: HR Admin / Trigger -->
      <rect x="50" y="75" width="280" height="850" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="50" y="75" width="280" height="35" fill="#1e293b"/>
      <text x="190" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#38bdf8">SWIMLANE: HR ADMIN / TRIGGER</text>

      <!-- Lane 2: Payroll Engine Controller -->
      <rect x="330" y="75" width="340" height="850" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="330" y="75" width="340" height="35" fill="#1e293b"/>
      <text x="500" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#a78bfa">SWIMLANE: PAYROLL ENGINE (/api/payroll)</text>

      <!-- Lane 3: Mathematical Processing Unit -->
      <rect x="670" y="75" width="340" height="850" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="670" y="75" width="340" height="35" fill="#1e293b"/>
      <text x="840" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#38bdf8">SWIMLANE: DETERMINISTIC MATH RULES</text>

      <!-- Lane 4: Ledger & Slip Storage -->
      <rect x="1010" y="75" width="340" height="850" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="1010" y="75" width="340" height="35" fill="#1e293b"/>
      <text x="1180" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#34d399">SWIMLANE: LEDGER REPOSITORY &amp; PDF</text>

      <!-- ================= ACTIVITIES ================= -->
      <!-- Start Node -->
      <circle cx="190" cy="140" r="14" fill="#0f172a"/>
      <line x1="190" y1="154" x2="190" y2="190" stroke="#0f172a" stroke-width="2" marker-end="url(#pay-arr)"/>

      <!-- HR selects period -->
      <rect x="90" y="190" width="200" height="50" rx="8" fill="#ffffff" stroke="#059669" stroke-width="1.8" filter="url(#pay-shadow)"/>
      <text x="190" y="209" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Select Pay Period Range</text>
      <text x="190" y="223" text-anchor="middle" font-size="9" fill="#64748b">Clicks 'Compute Monthly Payroll'</text>

      <!-- Dispatch to Engine -->
      <path d="M 290 215 L 400 215" stroke="#0f172a" stroke-width="2" marker-end="url(#pay-arr)"/>

      <!-- Engine fetches active employees -->
      <rect x="400" y="190" width="200" height="50" rx="8" fill="#ffffff" stroke="#7c3aed" stroke-width="1.8" filter="url(#pay-shadow)"/>
      <text x="500" y="209" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Query Active Employees</text>
      <text x="500" y="223" text-anchor="middle" font-size="9" fill="#64748b">WHERE status = 'Active' AND co_id = $1</text>

      <line x1="500" y1="240" x2="500" y2="280" stroke="#0f172a" stroke-width="2" marker-end="url(#pay-arr)"/>

      <!-- Fetch Biometric Logs -->
      <rect x="400" y="280" width="200" height="50" rx="8" fill="#ffffff" stroke="#7c3aed" stroke-width="1.8" filter="url(#pay-shadow)"/>
      <text x="500" y="299" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Fetch Biometric Logs</text>
      <text x="500" y="313" text-anchor="middle" font-size="9" fill="#64748b">ORDER BY timestamp ASC</text>

      <line x1="500" y1="330" x2="500" y2="370" stroke="#0f172a" stroke-width="2" marker-end="url(#pay-arr)"/>

      <!-- Pair Check_In and Check_Out -->
      <rect x="400" y="370" width="200" height="55" rx="8" fill="#ffffff" stroke="#7c3aed" stroke-width="1.8" filter="url(#pay-shadow)"/>
      <text x="500" y="389" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Pair In/Out Punches</text>
      <text x="500" y="403" text-anchor="middle" font-size="9" fill="#64748b">Compute elapsed hours H per shift</text>
      <text x="500" y="415" text-anchor="middle" font-size="8.5" fill="#475569">Discard unpaired orphan punches</text>

      <!-- Pass to Math Unit -->
      <path d="M 600 397 L 740 397" stroke="#0f172a" stroke-width="2" marker-end="url(#pay-arr)"/>

      <!-- Math: Segment Regular & Overtime -->
      <rect x="740" y="370" width="200" height="55" rx="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.8" filter="url(#pay-shadow)"/>
      <text x="840" y="389" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Segment Work Hours</text>
      <text x="840" y="403" text-anchor="middle" font-size="9" fill="#1e3a8a">H_reg = min(H, 8.0)</text>
      <text x="840" y="415" text-anchor="middle" font-size="9" fill="#1e3a8a">H_ot = max(0, H - 8.0)</text>

      <line x1="840" y1="425" x2="840" y2="465" stroke="#0f172a" stroke-width="2" marker-end="url(#pay-arr)"/>

      <!-- Lookup Hourly Rate -->
      <rect x="740" y="465" width="200" height="55" rx="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.8" filter="url(#pay-shadow)"/>
      <text x="840" y="484" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Lookup Role Hourly Wage</text>
      <text x="840" y="498" text-anchor="middle" font-size="9" fill="#64748b">HR: $30/hr | MGR: $25/hr</text>
      <text x="840" y="510" text-anchor="middle" font-size="9" fill="#64748b">Worker: $15/hr</text>

      <line x1="840" y1="520" x2="840" y2="560" stroke="#0f172a" stroke-width="2" marker-end="url(#pay-arr)"/>

      <!-- Compute Gross Pay -->
      <rect x="740" y="560" width="200" height="55" rx="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.8" filter="url(#pay-shadow)"/>
      <text x="840" y="579" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Compute Gross Earnings</text>
      <text x="840" y="593" text-anchor="middle" font-size="8.8" font-weight="700" fill="#1e40af">Gross = (H_reg * W) + (H_ot * W * 1.5)</text>
      <text x="840" y="605" text-anchor="middle" font-size="8.5" fill="#64748b">150% Premium on Overtime</text>

      <line x1="840" y1="615" x2="840" y2="655" stroke="#0f172a" stroke-width="2" marker-end="url(#pay-arr)"/>

      <!-- Apply 10% Statutory Deduction -->
      <rect x="740" y="655" width="200" height="55" rx="8" fill="#ffffff" stroke="#2563eb" stroke-width="1.8" filter="url(#pay-shadow)"/>
      <text x="840" y="674" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Deductions &amp; Net Calculation</text>
      <text x="840" y="688" text-anchor="middle" font-size="8.8" font-weight="700" fill="#1e40af">Deductions = Gross * 0.10 (Tax)</text>
      <text x="840" y="700" text-anchor="middle" font-size="8.8" font-weight="700" fill="#1e40af">Net Pay = Gross - Deductions</text>

      <!-- Pass to DB Store -->
      <path d="M 940 682 L 1080 682" stroke="#0f172a" stroke-width="2" marker-end="url(#pay-arr)"/>

      <!-- Upsert Payroll Ledger -->
      <rect x="1080" y="655" width="200" height="55" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8" filter="url(#pay-shadow)"/>
      <text x="1180" y="674" text-anchor="middle" font-size="10.5" font-weight="700" fill="#14532d">Upsert into payroll_ledgers</text>
      <text x="1180" y="688" text-anchor="middle" font-size="9" fill="#15803d">ON CONFLICT (emp_id, period)</text>
      <text x="1180" y="700" text-anchor="middle" font-size="8.5" fill="#15803d">Status: 'Draft' / 'Approved'</text>

      <line x1="1180" y1="710" x2="1180" y2="760" stroke="#0f172a" stroke-width="2" marker-end="url(#pay-arr)"/>

      <!-- Generate Printable Payslip -->
      <rect x="1080" y="760" width="200" height="55" rx="8" fill="#ffffff" stroke="#059669" stroke-width="1.8" filter="url(#pay-shadow)"/>
      <text x="1180" y="779" text-anchor="middle" font-size="10.5" font-weight="700" fill="#065f46">Generate Itemized Payslip</text>
      <text x="1180" y="793" text-anchor="middle" font-size="9" fill="#047857">Worker Self-Service Print Ready</text>

      <!-- Return Confirmation to HR Admin -->
      <path d="M 1180 815 L 1180 850 L 190 850" fill="none" stroke="#16a34a" stroke-width="2" marker-end="url(#pay-arr)"/>

      <rect x="90" y="825" width="200" height="50" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8" filter="url(#pay-shadow)"/>
      <text x="190" y="844" text-anchor="middle" font-size="10.5" font-weight="700" fill="#14532d">Payroll Batch Complete</text>
      <text x="190" y="858" text-anchor="middle" font-size="9" fill="#15803d">Real-Time Ledger Dashboard Updated</text>

      <!-- End Node -->
      <circle cx="190" cy="905" r="14" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
      <circle cx="190" cy="905" r="8" fill="#0f172a"/>
    </svg>
    """

def build_svg_sequence_and_state():
    return """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 950" width="100%" height="100%" style="background:#ffffff; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
      <defs>
        <marker id="seq-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#1e293b" />
        </marker>
        <marker id="seq-arr-dash" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
        </marker>
        <filter id="seq-shadow" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.08" />
        </filter>
      </defs>

      <!-- Background Grid -->
      <pattern id="seq-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
      <rect width="1400" height="950" fill="url(#seq-grid)" />

      <!-- TITLE -->
      <text x="700" y="32" text-anchor="middle" font-size="21" font-weight="800" fill="#0f172a" letter-spacing="0.5">
        UML SEQUENCE &amp; STATE SPECIFICATION: PROTOCOLS &amp; LIFECYCLES
      </text>
      <text x="700" y="50" text-anchor="middle" font-size="11.5" fill="#64748b" font-weight="500">
        Top: Multi-Tier Handshake for Biometric Authentication | Bottom: Finite State Transition Lifecycles (Shift, Swap, Payroll)
      </text>

      <!-- ================= SECTION A: SEQUENCE DIAGRAM (Y: 65 - 500) ================= -->
      <rect x="40" y="65" width="1320" height="425" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#seq-shadow)"/>
      <text x="60" y="90" font-size="12" font-weight="800" fill="#0f172a">PART A: UML SEQUENCE DIAGRAM — EDGE BIOMETRICS &amp; GEOFENCE HANDSHAKE</text>

      <!-- Lifeline Headers -->
      <!-- 1. Worker -->
      <rect x="100" y="105" width="140" height="35" rx="6" fill="#1e293b"/>
      <text x="170" y="127" text-anchor="middle" font-size="11" font-weight="700" fill="#38bdf8">Worker (Client)</text>
      <line x1="170" y1="140" x2="170" y2="470" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>

      <!-- 2. Kiosk Tablet -->
      <rect x="360" y="105" width="150" height="35" rx="6" fill="#1e293b"/>
      <text x="435" y="127" text-anchor="middle" font-size="11" font-weight="700" fill="#38bdf8">Kiosk Edge Device</text>
      <line x1="435" y1="140" x2="435" y2="470" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>

      <!-- 3. Attendance API -->
      <rect x="630" y="105" width="160" height="35" rx="6" fill="#1e293b"/>
      <text x="710" y="127" text-anchor="middle" font-size="11" font-weight="700" fill="#38bdf8">/api/attendance</text>
      <line x1="710" y1="140" x2="710" y2="470" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>

      <!-- 4. pgvector DB -->
      <rect x="910" y="105" width="160" height="35" rx="6" fill="#1e293b"/>
      <text x="990" y="127" text-anchor="middle" font-size="11" font-weight="700" fill="#34d399">pgvector PostgreSQL</text>
      <line x1="990" y1="140" x2="990" y2="470" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>

      <!-- 5. Fraud Queue -->
      <rect x="1170" y="105" width="150" height="35" rx="6" fill="#1e293b"/>
      <text x="1245" y="127" text-anchor="middle" font-size="11" font-weight="700" fill="#f87171">Fraud Flag Queue</text>
      <line x1="1245" y1="140" x2="1245" y2="470" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>

      <!-- Messages -->
      <!-- Msg 1: Worker clicks punch -->
      <line x1="170" y1="165" x2="435" y2="165" stroke="#1e293b" stroke-width="1.8" marker-end="url(#seq-arr)"/>
      <text x="290" y="158" text-anchor="middle" font-size="9.5" font-weight="600" fill="#1e293b">1: Clicks 'Verify &amp; Register Attendance'</text>

      <!-- Activation on Kiosk -->
      <rect x="430" y="165" width="10" height="85" fill="#cbd5e1"/>
      <text x="445" y="190" font-size="8.5" fill="#475569">Extracts 128d face vector &amp; navigator.geolocation</text>

      <!-- Msg 2: Kiosk POST to API -->
      <line x1="440" y1="220" x2="710" y2="220" stroke="#1e293b" stroke-width="1.8" marker-end="url(#seq-arr)"/>
      <text x="575" y="213" text-anchor="middle" font-size="9.5" font-weight="600" fill="#1e293b">2: POST /api/attendance { face_vector, gps, emp_id }</text>

      <!-- Activation on API -->
      <rect x="705" y="220" width="10" height="180" fill="#cbd5e1"/>

      <!-- Msg 3: API queries pgvector -->
      <line x1="715" y1="245" x2="990" y2="245" stroke="#1e293b" stroke-width="1.8" marker-end="url(#seq-arr)"/>
      <text x="850" y="238" text-anchor="middle" font-size="9" font-weight="600" fill="#1e293b">3: SELECT embedding &lt;-&gt; $1 AS distance</text>

      <!-- Return from DB -->
      <line x1="990" y1="280" x2="715" y2="280" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#seq-arr-dash)"/>
      <text x="850" y="273" text-anchor="middle" font-size="9" fill="#475569">4: Return match record (distance = 0.28)</text>

      <!-- API Internal Math -->
      <text x="725" y="305" font-size="8.5" font-weight="600" fill="#2563eb">Haversine distance check: R * c = 42m (&lt;= 100m)</text>

      <!-- ALT BLOCK: Geofence Check -->
      <rect x="680" y="325" width="600" height="95" fill="#f8fafc" stroke="#94a3b8" stroke-dasharray="3 3"/>
      <text x="690" y="340" font-size="8.5" font-weight="800" fill="#64748b">[alt: distance &gt; 100m]</text>

      <line x1="715" y1="355" x2="1245" y2="355" stroke="#e11d48" stroke-width="1.8" marker-end="url(#seq-arr)"/>
      <text x="980" y="350" text-anchor="middle" font-size="8.5" font-weight="700" fill="#e11d48">5a: INSERT INTO fraud_flags (flag_type: 'geofence')</text>

      <text x="690" y="380" font-size="8.5" font-weight="800" fill="#64748b">[else: valid perimeter]</text>
      <line x1="715" y1="395" x2="990" y2="395" stroke="#16a34a" stroke-width="1.8" marker-end="url(#seq-arr)"/>
      <text x="850" y="390" text-anchor="middle" font-size="8.5" font-weight="700" fill="#16a34a">5b: INSERT INTO biometric_logs (verified: true)</text>

      <!-- Response to Kiosk -->
      <line x1="705" y1="425" x2="440" y2="425" stroke="#16a34a" stroke-width="1.8" stroke-dasharray="4 3" marker-end="url(#seq-arr-dash)"/>
      <text x="575" y="418" text-anchor="middle" font-size="9.5" font-weight="700" fill="#16a34a">6: 200 OK { success: true, verified_by_face: true }</text>

      <!-- Response to Worker -->
      <line x1="435" y1="450" x2="170" y2="450" stroke="#16a34a" stroke-width="1.8" stroke-dasharray="4 3" marker-end="url(#seq-arr-dash)"/>
      <text x="290" y="443" text-anchor="middle" font-size="9.5" font-weight="700" fill="#16a34a">7: Visual confirmation card &amp; audio notification</text>

      <!-- ================= SECTION B: STATE MACHINE LIFECYCLES (Y: 510 - 920) ================= -->
      <!-- Machine 1: Shift State Lifecycle -->
      <rect x="40" y="510" width="420" height="400" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#seq-shadow)"/>
      <text x="60" y="535" font-size="11.5" font-weight="800" fill="#1e3a8a">STATE MACHINE 1: SHIFT LIFECYCLE</text>

      <!-- Start -->
      <circle cx="100" cy="580" r="10" fill="#0f172a"/>
      <line x1="110" y1="580" x2="160" y2="580" stroke="#0f172a" stroke-width="1.8" marker-end="url(#seq-arr)"/>

      <rect x="160" y="560" width="110" height="40" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.8"/>
      <text x="215" y="585" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">Scheduled</text>

      <!-- Scheduled to Standby -->
      <path d="M 215 600 L 215 650" stroke="#0f172a" stroke-width="1.8" marker-end="url(#seq-arr)"/>
      <text x="220" y="630" font-size="8" fill="#475569">[reassigned as backup]</text>

      <rect x="160" y="650" width="110" height="40" rx="8" fill="#fefce8" stroke="#ca8a04" stroke-width="1.8"/>
      <text x="215" y="675" text-anchor="middle" font-size="11" font-weight="700" fill="#854d0e">Standby</text>

      <!-- Scheduled to Completed -->
      <path d="M 270 580 L 330 580" stroke="#16a34a" stroke-width="1.8" marker-end="url(#seq-arr)"/>
      <text x="300" y="572" font-size="8" font-weight="600" fill="#16a34a">[Checked Out]</text>

      <rect x="330" y="560" width="110" height="40" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8"/>
      <text x="385" y="585" text-anchor="middle" font-size="11" font-weight="700" fill="#14532d">Completed</text>

      <!-- Scheduled to Absent -->
      <path d="M 215 690 L 215 740" stroke="#dc2626" stroke-width="1.8" marker-end="url(#seq-arr)"/>
      <text x="220" y="720" font-size="8" fill="#dc2626">[shift passed &amp; no log]</text>

      <rect x="160" y="740" width="110" height="40" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.8"/>
      <text x="215" y="765" text-anchor="middle" font-size="11" font-weight="700" fill="#991b1b">Absent</text>

      <!-- Completed to End -->
      <line x1="385" y1="600" x2="385" y2="820" stroke="#0f172a" stroke-width="1.8" marker-end="url(#seq-arr)"/>
      <circle cx="385" cy="835" r="12" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <circle cx="385" cy="835" r="7" fill="#0f172a"/>

      <!-- Machine 2: Shift Swap Lifecycle -->
      <rect x="490" y="510" width="420" height="400" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#seq-shadow)"/>
      <text x="510" y="535" font-size="11.5" font-weight="800" fill="#581c87">STATE MACHINE 2: SHIFT SWAP LIFECYCLE</text>

      <circle cx="550" cy="580" r="10" fill="#0f172a"/>
      <line x1="560" y1="580" x2="610" y2="580" stroke="#0f172a" stroke-width="1.8" marker-end="url(#seq-arr)"/>

      <rect x="610" y="560" width="130" height="40" rx="8" fill="#fffbeb" stroke="#d97706" stroke-width="1.8"/>
      <text x="675" y="585" text-anchor="middle" font-size="11" font-weight="700" fill="#92400e">Pending Review</text>

      <!-- Pending to Authorized -->
      <path d="M 675 600 L 675 670" stroke="#16a34a" stroke-width="1.8" marker-end="url(#seq-arr)"/>
      <text x="680" y="635" font-size="8.5" font-weight="700" fill="#16a34a">[Manager Authorizes]</text>

      <rect x="610" y="670" width="130" height="45" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8"/>
      <text x="675" y="692" text-anchor="middle" font-size="11" font-weight="700" fill="#14532d">Authorized</text>
      <text x="675" y="705" text-anchor="middle" font-size="8" fill="#15803d">(Atomic Schedule Swap)</text>

      <!-- Pending to Rejected -->
      <path d="M 740 580 L 800 580 L 800 670" fill="none" stroke="#dc2626" stroke-width="1.8" marker-end="url(#seq-arr)"/>
      <text x="770" y="572" font-size="8.5" font-weight="700" fill="#dc2626">[Manager Rejects]</text>

      <rect x="745" y="670" width="130" height="45" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.8"/>
      <text x="810" y="692" text-anchor="middle" font-size="11" font-weight="700" fill="#991b1b">Rejected</text>
      <text x="810" y="705" text-anchor="middle" font-size="8" fill="#b91c1c">(Roster Retained)</text>

      <!-- Terminal -->
      <line x1="675" y1="715" x2="675" y2="820" stroke="#0f172a" stroke-width="1.8" marker-end="url(#seq-arr)"/>
      <circle cx="675" cy="835" r="12" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <circle cx="675" cy="835" r="7" fill="#0f172a"/>

      <!-- Machine 3: Payroll Ledger Lifecycle -->
      <rect x="940" y="510" width="420" height="400" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#seq-shadow)"/>
      <text x="960" y="535" font-size="11.5" font-weight="800" fill="#065f46">STATE MACHINE 3: PAYROLL LEDGER LIFECYCLE</text>

      <circle cx="1000" cy="580" r="10" fill="#0f172a"/>
      <line x1="1010" y1="580" x2="1060" y2="580" stroke="#0f172a" stroke-width="1.8" marker-end="url(#seq-arr)"/>

      <rect x="1060" y="560" width="130" height="40" rx="8" fill="#faf5ff" stroke="#7c3aed" stroke-width="1.8"/>
      <text x="1125" y="585" text-anchor="middle" font-size="11" font-weight="700" fill="#581c87">Draft (Computed)</text>

      <!-- Draft to Approved -->
      <path d="M 1125 600 L 1125 670" stroke="#16a34a" stroke-width="1.8" marker-end="url(#seq-arr)"/>
      <text x="1130" y="635" font-size="8.5" font-weight="700" fill="#16a34a">[Admin Audits &amp; Approves]</text>

      <rect x="1060" y="670" width="130" height="45" rx="8" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>
      <text x="1125" y="692" text-anchor="middle" font-size="11" font-weight="700" fill="#1e3a8a">Approved</text>
      <text x="1125" y="705" text-anchor="middle" font-size="8" fill="#1e40af">(Ready for Disbursement)</text>

      <!-- Approved to Paid -->
      <path d="M 1125 715 L 1125 780" stroke="#16a34a" stroke-width="1.8" marker-end="url(#seq-arr)"/>
      <text x="1130" y="750" font-size="8.5" font-weight="700" fill="#16a34a">[Disbursement Confirmed]</text>

      <rect x="1060" y="780" width="130" height="45" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8"/>
      <text x="1125" y="802" text-anchor="middle" font-size="11" font-weight="700" fill="#14532d">Paid</text>
      <text x="1125" y="815" text-anchor="middle" font-size="8" fill="#15803d">(Payslip Released)</text>

      <!-- End -->
      <line x1="1190" y1="802" x2="1260" y2="802" stroke="#0f172a" stroke-width="1.8" marker-end="url(#seq-arr)"/>
      <circle cx="1275" cy="802" r="12" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <circle cx="1275" cy="802" r="7" fill="#0f172a"/>
    </svg>
    """

def generate_master_html():
    svg_l0 = build_svg_level0()
    svg_l1 = build_svg_level1()
    svg_l2_bio = build_svg_level2_biometric()
    svg_l2_pay = build_svg_level2_payroll()
    svg_uc = build_svg_usecase()
    svg_cls = build_svg_class_diagram()
    svg_act_bio = build_svg_activity_biometrics()
    svg_act_swap = build_svg_activity_shiftswap()
    svg_act_pay = build_svg_activity_payroll()
    svg_seq_state = build_svg_sequence_and_state()

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Workforce Intelligence Platform: Comprehensive Software Architecture &amp; UML Design Specification</title>
  <style>
    @page {{
      size: A4 landscape;
      margin: 8mm 10mm 8mm 10mm;
    }}
    * {{
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 10pt;
      line-height: 1.4;
    }}
    .page {{
      page-break-after: always;
      position: relative;
      width: 100%;
      min-height: 188mm;
      padding-bottom: 2mm;
    }}
    .page:last-child {{
      page-break-after: avoid;
    }}
    .header-bar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }}
    .header-bar .title {{
      font-size: 12pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.2px;
    }}
    .header-bar .meta {{
      font-size: 7.8pt;
      color: #64748b;
      font-weight: 600;
      text-align: right;
    }}
    .diagram-container {{
      width: 100%;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #ffffff;
      padding: 2px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      margin-bottom: 6px;
    }}
    .diagram-container svg {{
      display: block;
      width: 100%;
      height: auto;
      max-height: 130mm;
    }}
    .footer-bar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 3px;
      font-size: 7.2pt;
      color: #64748b;
      margin-top: 4px;
    }}
    .data-table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 7.5pt;
      margin-top: 4px;
    }}
    .data-table th, .data-table td {{
      border: 1px solid #cbd5e1;
      padding: 3px 6px;
      text-align: left;
    }}
    .data-table th {{
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
    }}
    .badge {{
      display: inline-block;
      padding: 1px 5px;
      border-radius: 3px;
      font-weight: 700;
      font-size: 6.8pt;
      text-transform: uppercase;
    }}
    .badge-blue {{ background: #dbeafe; color: #1e40af; }}
    .badge-green {{ background: #dcfce7; color: #166534; }}
    .badge-purple {{ background: #f3e8ff; color: #6b21a8; }}
    .badge-rose {{ background: #ffe4e6; color: #9f1239; }}
    .badge-amber {{ background: #fef3c7; color: #92400e; }}

    .grid-2col {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }}
    .grid-3col {{
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
    }}
    .card {{
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 8px;
      background: #f8fafc;
    }}
    .card h3 {{
      margin: 0 0 3px 0;
      font-size: 8.5pt;
      font-weight: 700;
    }}
    .card p {{
      margin: 0;
      font-size: 7.4pt;
      color: #334155;
      line-height: 1.35;
    }}
  </style>
</head>
<body>

  <!-- ================= PAGE 1: DFD LEVEL 0 CONTEXT ================= -->
  <div class="page">
    <div class="header-bar">
      <div class="title">System Architecture Specification — Level 0 Data Flow Diagram (Context)</div>
      <div class="meta">Doc ID: ARCH-DFD-L0 | Ver: 2.0 AI Enterprise | Platform: Industrial Intel</div>
    </div>
    <div class="diagram-container">
      {svg_l0}
    </div>
    <div class="footer-bar">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Formal Specification Approved for Engineering &amp; Regulatory Compliance</span>
      <span>Page 1 of 11</span>
    </div>
  </div>

  <!-- ================= PAGE 2: DFD LEVEL 1 DECOMPOSITION ================= -->
  <div class="page">
    <div class="header-bar">
      <div class="title">Functional Decomposition — Level 1 Data Flow Diagram (Subsystem Core)</div>
      <div class="meta">Doc ID: ARCH-DFD-L1 | Ver: 2.0 AI Enterprise | Platform: Industrial Intel</div>
    </div>
    <div class="diagram-container">
      {svg_l1}
    </div>
    <div class="footer-bar">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Formal Specification Approved for Engineering &amp; Regulatory Compliance</span>
      <span>Page 2 of 11</span>
    </div>
  </div>

  <!-- ================= PAGE 3: DFD LEVEL 2 BIOMETRICS & GEOFENCING ================= -->
  <div class="page">
    <div class="header-bar">
      <div class="title">Process 2.0 Subsystem Trace — Level 2 DFD: Biometric Verification &amp; Geofencing</div>
      <div class="meta">Doc ID: ARCH-DFD-L2-BIO | Ver: 2.0 AI Enterprise | Platform: Industrial Intel</div>
    </div>
    <div class="diagram-container">
      {svg_l2_bio}
    </div>
    <div class="footer-bar">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Formal Specification Approved for Engineering &amp; Regulatory Compliance</span>
      <span>Page 3 of 11</span>
    </div>
  </div>

  <!-- ================= PAGE 4: DFD LEVEL 2 PAYROLL ================= -->
  <div class="page">
    <div class="header-bar">
      <div class="title">Process 4.0 Subsystem Trace — Level 2 DFD: Deterministic Payroll Engine</div>
      <div class="meta">Doc ID: ARCH-DFD-L2-PAY | Ver: 2.0 AI Enterprise | Platform: Industrial Intel</div>
    </div>
    <div class="diagram-container">
      {svg_l2_pay}
    </div>
    <div class="footer-bar">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Formal Specification Approved for Engineering &amp; Regulatory Compliance</span>
      <span>Page 4 of 11</span>
    </div>
  </div>

  <!-- ================= PAGE 5: UML USE CASE DIAGRAM ================= -->
  <div class="page">
    <div class="header-bar">
      <div class="title">UML Use Case Specification — System Actors, Boundary &amp; Service Packages</div>
      <div class="meta">Doc ID: ARCH-UML-UC | Ver: 2.0 AI Enterprise | Platform: Industrial Intel</div>
    </div>
    <div class="diagram-container">
      {svg_uc}
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Actor ID &amp; Name</th>
          <th>Actor Archetype</th>
          <th>Primary Operational Capabilities</th>
          <th>Security &amp; Tenant Scope</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>E1: Worker (Faria)</strong></td>
          <td><span class="badge badge-blue">Human / Self-Service</span></td>
          <td>Biometric Kiosk Punch, View Personal Weekly Schedule, Propose Shift Swap, Submit Leave Request, Print Itemized Payslip, Query AI Bot.</td>
          <td>Row-Level Security locked to own employee_id. No access to other employee ledgers or admin panels.</td>
        </tr>
        <tr>
          <td><strong>E2: Floor Manager (Nazmul)</strong></td>
          <td><span class="badge badge-purple">Human / Operational</span></td>
          <td>Inspect Floor Headcount, Assign Shifts &amp; Standby Pool, Review &amp; Authorize/Reject Shift Swaps, Approve Leaves, Register Line Staff.</td>
          <td>Scoped to managed Department workers via manager_worker_access mapping table.</td>
        </tr>
        <tr>
          <td><strong>E3: HR Admin (Prithula)</strong></td>
          <td><span class="badge badge-green">Human / Executive</span></td>
          <td>Company-wide Governance, Full Staff CRUD, Run Deterministic Payroll, Audit &amp; Resolve Fraud Flags, Configure Vector Biometrics.</td>
          <td>Full Tenant Administrative Privileges (company_id isolated). Access to all financial and anomaly vaults.</td>
        </tr>
        <tr>
          <td><strong>E4: Gate Kiosk Terminal</strong></td>
          <td><span class="badge badge-amber">Hardware / Edge</span></td>
          <td>Face Embedding Capture (128d), GPS Haversine Distance Probe, IndexedDB Offline Punch Buffer, Reconnection Sync Batching.</td>
          <td>Hardware UUID Device Authentication. Offline store (kiosk_offline_db) restricted to local IndexedDB origin.</td>
        </tr>
        <tr>
          <td><strong>E5: AI &amp; Analytics Daemon</strong></td>
          <td><span class="badge badge-rose">Automated / Service</span></td>
          <td>Overtime Z-Score Outlier Scanner (z &gt; 1.5), 7-Day Moving Average Staffing Forecaster, Semantic RAG Knowledge Base Retrieval.</td>
          <td>System cron &amp; API background jobs. Operates across tenant datasets with strict mathematical determinism.</td>
        </tr>
      </tbody>
    </table>
    <div class="footer-bar">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Formal Specification Approved for Engineering &amp; Regulatory Compliance</span>
      <span>Page 5 of 11</span>
    </div>
  </div>

  <!-- ================= PAGE 6: UML CLASS DIAGRAM ================= -->
  <div class="page">
    <div class="header-bar">
      <div class="title">UML Class Specification — Domain Entities, Relational Schema &amp; Method Interfaces</div>
      <div class="meta">Doc ID: ARCH-UML-CLASS | Ver: 2.0 AI Enterprise | Platform: Industrial Intel</div>
    </div>
    <div class="diagram-container">
      {svg_cls}
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Entity Class</th>
          <th>Underlying Database Table</th>
          <th>Multiplicities &amp; Foreign Keys</th>
          <th>Architectural Role &amp; Integrity Invariants</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Company</strong></td>
          <td><code>companies</code></td>
          <td>1 to 1..* Departments, 1 to 1..* Employees</td>
          <td>Multi-Tenant Root Partition. All secondary queries must scope against company_id.</td>
        </tr>
        <tr>
          <td><strong>Employee</strong></td>
          <td><code>employees</code></td>
          <td>* to 1 Department, 1 to 0..* Logs/Shifts</td>
          <td>Identity Principal. Stores bcrypt password hash, role enum, and active status flag.</td>
        </tr>
        <tr>
          <td><strong>FaceEmbedding</strong></td>
          <td><code>face_embeddings</code></td>
          <td>* to 1 Employee (Cascade Delete)</td>
          <td>Biometric Anchor. Stores 128d float vector indexed via pgvector for sub-millisecond Euclidean distance matching.</td>
        </tr>
        <tr>
          <td><strong>ShiftSwap</strong></td>
          <td><code>shift_swaps</code></td>
          <td>* to 1 Employee</td>
          <td>Peer Exchange Entity. Manages lifecycle ('Pending' -&gt; 'Authorized' | 'Rejected') with atomic roster swap.</td>
        </tr>
        <tr>
          <td><strong>PayrollLedger</strong></td>
          <td><code>payroll_ledgers</code></td>
          <td>* to 1 Employee (Unique on Period)</td>
          <td>Financial Ledger. Computes regular vs overtime (1.5x) earnings, statutory 10% tax deduction, and net pay.</td>
        </tr>
      </tbody>
    </table>
    <div class="footer-bar">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Formal Specification Approved for Engineering &amp; Regulatory Compliance</span>
      <span>Page 6 of 11</span>
    </div>
  </div>

  <!-- ================= PAGE 7: UML ACTIVITY DIAGRAM (BIOMETRICS) ================= -->
  <div class="page">
    <div class="header-bar">
      <div class="title">UML Activity Specification — Biometric Kiosk Punch, Geofencing &amp; Offline Sync</div>
      <div class="meta">Doc ID: ARCH-UML-ACT-BIO | Ver: 2.0 AI Enterprise | Platform: Industrial Intel</div>
    </div>
    <div class="diagram-container">
      {svg_act_bio}
    </div>
    <div class="footer-bar">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Formal Specification Approved for Engineering &amp; Regulatory Compliance</span>
      <span>Page 7 of 11</span>
    </div>
  </div>

  <!-- ================= PAGE 8: UML ACTIVITY DIAGRAM (SHIFT SWAP) ================= -->
  <div class="page">
    <div class="header-bar">
      <div class="title">UML Activity Specification — Shift Scheduling &amp; Peer Swap Authorization</div>
      <div class="meta">Doc ID: ARCH-UML-ACT-SWAP | Ver: 2.0 AI Enterprise | Platform: Industrial Intel</div>
    </div>
    <div class="diagram-container">
      {svg_act_swap}
    </div>
    <div class="footer-bar">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Formal Specification Approved for Engineering &amp; Regulatory Compliance</span>
      <span>Page 8 of 11</span>
    </div>
  </div>

  <!-- ================= PAGE 9: UML ACTIVITY DIAGRAM (PAYROLL) ================= -->
  <div class="page">
    <div class="header-bar">
      <div class="title">UML Activity Specification — Deterministic Payroll &amp; 1.5x Overtime Calculation</div>
      <div class="meta">Doc ID: ARCH-UML-ACT-PAY | Ver: 2.0 AI Enterprise | Platform: Industrial Intel</div>
    </div>
    <div class="diagram-container">
      {svg_act_pay}
    </div>
    <div class="footer-bar">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Formal Specification Approved for Engineering &amp; Regulatory Compliance</span>
      <span>Page 9 of 11</span>
    </div>
  </div>

  <!-- ================= PAGE 10: UML SEQUENCE & STATE TRANSITION ================= -->
  <div class="page">
    <div class="header-bar">
      <div class="title">UML Sequence &amp; State Specification — Communication Protocols &amp; Lifecycles</div>
      <div class="meta">Doc ID: ARCH-UML-SEQ-STATE | Ver: 2.0 AI Enterprise | Platform: Industrial Intel</div>
    </div>
    <div class="diagram-container">
      {svg_seq_state}
    </div>
    <div class="footer-bar">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Formal Specification Approved for Engineering &amp; Regulatory Compliance</span>
      <span>Page 10 of 11</span>
    </div>
  </div>

  <!-- ================= PAGE 11: MATHEMATICAL SPECIFICATIONS & DICTIONARY ================= -->
  <div class="page">
    <div class="header-bar">
      <div class="title">Mathematical Formulations, Security Constraints &amp; Architectural Dictionary</div>
      <div class="meta">Doc ID: ARCH-MATH-SPEC | Ver: 2.0 AI Enterprise | Platform: Industrial Intel</div>
    </div>

    <div class="grid-2col" style="margin-top: 6px;">
      <div class="card">
        <h3 style="color: #1e40af;">1. Haversine Perimeter Distance Algorithm</h3>
        <p>Calculates great-circle distance between Kiosk/Mobile device GPS and Factory Anchor (23.8103, 90.4125):</p>
        <code style="font-size: 7.2pt; background: #e2e8f0; padding: 2px 4px; border-radius: 3px; display: block; margin: 3px 0;">
          dLat = (lat2 - lat1) * (pi / 180); dLon = (lon2 - lon1) * (pi / 180)<br>
          a = sin²(dLat/2) + cos(lat1)*cos(lat2)*sin²(dLon/2)<br>
          c = 2 * atan2(sqrt(a), sqrt(1-a)); Distance = 6,371,000 * c (meters)<br>
          Invariance: If Distance &gt; 100.0m -&gt; Raise 'geofence' FraudFlag
        </code>
      </div>

      <div class="card">
        <h3 style="color: #065f46;">2. pgvector Euclidean Biometric Matching</h3>
        <p>Evaluates L2-distance between enrolled 128-dimensional embedding vector and real-time facial query:</p>
        <code style="font-size: 7.2pt; background: #e2e8f0; padding: 2px 4px; border-radius: 3px; display: block; margin: 3px 0;">
          Distance = sqrt( sum( (e_i - q_i)² ) ) for i = 1 to 128<br>
          Match Rule: Distance &lt; 0.60 -&gt; verified_by_face = TRUE<br>
          Threshold 0.60 corresponds to &gt;= 99.2% statistical facial verification certainty
        </code>
      </div>

      <div class="card">
        <h3 style="color: #6b21a8;">3. Deterministic Overtime &amp; Tax Payroll Equation</h3>
        <p>Daily shift segmentation based on pairs of Check_In and Check_Out biometric timestamps:</p>
        <code style="font-size: 7.2pt; background: #e2e8f0; padding: 2px 4px; border-radius: 3px; display: block; margin: 3px 0;">
          H_reg = min(H, 8.0); H_ot = max(0, H - 8.0)<br>
          Gross Pay = (H_reg * Rate) + (H_ot * Rate * 1.5)<br>
          Deductions = Gross Pay * 0.10 (10% Statutory Income Tax Withholding)<br>
          Net Pay = Gross Pay - Deductions
        </code>
      </div>

      <div class="card">
        <h3 style="color: #9f1239;">4. Statistical Z-Score Anomaly Outlier Scanner</h3>
        <p>Scans population overtime distribution to detect fraudulent hour inflating or buddy punching:</p>
        <code style="font-size: 7.2pt; background: #e2e8f0; padding: 2px 4px; border-radius: 3px; display: block; margin: 3px 0;">
          mu = (1/N) * sum(OT_i); sigma = sqrt( (1/N) * sum( (OT_i - mu)² ) )<br>
          Z_i = (OT_i - mu) / sigma<br>
          Flagged if Z_i &gt; 1.5 AND OT_i &gt; 2.0 hours (dispatches review to HR Admin)
        </code>
      </div>
    </div>

    <table class="data-table" style="margin-top: 8px;">
      <thead>
        <tr>
          <th>System Boundary / Component</th>
          <th>Hardware &amp; Runtime Specification</th>
          <th>Cryptographic &amp; Security Standards</th>
          <th>Offline &amp; Disaster Recovery SLA</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Edge Kiosk Gateway</strong></td>
          <td>Android / iOS Tablet, 1080p Webcam, GPS Sensor, Chrome PWA Runtime</td>
          <td>Session tokens signed via NextAuth HMAC SHA-256. WebRTC media streams zero-buffered.</td>
          <td>IndexedDB persistent punch caching up to 10,000 entries. Zero data loss during network outage.</td>
        </tr>
        <tr>
          <td><strong>Backend API Core</strong></td>
          <td>Next.js 16 (App Router), Node.js v20+, TypeScript 5, Turbopack Compiler</td>
          <td>bcrypt password hashing (salt rounds: 10), SQL parameterized queries prevent injection.</td>
          <td>Sub-100ms response time on all transactional endpoints; horizontal autoscaling support.</td>
        </tr>
        <tr>
          <td><strong>Database &amp; Vector Store</strong></td>
          <td>PostgreSQL 16+, pgvector extension (128-dim vectors), pg_trgm trigram search</td>
          <td>SSL TLS 1.3 enforced (rejectUnauthorized in prod). Multi-tenant isolation at company level.</td>
          <td>Automated WAL streaming replication, point-in-time recovery, zero schema drift migrations.</td>
        </tr>
      </tbody>
    </table>

    <div class="footer-bar" style="margin-top: 8px;">
      <span>Industrial Intelligence Platform Architecture Specification</span>
      <span>Formal Specification Approved for Engineering &amp; Regulatory Compliance</span>
      <span>Page 11 of 11</span>
    </div>
  </div>

</body>
</html>
"""
    return html

def main():
    print("Generating comprehensive master HTML document with all UML and DFD models...")
    html_content = generate_master_html()

    docs_dir = r"e:\Faria\docs"
    platform_docs_dir = r"e:\Faria\indurstrial-workforce-inteligence-platform\docs"
    public_docs_dir = r"e:\Faria\indurstrial-workforce-inteligence-platform\public\docs"

    os.makedirs(docs_dir, exist_ok=True)
    os.makedirs(platform_docs_dir, exist_ok=True)
    os.makedirs(public_docs_dir, exist_ok=True)

    html_path = os.path.join(docs_dir, "dfd_specification.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Written comprehensive HTML at: {html_path}")

    # Save individual diagram SVGs to public/diagrams for web app display
    diagrams_dir = r"e:\Faria\indurstrial-workforce-inteligence-platform\public\diagrams"
    os.makedirs(diagrams_dir, exist_ok=True)
    
    diagrams_map = {
        "usecase_diagram.svg": build_svg_usecase(),
        "class_diagram.svg": build_svg_class_diagram(),
        "activity_biometrics.svg": build_svg_activity_biometrics(),
        "activity_shiftswap.svg": build_svg_activity_shiftswap(),
        "activity_payroll.svg": build_svg_activity_payroll(),
        "sequence_state_diagram.svg": build_svg_sequence_and_state(),
        "dfd_level0.svg": build_svg_level0(),
        "dfd_level1.svg": build_svg_level1(),
        "dfd_level2_biometrics.svg": build_svg_level2_biometric(),
        "dfd_level2_payroll.svg": build_svg_level2_payroll(),
    }

    for fname, svg_content in diagrams_map.items():
        with open(os.path.join(diagrams_dir, fname), "w", encoding="utf-8") as f:
            f.write(svg_content.strip())
    print(f"Exported {len(diagrams_map)} standalone SVG diagrams to: {diagrams_dir}")

    # Output PDF paths
    target_pdfs = [
        r"e:\Faria\AI_Workforce_Management_DFD_Specification.pdf",
        os.path.join(platform_docs_dir, "AI_Workforce_Management_DFD_Specification.pdf"),
        os.path.join(public_docs_dir, "AI_Workforce_Management_Specification.pdf"),
        os.path.join(public_docs_dir, "AI_Workforce_Management_DFD_Specification.pdf")
    ]

    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    browser_exe = chrome_path if os.path.exists(chrome_path) else edge_path

    primary_pdf = target_pdfs[0]
    cmd = [
        browser_exe,
        "--headless",
        "--disable-gpu",
        "--run-all-compositor-stages-before-draw",
        "--no-pdf-header-footer",
        f"--print-to-pdf={primary_pdf}",
        html_path
    ]

    print(f"Executing browser ({browser_exe}) to compile 11-page master PDF...")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if os.path.exists(primary_pdf) and os.path.getsize(primary_pdf) > 0:
        pdf_size = os.path.getsize(primary_pdf)
        print(f"SUCCESS: Master PDF compiled successfully! Size: {pdf_size} bytes")
        for dest in target_pdfs[1:]:
            shutil.copyfile(primary_pdf, dest)
            print(f"Copied to: {dest}")
    else:
        print(f"Error compiling PDF. Stderr: {result.stderr}")
        sys.exit(1)

if __name__ == "__main__":
    main()
