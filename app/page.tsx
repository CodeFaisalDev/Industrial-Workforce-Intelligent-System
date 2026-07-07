'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import DashboardOverview from '@/components/dashboard-overview';
import KioskMode from '@/components/kiosk-mode';
import EmployeeDirectory from '@/components/employee-directory';
import ShiftScheduler from '@/components/shift-scheduler';
import PayrollCenter from '@/components/payroll-center';
import FraudQueue from '@/components/fraud-queue';
import ChatbotDrawer from '@/components/chatbot-drawer';
import { Sheet } from '@/components/ui/sheet';
import { 
  Loader2, Terminal, ArrowRight, ShieldCheck, Cpu, 
  Users, CheckCircle2, ChevronRight, BarChart3, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('overview');
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // --- 1. LANDING PAGE FOR UNAUTHENTICATED VISITORS ---
  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-foreground overflow-x-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />

        {/* Navigation Navbar */}
        <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-lg border-b border-border transition-all">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-500 text-primary-foreground shadow-lg shadow-primary/25">
                <Terminal size={20} />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                Industrial Intel
              </span>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#solutions" className="hover:text-foreground transition-colors">Solutions</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="font-semibold text-sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/95 hover:to-violet-600/95 font-semibold text-sm shadow-md shadow-primary/15 transition-all duration-300">
                  Register Company
                </Button>
              </Link>
            </div>

            {/* Mobile Nav Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-background border-b border-border py-6 px-6 space-y-4 flex flex-col animate-in slide-in-from-top duration-200">
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground py-2"
              >
                Features
              </a>
              <a 
                href="#solutions" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground py-2"
              >
                Solutions
              </a>
              <a 
                href="#pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground py-2"
              >
                Pricing
              </a>
              <hr className="border-border my-2" />
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center bg-gradient-to-r from-primary to-violet-600">
                  Register Company
                </Button>
              </Link>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-28 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary mb-6 animate-pulse">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Empowering Modern Industrial Multi-Tenant Workspaces
          </div>

          <h1 className="max-w-4xl mx-auto text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
            AI-Powered Intelligence for the{" "}
            <span className="bg-gradient-to-r from-primary via-violet-500 to-indigo-500 bg-clip-text text-transparent">
              Factory Floor
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed mb-12">
            Secure biometric face scans, geofence validations, predictive staffing forecasts, automated payroll generation, and forensic audit flags in one collaborative SaaS console.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm sm:max-w-md mx-auto mb-16">
            <Link href="/signup" className="w-full">
              <Button size="lg" className="w-full bg-gradient-to-r from-primary to-violet-600 hover:scale-[1.02] shadow-lg shadow-primary/20 transition-all py-6 text-base font-semibold">
                Get Started Free <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button size="lg" variant="outline" className="w-full py-6 text-base font-semibold hover:bg-secondary/40">
                Launch Console
              </Button>
            </Link>
          </div>

          {/* Interactive UI Mockup */}
          <div className="relative max-w-5xl mx-auto rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-3 shadow-2xl shadow-primary/5 group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/10 to-violet-500/10 opacity-50 blur-lg -z-10 group-hover:opacity-75 transition-opacity" />
            <div className="rounded-xl overflow-hidden border border-border bg-background shadow-inner aspect-[16/10] flex items-center justify-center">
              <div className="text-center p-8 space-y-4">
                <Terminal className="h-16 w-16 mx-auto text-primary animate-bounce" />
                <h3 className="text-lg font-bold">Launch FariaOS Demo Sandbox</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Click below to log in immediately with pre-configured credentials to view departments, forecast metrics, shifts, and biometric audit tools.
                </p>
                <Link href="/login">
                  <Button size="sm" variant="secondary" className="font-semibold text-xs gap-1.5">
                    Sign In with Seed Account <ChevronRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Bento Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-border/60 relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Designed for Industrial Enterprise
            </h2>
            <p className="text-muted-foreground text-lg">
              Unlock security, accuracy, and efficiency across your shift operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bento Card 1 */}
            <div className="md:col-span-2 rounded-2xl border border-border bg-card/30 p-8 flex flex-col justify-between hover:border-primary/45 transition-colors">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Biometric Geofence Verification</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                  Stop buddy punching entirely. Our gate kiosk utilizes pgvector-based facial distance matches to compare scans against active templates, coupled with precision GPS range checks.
                </p>
              </div>
              <div className="mt-8 h-24 bg-gradient-to-r from-primary/5 to-violet-500/10 rounded-xl border border-dashed border-border/60 flex items-center justify-center text-xs font-mono text-muted-foreground">
                Euclidean L2 vector distance verification threshold: 0.05
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="rounded-2xl border border-border bg-card/30 p-8 flex flex-col justify-between hover:border-primary/45 transition-colors">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                  <Cpu size={24} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">AI Shift Forecast</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Predict shift absences and headcount gaps using historical performance statistics, optimized with LLM operational briefs.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full font-semibold">94% Accuracy</span>
                <span className="text-xs text-muted-foreground">Confidence Intervals</span>
              </div>
            </div>

            {/* Bento Card 3 */}
            <div className="rounded-2xl border border-border bg-card/30 p-8 flex flex-col justify-between hover:border-primary/45 transition-colors">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Forensic Auditing</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Real-time anomaly scanner evaluates z-score overtime outliers, double punches, and GPS offsets, generating automated alerts in the Fraud Queue.
                </p>
              </div>
              <div className="mt-8 h-12 flex items-center justify-between border-t border-border pt-4 text-xs font-semibold text-muted-foreground">
                <span>Anomaly Detection Engine</span>
                <span className="text-primary font-mono font-bold">Active</span>
              </div>
            </div>

            {/* Bento Card 4 */}
            <div className="md:col-span-2 rounded-2xl border border-border bg-card/30 p-8 flex flex-col justify-between hover:border-primary/45 transition-colors">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users size={24} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Dedicated Company Admins</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                  Each company gets its own dashboard, workspace parameters, and isolated worker rosters. Admins add and verify workers to grant console and kiosk clock-in permissions.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary" /> Multi-Tenant Isolation
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary" /> Role-Based Access
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 border-t border-border/60">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Flexible SaaS Pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              Start with a free trial and scale as your factory floor expands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Tier 1 */}
            <div className="rounded-2xl border border-border bg-card/40 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">Starter</h3>
                <p className="text-sm text-muted-foreground mb-6">Perfect for small teams & testing.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="text-muted-foreground text-sm">/ month</span>
                </div>
                <ul className="space-y-4 text-sm font-semibold mb-8 text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-primary" /> 1 HR Admin Account
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-primary" /> Up to 10 Workers
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-primary" /> Core Biometric Kiosk
                  </li>
                </ul>
              </div>
              <Link href="/signup">
                <Button variant="outline" className="w-full">Register Company</Button>
              </Link>
            </div>

            {/* Tier 2 (Featured) */}
            <div className="rounded-2xl border-2 border-primary bg-card/65 p-8 flex flex-col justify-between relative shadow-xl shadow-primary/5">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Growth</h3>
                <p className="text-sm text-muted-foreground mb-6">Complete shift planning & fraud queue.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold">$49</span>
                  <span className="text-muted-foreground text-sm">/ month</span>
                </div>
                <ul className="space-y-4 text-sm font-semibold mb-8 text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-primary" /> 3 Managers / Admins
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-primary" /> Up to 50 Workers
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-primary" /> AI Staffing Forecasts
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-primary" /> Forensic Fraud Logs
                  </li>
                </ul>
              </div>
              <Link href="/signup">
                <Button className="w-full bg-gradient-to-r from-primary to-violet-600 hover:scale-[1.01] transition-transform">
                  Start 14-Day Free Trial
                </Button>
              </Link>
            </div>

            {/* Tier 3 */}
            <div className="rounded-2xl border border-border bg-card/40 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">Enterprise</h3>
                <p className="text-sm text-muted-foreground mb-6">Unlimited scale and customized policy RAG.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold">Custom</span>
                </div>
                <ul className="space-y-4 text-sm font-semibold mb-8 text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-primary" /> Unlimited Managers & Workers
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-primary" /> Custom AI RAG Document indexing
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-primary" /> Dedicated Database Isolation
                  </li>
                </ul>
              </div>
              <Link href="/signup">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/60 py-12 bg-card/10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Terminal size={16} />
              </div>
              <span className="font-extrabold text-foreground tracking-tight">Industrial Intel</span>
            </div>
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} Industrial Intel Inc. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // --- 2. AUTHENTICATED CONSOLE WORKSPACE ---
  const role = (session?.user as any)?.role || 'Worker';
  const userId = (session?.user as any)?.id;
  const userName = session?.user?.name || 'Worker';

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'overview':
        return <DashboardOverview role={role} />;
      case 'kiosk':
        return <KioskMode role={role} userId={userId} userName={userName} />;
      case 'employees':
        return <EmployeeDirectory role={role} userId={userId} />;
      case 'scheduler':
        return <ShiftScheduler role={role} userId={userId} userName={userName} />;
      case 'payroll':
        return <PayrollCenter role={role} userId={userId} userName={userName} />;
      case 'fraud':
        return <FraudQueue />;
      default:
        return <DashboardOverview role={role} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <DashboardLayout
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        role={role}
        onOpenChat={() => setChatOpen(true)}
      >
        {renderActiveTab()}
      </DashboardLayout>

      {/* Floating Global Chatbot Sheet */}
      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <ChatbotDrawer role={role} />
      </Sheet>
    </div>
  );
}
