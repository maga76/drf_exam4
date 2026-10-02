import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  DoorOpen,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommandPalette = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    setActiveView,
    students,
    teachers,
    classes,
    classrooms,
    t
  } = useApp();

  const [query, setQuery] = useState('');

  // Handle Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  if (!searchModalOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Results with safe guards against null/undefined
  const matchedStudents = students.filter(s =>
    (s.fullName || '').toLowerCase().includes(q) ||
    (s.studentCode || '').toLowerCase().includes(q) ||
    (s.className || '').toLowerCase().includes(q)
  ).slice(0, 3);

  const matchedTeachers = teachers.filter(tch =>
    (tch.fullName || '').toLowerCase().includes(q) ||
    (tch.subjectName || '').toLowerCase().includes(q) ||
    (tch.roomNumber || '').toLowerCase().includes(q)
  ).slice(0, 3);

  const matchedClasses = classes.filter(cls =>
    (cls.name || '').toLowerCase().includes(q) ||
    (cls.homeroomTeacher || '').toLowerCase().includes(q)
  ).slice(0, 3);

  const quickPages = [
    { label: "Расписание уроков", view: "schedule", icon: Calendar },
    { label: "Электронный журнал оценок", view: "grades", icon: BookOpen },
    { label: "Оформление замен", view: "substitutions", icon: Sparkles },
    { label: "Живые уроки прямо сейчас", view: "liveLessons", icon: Sparkles },
    { label: "Посещаемость уроков", view: "attendance", icon: Calendar },
    { label: "Кабинеты и поиск свободных", view: "classrooms", icon: DoorOpen },
  ].filter(p => !q || p.label.toLowerCase().includes(q));

  const handleSelect = (view) => {
    setActiveView(view);
    setSearchModalOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setSearchModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-modal border border-slate-200/80 dark:border-slate-800 overflow-hidden transform transition-all z-10 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по системе, ученикам, учителям, классам..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setSearchModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Quick Pages */}
          {quickPages.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Быстрый переход
              </div>
              <div className="mt-1 space-y-0.5">
                {quickPages.map((page, idx) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(page.view)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                        <span>{page.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Students */}
          {matchedStudents.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Ученики
              </div>
              <div className="mt-1 space-y-0.5">
                {matchedStudents.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleSelect('students')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium">{st.fullName}</span>
                      <span className="text-xs text-slate-400">({st.className})</span>
                    </div>
                    <span className="text-xs text-slate-400">{st.studentCode}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Teachers */}
          {matchedTeachers.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Учителя
              </div>
              <div className="mt-1 space-y-0.5">
                {matchedTeachers.map((tch) => (
                  <button
                    key={tch.id}
                    onClick={() => handleSelect('teachers')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="w-4 h-4 text-teal-500" />
                      <span className="font-medium">{tch.fullName}</span>
                      <span className="text-xs text-slate-400">— {tch.subjectName}</span>
                    </div>
                    <span className="text-xs text-slate-400">Каб. {tch.roomNumber}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Classes */}
          {matchedClasses.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Классы
              </div>
              <div className="mt-1 space-y-0.5">
                {matchedClasses.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => handleSelect('classes')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-indigo-50 text-indigo-700">
                        {cls.name}
                      </span>
                      <span className="text-xs text-slate-500">Кл. рук: {cls.homeroomTeacher}</span>
                    </div>
                    <span className="text-xs text-slate-400">{cls.studentsCount} уч.</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedStudents.length === 0 && matchedTeachers.length === 0 && matchedClasses.length === 0 && quickPages.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-400">
              По запросу «{query}» ничего не найдено
            </div>
          )}
        </div>

        {/* Footer shortcuts tip */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Нажмите <kbd className="px-1 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">ESC</kbd> для закрытия</span>
          <span>Переход клавишами навигации</span>
        </div>
      </div>
    </div>
  );
};
