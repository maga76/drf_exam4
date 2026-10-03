import React from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Check,
  Building2,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Dropdown, DropdownItem, DropdownDivider } from '../ui/Dropdown';

export const Topbar = () => {
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    role,
    switchRole,
    currentUser,
    currentSchool,
    setCurrentSchool,
    schools,
    activeAcademicYear,
    setActiveAcademicYear,
    academicYears,
    unreadNotificationsCount,
    notifications,
    markAllNotificationsRead,
    setSearchModalOpen,
    setMobileMenuOpen,
    setActiveView,
    activeView,
    logoutUser
  } = useApp();

  const roles = [
    ['super_admin', 'Супер-администратор'],
    ['admin', 'Директор школы'],
    ['curriculum_director', 'Завуч'],
    ['teacher', 'Учитель'],
    ['homeroom_teacher', 'Классный руководитель'],
    ['student', 'Ученик'],
    ['parent', 'Родитель']
  ];

  // Map view to Frappe breadcrumbs (Desk / Category / Page)
  const breadcrumbMap = {
    dashboard: { section: 'Рабочие столы', label: 'Обзор школы' },
    liveLessons: { section: 'Рабочие столы', label: 'Школа сейчас' },
    classes: { section: 'Учебный процесс', label: 'Классы' },
    subjects: { section: 'Учебный процесс', label: 'Предметы' },
    schedule: { section: 'Учебный процесс', label: 'Расписание' },
    scheduleWizard: { section: 'Учебный процесс', label: 'AI-мастер' },
    yearsAndShifts: { section: 'Учебный процесс', label: 'Годы и смены' },
    students: { section: 'Ученики', label: 'Реестр учеников' },
    attendance: { section: 'Ученики', label: 'Посещаемость' },
    grades: { section: 'Ученики', label: 'Журнал оценок' },
    homework: { section: 'Ученики', label: 'Домашние задания' },
    teachers: { section: 'Преподаватели', label: 'Учителя' },
    substitutions: { section: 'Преподаватели', label: 'Замены уроков' },
    announcements: { section: 'Коммуникация', label: 'Объявления' },
    notifications: { section: 'Коммуникация', label: 'Уведомления' },
    schoolManagement: { section: 'Настройки', label: 'Управление школами' },
    classrooms: { section: 'Настройки', label: 'Кабинеты' },
    reports: { section: 'Настройки', label: 'Аналитика' },
    users: { section: 'Настройки', label: 'Пользователи' },
    schoolSettings: { section: 'Настройки', label: 'Параметры школы' },
    profile: { section: 'Пользователь', label: 'Профиль' }
  };

  const currentBreadcrumb = breadcrumbMap[activeView] || { section: 'Desk', label: 'Раздел' };

  return (
    <header className="h-14 sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800">
      {/* Left: Mobile trigger & Frappe Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
          aria-label="Открыть меню"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Frappe Desk Breadcrumb Navigation */}
        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 min-w-0">
          <button
            onClick={() => setActiveView('dashboard')}
            className="hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
          >
            Desk
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
          <span className="text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
            {currentBreadcrumb.section}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[160px]">
            {currentBreadcrumb.label}
          </span>
        </nav>
      </div>

      {/* Center: Frappe Awesomebar Search */}
      <div className="flex-1 max-w-md mx-2">
        <button
          onClick={() => setSearchModalOpen(true)}
          className="group w-full h-8 flex items-center gap-2.5 px-3 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700 transition-colors text-left"
          title="Поиск по Desk (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 shrink-0" />
          <span className="flex-1 text-xs text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 truncate">
            Search or type a command...
          </span>
          <span className="hidden sm:inline-flex items-center text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 shadow-2xs">
            Ctrl + K
          </span>
        </button>
      </div>

      {/* Right: Actions, School selector, Notifications, Profile */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* School Display (Static) */}
        {currentSchool && (
          <div className="hidden lg:flex h-8 items-center gap-1.5 px-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-200">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[140px]">{currentSchool?.name || 'Школа'}</span>
          </div>
        )}

        {/* Academic Year (Static) */}
        <div className="hidden xl:flex h-8 items-center gap-1.5 px-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-medium text-slate-600 dark:text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{activeAcademicYear}</span>
        </div>

        {/* Current Role (Static Badge) */}
        <div className="hidden md:flex h-8 items-center gap-1.5 px-2.5 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <span>{roles.find(item => item[0] === role)?.[1] || role}</span>
        </div>

        {/* Language Switcher */}
        <Dropdown
          align="right"
          trigger={
            <button className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase transition-colors">
              {language}
            </button>
          }
        >
          <DropdownItem onClick={() => setLanguage('ru')}>Русский</DropdownItem>
          <DropdownItem onClick={() => setLanguage('tj')}>Тоҷикӣ</DropdownItem>
          <DropdownItem onClick={() => setLanguage('en')}>English</DropdownItem>
        </Dropdown>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
          aria-label="Сменить тему"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Icon */}
        <Dropdown
          align="right"
          trigger={
            <button className="relative w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          }
        >
          <div className="w-[320px] max-w-[85vw] p-2">
            <div className="flex items-center justify-between px-2 py-2 border-b border-slate-100 dark:border-slate-800">
              <div className="font-semibold text-xs text-slate-900 dark:text-white">
                Уведомления ({unreadNotificationsCount})
              </div>
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Прочитать все
              </button>
            </div>
            <div className="py-1 space-y-0.5 max-h-64 overflow-y-auto">
              {notifications.slice(0, 5).map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView('notifications')}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex gap-2.5">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${item.read ? 'bg-slate-300' : 'bg-rose-500'}`} />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 dark:text-white truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{item.message}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Dropdown>

        {/* User Profile Avatar Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <img
                src={currentUser.avatar}
                alt=""
                className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <span className="hidden xl:block text-xs font-medium text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                {currentUser.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          }
        >
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-900 dark:text-white">{currentUser.name}</div>
            <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
          </div>
          <DropdownItem icon={User} onClick={() => setActiveView('profile')}>Мой профиль</DropdownItem>
          <DropdownItem icon={Settings} onClick={() => setActiveView('schoolSettings')}>Параметры</DropdownItem>
          <DropdownDivider />
          <DropdownItem icon={LogOut} danger onClick={logoutUser}>Выйти из системы</DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
};
