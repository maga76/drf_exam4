import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  UserCheck,
  ChevronDown,
  Menu,
  Check,
  Clock,
  Layers,
  School,
  ExternalLink,
  User,
  LogOut,
  Settings
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
    schools,
    setCurrentSchool,
    activeAcademicYear,
    setActiveAcademicYear,
    academicYears,
    activeShift,
    setActiveShift,
    unreadNotificationsCount,
    notifications,
    markAllNotificationsRead,
    setSearchModalOpen,
    setMobileMenuOpen,
    setActiveView,
    t
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);

  const rolesList = [
    { id: 'super_admin', label: 'Супер-администратор' },
    { id: 'admin', label: 'Администратор школы' },
    { id: 'curriculum_director', label: 'Завуч' },
    { id: 'teacher', label: 'Учитель' },
    { id: 'homeroom_teacher', label: 'Классный руководитель' },
    { id: 'student', label: 'Ученик' },
    { id: 'parent', label: 'Родитель' }
  ];

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Mobile hamburger & Global Search Button */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search trigger bar */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="w-full max-w-sm flex items-center justify-between px-3.5 py-1.5 bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-xs sm:text-sm text-slate-400 dark:text-slate-400 transition-all text-left shadow-subtle group"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
            <span className="truncate">{t('searchPlaceholder')}</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Academic Year, Shift, Role Switcher, Language, Theme, Notifications, Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Academic Year Selector */}
        <div className="hidden lg:block">
          <Dropdown
            align="right"
            trigger={
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-xl transition-colors">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeAcademicYear}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            }
          >
            <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('academicYear')}
            </div>
            {academicYears.map((ay) => (
              <DropdownItem
                key={ay.id}
                onClick={() => setActiveAcademicYear(ay.name)}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{ay.name} {ay.isActive && '(Текущий)'}</span>
                  {activeAcademicYear === ay.name && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
              </DropdownItem>
            ))}
          </Dropdown>
        </div>

        {/* Shift Selector */}
        <div className="hidden xl:block">
          <Dropdown
            align="right"
            trigger={
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-xl transition-colors">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeShift === 1 ? '1 смена' : '2 смена'}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            }
          >
            <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('shift')}
            </div>
            <DropdownItem onClick={() => setActiveShift(1)}>
              <div className="flex items-center justify-between w-full">
                <span>{t('shift1')}</span>
                {activeShift === 1 && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </div>
            </DropdownItem>
            <DropdownItem onClick={() => setActiveShift(2)}>
              <div className="flex items-center justify-between w-full">
                <span>{t('shift2')}</span>
                {activeShift === 2 && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </div>
            </DropdownItem>
          </Dropdown>
        </div>

        {/* Role Switcher Demo Picker */}
        <Dropdown
          align="right"
          trigger={
            <button
              title="Переключить роль для тестирования UI"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-xl transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden md:inline">{t(`roles.${role}`)}</span>
              <span className="md:hidden">Роль</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
          }
        >
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {t('switchRole')}
          </div>
          {rolesList.map((r) => (
            <DropdownItem
              key={r.id}
              onClick={() => switchRole(r.id)}
            >
              <div className="flex items-center justify-between w-full">
                <span>{r.label}</span>
                {role === r.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </div>
            </DropdownItem>
          ))}
        </Dropdown>

        {/* Language Switcher */}
        <Dropdown
          align="right"
          trigger={
            <button className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <span className="text-xs font-bold uppercase">{language}</span>
            </button>
          }
        >
          <DropdownItem onClick={() => setLanguage('ru')}>
            <div className="flex items-center justify-between w-full">
              <span>Русский (RU)</span>
              {language === 'ru' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </div>
          </DropdownItem>
          <DropdownItem onClick={() => setLanguage('tj')}>
            <div className="flex items-center justify-between w-full">
              <span>Тоҷикӣ (TJ)</span>
              {language === 'tj' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </div>
          </DropdownItem>
          <DropdownItem onClick={() => setLanguage('en')}>
            <div className="flex items-center justify-between w-full">
              <span>English (EN)</span>
              {language === 'en' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </div>
          </DropdownItem>
        </Dropdown>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? "Включить светлую тему" : "Включить тёмную тему"}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Popover */}
        <Dropdown
          align="right"
          trigger={
            <button className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative">
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          }
        >
          <div className="p-3 w-80 max-w-xs sm:w-88">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {t('notificationsTitle')} ({unreadNotificationsCount})
              </span>
              {unreadNotificationsCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  {t('markAllRead')}
                </button>
              )}
            </div>

            <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
              {notifications.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  onClick={() => setActiveView('notifications')}
                  className={`p-2.5 rounded-xl cursor-pointer transition-colors text-xs ${
                    n.read
                      ? 'bg-slate-50/60 dark:bg-slate-800/40 text-slate-500'
                      : 'bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-800 dark:text-slate-200 border border-indigo-100/60 dark:border-indigo-900/40'
                  }`}
                >
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={() => setActiveView('notifications')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Все уведомления &rarr;
              </button>
            </div>
          </div>
        </Dropdown>

        {/* User Avatar Menu */}
        <Dropdown
          align="right"
          trigger={
            <div className="flex items-center gap-2 pl-1 cursor-pointer">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-[120px]">
                  {currentUser.roleTitle}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          }
        >
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{currentUser.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
          </div>
          <DropdownItem icon={User} onClick={() => setActiveView('profile')}>
            {t('nav.profile')}
          </DropdownItem>
          <DropdownItem icon={Settings} onClick={() => setActiveView('settings')}>
            {t('nav.settings')}
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem icon={LogOut} danger onClick={() => setActiveView('auth')}>
            {t('nav.logout')}
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
};
