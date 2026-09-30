import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { CommandPalette } from './CommandPalette';
import { ToastContainer } from '../ui/ToastContainer';
import { useApp } from '../../context/AppContext';

export const Layout = ({ children }) => {
  const { activeView } = useApp();

  // If user is on the Auth screen, render it full screen without sidebar/topbar
  if (activeView === 'auth') {
    return (
      <div className="min-h-screen bg-[#f4f6fa] dark:bg-[#080f20] text-slate-900 dark:text-slate-100 flex flex-col justify-center">
        {children}
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f4f6fa] dark:bg-[#080f20] text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Topbar />

        <main className="flex-1 p-4 sm:p-6 lg:px-8 lg:py-7 max-w-[1680px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation & Drawer */}
      <MobileNav />

      {/* Global Command Palette / Search modal */}
      <CommandPalette />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
