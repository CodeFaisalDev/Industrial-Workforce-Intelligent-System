'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Users, CheckCircle2, ShieldAlert, BadgeInfo,
  TrendingUp, CalendarDays, BrainCircuit, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

interface OverviewProps {
  role: string;
}

export default function DashboardOverview({ role }: OverviewProps) {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    activeCount: 0,
    totalScheduled: 0,
    completedShifts: 0,
    fraudFlagsCount: 0,
  });
  const [forecast, setForecast] = useState<any>(null);
  const [flags, setFlags] = useState<any[]>([]);
  const [generatingForecast, setGeneratingForecast] = useState(false);

  // Fetch metrics and forecasts
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch attendance logs
      const attRes = await fetch('/api/attendance');
      const attData = await attRes.json();
      const logs = attData.logs || [];

      // Fetch today's shifts
      const todayStr = new Date().toISOString().split('T')[0];
      const shiftsRes = await fetch(`/api/forecast?date=${todayStr}`);
      const shiftsData = await shiftsRes.json();
      const todayForecasts = shiftsData.forecasts || [];

      // Fetch tomorrow's forecast
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const foreRes = await fetch(`/api/forecast?date=${tomorrow}`);
      const foreData = await foreRes.json();
      const tomorrowForecast = foreData.forecasts?.[0] || null;

      // Fetch fraud flags
      const fraudRes = await fetch('/api/fraud');
      const fraudData = await fraudRes.json();
      const fraudFlags = fraudData.flags || [];

      // Process today's statistics
      const uniqueActive = new Set(logs.filter((l: any) => l.log_type === 'Check_In').map((l: any) => l.employee_id));
      const completed = logs.filter((l: any) => l.log_type === 'Check_Out').length;

      setMetrics({
        activeCount: uniqueActive.size,
        totalScheduled: 4, // Default mock base schedule
        completedShifts: completed,
        fraudFlagsCount: fraudFlags.filter((f: any) => f.status === 'Pending').length,
      });

      setForecast(tomorrowForecast);
      setFlags(fraudFlags.slice(0, 3)); // show top 3 latest flags
    } catch (error) {
      console.error('Error fetching dashboard overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateForecast = async () => {
    try {
      setGeneratingForecast(true);
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const res = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: tomorrow }),
      });
      const data = await res.json();
      if (data.success) {
        setForecast(data.forecasts?.[0] || null);
      }
    } catch (error) {
      console.error('Failed to trigger forecast generation:', error);
    } finally {
      setGeneratingForecast(false);
    }
  };

  // Mock chart data representing recent shift trends
  const chartData = [
    { name: 'Mon', Scheduled: 4, Attended: 4 },
    { name: 'Tue', Scheduled: 4, Attended: 3 },
    { name: 'Wed', Scheduled: 5, Attended: 4 },
    { name: 'Thu', Scheduled: 4, Attended: 4 },
    { name: 'Fri', Scheduled: 4, Attended: 4 },
    { name: 'Sat', Scheduled: 3, Attended: 3 },
    { name: 'Sun', Scheduled: 2, Attended: 2 },
  ];

  const payPeriodTrends = [
    { name: 'Period 1', GrossPay: 600, OvertimePay: 90 },
    { name: 'Period 2', GrossPay: 630, OvertimePay: 120 },
    { name: 'Period 3', GrossPay: 580, OvertimePay: 45 },
    { name: 'Period 4', GrossPay: 690, OvertimePay: 180 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Overview</h2>
          <p className="text-muted-foreground text-sm">Real-time attendance intelligence, forecasts, and payroll metrics.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="gap-2 text-xs">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Sync Live Data
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Active Staff */}
        <Card className="glass-panel relative overflow-hidden bg-card/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Headcount</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeCount} Workers</div>
            <CardDescription className="text-[10px] mt-1 font-medium text-emerald-500">
              Clocked in & active on the floor
            </CardDescription>
          </CardContent>
        </Card>

        {/* Completed Shifts */}
        <Card className="glass-panel relative overflow-hidden bg-card/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today's Completions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedShifts} Shifts</div>
            <CardDescription className="text-[10px] mt-1 text-muted-foreground">
              Fully verified check-out logs
            </CardDescription>
          </CardContent>
        </Card>

        {/* Fraud flags */}
        <Card className={`glass-panel relative overflow-hidden bg-card/40 border-l-2 ${metrics.fraudFlagsCount > 0 ? 'border-l-destructive' : 'border-l-primary'}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unresolved Flags</CardTitle>
            <ShieldAlert className={`h-4 w-4 ${metrics.fraudFlagsCount > 0 ? 'text-destructive animate-bounce' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.fraudFlagsCount} Anomalies</div>
            <CardDescription className="text-[10px] mt-1 text-muted-foreground">
              Geofence, overtime, and face checks
            </CardDescription>
          </CardContent>
        </Card>

        {/* Current Payroll State */}
        <Card className="glass-panel relative overflow-hidden bg-card/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payroll Status</CardTitle>
            <CalendarDays className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">June Cycle</div>
            <CardDescription className="text-[10px] mt-1 font-semibold text-violet-500">
              Draft ledger computed
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* AI Staffing Briefing Banner */}
      <div className="rounded-xl overflow-hidden glass-panel border border-primary/20 bg-primary/5 p-6 flex flex-col md:flex-row items-start md:items-center gap-5 justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary mt-1 md:mt-0 shrink-0">
            <BrainCircuit size={22} className="animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold tracking-tight">Tomorrow's AI Predictive Staffing Forecast</h3>
            {forecast ? (
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">
                  {forecast.department_name}: Predicted {forecast.predicted_headcount} active workers (Confidence: {forecast.confidence_band}).
                </span>{' '}
                {forecast.ai_briefing_text}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                No forecasting briefing generated for tomorrow yet. Click "Generate Forecast" to execute the operational analysis.
              </p>
            )}
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGenerateForecast}
          disabled={generatingForecast}
          className="text-xs font-semibold border-primary/20 hover:bg-primary/10 shrink-0"
        >
          {generatingForecast ? 'Analyzing...' : 'Generate Forecast'}
        </Button>
      </div>

      {/* Charts section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Attendance Rates Area Chart */}
        <Card className="glass-panel bg-card/30">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Weekly Attendance Trends
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Scheduled vs completed shift headcounts.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSched" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--border)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--border)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(from var(--border) r g b / 0.3)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  labelStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="Scheduled" stroke="var(--muted-foreground)" fillOpacity={1} fill="url(#colorSched)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="Attended" stroke="var(--primary)" fillOpacity={1} fill="url(#colorAtt)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Overtime & Gross Pay Bar Chart */}
        <Card className="glass-panel bg-card/30">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CalendarDays size={16} className="text-primary" />
              Payroll Period Costs
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Base Gross Pay vs Overtime expenditure.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payPeriodTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(from var(--border) r g b / 0.3)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  labelStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
                <Bar dataKey="GrossPay" name="Base Gross Pay ($)" fill="oklch(from var(--primary) r g b / 0.4)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="OvertimePay" name="Overtime Spend ($)" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Latest Anomalies Log Feed */}
      {role === 'HR Admin' && (
        <Card className="glass-panel bg-card/30">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ShieldAlert size={16} className="text-destructive" />
              Active Operational Anomalies
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Real-time issues flagged by the fraud detection module.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {flags.length > 0 ? (
              <div className="space-y-4">
                {flags.map((flag) => (
                  <div key={flag.id} className="flex items-start gap-4 p-3 rounded-lg bg-secondary/20 border border-border/50 text-xs">
                    <div className="p-1.5 rounded bg-destructive/10 text-destructive mt-0.5">
                      <ShieldAlert size={14} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{flag.employee_name} ({flag.employee_role})</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(flag.raised_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-muted-foreground">{flag.details}</p>
                      <span className="inline-block mt-1 font-semibold uppercase tracking-wider text-[9px] text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                        {flag.flag_type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-muted-foreground">
                <CheckCircle2 className="text-emerald-500 mb-2" size={24} />
                No anomalies flagged. Everything running within threshold parameters!
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
