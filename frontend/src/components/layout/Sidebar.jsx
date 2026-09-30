import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Repeat,
  GraduationCap,
  Users,
  FolderKanban,
  CheckSquare,
  BookOpen,
  FileText,
  DoorOpen,
  Bookmark,
  Bell,
  BarChart3,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Radio,
  Wand2,
  ShieldCheck,
  CalendarRange,
  AlertOctagon,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const {
    activeView,
    setActiveView,
    sidebarCollapsed,
    setSidebarCollapsed,
    currentSchool,
    role,
    t,
    switchRole
  } = useApp();

  const navigationItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, roles: ['super_admin', 'admin', 'curriculum_director', 'teacher', 'homeroom_teacher', 'student', 'parent'] },
    { id: 'liveLessons', label: t('nav.liveLessons'), icon: Radio, roles: ['super_admin', 'admin', 'curriculum_director', 'teacher', 'homeroom_teacher'], badge: 'Live' },
    { id: 'schedule', label: t('nav.schedule'), icon: CalendarDays, roles: ['super_admin', 'admin', 'curriculum_director', 'teacher', 'homeroom_teacher', 'student', 'parent'] },
    { id: 'scheduleWizard', label: t('nav.scheduleWizard'), icon: Wand2, roles: ['super_admin', 'admin', 'curriculum_director'] },
    { id: 'substitutions', label: t('nav.substitutions'), icon: Repeat, roles: ['super_admin', 'admin', 'curriculum_director', 'teacher', 'homeroom_teacher'], badge: '2' },
    { id: 'teachers', label: t('nav.teachers'), icon: GraduationCap, roles: ['super_admin', 'admin', 'curriculum_director'] },
    { id: 'students', label: t('nav.students'), icon: Users, roles: ['super_admin', 'admin', 'curriculum_director', 'homeroom_teacher'] },
    { id: 'parents', label: t('nav.parents'), icon: Users, roles: ['super_admin', 'admin', 'curriculum_director', 'homeroom_teacher'] },
    { id: 'classes', label: t('nav.classes'), icon: FolderKanban, roles: ['super_admin', 'admin', 'curriculum_director', 'teacher', 'homeroom_teacher'] },
    { id: 'attendance', label: t('nav.attendance'), icon: CheckSquare, roles: ['super_admin', 'admin', 'curriculum_director', 'teacher', 'homeroom_teacher', 'student', 'parent'] },
    { id: 'grades', label: t('nav.grades'), icon: BookOpen, roles: ['super_admin', 'admin', 'curriculum_director', 'teacher', 'homeroom_teacher', 'student', 'parent'] },
    { id: 'homework', label: t('nav.homework'), icon: FileText, roles: ['super_admin', 'admin', 'curriculum_director', 'teacher', 'homeroom_teacher', 'student', 'parent'] },
    { id: 'classrooms', label: t('nav.classrooms'), icon: DoorOpen, roles: ['super_admin', 'admin', 'curriculum_director', 'teacher'] },
    { id: 'subjects', label: t('nav.subjects'), icon: Bookmark, roles: ['super_admin', 'admin', 'curriculum_director'] },
    { id: 'announcements', label: t('nav.announcements'), icon: Bell, roles: ['super_admin', 'admin', 'curriculum_director', 'teacher', 'homeroom_teacher', 'student', 'parent'] },
    { id: 'reports', label: t('nav.reports'), icon: BarChart3, roles: ['super_admin', 'admin', 'curriculum_director', 'teacher', 'homeroom_teacher'] },
    { id: 'users', label: t('nav.users'), icon: ShieldCheck, roles: ['super_admin', 'admin'] },
    { id: 'yearsAndShifts', label: t('nav.yearsAndShifts'), icon: CalendarRange, roles: ['super_admin', 'admin'] },
    { id: 'schoolManagement', label: t('nav.schoolManagement'), icon: Building2, roles: ['super_admin'] },
    { id: 'settings', label: t('nav.settings'), icon: Settings, roles: ['super_admin', 'admin', 'curriculum_director', 'teacher', 'homeroom_teacher', 'student', 'parent'] },
    { id: 'errorStates', label: t('nav.errorStates'), icon: AlertOctagon, roles: ['super_admin', 'admin', 'curriculum_director', 'teacher', 'homeroom_teacher', 'student', 'parent'] }
  ];

  const visibleItems = navigationItems.filter(item => !item.roles || item.roles.includes(role));

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 select-none z-30 shrink-0 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
              S
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-base text-slate-900 dark:text-slate-100 truncate tracking-tight">
                {t('appName')}
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-400 truncate">
                {currentSchool.name}
              </p>
            </div>
          </div>
        )}

        {sidebarCollapsed && (
          <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            S
          </div>
        )}

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors ${
            sidebarCollapsed ? 'hidden' : 'block'
          }`}
          title={sidebarCollapsed ? "Развернуть меню" : "Свернуть меню"}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 scale-105'
                    : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`}
              />

              {!sidebarCollapsed && (
                <>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-xs font-semibold rounded-md ${
                        item.badge === 'Live'
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Toggle */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors gap-2"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Свернуть меню</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
