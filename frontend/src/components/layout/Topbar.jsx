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
  Command
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
    activeAcademicYear,
    setActiveAcademicYear,
    academicYears,
    unreadNotificationsCount,
    notifications,
    markAllNotificationsRead,
    setSearchModalOpen,
    setMobileMenuOpen,
    setActiveView,
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

  return (
    <header className="h-[76px] sticky top-0 z-30 px-4 sm:px-7 flex items-center justify-between gap-4 bg-white/95 dark:bg-[#101827]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center"
          aria-label="Открыть меню"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => setSearchModalOpen(true)}
          className="group w-full max-w-md h-11 flex items-center gap-3 px-4 rounded-2xl bg-[#f2f5f9] dark:bg-white/5 border border-transparent hover:border-blue-200 dark:hover:border-white/10 transition-all text-left"
        >
          <Search className="w-[18px] h-[18px] text-slate-400 group-hover:text-blue-600" />
          <span className="flex-1 text-sm text-slate-400 truncate">Найти ученика, учителя или класс</span>
          <span className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-white/10 text-[10px] font-semibold text-slate-400 shadow-sm border border-slate-200/70 dark:border-white/10">
            <Command className="w-3 h-3" /> K
          </span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <Dropdown
          align="right"
          trigger={
            <button className="hidden lg:flex h-10 items-center gap-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {activeAcademicYear}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          }
        >
          {academicYears.map(year => (
            <DropdownItem key={year.id} onClick={() => setActiveAcademicYear(year.name)}>
              <span className="flex-1">{year.name}</span>
              {activeAcademicYear === year.name && <Check className="w-4 h-4 text-blue-600" />}
            </DropdownItem>
          ))}
        </Dropdown>

        <Dropdown
          align="right"
          trigger={
            <button className="hidden xl:flex h-10 items-center gap-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-xs font-bold text-blue-700 dark:text-blue-300">
              {roles.find(item => item[0] === role)?.[1] || role}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          }
        >
          <div className="px-3 py-2 text-[10px] font-black tracking-wider uppercase text-slate-400">Рабочая роль</div>
          {roles.map(([value, label]) => (
            <DropdownItem key={value} onClick={() => switchRole(value)}>
              <span className="flex-1">{label}</span>
              {role === value && <Check className="w-4 h-4 text-blue-600" />}
            </DropdownItem>
          ))}
        </Dropdown>

        <Dropdown
          align="right"
          trigger={
            <button className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-black text-slate-600 dark:text-slate-300 uppercase">
              {language}
            </button>
          }
        >
          <DropdownItem onClick={() => setLanguage('ru')}>Русский</DropdownItem>
          <DropdownItem onClick={() => setLanguage('tj')}>Тоҷикӣ</DropdownItem>
          <DropdownItem onClick={() => setLanguage('en')}>English</DropdownItem>
        </Dropdown>

        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-500"
          aria-label="Сменить тему"
        >
          {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>

        <Dropdown
          align="right"
          trigger={
            <button className="relative w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-500">
              <Bell className="w-[18px] h-[18px]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#101827]" />
              )}
            </button>
          }
        >
          <div className="w-[340px] max-w-[85vw] p-3">
            <div className="flex items-center justify-between px-1 pb-3 border-b border-slate-100 dark:border-white/10">
              <div>
                <div className="font-bold text-sm">Уведомления</div>
                <div className="text-xs text-slate-400">{unreadNotificationsCount} новых событий</div>
              </div>
              <button onClick={markAllNotificationsRead} className="text-xs font-semibold text-blue-600">Прочитать все</button>
            </div>
            <div className="py-2 space-y-1 max-h-72 overflow-y-auto">
              {notifications.slice(0, 5).map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView('notifications')}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <div className="flex gap-3">
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${item.read ? 'bg-slate-300' : 'bg-blue-500'}`} />
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-white">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.message}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Dropdown>

        <Dropdown
          align="right"
          trigger={
            <button className="ml-1 flex items-center gap-2.5 pl-1 sm:pl-2">
              <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-[14px] object-cover ring-2 ring-white dark:ring-white/10 shadow-sm" />
              <div className="hidden 2xl:block text-left max-w-[150px]">
                <div className="text-xs font-bold text-slate-800 dark:text-white truncate">{currentUser.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{currentUser.roleTitle}</div>
              </div>
              <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
            </button>
          }
        >
          <div className="px-3 py-2.5 border-b border-slate-100 dark:border-white/10">
            <div className="text-sm font-bold">{currentUser.name}</div>
            <div className="text-xs text-slate-400">{currentUser.email}</div>
          </div>
          <DropdownItem icon={User} onClick={() => setActiveView('profile')}>Мой профиль</DropdownItem>
          <DropdownItem icon={Settings} onClick={() => setActiveView('settings')}>Настройки</DropdownItem>
          <DropdownDivider />
          <DropdownItem icon={LogOut} danger onClick={logoutUser}>Выйти</DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
};
