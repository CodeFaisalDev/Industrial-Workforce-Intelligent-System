'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { DollarSign, Printer, Calculator, FileText, CheckCircle2, TrendingUp } from 'lucide-react';

interface PayrollProps {
  role: string;
}

export default function PayrollCenter({ role }: PayrollProps) {
  const [payrollList, setPayrollList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [computing, setComputing] = useState(false);

  // Period forms
  const [start, setStart] = useState('2026-06-01');
  const [end, setEnd] = useState('2026-06-30');

  // Selected payslip modal state
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      // Fetch payroll list
      let url = '/api/payroll';
      if (role === 'Worker') {
        // Find employee id for Faria Sultana (Worker) from seed employees
        // Since Faria is seeded, we can filter client-side or pass employee_id = 3
        url = '/api/payroll?employee_id=3'; // Hardcoded Faria Sultana ID for demo
      }
      const res = await fetch(url);
      const data = await res.json();
      setPayrollList(data.payroll || []);
    } catch (error) {
      console.error('Failed to load payroll records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [role]);

  const handleComputePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setComputing(true);
      const res = await fetch('/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period_start: start, period_end: end }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Payroll calculations completed for the period!');
        fetchPayroll();
      }
    } catch (error) {
      console.error('Failed to run payroll computations:', error);
    } finally {
      setComputing(false);
    }
  };

  const handleOpenPayslip = (record: any) => {
    setSelectedPayslip(record);
    setIsPayslipOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payroll Center</h2>
          <p className="text-muted-foreground text-sm">Review payroll ledgers, run billing calculations, and view digital payslips.</p>
        </div>
      </div>

      {/* Compute Payroll Control Form (HR Admin only) */}
      {role === 'HR Admin' && (
        <Card className="glass-panel border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calculator size={16} className="text-primary animate-pulse" />
              Compute Roster Payroll Period
            </CardTitle>
            <CardDescription className="text-xs">
              Runs the deterministic payroll calculation engine over employee check-in logs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleComputePayroll} className="flex flex-col sm:flex-row items-end gap-4">
              <div className="grid grid-cols-2 gap-4 flex-1 max-w-md">
                <div className="space-y-1">
                  <Label htmlFor="start" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Start Date</Label>
                  <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="text-xs h-9 bg-background/50" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="end" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">End Date</Label>
                  <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="text-xs h-9 bg-background/50" required />
                </div>
              </div>
              <Button type="submit" disabled={computing} className="text-xs font-semibold h-9 shrink-0 gap-1.5">
                <Calculator size={14} />
                {computing ? 'Calculating Ledgers...' : 'Calculate Payroll'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Ledger Table */}
      <Card className="glass-panel bg-card/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Payroll Register</CardTitle>
          <CardDescription className="text-xs">Calculated ledger entries of workforce compensation.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[180px]">Employee</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Period</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hours (OT)</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Net Pay</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    Loading payroll records...
                  </TableCell>
                </TableRow>
              ) : payrollList.length > 0 ? (
                payrollList.map((record) => (
                  <TableRow key={record.id} className="hover:bg-secondary/20">
                    <TableCell className="font-semibold py-4">
                      <div className="text-xs font-bold text-foreground">{record.employee_name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{record.employee_role}</div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {new Date(record.period_start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(record.period_end).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {record.regular_hours} hrs ({record.overtime_hours} OT)
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      ${record.net_pay.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenPayslip(record)}
                        className="text-xs font-semibold hover:bg-secondary rounded-lg gap-1"
                      >
                        <FileText size={12} />
                        Payslip
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    No payroll ledgers generated for this period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Digital Payslip Modal */}
      <Dialog open={isPayslipOpen} onOpenChange={setIsPayslipOpen}>
        <DialogContent className="sm:max-w-[480px]">
          {selectedPayslip && (
            <div className="space-y-6 pt-4 print:p-0">
              {/* Payslip Header */}
              <div className="border-b border-border pb-4 flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-primary">Industrial Intel Ltd.</h3>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Dacca Factory Floor Operations</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Payslip Ledger</span>
                  <p className="text-xs font-mono font-bold mt-1 text-foreground">#PAY-{selectedPayslip.id}-{new Date(selectedPayslip.period_start).getFullYear()}</p>
                </div>
              </div>

              {/* Worker Information */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground">Employee Name</span>
                  <p className="font-bold text-foreground mt-0.5">{selectedPayslip.employee_name}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground">Department</span>
                  <p className="font-semibold text-foreground mt-0.5">{selectedPayslip.department_name || 'Administration'}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground">Roster Role</span>
                  <p className="text-muted-foreground mt-0.5">{selectedPayslip.employee_role}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground">Pay Period</span>
                  <p className="text-muted-foreground font-mono mt-0.5">
                    {new Date(selectedPayslip.period_start).toLocaleDateString()} - {new Date(selectedPayslip.period_end).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Earnings & Deductions Breakdown */}
              <div className="border-t border-b border-border py-4 space-y-3 text-xs">
                <div className="flex justify-between items-center text-muted-foreground font-semibold">
                  <span>Description</span>
                  <span className="text-right">Amount</span>
                </div>
                
                {/* Regular Earnings */}
                <div className="flex justify-between items-center font-medium">
                  <span>Regular Hours ({selectedPayslip.regular_hours} hrs)</span>
                  <span className="font-mono">${(selectedPayslip.regular_hours * (selectedPayslip.employee_role === 'HR Admin' ? 30 : selectedPayslip.employee_role === 'Floor Manager' ? 25 : 15)).toFixed(2)}</span>
                </div>

                {/* Overtime Premium */}
                {selectedPayslip.overtime_hours > 0 && (
                  <div className="flex justify-between items-center font-medium">
                    <span>Overtime Premium ({selectedPayslip.overtime_hours} hrs @ 1.5x)</span>
                    <span className="font-mono text-emerald-500">+${(selectedPayslip.overtime_hours * (selectedPayslip.employee_role === 'HR Admin' ? 30 : selectedPayslip.employee_role === 'Floor Manager' ? 25 : 15) * 1.5).toFixed(2)}</span>
                  </div>
                )}

                {/* Gross Pay */}
                <div className="flex justify-between items-center font-bold border-t border-dashed border-border pt-2 text-foreground">
                  <span>Total Gross Earnings</span>
                  <span className="font-mono">${selectedPayslip.gross_pay.toFixed(2)}</span>
                </div>

                {/* Tax / Pension Deductions */}
                <div className="flex justify-between items-center font-medium text-destructive">
                  <span>Taxes & Pension Contributions (10%)</span>
                  <span className="font-mono">-${selectedPayslip.deductions.toFixed(2)}</span>
                </div>
              </div>

              {/* Net Payout Summary */}
              <div className="bg-secondary/40 p-4 rounded-xl border border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground">Net Payout Amount</p>
                    <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">Deposited via Direct Bank Transfer</p>
                  </div>
                </div>
                <span className="text-2xl font-bold font-mono text-foreground">${selectedPayslip.net_pay.toFixed(2)}</span>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-4 pt-2 print:hidden">
                <Button variant="outline" size="sm" onClick={handlePrint} className="flex-1 text-xs gap-1.5 font-semibold">
                  <Printer size={14} />
                  Print Payslip
                </Button>
                <Button size="sm" onClick={() => setIsPayslipOpen(false)} className="flex-1 text-xs font-semibold">
                  Close Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
