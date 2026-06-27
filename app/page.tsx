'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import DashboardOverview from '@/components/dashboard-overview';
import KioskMode from '@/components/kiosk-mode';
import EmployeeDirectory from '@/components/employee-directory';
import ShiftScheduler from '@/components/shift-scheduler';
import PayrollCenter from '@/components/payroll-center';
import FraudQueue from '@/components/fraud-queue';
import ChatbotDrawer from '@/components/chatbot-drawer';
import { Sheet } from '@/components/ui/sheet';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('overview');
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null; // will redirect to login via useEffect
  }

  const role = (session.user as any).role || 'Worker';

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'overview':
        return <DashboardOverview role={role} />;
      case 'kiosk':
        return <KioskMode />;
      case 'employees':
        return <EmployeeDirectory />;
      case 'scheduler':
        return <ShiftScheduler role={role} />;
      case 'payroll':
        return <PayrollCenter role={role} />;
      case 'fraud':
        return <FraudQueue />;
      default:
        return <DashboardOverview role={role} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <DashboardLayout
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        role={role}
        onOpenChat={() => setChatOpen(true)}
      >
        {renderActiveTab()}
      </DashboardLayout>

      {/* Floating Global Chatbot Sheet */}
      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <ChatbotDrawer role={role} />
      </Sheet>
    </div>
  );
}
