'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar, User, Clock, ShieldCheck, ArrowUpDown, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface SchedulerProps {
  role: string;
  userId?: string;
  userName?: string;
}

export default function ShiftScheduler({ role, userId, userName }: SchedulerProps) {
  const { data: session } = useSession();
  const [shifts, setShifts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Assignment form states
  const [empId, setEmpId] = useState('');
  const [date, setDate] = useState('');
  const [shiftTime, setShiftTime] = useState('Day'); // Day: 8am-4pm, Night: 8pm-4am
  const [status, setStatus] = useState('Scheduled');
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  // Swap requests state
  const [swaps, setSwaps] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch employees to assign
      const empRes = await fetch('/api/employees');
      const empData = await empRes.json();
      setEmployees(empData.employees || []);

      // Fetch shifts
      const shiftsRes = await fetch('/api/shifts');
      const shiftsData = await shiftsRes.json();
      setShifts(shiftsData.shifts || []);

      // Fetch swaps
      const swapsRes = await fetch('/api/shifts/swap');
      const swapsData = await swapsRes.json();
      setSwaps(swapsData.swaps || []);
    } catch (error) {
      console.error('Failed to load scheduler data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empId || !date) return;

    const start_time = shiftTime === 'Day' ? '08:00:00' : '20:00:00';
    const end_time = shiftTime === 'Day' ? '16:00:00' : '04:00:00';

    try {
      const res = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: parseInt(empId),
          date,
          start_time,
          end_time,
          status
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAssignOpen(false);
        setEmpId('');
        setDate('');
        setShiftTime('Day');
        setStatus('Scheduled');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to assign shift:', error);
    }
  };

  const handleApproveSwap = async (id: number) => {
    try {
      const res = await fetch('/api/shifts/swap', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          swap_id: id,
          status: 'Approved',
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to approve shift swap:', error);
    }
  };

  const handleRequestSwap = async (shiftDate: string, timeStr: string) => {
    if (!session?.user) return;
    const empIdVal = parseInt((session.user as any).id);
    const empNameVal = session.user.name || 'Worker';

    try {
      const res = await fetch('/api/shifts/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: empIdVal,
          employee_name: empNameVal,
          date: shiftDate,
          shift: timeStr === '08:00:00' || timeStr.startsWith('08') ? 'Day Shift' : 'Night Shift',
          reason: 'Shift adjustments',
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Shift swap request submitted to Floor Manager!');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to submit shift swap request:', error);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Shift Scheduler</h2>
          <p className="text-muted-foreground text-sm">Design weekly work schedules, assign standby cover, and request shift swaps.</p>
        </div>

        {/* Assign Shift Dialog (HR/Manager only) */}
        {(role === 'HR Admin' || role === 'Floor Manager') && (
          <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
            <DialogTrigger render={<Button size="sm" className="gap-2 text-xs font-semibold" />}>
              <Calendar size={14} />
              Assign Shift
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold">Assign Roster Shift</DialogTitle>
                <DialogDescription className="text-xs">
                  Create a new shift roster entry in the workforce calendar.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAssignShift} className="space-y-4 pt-4">
                <div className="space-y-1">
                  <Label htmlFor="emp" className="text-xs font-semibold">Employee</Label>
                  <Select value={empId} onValueChange={(val) => { if (val) setEmpId(val); }}>
                    <SelectTrigger id="emp" className="text-xs">
                      <SelectValue placeholder="Select worker" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id.toString()} className="text-xs">
                          {e.name} ({e.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="date" className="text-xs font-semibold">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    className="text-xs" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="time" className="text-xs font-semibold">Shift Timing</Label>
                    <Select value={shiftTime} onValueChange={(val) => { if (val) setShiftTime(val); }}>
                      <SelectTrigger id="time" className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Day" className="text-xs">Day (8 AM - 4 PM)</SelectItem>
                        <SelectItem value="Night" className="text-xs">Night (8 PM - 4 AM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="status" className="text-xs font-semibold">Status</Label>
                    <Select value={status} onValueChange={(val) => { if (val) setStatus(val); }}>
                      <SelectTrigger id="status" className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scheduled" className="text-xs">Scheduled</SelectItem>
                        <SelectItem value="Standby" className="text-xs">Standby</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsAssignOpen(false)} className="text-xs">Cancel</Button>
                  <Button type="submit" size="sm" className="text-xs">Assign Shift</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Roster Grid */}
      <Card className="glass-panel bg-card/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Roster Calendar</CardTitle>
          <CardDescription className="text-xs">Weekly scheduled shifts & covers.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[180px]">Date</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Employee</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Shift Time</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    Loading shift roster...
                  </TableCell>
                </TableRow>
              ) : shifts.length > 0 ? (
                shifts.map((shift) => (
                  <TableRow key={shift.id} className="hover:bg-secondary/20">
                    <TableCell className="text-xs font-mono font-semibold py-3.5">
                      {new Date(shift.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      {shift.employee_name}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge 
                        variant={shift.status === 'Completed' ? 'default' : shift.status === 'Absent' ? 'destructive' : 'secondary'}
                        className="text-[9px] uppercase font-bold py-0"
                      >
                        {shift.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Worker shift swap request button */}
                      {role === 'Worker' && shift.employee_name === session?.user?.name && shift.status === 'Scheduled' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRequestSwap(new Date(shift.date).toLocaleDateString(), shift.start_time)}
                          className="text-[10px] font-bold h-7 px-2 hover:bg-primary/10 hover:text-primary rounded-md"
                        >
                          Request Swap
                        </Button>
                      )}
                      
                      {/* Standby toggle if HR/Manager */}
                      {(role === 'HR Admin' || role === 'Floor Manager') && shift.status === 'Standby' && (
                        <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] py-0.5">
                          Standby Active
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    No active shifts scheduled.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Shift Swap Requests Panel (HR/Manager only) */}
      {(role === 'HR Admin' || role === 'Floor Manager') && (
        <Card className="glass-panel bg-card/30">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ArrowUpDown size={16} className="text-primary" />
              Roster Shift Swap Proposals
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Verify and authorize employee shift cover requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {swaps.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 border border-border/50 rounded-xl bg-secondary/10 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{s.employee_name}</span>
                    <Badge variant="outline" className="text-[9px] py-0 font-bold uppercase">{s.status}</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Wants to swap shift on <span className="font-semibold">{s.date} ({s.shift})</span> due to: "{s.reason}"
                  </p>
                </div>
                {s.status === 'Pending' ? (
                  <Button 
                    size="sm" 
                    onClick={() => handleApproveSwap(s.id)}
                    className="text-[10px] h-7 px-3 font-semibold"
                  >
                    Authorize Swap
                  </Button>
                ) : (
                  <div className="flex items-center gap-1 text-emerald-500 font-semibold text-[10px]">
                    <ShieldCheck size={14} />
                    Authorized
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
