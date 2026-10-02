import React from 'react';
import { Sparkles } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { CommandPalette } from './CommandPalette';
import { ToastContainer } from '../ui/ToastContainer';
import { useApp } from '../../context/AppContext';

export const Layout = ({ children }) => {
  const { activeView, setActiveView } = useApp();

  // If user is on the Auth screen, render it full screen without sidebar/topbar
  if (activeView === 'auth') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center">
        {children}
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* Frappe Desk Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Topbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation & Drawer */}
      <MobileNav />

      {/* Global Awesomebar / Command Palette */}
      <CommandPalette />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Floating AI Copilot Trigger Button */}
      <button
        onClick={() => setActiveView('aiAssistant')}
        title="Smart School AI"
        className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 group cursor-pointer"
      >
        <div className="relative">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5"></span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5"></span>
          <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
        </div>
        <span className="text-xs font-bold tracking-wide">AI-Ассистент</span>
      </button>
    </div>
  );
};
