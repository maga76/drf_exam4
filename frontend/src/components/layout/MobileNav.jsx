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
  LogOut,
  Sparkles,
  Sun,
  Moon,
  Globe
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
    currentSchool,
    currentUser,
    logoutUser,
    language,
    setLanguage,
    theme,
    toggleTheme
  } = useApp();

  const drawerNavItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'aiAssistant', label: 'AI Ассистент (ИИ)', icon: Sparkles, badge: 'AI' },
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

  const languages = [
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'tj', label: 'Тоҷикӣ', flag: '🇹🇯' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  return (
    <>
      {/* Fixed Bottom Navigation (Mobile & Tablet) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1 flex items-center justify-around shadow-lg">
        {/* 1. Dashboard */}
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
            activeView === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t('nav.dashboard') || 'Главная'}</span>
        </button>

        {/* 2. Schedule */}
        <button
          onClick={() => setActiveView('schedule')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
            activeView === 'schedule'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <CalendarDays className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t('nav.schedule') || 'Расписание'}</span>
        </button>

        {/* 3. Center AI Button (Raised & Glowing) */}
        <button
          onClick={() => setActiveView('aiAssistant')}
          className="relative -top-4 flex flex-col items-center justify-center group active:scale-90 transition-transform duration-200"
          title="AI Ассистент"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40 ring-4 ring-white dark:ring-slate-900 group-hover:scale-105 transition-all">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
            AI Копилот
          </span>
        </button>

        {/* 4. Grades */}
        <button
          onClick={() => setActiveView('grades')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
            activeView === 'grades'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t('nav.grades') || 'Оценки'}</span>
        </button>

        {/* 5. More / Drawer */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
            mobileMenuOpen
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Ещё</span>
        </button>
      </nav>

      {/* Slide-out Drawer for extra sections */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-backdrop-fade">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 animate-slide-in-left border-r border-slate-200 dark:border-slate-800">
            {/* Drawer Header & Profile */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {t('appName')}
                    </h3>
                    <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                      {currentSchool?.name || 'Smart School'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User snippet */}
              <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <img
                  src={currentUser?.avatar}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover border border-indigo-200 dark:border-indigo-800"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser?.name}
                  </div>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium capitalize">
                    {role?.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Quick Controls: Language + Theme Switcher */}
              <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                        language === lang.code
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {lang.flag}
                    </button>
                  ))}
                </div>

                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 active:scale-95 transition-all"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Светлая</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Темная</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Nav list in drawer */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {drawerNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                const isAi = item.id === 'aiAssistant';
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-98 ${
                      isActive
                        ? isAi
                          ? 'bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800/60'
                          : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                        : isAi
                          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isAi ? 'text-indigo-500 animate-pulse' : 'text-slate-400'}`} />
                    <span className="truncate flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                        isAi 
                          ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-xs' 
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Logout button */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <button
                onClick={() => {
                  logoutUser();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors active:scale-98"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('nav.logout') || 'Выйти из аккаунта'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
