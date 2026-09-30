import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  FileText,
  Menu,
  X,
  Radio,
  Repeat,
  GraduationCap,
  Users,
  FolderKanban,
  CheckSquare,
  DoorOpen,
  Bookmark,
  Bell,
  BarChart3,
  Building2,
  Settings,
  ShieldCheck,
  CalendarRange,
  AlertOctagon,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav = () => {
  const {
    activeView,
    setActiveView,
    mobileMenuOpen,
    setMobileMenuOpen,
    role,
    t,
    currentSchool
  } = useApp();

  const bottomNavItems = [
    { id: 'dashboard', label: 'Главная', icon: LayoutDashboard },
    { id: 'schedule', label: 'Расписание', icon: CalendarDays },
    { id: 'grades', label: 'Оценки', icon: BookOpen },
    { id: 'homework', label: 'ДЗ', icon: FileText },
  ];

  const drawerNavItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'liveLessons', label: t('nav.liveLessons'), icon: Radio, badge: 'Live' },
    { id: 'schedule', label: t('nav.schedule'), icon: CalendarDays },
    { id: 'scheduleWizard', label: t('nav.scheduleWizard'), icon: Settings },
    { id: 'substitutions', label: t('nav.substitutions'), icon: Repeat, badge: '2' },
    { id: 'teachers', label: t('nav.teachers'), icon: GraduationCap },
    { id: 'students', label: t('nav.students'), icon: Users },
    { id: 'parents', label: t('nav.parents'), icon: Users },
    { id: 'classes', label: t('nav.classes'), icon: FolderKanban },
    { id: 'attendance', label: t('nav.attendance'), icon: CheckSquare },
    { id: 'grades', label: t('nav.grades'), icon: BookOpen },
    { id: 'homework', label: t('nav.homework'), icon: FileText },
    { id: 'classrooms', label: t('nav.classrooms'), icon: DoorOpen },
    { id: 'subjects', label: t('nav.subjects'), icon: Bookmark },
    { id: 'announcements', label: t('nav.announcements'), icon: Bell },
    { id: 'reports', label: t('nav.reports'), icon: BarChart3 },
    { id: 'users', label: t('nav.users'), icon: ShieldCheck },
    { id: 'yearsAndShifts', label: t('nav.yearsAndShifts'), icon: CalendarRange },
    { id: 'schoolManagement', label: t('nav.schoolManagement'), icon: Building2 },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
    { id: 'errorStates', label: t('nav.errorStates'), icon: AlertOctagon }
  ];

  return (
    <>
      {/* Fixed Bottom Navigation (Mobile 390px / Tablet) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}

        {/* More/Drawer Trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            mobileMenuOpen ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Ещё</span>
        </button>
      </nav>

      {/* Slide-out Drawer for extra sections */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 animate-fade-in border-r border-slate-200 dark:border-slate-800">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  {t('appName')}
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-[180px]">
                  {currentSchool.name}
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list in drawer */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {drawerNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                    <span className="truncate flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-xs font-semibold rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Logout button */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setActiveView('auth');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
