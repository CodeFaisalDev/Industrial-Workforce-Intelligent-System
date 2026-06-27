'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, CreditCard, ShieldAlert, LayoutDashboard, 
  Terminal, Menu, X, MessageSquare, Sun, Moon, Clock, UserCheck
} from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useSession, signOut } from 'next-auth/react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  role: string;
  onOpenChat: () => void;
}

const NAV_ITEMS = [
  { id: 'overview', name: 'Overview', icon: LayoutDashboard, roles: ['HR Admin', 'Floor Manager', 'Worker'] },
  { id: 'kiosk', name: 'Kiosk Mode', icon: UserCheck, roles: ['HR Admin', 'Floor Manager', 'Worker'] },
  { id: 'employees', name: 'Employees', icon: Users, roles: ['HR Admin', 'Floor Manager'] },
  { id: 'scheduler', name: 'Scheduler', icon: Calendar, roles: ['HR Admin', 'Floor Manager', 'Worker'] },
  { id: 'payroll', name: 'Payroll Center', icon: CreditCard, roles: ['HR Admin', 'Worker'] },
  { id: 'fraud', name: 'Fraud Queue', icon: ShieldAlert, roles: ['HR Admin'] },
];

export function Sidebar({ currentTab, setCurrentTab, role, onOpenChat }: SidebarProps) {
  const filteredItems = NAV_ITEMS.filter(item => item.roles.includes(role));

  return (
    <div className="flex flex-col h-full bg-card border-r border-border py-6 px-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow">
          <Terminal size={18} />
        </div>
        <div>
          <h1 className="font-semibold tracking-tight text-sm">Industrial Intel</h1>
          <span className="text-[10px] text-muted-foreground font-mono">v2.0 Enhanced AI</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="space-y-1 flex-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon size={16} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Footer / Chatbot Trigger */}
      <div className="pt-4 border-t border-border">
        <Button 
          variant="outline" 
          onClick={onOpenChat}
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold rounded-lg hover:border-primary/50 hover:bg-primary/5"
        >
          <MessageSquare size={14} />
          AI Assistant Chat
        </Button>
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
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0">
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} role={role} onOpenChat={onOpenChat} />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Header Bar */}
        <header className="flex h-16 items-center justify-between px-6 border-b border-border bg-card/65 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Nav Toggle */}
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
                <Menu size={20} />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} role={role} onOpenChat={onOpenChat} />
              </SheetContent>
            </Sheet>

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

            {/* Dark Mode toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-lg h-9 w-9">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </Button>

            {/* Role Switcher replaced with actual Authenticated User Options */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <div className="flex items-center gap-2.5 cursor-pointer bg-secondary/30 hover:bg-secondary/70 p-1.5 pr-3 rounded-lg border border-border transition-colors" />
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
