'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import DashboardOverview from '@/components/dashboard-overview';
import KioskMode from '@/components/kiosk-mode';
import EmployeeDirectory from '@/components/employee-directory';
import ShiftScheduler from '@/components/shift-scheduler';
import PayrollCenter from '@/components/payroll-center';
import FraudQueue from '@/components/fraud-queue';
import ChatbotDrawer from '@/components/chatbot-drawer';
import { Sheet } from '@/components/ui/sheet';

export default function Home() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [role, setRole] = useState('HR Admin'); // Default demo role context: 'HR Admin', 'Floor Manager', 'Worker'
  const [chatOpen, setChatOpen] = useState(false);

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
        setRole={(newRole) => {
          setRole(newRole);
          // If the selected persona cannot access the current tab, fall back to overview
          if (newRole === 'Floor Manager' && currentTab === 'fraud') {
            setCurrentTab('overview');
          }
          if (newRole === 'Worker' && ['employees', 'fraud'].includes(currentTab)) {
            setCurrentTab('overview');
          }
        }}
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
