'use client';

import React, { useState } from 'react';
import { 
  FileText, Download, ExternalLink, ZoomIn, ZoomOut, RotateCcw, 
  Maximize2, Database, ShieldCheck, Cpu, GitBranch, Layers, 
  Workflow, Activity, UserCheck, Calendar, DollarSign, CheckCircle2,
  Info
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface ArchitectureViewerProps {
  role?: string;
}

type DiagramKey = 
  | 'usecase' 
  | 'class' 
  | 'activity_biometrics' 
  | 'activity_shiftswap' 
  | 'activity_payroll' 
  | 'sequence_state' 
  | 'dfd_level0' 
  | 'dfd_level1' 
  | 'dfd_level2_biometrics' 
  | 'dfd_level2_payroll'
  | 'pdf_viewer';

interface DiagramMeta {
  title: string;
  category: 'UML' | 'Activity' | 'DFD' | 'Specification';
  badge: string;
  badgeColor: string;
  svgUrl: string;
  description: string;
  keyConcepts: string[];
}

const DIAGRAMS: Record<DiagramKey, DiagramMeta> = {
  usecase: {
    title: 'UML Use Case Diagram: System Actors & Boundary',
    category: 'UML',
    badge: 'UML Use Case',
    badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    svgUrl: '/diagrams/usecase_diagram.svg',
    description: 'Decomposes primary human actors (Worker, Floor Manager, HR Admin), hardware edge devices (Kiosk Terminal), and automated system daemons across 6 core service packages with formal <<include>> and <<extend>> dependencies.',
    keyConcepts: [
      'Worker Self-Service (Kiosk Punch, Shift Swaps, Payslips)',
      'Floor Manager Delegation (Roster Scheduling, Swap Approvals)',
      'HR Admin Governance (Deterministic Payroll, Fraud Resolution)',
      'Hardware Gateways & AI Micro-Daemons',
    ],
  },
  class: {
    title: 'UML Class Diagram: Domain Entities & Relational Schema',
    category: 'UML',
    badge: 'UML Class',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    svgUrl: '/diagrams/class_diagram.svg',
    description: 'Exhaustive object-oriented and relational domain model representing all 16 database tables, attributes, types, visibility (+/-), methods, and multi-tenant foreign key relationships (1..*) with pgvector support.',
    keyConcepts: [
      'Multi-Tenant Company & Department Hierarchy',
      'Employee Principal & NextAuth bcrypt Security',
      'pgvector 128-d FaceEmbedding Vector Indexing',
      'PayrollLedger, Shift, ShiftSwap & FraudFlag Schema',
    ],
  },
  activity_biometrics: {
    title: 'UML Activity Diagram: Biometric Kiosk Punch & Offline Sync',
    category: 'Activity',
    badge: 'Activity Workflow',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    svgUrl: '/diagrams/activity_biometrics.svg',
    description: 'Sequential swimlane workflow covering edge camera capture, pgvector Euclidean matching (<0.60 threshold), Haversine GPS geofence audit (<100m), and browser IndexedDB offline punch caching with background re-sync.',
    keyConcepts: [
      '5-Lane Swimlane (Worker, Kiosk, IndexedDB, API, Postgres)',
      'pgvector Euclidean L2 Vector Search (<->)',
      'Haversine 100-Meter Factory Radius Invariant',
      'Zero-Loss Offline Caching via IndexedDB Store',
    ],
  },
  activity_shiftswap: {
    title: 'UML Activity Diagram: Shift Scheduling & Peer Swap Workflow',
    category: 'Activity',
    badge: 'Activity Workflow',
    badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    svgUrl: '/diagrams/activity_shiftswap.svg',
    description: 'Peer-to-peer shift swap lifecycle. Worker selects conflicting shift and submits swap proposal; Floor Manager reviews department roster coverage and authorizes swap, executing an atomic schedule exchange.',
    keyConcepts: [
      'Peer-to-Peer Shift Swap Proposal Submission',
      'Floor Manager Authorization Gate',
      'Atomic SQL Roster Exchange Transaction',
      'Rollback Invariant on Manager Rejection',
    ],
  },
  activity_payroll: {
    title: 'UML Activity Diagram: Autonomous Payroll & Overtime Engine',
    category: 'Activity',
    badge: 'Activity Workflow',
    badgeColor: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    svgUrl: '/diagrams/activity_payroll.svg',
    description: 'Deterministic payroll pipeline. Pairs daily Check_In and Check_Out punches, segments regular (<=8h) and overtime (>8h @ 1.5x wage), applies 10% statutory tax deduction, and issues itemized payslip ledgers.',
    keyConcepts: [
      'Biometric Log Chronological Pair Matching',
      '150% Wage Multiplier on Hours > 8.0/day',
      '10% Statutory Income Tax Withholding',
      'Automated Ledger Upsert & Printable PDF Slips',
    ],
  },
  sequence_state: {
    title: 'UML Sequence & State Machine Specification',
    category: 'UML',
    badge: 'Sequence & State',
    badgeColor: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    svgUrl: '/diagrams/sequence_state_diagram.svg',
    description: 'Part A: Full inter-service sequence handshake for edge punch verification across client, Next.js API, and pgvector Postgres. Part B: 3 Finite State Machine lifecycles for Shifts, Shift Swaps, and Payroll Ledgers.',
    keyConcepts: [
      'Multi-Tier Synchronous & Asynchronous Handshake',
      'Alternative Branching (Geofence Breach vs Valid Punch)',
      'Shift State Lifecycle (Scheduled -> Standby -> Completed)',
      'Shift Swap State Lifecycle (Pending -> Authorized/Rejected)',
    ],
  },
  dfd_level0: {
    title: 'Data Flow Diagram: Level 0 System Context',
    category: 'DFD',
    badge: 'DFD Level 0',
    badgeColor: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    svgUrl: '/diagrams/dfd_level0.svg',
    description: 'High-level environmental boundary showing Process 0.0, external entities (Worker, Manager, HR Admin, Kiosk Terminal, AI Ingestion Service), and all incoming & outgoing information flows.',
    keyConcepts: [
      'System Context Boundary (Process 0.0)',
      'External Ingestion & Egress Information Vectors',
      'Gane & Sarson DFD Standard Representation',
    ],
  },
  dfd_level1: {
    title: 'Data Flow Diagram: Level 1 Functional Decomposition',
    category: 'DFD',
    badge: 'DFD Level 1',
    badgeColor: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    svgUrl: '/diagrams/dfd_level1.svg',
    description: 'Decomposes Process 0.0 into 6 discrete transactional subsystems: Multi-Tenant Auth, Biometric Ingestion, Shift Scheduling, Deterministic Payroll, Predictive Staffing, and Forensic Anomaly Detection.',
    keyConcepts: [
      '6 Subsystem Processes (1.0 to 6.0)',
      '8 Inter-Process Data Stores (D1 to D8)',
      'Asynchronous Event Streams & Audit Trails',
    ],
  },
  dfd_level2_biometrics: {
    title: 'Data Flow Diagram: Level 2 Process 2.0 (Biometrics & Geofencing)',
    category: 'DFD',
    badge: 'DFD Level 2',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    svgUrl: '/diagrams/dfd_level2_biometrics.svg',
    description: 'Micro-step data flow breakdown of facial biometric feature extraction, pgvector vector matching, GPS Haversine perimeter distance evaluation, and offline IndexedDB caching fallback.',
    keyConcepts: [
      'Micro-Steps 2.1 to 2.5 Decomposition',
      'pgvector Euclidean L2 Vector Store Interaction',
      'Geofence Fraud Flag Pipeline',
    ],
  },
  dfd_level2_payroll: {
    title: 'Data Flow Diagram: Level 2 Process 4.0 (Payroll Engine)',
    category: 'DFD',
    badge: 'DFD Level 2',
    badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    svgUrl: '/diagrams/dfd_level2_payroll.svg',
    description: 'Micro-step data flow breakdown of biometric pairing, 1.5x overtime multiplier computation, 10% statutory tax deduction, and payslip ledger generation.',
    keyConcepts: [
      'Micro-Steps 4.1 to 4.5 Decomposition',
      'Deterministic Pay Formula Execution',
      'Immutable Financial Ledger Persistence',
    ],
  },
  pdf_viewer: {
    title: 'Complete 11-Page Architecture & UML Specification (PDF)',
    category: 'Specification',
    badge: 'Official Master PDF',
    badgeColor: 'bg-primary/10 text-primary border-primary/20',
    svgUrl: '',
    description: 'The authoritative, publication-grade 11-page master document containing all UML diagrams, DFD models, database schema tables, mathematical proofs, and security architecture specifications.',
    keyConcepts: [
      'Official Engineering Specification (11 Pages A4 Landscape)',
      'Includes All UML Diagrams, DFDs & Mathematical Logic',
      'Regulatory Compliance & Technical Audit Ready',
    ],
  },
};

export default function ArchitectureViewer({ role }: ArchitectureViewerProps) {
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramKey>('usecase');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [fullscreenOpen, setFullscreenOpen] = useState<boolean>(false);

  const currentMeta = DIAGRAMS[selectedDiagram];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleZoomReset = () => setZoomLevel(100);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background/50 p-6 space-y-6">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-border p-6 shadow-xl text-white">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/20 text-primary-foreground border-primary/30 text-xs px-2.5 py-0.5 font-mono">
                AI Enterprise v2.0
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs px-2.5 py-0.5">
                UML &amp; DFD Certified
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Layers className="text-primary h-7 w-7" />
              AI Workforce Management Architecture &amp; UML Models
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Formal system design specification featuring complete UML Use Case, Class, Activity, Sequence, and State Machine diagrams, paired with multi-level Data Flow Diagrams and deterministic mathematical proofs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a href="/api/docs/pdf?download=true" download="AI_Workforce_Management_Specification.pdf">
              <Button className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white font-semibold shadow-lg shadow-primary/25 text-sm gap-2">
                <Download size={16} />
                Download Master PDF
              </Button>
            </a>
            <a href="/api/docs/pdf" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-sm gap-2">
                <ExternalLink size={16} />
                Open PDF in Tab
              </Button>
            </a>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/10 text-primary">
              <Database size={16} />
            </div>
            <div>
              <div className="font-bold text-white">16 Domain Entities</div>
              <div className="text-slate-400">pgvector &amp; Relational</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/10 text-emerald-400">
              <Workflow size={16} />
            </div>
            <div>
              <div className="font-bold text-white">10 Architecture Diagrams</div>
              <div className="text-slate-400">UML &amp; DFD Standards</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/10 text-amber-400">
              <ShieldCheck size={16} />
            </div>
            <div>
              <div className="font-bold text-white">100m Geofence</div>
              <div className="text-slate-400">Haversine GPS Formula</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/10 text-violet-400">
              <Cpu size={16} />
            </div>
            <div>
              <div className="font-bold text-white">Deterministic Payroll</div>
              <div className="text-slate-400">1.5x OT &amp; 10% Tax Deduction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Diagram Selector Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground">
            Select Diagram Model
          </span>
          <span className="text-xs text-muted-foreground">
            Click any model to inspect high-resolution vector SVG
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* UML Group */}
          <button
            onClick={() => { setSelectedDiagram('usecase'); setZoomLevel(100); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
              selectedDiagram === 'usecase'
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-card hover:bg-secondary text-foreground border-border'
            }`}
          >
            <UserCheck size={14} />
            UML: Use Case Diagram
          </button>

          <button
            onClick={() => { setSelectedDiagram('class'); setZoomLevel(100); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
              selectedDiagram === 'class'
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-card hover:bg-secondary text-foreground border-border'
            }`}
          >
            <Database size={14} />
            UML: Class Diagram (Schema)
          </button>

          <button
            onClick={() => { setSelectedDiagram('activity_biometrics'); setZoomLevel(100); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
              selectedDiagram === 'activity_biometrics'
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-card hover:bg-secondary text-foreground border-border'
            }`}
          >
            <Activity size={14} />
            Activity: Biometrics &amp; Sync
          </button>

          <button
            onClick={() => { setSelectedDiagram('activity_shiftswap'); setZoomLevel(100); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
              selectedDiagram === 'activity_shiftswap'
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-card hover:bg-secondary text-foreground border-border'
            }`}
          >
            <Calendar size={14} />
            Activity: Shift Swaps
          </button>

          <button
            onClick={() => { setSelectedDiagram('activity_payroll'); setZoomLevel(100); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
              selectedDiagram === 'activity_payroll'
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-card hover:bg-secondary text-foreground border-border'
            }`}
          >
            <DollarSign size={14} />
            Activity: Payroll Engine
          </button>

          <button
            onClick={() => { setSelectedDiagram('sequence_state'); setZoomLevel(100); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
              selectedDiagram === 'sequence_state'
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-card hover:bg-secondary text-foreground border-border'
            }`}
          >
            <GitBranch size={14} />
            Sequence &amp; State Lifecycles
          </button>

          {/* DFD Group */}
          <button
            onClick={() => { setSelectedDiagram('dfd_level0'); setZoomLevel(100); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
              selectedDiagram === 'dfd_level0'
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-card hover:bg-secondary text-foreground border-border'
            }`}
          >
            <Workflow size={14} />
            DFD: Level 0 Context
          </button>

          <button
            onClick={() => { setSelectedDiagram('dfd_level1'); setZoomLevel(100); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
              selectedDiagram === 'dfd_level1'
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-card hover:bg-secondary text-foreground border-border'
            }`}
          >
            <Workflow size={14} />
            DFD: Level 1 Decomposition
          </button>

          <button
            onClick={() => { setSelectedDiagram('dfd_level2_biometrics'); setZoomLevel(100); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
              selectedDiagram === 'dfd_level2_biometrics'
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-card hover:bg-secondary text-foreground border-border'
            }`}
          >
            <Workflow size={14} />
            DFD: Level 2 Biometrics
          </button>

          <button
            onClick={() => { setSelectedDiagram('dfd_level2_payroll'); setZoomLevel(100); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
              selectedDiagram === 'dfd_level2_payroll'
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-card hover:bg-secondary text-foreground border-border'
            }`}
          >
            <Workflow size={14} />
            DFD: Level 2 Payroll
          </button>

          {/* PDF Viewer Tab */}
          <button
            onClick={() => { setSelectedDiagram('pdf_viewer'); setZoomLevel(100); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
              selectedDiagram === 'pdf_viewer'
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-card hover:bg-secondary text-foreground border-border'
            }`}
          >
            <FileText size={14} />
            Full 11-Page PDF
          </button>
        </div>
      </div>

      {/* Main Diagram Display Canvas */}
      <Card className="border border-border shadow-sm overflow-hidden flex flex-col">
        {/* Canvas Toolbar Header */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-card/80 border-b border-border gap-4">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${currentMeta.badgeColor}`}>
              {currentMeta.badge}
            </span>
            <h2 className="font-bold text-sm tracking-tight text-foreground">
              {currentMeta.title}
            </h2>
          </div>

          {/* Viewer Controls */}
          {selectedDiagram !== 'pdf_viewer' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-secondary/70 rounded-lg p-0.5 border border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  className="h-7 w-7 rounded text-muted-foreground hover:text-foreground"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </Button>
                <span className="px-2 font-mono text-xs font-semibold text-muted-foreground select-none">
                  {zoomLevel}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  className="h-7 w-7 rounded text-muted-foreground hover:text-foreground"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomReset}
                  className="h-7 w-7 rounded text-muted-foreground hover:text-foreground ml-1"
                  title="Reset Zoom"
                >
                  <RotateCcw size={13} />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setFullscreenOpen(true)}
                className="h-8 text-xs gap-1.5 font-medium"
              >
                <Maximize2 size={13} />
                Fullscreen
              </Button>

              <a href={currentMeta.svgUrl} download={`${selectedDiagram}.svg`}>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-medium">
                  <Download size={13} />
                  SVG
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* Diagram Display Area */}
        <div className="relative w-full bg-slate-50/50 dark:bg-slate-950/50 p-6 min-h-[500px] flex items-center justify-center overflow-auto">
          {selectedDiagram === 'pdf_viewer' ? (
            <div className="w-full h-[750px] rounded-xl overflow-hidden border border-border shadow-inner bg-card flex flex-col">
              <div className="p-3 bg-secondary/50 border-b border-border flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-2">
                  <FileText size={14} className="text-primary" />
                  Embedded Document Preview: AI_Workforce_Management_Specification.pdf (11 Pages)
                </span>
                <div className="flex items-center gap-2">
                  <a href="/api/docs/pdf?download=true">
                    <Button size="sm" className="h-7 text-xs gap-1.5">
                      <Download size={12} />
                      Download Copy
                    </Button>
                  </a>
                  <a href="/api/docs/pdf" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                      <ExternalLink size={12} />
                      Open Full Tab
                    </Button>
                  </a>
                </div>
              </div>
              <iframe
                src="/api/docs/pdf"
                className="w-full h-full border-none"
                title="AI Workforce Management PDF Document"
              />
            </div>
          ) : (
            <div
              className="transition-transform duration-200 ease-out max-w-full rounded-xl shadow-lg border border-border/80 bg-white overflow-hidden"
              style={{ width: `${zoomLevel}%` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentMeta.svgUrl}
                alt={currentMeta.title}
                className="w-full h-auto block select-none"
                loading="eager"
              />
            </div>
          )}
        </div>

        {/* Technical Description & Key Concepts Drawer */}
        <div className="px-6 py-4 bg-card border-t border-border space-y-3">
          <div className="flex items-start gap-3">
            <Info size={16} className="text-primary mt-0.5 shrink-0" />
            <div className="space-y-2 flex-1">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentMeta.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {currentMeta.keyConcepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-secondary text-secondary-foreground border border-border/60"
                  >
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Fullscreen Modal Dialog */}
      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] flex flex-col p-4 bg-background border-border">
          <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${currentMeta.badgeColor}`}>
                {currentMeta.badge}
              </span>
              <DialogTitle className="text-base font-bold text-foreground">
                {currentMeta.title}
              </DialogTitle>
            </div>
            <a href={currentMeta.svgUrl} download={`${selectedDiagram}.svg`}>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-medium">
                <Download size={13} />
                Save Vector SVG
              </Button>
            </a>
          </DialogHeader>

          <div className="flex-1 w-full overflow-auto bg-slate-950/20 rounded-xl p-4 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentMeta.svgUrl}
              alt={currentMeta.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-border/80 bg-white"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
