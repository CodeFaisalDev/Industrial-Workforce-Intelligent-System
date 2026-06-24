'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { ShieldAlert, ShieldCheck, Check, X, ShieldX, BrainCircuit, RefreshCw } from 'lucide-react';

export default function FraudQueue() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [digest, setDigest] = useState('');

  const fetchFlags = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fraud');
      const data = await res.json();
      setFlags(data.flags || []);

      // Pull latest AI digest from any flagged items that contain it
      const latestAiFlag = data.flags?.find((f: any) => f.ai_digest_text);
      if (latestAiFlag) {
        setDigest(latestAiFlag.ai_digest_text);
      }
    } catch (error) {
      console.error('Failed to load fraud flags:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleResolveFlag = async (flagId: number, status: 'Confirmed' | 'Dismissed') => {
    try {
      const res = await fetch('/api/fraud', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag_id: flagId, status, resolved_by: 1 }), // Resolved by KA (HR)
      });
      const data = await res.json();
      if (data.success) {
        fetchFlags();
      }
    } catch (error) {
      console.error('Failed to update fraud flag status:', error);
    }
  };

  const handleRunScanner = async () => {
    try {
      setScanning(true);
      const res = await fetch('/api/fraud', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        alert(`Audit scan completed! Raised ${data.flags_raised} new flags.`);
        if (data.ai_digest) {
          setDigest(data.ai_digest);
        }
        fetchFlags();
      }
    } catch (error) {
      console.error('Failed to execute fraud audit scan:', error);
    } finally {
      setScanning(false);
    }
  };

  const getFlagBadge = (type: string) => {
    if (type === 'geofence') return <Badge variant="destructive" className="text-[9px] uppercase font-bold py-0.5">Geofence</Badge>;
    if (type === 'overtime_outlier') return <Badge className="bg-amber-500 hover:bg-amber-500/85 text-background text-[9px] uppercase font-bold py-0.5">Overtime Outlier</Badge>;
    return <Badge className="bg-purple-500 hover:bg-purple-500/85 text-background text-[9px] uppercase font-bold py-0.5">Buddy Punch</Badge>;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fraud Queue</h2>
          <p className="text-muted-foreground text-sm">Monitor geo-boundary parameters, overtime outliers, and buddy-punching alerts.</p>
        </div>
        <Button size="sm" onClick={handleRunScanner} disabled={scanning} className="gap-2 text-xs font-semibold">
          <RefreshCw size={14} className={scanning ? 'animate-spin' : ''} />
          {scanning ? 'Running Audit Scan...' : 'Run Audit Scan'}
        </Button>
      </div>

      {/* AI Digest Card */}
      {digest && (
        <Card className="glass-panel border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-destructive">
              <BrainCircuit size={16} className="animate-pulse" />
              Weekly Anomaly Audit Digest
            </CardTitle>
            <CardDescription className="text-xs">
              AI Analyst summary of active geofence and overtime flags.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              "{digest}"
            </p>
          </CardContent>
        </Card>
      )}

      {/* Flag Table */}
      <Card className="glass-panel bg-card/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Flagged Anomalies</CardTitle>
          <CardDescription className="text-xs">Triage queue of system alerts requiring HR review.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[180px]">Employee</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[130px]">Flag Type</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Anomaly Details</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[120px]">Status</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right w-[140px]">Resolve</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    Loading fraud registry...
                  </TableCell>
                </TableRow>
              ) : flags.length > 0 ? (
                flags.map((flag) => (
                  <TableRow key={flag.id} className="hover:bg-secondary/20">
                    <TableCell className="font-semibold py-4">
                      <div className="text-xs font-bold text-foreground">{flag.employee_name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{flag.employee_role}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      {getFlagBadge(flag.flag_type)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {flag.details}
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge 
                        variant={flag.status === 'Pending' ? 'secondary' : flag.status === 'Confirmed' ? 'default' : 'outline'}
                        className="text-[9px] uppercase font-bold py-0"
                      >
                        {flag.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      {flag.status === 'Pending' ? (
                        <div className="flex justify-end gap-1.5">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleResolveFlag(flag.id, 'Dismissed')}
                            className="h-7 w-7 text-muted-foreground hover:bg-secondary rounded-md"
                            title="Dismiss Alert"
                          >
                            <X size={12} />
                          </Button>
                          <Button 
                            size="icon" 
                            onClick={() => handleResolveFlag(flag.id, 'Confirmed')}
                            className="h-7 w-7 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md"
                            title="Confirm Anomaly"
                          >
                            <Check size={12} />
                          </Button>
                        </div>
                      ) : flag.status === 'Confirmed' ? (
                        <div className="flex items-center justify-end gap-1 text-destructive font-semibold text-[10px]">
                          <ShieldX size={14} />
                          Confirmed
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1 text-muted-foreground text-[10px]">
                          <ShieldCheck size={14} />
                          Dismissed
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    No active anomalies detected. Roster attendance metrics are fully clean.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
