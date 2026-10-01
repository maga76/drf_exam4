import React, { useState } from 'react';
import {
  Radio,
  Clock,
  Building,
  CheckCircle,
  AlertTriangle,
  UserX,
  Search,
  CheckSquare,
  Filter,
  Eye,
  RefreshCw,
  Sparkles,
  GraduationCap,
  DoorOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Select, SearchInput } from '../components/ui/Input';

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
    ongoing: <Badge variant="success" dot>Идёт прямо сейчас</Badge>,
    endingSoon: <Badge variant="warning" dot>Скоро звонок</Badge>,
    replacement: <Badge variant="purple" dot>Замена учителя</Badge>,
    cancelled: <Badge variant="danger" dot>Урок отменён</Badge>
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Live Signal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl shadow-slate-950/20 border border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
            ЭФИР ШКОЛЫ
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Живые уроки в реальном времени
          </h2>
          <p className="text-xs sm:text-sm text-blue-200/70 mt-1 font-medium">
            2-й урок · 08:50 – 09:35 · Активно 4 из 5 учебных кабинетов
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          icon={RefreshCw}
          className="!border-white/20 !bg-white/10 !text-white hover:!bg-white/20 backdrop-blur-md"
          onClick={() => addToast({ type: 'info', title: 'Обновлено', message: 'Данные живых уроков синхронизированы' })}
        >
          Синхронизировать
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Поиск по уроку, классу, учителю или кабинету..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Select
            value={filterFloor}
            onChange={(e) => setFilterFloor(e.target.value)}
            className="w-auto text-xs py-2"
          >
            <option value="all">Все этажи</option>
            <option value="1">1-й этаж</option>
            <option value="2">2-й этаж</option>
            <option value="3">3-й этаж</option>
          </Select>

          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-auto text-xs py-2"
          >
            <option value="all">Все статусы</option>
            <option value="ongoing">Идёт прямо сейчас</option>
            <option value="endingSoon">Скоро закончится</option>
            <option value="replacement">Замена</option>
            <option value="cancelled">Отменён</option>
          </Select>
        </div>
      </div>

      {/* Live Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLessons.map((lesson, idx) => {
          const isCancelled = lesson.status === 'cancelled';
          const isReplacement = lesson.status === 'replacement';

          const gradientBox = idx % 3 === 0
            ? 'from-blue-600 to-indigo-600 shadow-blue-500/25'
            : idx % 3 === 1
              ? 'from-emerald-500 to-teal-600 shadow-emerald-500/25'
              : 'from-purple-600 to-pink-600 shadow-purple-500/25';

          return (
            <div
              key={lesson.id}
              className={`group relative overflow-hidden p-5 sm:p-6 rounded-[24px] border transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between ${
                isCancelled
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/50 opacity-80'
                  : isReplacement
                    ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-200/80 dark:border-purple-900/50'
                    : 'bg-white/95 dark:bg-[#0e1629] border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              {/* Top Accent Gradient Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${isCancelled ? 'from-rose-500 to-red-600' : isReplacement ? 'from-purple-500 to-indigo-600' : 'from-indigo-500 via-blue-500 to-teal-400'}`} />

              <div>
                {/* Header: Class + Subject */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientBox} text-white font-black text-base flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      {lesson.className}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {lesson.subject}
                      </h4>
                      <span className="text-xs text-slate-400 font-semibold">
                        {lesson.lessonNumber}-й урок ({lesson.time})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status pill & remaining time */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  {statusBadges[lesson.status]}
                  {lesson.timeRemaining !== '—' && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5 bg-slate-100/80 dark:bg-white/5 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      Осталось {lesson.timeRemaining}
                    </span>
                  )}
                </div>

                {/* Simulated Lesson Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1.5">
                    <span>Прогресс урока</span>
                    <span>28 / 45 мин (62%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 w-[62%]" />
                  </div>
                </div>

                {/* Teacher and Room details */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> Учитель:
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{lesson.teacher}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <DoorOpen className="w-3.5 h-3.5 text-slate-400" /> Кабинет:
                    </span>
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                      {lesson.room}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Посещаемость:</span>
                    <span className={`font-bold ${lesson.attendanceChecked ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {lesson.attendanceChecked
                        ? `${lesson.presentCount} из ${lesson.totalStudents} уч.`
                        : 'Не отмечено'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full !rounded-xl hover:!border-indigo-400 hover:!text-indigo-600 font-bold"
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
