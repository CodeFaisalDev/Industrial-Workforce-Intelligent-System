'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Terminal, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff, 
  ArrowLeft, ShieldCheck, Cpu, Sparkles, CheckCircle2,
  Users, Activity, UserCheck, ArrowRight, KeyRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

function LoginForm() {
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<'admin' | 'manager' | 'worker'>('admin');

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Read error parameter from URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'CredentialsSignIn') {
      setError('Invalid email or password. Please verify your credentials.');
    } else if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both work email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error === 'CredentialsSignIn' ? 'Invalid credentials provided' : result.error);
        setLoading(false);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError('An unexpected system error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleQuickRoleSelect = (role: 'admin' | 'manager' | 'worker') => {
    setActiveRole(role);
    setError('');
    if (role === 'admin') {
      setEmail('admin@industrialintel.com');
      setPassword('admin123');
    } else if (role === 'manager') {
      setEmail('manager@industrialintel.com');
      setPassword('manager123');
    } else {
      setEmail('worker@industrialintel.com');
      setPassword('worker123');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-mono">Verifying security session...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2.5 bg-destructive/10 border border-destructive/25 text-destructive text-xs font-semibold p-3.5 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Demo Access Role Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
            <Sparkles size={12} className="text-primary animate-pulse" />
            Quick Demo Persona
          </span>
          <span className="text-[9px] text-muted-foreground/70 font-mono">Click to autofill</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-secondary/30 border border-border/60 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => handleQuickRoleSelect('admin')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeRole === 'admin'
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <ShieldCheck size={14} className="mb-0.5" />
            <span className="text-[11px]">HR Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickRoleSelect('manager')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeRole === 'manager'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <Users size={14} className="mb-0.5" />
            <span className="text-[11px]">Manager</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickRoleSelect('worker')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeRole === 'worker'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <UserCheck size={14} className="mb-0.5" />
            <span className="text-[11px]">Worker</span>
          </button>
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-bold text-foreground/90">
            Corporate Work Email
          </Label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="admin@industrialintel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 text-xs h-10 bg-secondary/20 hover:bg-secondary/35 focus:bg-background border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-all rounded-xl"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-xs font-bold text-foreground/90">
              Account Password
            </Label>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 text-xs h-10 bg-secondary/20 hover:bg-secondary/35 focus:bg-background border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-all rounded-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full text-xs font-bold h-11 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all bg-gradient-to-r from-primary via-violet-600 to-primary text-primary-foreground group"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Authenticating Session...
          </>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Sign In to Workspace <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </Button>

      {/* Signup Redirection */}
      <div className="text-center text-xs text-muted-foreground pt-2">
        Need a workspace for your facility?{' '}
        <Link href="/signup" className="text-primary hover:underline font-bold transition-colors">
          Register New Company
        </Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground font-sans flex flex-col justify-between overflow-hidden selection:bg-primary/30">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_30px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all bg-secondary/40 hover:bg-secondary/80 border border-border/80 px-3.5 py-2 rounded-xl backdrop-blur-md"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-bold font-mono py-1 px-3 bg-primary/5 text-primary border-primary/20 flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-primary" />
            256-BIT ENCRYPTED PORTAL
          </Badge>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-center relative z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Showcase (Desktop) */}
          <div className="hidden lg:flex lg:col-span-7 flex-col space-y-8 pr-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono">
                <Cpu size={14} /> INDUSTRIAL WORKFORCE PLATFORM v2.0
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                Predictive AI Roster & Biometric Governance
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                Automated facial liveness check-ins, deterministic overtime calculation engines, and real-time fraud anomaly prevention for modern manufacturing facilities.
              </p>
            </div>

            {/* Feature Highlights Bento Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="glass-panel p-4 rounded-2xl border border-border/70 bg-card/40 backdrop-blur-md space-y-1.5 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <Activity size={16} /> 99.8% Biometric Match
                </div>
                <p className="text-[11px] text-muted-foreground">Cosine similarity facial embeddings with anti-photo liveness verification.</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-border/70 bg-card/40 backdrop-blur-md space-y-1.5 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                  <CheckCircle2 size={16} /> Deterministic Payroll
                </div>
                <p className="text-[11px] text-muted-foreground">Automatic 1.5x overtime multiplier computation & digital payslip ledgers.</p>
              </div>
            </div>

            {/* Quote Badge */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-secondary/30 border border-border/50 backdrop-blur-sm max-w-md">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <KeyRound size={16} />
              </div>
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Isolated Corporate Tenants:</strong> Role-based access control for HR Admins, Floor Supervisors, and Workers.
              </p>
            </div>
          </div>

          {/* Right Authentication Card */}
          <div className="w-full lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[440px] rounded-3xl border border-border/80 bg-card/50 backdrop-blur-xl p-7 md:p-9 shadow-2xl relative overflow-hidden group">
              
              {/* Card Header */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-violet-600 text-primary-foreground shadow-xl shadow-primary/30 mb-3.5 hover:scale-105 transition-transform">
                  <Terminal size={24} />
                </div>
                <h2 className="font-extrabold text-2xl tracking-tight">Portal Sign In</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your corporate credentials to access your industrial console
                </p>
              </div>

              {/* Login Form Suspense Wrapper */}
              <Suspense fallback={
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              }>
                <LoginForm />
              </Suspense>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-muted-foreground/70 font-mono relative z-20">
        &copy; {new Date().getFullYear()} Industrial Intel Inc. All rights reserved.
      </footer>
    </div>
  );
}
