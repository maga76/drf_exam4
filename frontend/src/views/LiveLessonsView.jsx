import React, { useState } from 'react';
import {
  Clock,
  RefreshCw,
  GraduationCap,
  DoorOpen,
  CheckSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select, SearchInput } from '../components/ui/Input';

export const LiveLessonsView = () => {
  const { liveLessons, setActiveView, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [filterFloor, setFilterFloor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredLessons = liveLessons.filter(lesson => {
    const matchesSearch =
      lesson.className.toLowerCase().includes(search.toLowerCase()) ||
      lesson.subject.toLowerCase().includes(search.toLowerCase()) ||
      lesson.teacher.toLowerCase().includes(search.toLowerCase()) ||
      lesson.room.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'all' || lesson.status === filterStatus;
    const matchesFloor = filterFloor === 'all' || lesson.room.includes(filterFloor + ' этаж');

    return matchesSearch && matchesStatus && matchesFloor;
  });

  const statusBadges = {
    ongoing: <Badge variant="success" dot>Идёт урок</Badge>,
    endingSoon: <Badge variant="warning" dot>Скоро звонок</Badge>,
    replacement: <Badge variant="purple" dot>Замена</Badge>,
    cancelled: <Badge variant="danger" dot>Отменён</Badge>
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Frappe Desk Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Эфир школы
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Живые уроки в реальном времени
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            2-й урок · 08:50 – 09:35 · Активно 4 из 5 учебных кабинетов
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          icon={RefreshCw}
          onClick={() => addToast({ type: 'info', title: 'Обновлено', message: 'Данные живых уроков синхронизированы' })}
        >
          Синхронизировать
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Поиск по уроку, классу, учителю или кабинету..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={filterFloor}
            onChange={(e) => setFilterFloor(e.target.value)}
            className="w-auto text-xs py-1.5"
          >
            <option value="all">Все этажи</option>
            <option value="1">1-й этаж</option>
            <option value="2">2-й этаж</option>
            <option value="3">3-й этаж</option>
          </Select>

          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-auto text-xs py-1.5"
          >
            <option value="all">Все статусы</option>
            <option value="ongoing">Идёт урок</option>
            <option value="endingSoon">Скоро закончится</option>
            <option value="replacement">Замена</option>
            <option value="cancelled">Отменён</option>
          </Select>
        </div>
      </div>

      {/* Live Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLessons.map((lesson) => {
          const isCancelled = lesson.status === 'cancelled';
          const isReplacement = lesson.status === 'replacement';

          return (
            <div
              key={lesson.id}
              className={`frappe-card p-4 sm:p-5 flex flex-col justify-between ${
                isCancelled
                  ? 'bg-rose-50/30 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50'
                  : isReplacement
                    ? 'bg-purple-50/30 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/50'
                    : ''
              }`}
            >
              <div>
                {/* Header: Class + Subject */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0">
                      {lesson.className}
                    </span>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                        {lesson.subject}
                      </h4>
                      <span className="text-xs text-slate-400">
                        {lesson.lessonNumber}-й урок ({lesson.time})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status pill & remaining time */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  {statusBadges[lesson.status]}
                  {lesson.timeRemaining !== '—' && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {lesson.timeRemaining}
                    </span>
                  )}
                </div>

                {/* Simulated Lesson Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Прогресс</span>
                    <span>28 / 45 мин</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-slate-900 dark:bg-slate-100 w-[62%]" />
                  </div>
                </div>

                {/* Teacher and Room details */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> Учитель:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{lesson.teacher}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <DoorOpen className="w-3.5 h-3.5 text-slate-400" /> Кабинет:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {lesson.room}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Посещаемость:</span>
                    <span className={`font-medium ${lesson.attendanceChecked ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                      {lesson.attendanceChecked
                        ? `${lesson.presentCount} из ${lesson.totalStudents} уч.`
                        : 'Не отмечено'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full font-medium"
                  icon={CheckSquare}
                  onClick={() => setActiveView('attendance')}
                >
                  Журнал урока
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
