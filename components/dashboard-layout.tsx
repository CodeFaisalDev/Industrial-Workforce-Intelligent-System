'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, CreditCard, ShieldAlert, LayoutDashboard, 
  Terminal, Menu, X, MessageSquare, Sun, Moon, Clock, UserCheck,
  Umbrella, Bell, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight,
  Sparkles, PanelLeft
} from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useSession, signOut } from 'next-auth/react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  role: string;
  onOpenChat: () => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

const NAV_ITEMS = [
  { id: 'overview', name: 'Overview', icon: LayoutDashboard, roles: ['HR Admin', 'Floor Manager', 'Worker'] },
  { id: 'kiosk', name: 'Kiosk Mode', icon: UserCheck, roles: ['HR Admin', 'Floor Manager', 'Worker'] },
  { id: 'employees', name: 'Employees', icon: Users, roles: ['HR Admin', 'Floor Manager'] },
  { id: 'scheduler', name: 'Scheduler', icon: Calendar, roles: ['HR Admin', 'Floor Manager', 'Worker'] },
  { id: 'leave', name: 'Leave & Absence', icon: Umbrella, roles: ['HR Admin', 'Floor Manager', 'Worker'] },
  { id: 'payroll', name: 'Payroll Center', icon: CreditCard, roles: ['HR Admin', 'Worker'] },
  { id: 'fraud', name: 'Fraud Queue', icon: ShieldAlert, roles: ['HR Admin'] },
];

