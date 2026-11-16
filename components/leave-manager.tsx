'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar, FilePlus, CheckCircle2, XCircle, Clock, ShieldCheck, User, Umbrella } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface LeaveManagerProps {
  role: string;
  userId?: string;
  userName?: string;
}

export default function LeaveManager({ role, userId, userName }: LeaveManagerProps) {
  const { data: session } = useSession();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leave');
      const data = await res.json();
      setLeaves(data.leave_requests || []);
    } catch (error) {
      console.error('Failed to load leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          reason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsApplyOpen(false);
        setStartDate('');
        setEndDate('');
        setReason('');
        setLeaveType('Casual Leave');
        fetchLeaves();
      } else {
        alert(data.error || 'Failed to submit leave request.');
      }
    } catch (error) {
      console.error('Failed to submit leave request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (leaveId: number, status: 'Approved' | 'Rejected') => {
    try {
      const res = await fetch('/api/leave', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leave_id: leaveId, status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLeaves();
      }
    } catch (error) {
      console.error('Failed to update leave status:', error);
    }
  };

  // Quota statistics
  const approvedLeavesCount = leaves.filter(l => l.status === 'Approved').length;
  const pendingLeavesCount = leaves.filter(l => l.status === 'Pending').length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leave & Absence Management</h2>
          <p className="text-muted-foreground text-sm">Submit leave applications, track quota balances, and review manager approvals.</p>
        </div>

        {/* Apply for Leave Modal Button */}
        <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
          <DialogTrigger render={<Button size="sm" className="gap-2 text-xs font-semibold" />}>
            <FilePlus size={14} />
            File Leave Request
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold">New Leave Application</DialogTitle>
              <DialogDescription className="text-xs">
                Submit an official absence request for review by your manager.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleApplyLeave} className="space-y-4 pt-4">
              <div className="space-y-1">
                <Label htmlFor="leaveType" className="text-xs font-semibold">Leave Type</Label>
                <Select value={leaveType} onValueChange={(val) => { if (val) setLeaveType(val); }}>
                  <SelectTrigger id="leaveType" className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casual Leave" className="text-xs">Casual Leave</SelectItem>
                    <SelectItem value="Sick Leave" className="text-xs">Sick Leave</SelectItem>
                    <SelectItem value="Annual Paid Leave" className="text-xs">Annual Paid Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="startDate" className="text-xs font-semibold">Start Date</Label>
                  <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-xs" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="endDate" className="text-xs font-semibold">End Date</Label>
                  <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-xs" required />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="reason" className="text-xs font-semibold">Reason for Absence</Label>
                <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Provide context..." className="text-xs" required />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsApplyOpen(false)} className="text-xs">Cancel</Button>
                <Button type="submit" size="sm" disabled={submitting} className="text-xs font-semibold">
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leave Balance Quota Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-panel bg-card/40 border-l-2 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              Annual Paid Leave
              <Umbrella size={16} className="text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13 / 15 Days</div>
            <CardDescription className="text-[10px] mt-1 font-semibold text-emerald-500">
              13 Days Remaining in 2026
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="glass-panel bg-card/40 border-l-2 border-l-violet-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              Casual & Sick Quota
              <Clock size={16} className="text-violet-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 Days Left</div>
            <CardDescription className="text-[10px] mt-1 text-muted-foreground">
              Medical doc required if &gt; 2 days
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="glass-panel bg-card/40 border-l-2 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              Pending Approval
              <Calendar size={16} className="text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLeavesCount} Applications</div>
            <CardDescription className="text-[10px] mt-1 text-amber-500 font-semibold">
              Awaiting manager review
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests Table */}
      <Card className="glass-panel bg-card/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Leave Applications History</CardTitle>
          <CardDescription className="text-xs">Filed leave requests and approval audit logs.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[180px]">Employee</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Leave Type</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reason</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Loading leave requests...
                  </TableCell>
                </TableRow>
              ) : leaves.length > 0 ? (
                leaves.map((leave) => (
                  <TableRow key={leave.id} className="hover:bg-secondary/20">
                    <TableCell className="font-semibold py-4">
                      <div className="text-xs font-bold text-foreground">{leave.employee_name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{leave.employee_role}</div>
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      <Badge variant="outline" className="text-[9px] uppercase font-bold py-0">
                        {leave.leave_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {new Date((leave.start_date || '').split('T')[0] + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date((leave.end_date || '').split('T')[0] + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                      {leave.reason}
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge 
                        variant={leave.status === 'Approved' ? 'default' : leave.status === 'Rejected' ? 'destructive' : 'secondary'}
                        className="text-[9px] uppercase font-bold py-0"
                      >
                        {leave.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* HR Admin / Floor Manager Approval Action */}
                      {(role === 'HR Admin' || role === 'Floor Manager') && leave.status === 'Pending' ? (
                        <div className="flex justify-end gap-1.5">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(leave.id, 'Rejected')}
                            className="text-[10px] h-7 px-2 text-destructive border-destructive/20 hover:bg-destructive/10 font-semibold"
                          >
                            Reject
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateStatus(leave.id, 'Approved')}
                            className="text-[10px] h-7 px-2 font-semibold"
                          >
                            Approve
                          </Button>
                        </div>
                      ) : leave.status === 'Approved' ? (
                        <div className="flex items-center justify-end gap-1 text-emerald-500 font-semibold text-[10px]">
                          <CheckCircle2 size={14} /> Approved
                        </div>
                      ) : leave.status === 'Rejected' ? (
                        <div className="flex items-center justify-end gap-1 text-destructive font-semibold text-[10px]">
                          <XCircle size={14} /> Rejected
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-mono">Pending</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    No leave requests found in database.
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
