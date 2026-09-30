import React, { useState } from 'react';
import {
  User,
  Calendar,
  BookOpen,
  CheckCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { StatsCard } from '../components/ui/StatsCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const ParentDashboardView = () => {
  const { currentUser, setActiveView, announcements } = useApp();

  const childrenList = [
    { id: 'ch-1', name: 'Шарипов Алишер', class: '7А класс', gpa: '4.65', attendance: '98.2%', teacher: 'Саидова Нигора Акмаловна' },
    { id: 'ch-2', name: 'Шарипова Мадина', class: '4Б класс', gpa: '4.85', attendance: '100%', teacher: 'Расулова Гульнора М.' },
  ];

  const [selectedChildId, setSelectedChildId] = useState('ch-1');
  const activeChild = childrenList.find(c => c.id === selectedChildId) || childrenList[0];

  const childSchedule = [
    { num: 1, time: "08:00 – 08:45", subject: "Алгебра", room: "302", teacher: "Каримова М. Р.", status: "Проведён" },
    { num: 2, time: "08:50 – 09:35", subject: "Русский язык", room: "101", teacher: "Саидова Н. А.", status: "Идёт сейчас" },
    { num: 3, time: "09:45 – 10:30", subject: "Английский язык", room: "102", teacher: "Замена: Каримова М. Р.", status: "Ожидается" },
    { num: 4, time: "10:45 – 11:30", subject: "Физика", room: "204", teacher: "Иванов А. С.", status: "Ожидается" },
  ];

  const childGrades = [
    { subject: "Алгебра", grade: 5, date: "Сегодня", type: "Контрольная №1", comment: "Отличная работа без ошибок" },
    { subject: "Физика", grade: 4, date: "29 сен", type: "Лабораторная работа", comment: "Хорошие выводы" },
    { subject: "Русский язык", grade: 5, date: "28 сен", type: "Словарный диктант", comment: "0 ошибок" },
    { subject: "История", grade: 4, date: "26 сен", type: "Ответ у доски", comment: "" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Child Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Кабинет родителя: {currentUser.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Мониторинг успеваемости, посещаемости и школьного расписания детей
          </p>
        </div>

        {/* Child Switcher Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          {childrenList.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChildId(ch.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedChildId === ch.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{ch.name}</span>
              <span className="text-[11px] opacity-70">({ch.class})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Child Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard
          title="Средний балл"
          value={activeChild.gpa}
          subtitle="За 1-ю четверть"
          icon={TrendingUp}
          color="indigo"
          onClick={() => setActiveView('grades')}
        />
        <StatsCard
          title="Посещаемость"
          value={activeChild.attendance}
          subtitle="Без неоправданных пропусков"
          icon={CheckCircle}
          color="emerald"
          onClick={() => setActiveView('attendance')}
        />
        <StatsCard
          title="Классный руководитель"
          value={activeChild.class}
          subtitle={activeChild.teacher}
          icon={User}
          color="teal"
        />
        <StatsCard
          title="Заданий на дом"
          value="3"
          subtitle="На текущую неделю"
          icon={FileText}
          color="amber"
          onClick={() => setActiveView('homework')}
        />
      </div>

      {/* Schedule Changes Alert Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
        <div className="flex-1">
          <span className="font-semibold">Внимание: Замена учителя в расписании сегодня!</span>
          <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
            3-й урок (Английский язык) проведёт Каримова М. Р. в связи с временным больничным Юсуповой З. Д. Урок пройдёт в штатном режиме в кабинете 102.
          </p>
        </div>
      </div>

      {/* Main Grid: Child Schedule & Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title={`Расписание уроков: ${activeChild.name} (${activeChild.class})`}
              subtitle="Среда, 30 сентября • 4 урока"
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => setActiveView('schedule')}
                >
                  Расписание на неделю
                </Button>
              }
            />

            <div className="space-y-3">
              {childSchedule.map((s) => (
                <div
                  key={s.num}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 flex items-center justify-between gap-3 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      {s.num}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {s.subject}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {s.time} • Каб. {s.room} • {s.teacher}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                    s.status === 'Идёт сейчас'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse'
                      : 'text-slate-400'
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Child Grades */}
          <Card>
            <CardHeader
              title="Оценки и комментарии учителей"
              subtitle="Электронный табель успеваемости"
              action={
                <button
                  onClick={() => setActiveView('grades')}
                  className="text-xs text-indigo-600 font-medium hover:underline"
                >
                  Полный табель &rarr;
                </button>
              }
            />

            <div className="space-y-3">
              {childGrades.map((g, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 flex items-start justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{g.subject}</span>
                      <span className="text-slate-400 text-xs">• {g.type} ({g.date})</span>
                    </div>
                    {g.comment && (
                      <p className="text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1.5 italic">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        «{g.comment}»
                      </p>
                    )}
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-lg flex items-center justify-center border border-emerald-200/60 shrink-0">
                    {g.grade}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Attendance record & Notices */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Журнал посещаемости"
              subtitle="Статистика за сентябрь"
            />
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                <span>Присутствовал на уроках:</span>
                <span className="font-bold">116 уроков (98.2%)</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300">
                <span>Пропуски по болезни (справка):</span>
                <span className="font-bold">2 урока</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
                <span>Опоздания:</span>
                <span className="font-bold">1 раз (10 минут)</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <span>Без уважительной причины:</span>
                <span className="font-bold">0 уроков</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Для родителей"
              action={
                <button
                  onClick={() => setActiveView('announcements')}
                  className="text-xs text-indigo-600 font-medium hover:underline"
                >
                  Все &rarr;
                </button>
              }
            />

            <div className="space-y-3">
              {announcements.filter(a => a.targetAudience === 'parents' || a.targetAudience === 'all').slice(0, 2).map((a) => (
                <div key={a.id} className="text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{a.title}</p>
                  <p className="text-slate-500 mt-1 line-clamp-2">{a.content}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{a.date}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
