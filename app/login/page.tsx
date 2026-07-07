'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Terminal, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

function LoginForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect to home page
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Read error parameter from URL if redirected by NextAuth
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'CredentialsSignIn') {
      setError('Invalid email or password. Please try again.');
    } else if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
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
        setError(result.error === 'CredentialsSignIn' ? 'Invalid email or password' : result.error);
        setLoading(false);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold p-3 rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-foreground/80">
            Work Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@factory.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 text-xs h-9.5 bg-secondary/10 border-border/80 focus:bg-background/80 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/50 transition-all rounded-lg"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-xs font-semibold text-foreground/80">
              Password
            </Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 pr-10 text-xs h-9.5 bg-secondary/10 border-border/80 focus:bg-background/80 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/50 transition-all rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pb-8 px-6">
        <Button
          type="submit"
          className="w-full text-xs font-bold h-9.5 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all bg-primary text-primary-foreground"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Authenticating...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        <div className="text-center text-xs text-muted-foreground">
          New Company?{' '}
          <Link href="/signup" className="text-primary hover:underline font-semibold">
            Register your company
          </Link>
        </div>

        <div className="text-[10px] text-muted-foreground text-center font-sans mt-2 w-full border-t border-border/40 pt-4">
          <p className="font-semibold text-foreground/75 mb-2">Seeded Demo Access Profiles</p>
          <div className="grid grid-cols-1 gap-1.5 text-left text-foreground/80">
            <div className="bg-secondary/40 border border-border/30 hover:border-primary/20 hover:bg-secondary/60 p-2 rounded-lg transition-all flex justify-between items-center font-mono">
              <span className="font-semibold text-primary">HR Admin:</span>
              <span>admin@gmail.com / admin123</span>
            </div>
            <div className="bg-secondary/40 border border-border/30 hover:border-primary/20 hover:bg-secondary/60 p-2 rounded-lg transition-all flex justify-between items-center font-mono">
              <span className="font-semibold text-emerald-500 dark:text-emerald-400">Manager:</span>
              <span>manager@gmail.com / manager123</span>
            </div>
            <div className="bg-secondary/40 border border-border/30 hover:border-primary/20 hover:bg-secondary/60 p-2 rounded-lg transition-all flex justify-between items-center font-mono">
              <span className="font-semibold text-blue-500 dark:text-blue-400">Worker:</span>
              <span>worker@gmail.com / worker123</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </form>
  );
}

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden px-4">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
 
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors bg-secondary/30 hover:bg-secondary/70 border border-border px-3.5 py-2 rounded-lg">
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
 
      <Card className="w-full max-w-[420px] glass-panel bg-card/30 border-border/80 backdrop-blur-md shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="space-y-1 text-center pt-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Terminal size={24} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Industrial Intel</CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-mono">
            Workforce & Payroll Management Portal
          </CardDescription>
        </CardHeader>
 
        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}
