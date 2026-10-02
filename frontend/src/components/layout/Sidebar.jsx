import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Repeat2,
  GraduationCap,
  Users,
  School,
  ClipboardCheck,
  BookOpenCheck,
  NotebookTabs,
  DoorOpen,
  LibraryBig,
  Megaphone,
  ChartNoAxesCombined,
  Settings,
  Radio,
  WandSparkles,
  ShieldCheck,
  CalendarRange,
  PanelLeftClose,
  PanelLeftOpen,
  Building2,
  Bell,
  SlidersHorizontal,
  Sparkles
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
    t
  } = useApp();

  const sections = [
    {
      title: t('sidebar.workspaces'),
      items: [
        { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { id: 'liveLessons', label: t('nav.liveLessons'), icon: Radio, badge: 'LIVE', badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' }
      ]
    },
    {
      title: t('sidebar.academics'),
      items: [
        { id: 'classes', label: t('nav.classes'), icon: School },
        { id: 'subjects', label: t('nav.subjects'), icon: LibraryBig, roles: ['super_admin', 'admin', 'curriculum_director'] },
        { id: 'schedule', label: t('nav.schedule'), icon: CalendarDays },
        { id: 'scheduleWizard', label: t('nav.scheduleWizard'), icon: WandSparkles, roles: ['super_admin', 'admin', 'curriculum_director'] },
        { id: 'aiAssistant', label: t('nav.aiAssistant'), icon: Sparkles, badge: 'AI', badgeColor: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xs' },
        { id: 'yearsAndShifts', label: t('nav.yearsAndShifts'), icon: CalendarRange, roles: ['super_admin', 'admin'] }
      ]
    },
    {
      title: t('sidebar.students'),
      items: [
        { id: 'students', label: t('nav.students'), icon: Users, roles: ['super_admin', 'admin', 'curriculum_director', 'homeroom_teacher'] },
        { id: 'attendance', label: t('nav.attendance'), icon: ClipboardCheck },
        { id: 'grades', label: t('nav.grades'), icon: BookOpenCheck },
        { id: 'homework', label: t('nav.homework'), icon: NotebookTabs }
      ]
    },
    {
      title: t('sidebar.teachers'),
      items: [
        { id: 'teachers', label: t('nav.teachers'), icon: GraduationCap, roles: ['super_admin', 'admin', 'curriculum_director'] },
        { id: 'substitutions', label: t('nav.substitutions'), icon: Repeat2, badge: '2', badgeColor: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200', roles: ['super_admin', 'admin', 'curriculum_director', 'teacher', 'homeroom_teacher'] }
      ]
    },
    {
      title: t('sidebar.communication'),
      items: [
        { id: 'announcements', label: t('nav.announcements'), icon: Megaphone },
        { id: 'notifications', label: t('nav.notifications'), icon: Bell }
      ]
    },
    {
      title: t('sidebar.settings'),
      items: [
        { id: 'schoolManagement', label: t('nav.schoolManagement'), icon: Building2, roles: ['super_admin'] },
        { id: 'classrooms', label: t('nav.classrooms'), icon: DoorOpen, roles: ['super_admin', 'admin', 'curriculum_director', 'teacher'] },
        { id: 'reports', label: t('nav.reports'), icon: ChartNoAxesCombined, roles: ['super_admin', 'admin', 'curriculum_director', 'teacher'] },
        { id: 'users', label: t('nav.users'), icon: ShieldCheck, roles: ['super_admin', 'admin'] },
        { id: 'schoolSettings', label: t('nav.settings'), icon: Settings, roles: ['super_admin', 'admin'] }
      ]
    }
  ];

  const isVisible = (item) => !item.roles || item.roles.includes(role);

  return (
    <aside
      className={`hidden md:flex h-screen sticky top-0 flex-col bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 transition-all duration-200 shrink-0 z-20 ${
        sidebarCollapsed ? 'w-[72px]' : 'w-[250px]'
      }`}
    >
      {/* Frappe Desk Header Brand */}
      <div className="h-14 flex items-center px-4 border-b border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex items-center gap-3 min-w-0 ${sidebarCollapsed ? 'mx-auto' : ''}`}
          title="Smart School Desk"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 font-bold shrink-0 shadow-sm">
            <School className="w-4 h-4" />
          </div>
          {!sidebarCollapsed && (
            <div className="text-left min-w-0">
              <div className="font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Smart School
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Desk
                </span>
              </div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[150px]">
                {currentSchool?.name || 'Education'}
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3.5 space-y-5">
        {sections.map(section => {
          const visibleItems = section.items.filter(isVisible);
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title}>
              {!sidebarCollapsed && (
                <div className="px-2.5 mb-1.5 text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                  {section.title}
                </div>
              )}
              <div className="space-y-0.5">
                {visibleItems.map(item => {
                  const Icon = item.icon;
                  const active = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full h-9 flex items-center rounded-lg transition-colors text-[13px] ${
                        sidebarCollapsed ? 'justify-center px-0' : 'px-2.5 gap-2.5'
                      } ${
                        active
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-200/80 dark:border-slate-700/80'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          {item.badge && (
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: Settings & Collapse */}
      <div className="p-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-1">
        <button
          onClick={() => setActiveView('schoolSettings')}
          className={`flex items-center gap-2 p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors ${
            sidebarCollapsed ? 'mx-auto' : 'flex-1'
          }`}
          title="Настройки школы"
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && <span>Настройки</span>}
        </button>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors shrink-0"
          title={sidebarCollapsed ? "Развернуть меню" : "Свернуть меню"}
        >
          {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
