# Biometric & Role-Based Security Audit

This document outlines the security architecture, biometric data handling policies, and Role-Based Access Control (RBAC) rules implemented in the Industrial Workforce & Payroll Management System.

---

## 1. Biometric Data Handling & Privacy

Facial recognition is treated as high-risk sensitive biometric data under international privacy regulations (such as GDPR and local data protection rules).

### Data Collection & Extraction
- **Zero Raw Image Persistence:** Webcam frames captured by the Web Kiosk or Mobile App are parsed in memory to extract face descriptors. The raw images are **never written to disk, never cached, and never sent to third-party servers**.
- **Vector-Only Storage:** Only the numeric face embedding vector (a 128-dimensional array of floats) is persisted in the `face_embeddings` table. 
- **Reconstruction Resistance:** A 128-dimensional floating-point face descriptor is mathematically one-way. It is impossible to reconstruct or reverse-engineer a worker's visual face image from the numeric embedding stored in Postgres.

### Consent & Fallback Compliance
- HR must obtain explicit, written consent from employees before capturing reference enrollment profiles.
- A manual check-in form fallback is permanently available for employees who choose to opt out of biometric face scanning.

---

## 2. Role-Based Access Control (RBAC)

The system enforces strict segregation of duties between system roles.

| Feature / Page | HR Admin | Floor Manager | Worker | Description |
| :--- | :---: | :---: | :---: | :--- |
| **System Overview Dashboard** | Yes | Yes | Yes | HR Admin views full analytics; Worker only views own summaries. |
| **Employee Directory** | Yes | Yes | No | Registrations and editing are limited to Managers/HR; Workers cannot view directories. |
| **Biometric Face Enrollment** | Yes | Yes | No | Capturing reference embeddings can only be triggered by Managers/HR. |
| **Shift Scheduler (View)** | Yes | Yes | Yes | Full week grid view for everyone. |
| **Shift Scheduler (Assign)** | Yes | Yes | No | Only HR/Managers can assign and modify rosters. |
| **Shift Swap Authorizations** | Yes | Yes | No | Authorization of Cover Swap Proposals is restricted to Managers/HR. |
| **Shift Swap Proposals (Request)** | No | No | Yes | Workers can propose swaps for their own assigned shifts. |
| **Payroll Ledgers (View)** | Yes | No | Yes | HR views whole payroll register; Workers can only view their own payslips. |
| **Payroll Calculations (Run)** | Yes | No | No | Only HR Admin can trigger period calculations over biometric logs. |
| **Fraud Queue Triage** | Yes | No | No | Only HR Admin can review geofence and overtime flags, and trigger scans. |

---

## 3. Database Security Controls
- **TLS/SSL Encryption:** All communication between the Next.js API layer and the serverless Neon PostgreSQL cluster is encrypted in transit via SSL (`sslmode=require`).
- **Connection Isolation:** Database credentials are read server-side from `.env.local` and are never exposed to the browser or the client bundle.
- **SQL Injection Mitigation:** The database client (`lib/db.ts`) uses parameterized queries exclusively, eliminating the risk of SQL injection attacks on input parameters.