export function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  role, 
  onOpenChat,
  isCollapsed = false,
  setIsCollapsed 
}: SidebarProps) {
  const { data: session } = useSession();
  const filteredItems = NAV_ITEMS.filter(item => item.roles.includes(role));

  return (
    <div className="flex flex-col h-full bg-card/80 backdrop-blur-xl border-r border-border/80 py-5 px-3 select-none">
      {/* Brand Header */}
      <div className={`flex items-center mb-6 px-1.5 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/20">
            <Terminal size={20} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 animate-in fade-in duration-200">
              <h1 className="font-bold tracking-tight text-sm truncate bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Industrial Intel
              </h1>
              <span className="text-[10px] text-primary font-mono font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                v2.0 AI Enterprise
              </span>
            </div>
          )}
        </div>

        {setIsCollapsed && !isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors shrink-0"
            title="Collapse Sidebar"
          >
            <ChevronLeft size={18} />
          </Button>
        )}
      </div>

      {/* Collapse Toggle Button when collapsed */}
      {setIsCollapsed && isCollapsed && (
        <div className="flex justify-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(false)}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      )}

      {/* Navigation Category Label */}
      {!isCollapsed && (
        <div className="px-3 mb-2">
          <span className="text-[10px] font-bold font-mono tracking-wider text-muted-foreground/70 uppercase">
            Platform Menu
          </span>
        </div>
      )}

      {/* Nav Menu */}
      <nav className="space-y-1.5 flex-1 overflow-y-auto py-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => setCurrentTab(item.id)}
                className={`relative flex items-center w-full rounded-xl text-sm font-medium transition-all duration-200 ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5'
                } ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary to-violet-600 text-primary-foreground shadow-md shadow-primary/25 font-semibold' 
                    : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                }`}
              >
                {/* Active left bar indicator when expanded */}
                {isActive && !isCollapsed && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-primary-foreground rounded-r-full shadow-sm" />
                )}

                <Icon size={18} className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-primary-foreground' : ''}`} />
                
                {!isCollapsed && (
                  <span className="truncate text-xs font-semibold">{item.name}</span>
                )}
              </button>

              {/* Floating Tooltip Label when collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-semibold rounded-lg shadow-xl border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none z-50 flex items-center gap-1.5">
                  <span>{item.name}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Controls & Chatbot Trigger */}
      <div className="pt-3 space-y-3 border-t border-border/80">
        {/* AI Assistant Button */}
        <div className="relative group">
          <Button 
            variant={isCollapsed ? "ghost" : "outline"} 
            onClick={onOpenChat}
            className={`w-full flex items-center font-semibold text-xs rounded-xl transition-all duration-200 border-primary/20 hover:border-primary/50 hover:bg-primary/10 hover:text-primary ${
              isCollapsed ? 'justify-center p-3 h-10' : 'justify-between px-3.5 py-2.5 h-10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} className="text-primary animate-pulse shrink-0" />
              {!isCollapsed && <span>AI Assistant Chat</span>}
            </div>
            {!isCollapsed && (
              <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary border-primary/20">
                Live
              </Badge>
            )}
          </Button>

          {isCollapsed && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-semibold rounded-lg shadow-xl border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none z-50">
              AI Assistant Chat
            </div>
          )}
        </div>

        {/* User Mini Profile Card */}
        <div className={`flex items-center gap-2.5 p-2 rounded-xl bg-secondary/40 border border-border/50 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative shrink-0">
              <Avatar className="h-8 w-8 rounded-lg border border-primary/20">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                  {(session?.user?.name || 'User')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
            </div>
            
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate">{session?.user?.name || 'User'}</span>
                <span className="text-[10px] text-muted-foreground font-mono truncate">{role}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  role: string;
  onOpenChat: () => void;
}

export default function DashboardLayout({
  children,
  currentTab,
  setCurrentTab,
  role,
  onOpenChat,
}: DashboardLayoutProps) {
  const { data: session } = useSession();
  const [time, setTime] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Live clock update
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Theme toggle helper
  const toggleTheme = () => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans">
      {/* Desktop Collapsible Sidebar */}
      <aside 
        className={`hidden md:flex flex-col h-full shrink-0 border-r border-border/80 bg-card/60 backdrop-blur-xl transition-all duration-300 ease-in-out relative z-40 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          role={role} 
          onOpenChat={onOpenChat} 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border bg-card/65 backdrop-blur-md z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Nav Toggle */}
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
                <Menu size={20} />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} role={role} onOpenChat={onOpenChat} />
              </SheetContent>
            </Sheet>

            {/* Desktop Sidebar Collapse Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <PanelLeft size={18} />
            </Button>

            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:inline-block">
              Factory Portal
            </span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4">
            {/* Live Clock Kiosk Widget */}
            <div className="flex items-center gap-2 bg-secondary/80 px-3 py-1.5 rounded-lg border border-border text-xs font-mono font-semibold">
              <Clock size={12} className="text-primary animate-pulse" />
              {time || '00:00:00'}
            </div>

            {/* Notification Center Popover */}
            <Popover>
              <PopoverTrigger render={
                <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 relative">
                  <Bell size={16} />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                </Button>
              } />
              <PopoverContent align="end" className="w-80 p-0 border border-border bg-card/95 backdrop-blur-md shadow-2xl">
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={14} className="text-primary" />
                    <span className="text-xs font-bold">Operational Notifications</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-bold text-amber-500 border-amber-500/30">
                    3 New
                  </Badge>
                </div>
                <div className="divide-y divide-border/40 max-h-72 overflow-y-auto">
                  <div className="p-3 hover:bg-secondary/30 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded bg-amber-500/10 text-amber-500 shrink-0 mt-0.5">
                        <AlertTriangle size={12} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold">Geofence Distance Flagged</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Worker #4 clock-in location 2.4 km outside facility perimeter.</p>
                        <span className="text-[9px] text-muted-foreground/60 font-mono mt-1 inline-block">10 mins ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-secondary/30 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded bg-primary/10 text-primary shrink-0 mt-0.5">
                        <Umbrella size={12} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold">Pending Leave Request</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Worker filed a 2-day Casual Leave application.</p>
                        <span className="text-[9px] text-muted-foreground/60 font-mono mt-1 inline-block">25 mins ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-secondary/30 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                        <CheckCircle2 size={12} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold">AI Staffing Forecast Ready</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">92% shift allocation confidence calculated for tomorrow.</p>
                        <span className="text-[9px] text-muted-foreground/60 font-mono mt-1 inline-block">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-border text-center">
                  <button className="text-[10px] text-primary hover:underline font-semibold cursor-pointer">
                    Mark All Notifications as Read
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Dark Mode toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-lg h-9 w-9">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </Button>

            {/* User Profile / Options */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <button type="button" className="flex items-center gap-2.5 cursor-pointer bg-secondary/30 hover:bg-secondary/70 p-1.5 pr-3 rounded-lg border border-border transition-colors text-foreground focus-visible:outline-none" />
              }>
                <Avatar className="h-7 w-7 rounded-md">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                    {(session?.user?.name || 'User')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold leading-none">{session?.user?.name || 'User'}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{role}</p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 border-b border-border">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground font-mono">User Options</span>
                </div>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })} className="text-xs font-medium cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Views Main Mount */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
