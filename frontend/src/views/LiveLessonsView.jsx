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
  RefreshCw
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
    endingSoon: <Badge variant="warning" dot>Скоро закончится</Badge>,
    replacement: <Badge variant="purple" dot>Замена учителя</Badge>,
    cancelled: <Badge variant="danger" dot>Урок отменён</Badge>
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            Живые уроки (Прямой эфир школы)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            2-й урок • 08:50 – 09:35 • Активно 4 из 5 учебных кабинетов
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
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-sm">
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
            <option value="1">1 этаж</option>
            <option value="2">2 этаж</option>
            <option value="3">3 этаж</option>
          </Select>

          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-auto text-xs py-1.5"
          >
            <option value="all">Все статусы</option>
            <option value="ongoing">Идёт</option>
            <option value="endingSoon">Скоро закончится</option>
            <option value="replacement">Замена</option>
            <option value="cancelled">Отменён</option>
          </Select>
        </div>
      </div>

      {/* Live Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`p-5 rounded-2xl border transition-all shadow-card flex flex-col justify-between ${
              lesson.status === 'cancelled'
                ? 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200/70 dark:border-rose-900/40 opacity-75'
                : lesson.status === 'replacement'
                ? 'bg-purple-50/30 dark:bg-purple-950/20 border-purple-200/70 dark:border-purple-900/40'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:shadow-card-hover'
            }`}
          >
            <div>
              {/* Header: Class + Status Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {lesson.className}
                  </span>
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {lesson.subject}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">
                      {lesson.lessonNumber}-й урок ({lesson.time})
                    </span>
                  </div>
                </div>
              </div>

              {/* Status pill & remaining time */}
              <div className="flex items-center justify-between mb-4">
                {statusBadges[lesson.status]}
                {lesson.timeRemaining !== '—' && (
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Осталось {lesson.timeRemaining}
                  </span>
                )}
              </div>

              {/* Teacher and Room info */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Преподаватель:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{lesson.teacher}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Кабинет:</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{lesson.room}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Посещаемость:</span>
                  <span className={`font-semibold ${lesson.attendanceChecked ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {lesson.attendanceChecked
                      ? `${lesson.presentCount} из ${lesson.totalStudents} уч. (отмечено)`
                      : 'Не заполнено'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="w-full"
                icon={CheckSquare}
                onClick={() => setActiveView('attendance')}
              >
                Открыть журнал урока
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
