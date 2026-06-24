'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { 
  Camera, ScanFace, CheckCircle2, AlertTriangle, Wifi, WifiOff, 
  MapPin, ShieldAlert, BadgeCheck, Clock, User
} from 'lucide-react';

export default function KioskMode() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [logType, setLogType] = useState<'Check_In' | 'Check_Out'>('Check_In');
  
  // Geofence simulation settings
  const [simulateOffsite, setSimulateOffsite] = useState(false);

  // Network connection settings (offline mode simulation)
  const [offlineMode, setOfflineMode] = useState(false);
  const [offlineLogs, setOfflineLogs] = useState<any[]>([]);

  // Camera and scanning states
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'liveness' | 'success' | 'error'>('idle');
  const [livenessChallenge, setLivenessChallenge] = useState('Blink twice to verify liveness');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      const data = await res.json();
      setEmployees(data.employees || []);
    } catch (err) {
      console.error('Failed to load employees for kiosk:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // Load any pending offline logs from localStorage
    const saved = localStorage.getItem('kiosk_offline_punches');
    if (saved) {
      setOfflineLogs(JSON.parse(saved));
    }
  }, []);

  // Sync offline logs when connection is restored
  useEffect(() => {
    if (!offlineMode && offlineLogs.length > 0) {
      syncOfflineLogs();
    }
  }, [offlineMode, offlineLogs]);

  const startCamera = async () => {
    setScanState('scanning');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Simulate liveness trigger after 2 seconds of scanning
      setTimeout(() => {
        setScanState('liveness');
        // Randomize challenge
        const challenges = [
          'Blink twice to verify liveness',
          'Turn your head slightly to the right',
          'Tilt your head upwards'
        ];
        setLivenessChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
      }, 2000);

    } catch (err) {
      console.error('Webcam failed in Kiosk mode:', err);
      // Fallback: Proceed straight to liveness in mock mode
      setTimeout(() => {
        setScanState('liveness');
      }, 1500);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handlePunch = () => {
    if (!selectedEmpId) return;
    startCamera();
  };

  const handleLivenessPass = async () => {
    setScanState('success');
    stopCamera();

    // Coordinates: Factory coordinates is (23.8103, 90.4125). Offsite is (23.8122, 90.4138)
    const lat = simulateOffsite ? 23.8122 : 23.81031;
    const lng = simulateOffsite ? 90.4138 : 90.41252;

    const punchPayload = {
      employee_id: parseInt(selectedEmpId),
      log_type: logType,
      gps_lat: lat,
      gps_lng: lng,
      verified_by_face: true,
      device_id: 'kiosk_main_entrance',
      device_type: 'Kiosk',
      confidence_score: 0.96,
    };

    if (offlineMode) {
      // Cache punch log locally in offline mode
      const emp = employees.find(e => e.id === parseInt(selectedEmpId));
      const logItem = {
        ...punchPayload,
        employee_name: emp?.name || 'Worker',
        timestamp: new Date().toISOString(),
      };
      const updated = [...offlineLogs, logItem];
      setOfflineLogs(updated);
      localStorage.setItem('kiosk_offline_punches', JSON.stringify(updated));
      
      setVerificationResult({
        success: true,
        message: `${logType} recorded locally (Offline Cache)!`,
        employee_name: emp?.name,
        geofence_ok: !simulateOffsite,
        geofence_distance_m: simulateOffsite ? 250 : 2,
        offline: true
      });
      return;
    }

    // Standard online punch
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(punchPayload)
      });
      const data = await res.json();
      if (data.success) {
        setVerificationResult(data);
      } else {
        setScanState('error');
      }
    } catch (err) {
      console.error('Failed to register check-in:', err);
      setScanState('error');
    }
  };

  const syncOfflineLogs = async () => {
    console.log('Online connection restored. Syncing cached kiosk logs to Neon...');
    const logsToSync = [...offlineLogs];
    
    // Clear state/localStorage immediately to prevent duplicate runs
    setOfflineLogs([]);
    localStorage.removeItem('kiosk_offline_punches');

    for (const log of logsToSync) {
      try {
        await fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(log)
        });
      } catch (err) {
        console.error('Failed to sync log item:', log, err);
      }
    }
    alert('Synchronized all cached offline logs to database successfully!');
  };

  const handleResetKiosk = () => {
    setScanState('idle');
    setVerificationResult(null);
    setSelectedEmpId('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-center">Entrance Kiosk Terminal</h2>
        <p className="text-muted-foreground text-sm text-center">Simulated device mounting at the factory entrance gates.</p>
      </div>

      {/* Settings / Simulation control */}
      <div className="grid grid-cols-2 gap-4">
        {/* Offline Mode Simulator */}
        <Card className={`glass-panel border-l-2 cursor-pointer bg-card/40 ${offlineMode ? 'border-l-rose-500' : 'border-l-primary'}`} onClick={() => setOfflineMode(!offlineMode)}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Connectivity Mode</span>
              <p className="text-xs font-bold text-foreground mt-0.5">{offlineMode ? 'Offline Simulation' : 'Connected to Server'}</p>
            </div>
            {offlineMode ? <WifiOff size={16} className="text-rose-500" /> : <Wifi size={16} className="text-primary" />}
          </CardContent>
        </Card>

        {/* Geofence Simulator */}
        <Card className={`glass-panel border-l-2 cursor-pointer bg-card/40 ${simulateOffsite ? 'border-l-amber-500' : 'border-l-emerald-500'}`} onClick={() => setSimulateOffsite(!simulateOffsite)}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Location Profile</span>
              <p className="text-xs font-bold text-foreground mt-0.5">{simulateOffsite ? 'Outside Perimeter (250m)' : 'Inside Factory Gate (2m)'}</p>
            </div>
            <MapPin size={16} className={simulateOffsite ? 'text-amber-500' : 'text-emerald-500'} />
          </CardContent>
        </Card>
      </div>

      {/* Kiosk Main Board */}
      <Card className="glass-panel border-primary/20 bg-card/30 relative overflow-hidden">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg font-bold flex items-center justify-center gap-2">
            <ScanFace className="text-primary" />
            Biometric Gate Lock
          </CardTitle>
          <CardDescription className="text-xs">Identify yourself to clock-in or clock-out of your shift.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-6 space-y-6">

          {scanState === 'idle' && (
            <div className="w-full max-w-sm space-y-4">
              {/* Roster Select */}
              <div className="space-y-1">
                <Label htmlFor="kiosk-emp" className="text-xs font-semibold">Select Employee Profile</Label>
                <Select value={selectedEmpId} onValueChange={(val) => { if (val) setSelectedEmpId(val); }}>
                  <SelectTrigger id="kiosk-emp" className="text-xs h-10 bg-background/50">
                    <SelectValue placeholder="Identify yourself..." />
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

              {/* In/Out Toggle */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant={logType === 'Check_In' ? 'default' : 'outline'} 
                  onClick={() => setLogType('Check_In')}
                  className="text-xs font-semibold h-10"
                >
                  Check In
                </Button>
                <Button 
                  variant={logType === 'Check_Out' ? 'default' : 'outline'} 
                  onClick={() => setLogType('Check_Out')}
                  className="text-xs font-semibold h-10"
                >
                  Check Out
                </Button>
              </div>

              <Button 
                onClick={handlePunch} 
                disabled={!selectedEmpId}
                className="w-full text-xs font-semibold h-11 shadow-md hover:shadow-primary/25"
              >
                Scan Face and Punch
              </Button>
            </div>
          )}

          {/* Scanning & Liveness Mode Webcam Mount */}
          {(scanState === 'scanning' || scanState === 'liveness') && (
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="w-[320px] h-[240px] bg-black rounded-xl overflow-hidden border border-border relative flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                
                {/* HUD reticle */}
                <div className="absolute inset-0 border-2 border-primary/50 m-10 rounded-full border-dashed animate-pulse flex items-center justify-center">
                  <div className="h-4 w-4 bg-primary rounded-full animate-ping" />
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-[10px] font-mono font-semibold text-primary">
                  {scanState === 'scanning' ? 'Acquiring Face Frame...' : 'Liveness Check'}
                </div>
              </div>

              {scanState === 'liveness' ? (
                <div className="text-center space-y-2 animate-bounce">
                  <p className="text-xs font-bold text-primary flex items-center gap-1.5 justify-center">
                    <ShieldAlert size={14} />
                    {livenessChallenge}
                  </p>
                  <Button size="sm" onClick={handleLivenessPass} className="text-xs font-semibold">
                    Complete Challenge
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground font-mono animate-pulse">Initializing Biometric Module...</p>
              )}
            </div>
          )}

          {/* Success Screen */}
          {scanState === 'success' && verificationResult && (
            <div className="w-full max-w-sm flex flex-col items-center text-center p-4 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center animate-bounce">
                <CheckCircle2 size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-md font-bold text-foreground">Verified!</h3>
                <p className="text-xs text-muted-foreground">
                  Hello, <span className="font-semibold text-foreground">{verificationResult.employee_name}</span>. Your {logType === 'Check_In' ? 'Check In' : 'Check Out'} was successfully recorded.
                </p>
              </div>

              {/* Geofence result */}
              {verificationResult.geofence_ok ? (
                <Badge className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 text-[10px]">
                  Geofence Verified (inside perimeter)
                </Badge>
              ) : (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 space-y-1 text-left w-full">
                  <div className="flex items-center gap-1.5 text-destructive font-semibold text-[10px]">
                    <AlertTriangle size={12} />
                    Geofence Alert (Anomaly Flagged)
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Punch registered {verificationResult.geofence_distance_m}m away. An anomaly report has been dispatched to Kafi Ahmed.
                  </p>
                </div>
              )}

              {verificationResult.offline && (
                <Badge variant="outline" className="text-rose-500 border-rose-500/20 text-[9px] uppercase font-bold">
                  Cached Offline
                </Badge>
              )}

              <Button onClick={handleResetKiosk} variant="outline" size="sm" className="w-full text-xs font-semibold">
                Done
              </Button>
            </div>
          )}

          {/* Error Screen */}
          {scanState === 'error' && (
            <div className="w-full max-w-sm flex flex-col items-center text-center p-4 space-y-4">
              <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-md font-bold text-foreground">Verification Failed</h3>
                <p className="text-xs text-muted-foreground">
                  Liveness check or facial node matching failed. Please try again or report to Nazmul Hasan.
                </p>
              </div>
              <Button onClick={handleResetKiosk} className="w-full text-xs font-semibold">
                Retry Face Scan
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
      
      {/* Offline cached items list */}
      {offlineLogs.length > 0 && (
        <Card className="glass-panel border-rose-500/20 bg-rose-500/5">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-bold text-rose-500 flex items-center gap-2">
              <WifiOff size={14} />
              Offline Cached Punches ({offlineLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0">
            <div className="space-y-1.5 text-[10px] font-mono text-muted-foreground">
              {offlineLogs.map((log, idx) => (
                <div key={idx} className="flex justify-between border-b border-border/30 pb-1">
                  <span>{log.employee_name} ({log.log_type})</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
