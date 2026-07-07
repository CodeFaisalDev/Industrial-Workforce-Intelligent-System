'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Terminal, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Signup() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!companyName.trim() || !adminName.trim() || !adminEmail.trim() || !adminPassword) {
      setError('All fields are required.');
      return;
    }

    if (adminPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          admin_name: adminName,
          admin_email: adminEmail,
          admin_password: adminPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to register company.');
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-background text-foreground font-sans px-4 overflow-hidden py-10">
      {/* Decorative glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[90px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors bg-secondary/30 hover:bg-secondary/70 border border-border px-3.5 py-2 rounded-lg">
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>

      {/* Main card */}
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card/45 backdrop-blur-md p-8 md:p-10 shadow-2xl relative">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/5 to-violet-500/5 opacity-50 -z-10" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-500 text-primary-foreground shadow-md shadow-primary/20 mb-3.5">
            <Terminal size={22} />
          </div>
          <h1 className="font-extrabold text-2xl tracking-tight">Register New Company</h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Deploy an isolated corporate workforce console with AI staffing forecasts and biometric audits.
          </p>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-6">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-md">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Company Registered!</h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Your workspace is ready. You can now log in using your manager/admin email and password.
              </p>
            </div>
            <Button onClick={() => router.push('/login')} className="w-full bg-gradient-to-r from-primary to-violet-600 hover:from-primary/95 hover:to-violet-600/95 py-5 text-sm font-semibold">
              Proceed to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs font-semibold rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-center">
                {error}
              </div>
            )}

            {/* Company Section */}
            <div className="space-y-1.5">
              <label htmlFor="companyName" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Manufacturing Ltd."
                className="w-full bg-secondary/30 hover:bg-secondary/50 focus:bg-background focus:ring-1 focus:ring-primary border border-border px-3.5 py-2.5 rounded-lg text-sm transition-all focus:outline-none placeholder:text-muted-foreground/60"
                required
              />
            </div>

            {/* Admin Section */}
            <div className="space-y-1.5">
              <label htmlFor="adminName" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                HR Admin Full Name
              </label>
              <input
                id="adminName"
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="(test name)"
                className="w-full bg-secondary/30 hover:bg-secondary/50 focus:bg-background focus:ring-1 focus:ring-primary border border-border px-3.5 py-2.5 rounded-lg text-sm transition-all focus:outline-none placeholder:text-muted-foreground/60"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="adminEmail" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                HR Admin Email
              </label>
              <input
                id="adminEmail"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="e.g. admin@company.com"
                className="w-full bg-secondary/30 hover:bg-secondary/50 focus:bg-background focus:ring-1 focus:ring-primary border border-border px-3.5 py-2.5 rounded-lg text-sm transition-all focus:outline-none placeholder:text-muted-foreground/60"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="adminPassword" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Admin Password
                </label>
                <input
                  id="adminPassword"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-secondary/30 hover:bg-secondary/50 focus:bg-background focus:ring-1 focus:ring-primary border border-border px-3.5 py-2.5 rounded-lg text-sm transition-all focus:outline-none placeholder:text-muted-foreground/60"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-secondary/30 hover:bg-secondary/50 focus:bg-background focus:ring-1 focus:ring-primary border border-border px-3.5 py-2.5 rounded-lg text-sm transition-all focus:outline-none placeholder:text-muted-foreground/60"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/95 hover:to-violet-600/95 py-5 text-sm font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Registering Workspace...
                </>
              ) : (
                'Create Company Profile'
              )}
            </Button>

            <div className="text-center text-xs text-muted-foreground mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
