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
  PanelLeftOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';


export const Sidebar = () => {
  const {
    activeView,
    setActiveView,
    sidebarCollapsed,
    setSidebarCollapsed,
    currentSchool,
    role
  } = useApp();

  const sections = [
    {
      title: 'Сегодня',
      items: [
        { id: 'dashboard', label: 'Обзор школы', icon: LayoutDashboard },
        { id: 'liveLessons', label: 'Школа сейчас', icon: Radio, badge: 'LIVE' },
        { id: 'schedule', label: 'Расписание', icon: CalendarDays },
        { id: 'substitutions', label: 'Замены', icon: Repeat2, badge: '2' }
      ]
    },
    {
      title: 'Учебный процесс',
      items: [
        { id: 'teachers', label: 'Учителя', icon: GraduationCap, roles: ['super_admin', 'admin', 'curriculum_director'] },
        { id: 'students', label: 'Ученики', icon: Users, roles: ['super_admin', 'admin', 'curriculum_director', 'homeroom_teacher'] },
        { id: 'classes', label: 'Классы', icon: School },
        { id: 'attendance', label: 'Посещаемость', icon: ClipboardCheck },
        { id: 'grades', label: 'Журнал оценок', icon: BookOpenCheck },
        { id: 'homework', label: 'Домашние задания', icon: NotebookTabs }
      ]
    },
    {
      title: 'Управление',
      items: [
        { id: 'classrooms', label: 'Кабинеты', icon: DoorOpen },
        { id: 'subjects', label: 'Предметы', icon: LibraryBig, roles: ['super_admin', 'admin', 'curriculum_director'] },
        { id: 'announcements', label: 'Объявления', icon: Megaphone },
        { id: 'reports', label: 'Аналитика', icon: ChartNoAxesCombined },
        { id: 'scheduleWizard', label: 'AI-расписание', icon: WandSparkles, roles: ['super_admin', 'admin', 'curriculum_director'] },
        { id: 'users', label: 'Пользователи', icon: ShieldCheck, roles: ['super_admin', 'admin'] },
        { id: 'yearsAndShifts', label: 'Годы и смены', icon: CalendarRange, roles: ['super_admin', 'admin'] }
      ]
    }
  ];

  const isVisible = (item) => !item.roles || item.roles.includes(role);

  return (
    <aside className={`hidden md:flex h-screen sticky top-0 flex-col bg-[#0b1739] text-white transition-all duration-300 shrink-0 ${sidebarCollapsed ? 'w-[84px]' : 'w-[264px]'}`}>
      <div className="h-[76px] flex items-center px-5 border-b border-white/10">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex items-center gap-3 min-w-0 ${sidebarCollapsed ? 'mx-auto' : ''}`}
        >
          <div className="w-10 h-10 rounded-[14px] bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-950/30 relative shrink-0">
            <School className="w-5 h-5" />
            <span className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-[#0b1739]" />
          </div>
          {!sidebarCollapsed && (
            <div className="text-left min-w-0">
              <div className="font-bold text-[17px] tracking-tight">Smart School</div>
              <div className="text-[11px] text-blue-200/70 truncate">{currentSchool.name}</div>
            </div>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {sections.map(section => (
          <div key={section.title}>
            {!sidebarCollapsed && (
              <div className="px-3 mb-2 text-[10px] font-bold tracking-[0.16em] uppercase text-blue-200/40">
                {section.title}
              </div>
            )}
            <div className="space-y-1">
              {section.items.filter(isVisible).map(item => {
                const Icon = item.icon;
                const active = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full h-10 flex items-center rounded-xl transition-all duration-200 ${sidebarCollapsed ? 'justify-center' : 'px-3 gap-3'} ${active ? 'bg-white text-[#0b1739] shadow-lg shadow-black/10' : 'text-blue-100/70 hover:text-white hover:bg-white/[0.08]'}`}
                  >
                    <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-blue-600' : ''}`} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left text-[13px] font-semibold">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${item.badge === 'LIVE' ? 'bg-red-500 text-white' : 'bg-amber-400 text-[#0b1739]'}`}>
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
        ))}
      </div>

      <div className="p-3 border-t border-white/10">
        {!sidebarCollapsed && (
          <button
            onClick={() => setActiveView('settings')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-100/70 hover:text-white hover:bg-white/[0.08] text-[13px] font-semibold"
          >
            <Settings className="w-[18px] h-[18px]" />
            Настройки школы
          </button>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="mt-1 w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-blue-200/50 hover:text-white hover:bg-white/[0.08] text-xs"
        >
          {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          {!sidebarCollapsed && <span>Свернуть меню</span>}
        </button>
      </div>
    </aside>
  );
};
