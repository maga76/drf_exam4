import React from 'react';
import {
  Clock,
  Calendar,
  BookOpen,
  FileText,
  Award,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { StatsCard } from '../components/ui/StatsCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const StudentDashboardView = () => {
  const { currentUser, setActiveView, announcements } = useApp();

  const studentLessons = [
    { number: 1, time: "08:00 – 08:45", subject: "Алгебра", teacher: "Каримова М. Р.", room: "302", done: true, grade: 5 },
    { number: 2, time: "08:50 – 09:35", subject: "Русский язык", teacher: "Саидова Н. А.", room: "101", isCurrent: true },
    { number: 3, time: "09:45 – 10:30", subject: "Английский язык", teacher: "Юсупова З. Д.", room: "102" },
    { number: 4, time: "10:45 – 11:30", subject: "Физика", teacher: "Иванов А. С.", room: "204" },
    { number: 5, time: "11:35 – 12:20", subject: "Информатика", teacher: "Рахимов Ф. З.", room: "201" },
  ];

  const recentGrades = [
    { subject: "Алгебра", value: 5, type: "Контрольная работа", date: "Сегодня", teacher: "Каримова М. Р." },
    { subject: "Физика", value: 4, type: "Лабораторная", date: "Вчера", teacher: "Иванов А. С." },
    { subject: "Русский язык", value: 5, type: "Диктант", date: "28 сен", teacher: "Саидова Н. А." },
    { subject: "История", value: 4, type: "Устный ответ", date: "27 сен", teacher: "Шарипов С. Т." },
  ];

  const homeworkDue = [
    { subject: "Физика", title: "Лаб. работа №3 (конспект и выводы)", due: "Завтра, 08:00", urgent: true },
    { subject: "Алгебра", title: "№ 245 (а, б), № 248 в тетради", due: "Пт, 02 окт", urgent: false },
    { subject: "Русский язык", title: "Упражнение 112 (причастия)", due: "Чт, 01 окт", urgent: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Привет, {currentUser.name}! 🎓
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            7А класс • Среда, 30 сентября 2026 г. • 5 уроков сегодня
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={Calendar}
            onClick={() => setActiveView('schedule')}
          >
            Моё расписание
          </Button>
          <Button
            size="sm"
            icon={BookOpen}
            onClick={() => setActiveView('grades')}
          >
            Дневник оценок
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard
          title="Средний балл (GPA)"
          value="4.65"
          subtitle="Отличная успеваемость"
          icon={Award}
          trend={{ value: "+0.15", isPositive: true }}
          color="indigo"
          onClick={() => setActiveView('grades')}
        />
        <StatsCard
          title="Посещаемость"
          value="98.2%"
          subtitle="1 пропуск по уваж. причине"
          icon={CheckCircle}
          color="emerald"
          onClick={() => setActiveView('attendance')}
        />
        <StatsCard
          title="Заданий на дом"
          value="3"
          subtitle="1 срочное к сдаче"
          icon={FileText}
          color="amber"
          onClick={() => setActiveView('homework')}
        />
        <StatsCard
          title="Место в классе"
          value="2-е"
          subtitle="Среди 28 учеников"
          icon={TrendingUp}
          color="violet"
        />
      </div>

      {/* Next Lesson Spotlight */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
            Следующий урок прямо сейчас
          </span>
          <h3 className="text-xl font-bold">
            Русский язык — Кабинет 101 (1 этаж)
          </h3>
          <p className="text-teal-100 text-xs sm:text-sm mt-1">
            08:50 – 09:35 • Учитель: Саидова Нигора Акмаловна • Тема: «Причастный оборот»
          </p>
        </div>

        <Button
          size="sm"
          className="bg-white text-teal-800 hover:bg-teal-50 shrink-0 font-semibold"
          onClick={() => setActiveView('homework')}
        >
          Открыть задание к уроку
        </Button>
      </div>

      {/* Main Grid: Today's schedule, homework, recent grades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Расписание на сегодня"
              subtitle="5 уроков • Окончание в 12:20"
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => setActiveView('schedule')}
                >
                  Вся неделя
                </Button>
              }
            />

            <div className="space-y-3">
              {studentLessons.map((l) => (
                <div
                  key={l.number}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    l.isCurrent
                      ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/60 dark:bg-indigo-950/40'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center ${
                      l.isCurrent
                        ? 'bg-indigo-600 text-white'
                        : l.done
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {l.number}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {l.subject}
                        </span>
                        {l.isCurrent && <Badge variant="primary" size="sm">Текущий</Badge>}
                        {l.grade && (
                          <Badge variant="success" size="sm">Оценка: {l.grade}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {l.time} • Каб. {l.room} • {l.teacher}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 font-medium">
                    {l.done ? 'Завершён' : l.isCurrent ? 'Идёт' : 'Ожидается'}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Grades table */}
          <Card>
            <CardHeader
              title="Последние полученные оценки"
              subtitle="Электронный дневник"
              action={
                <button
                  onClick={() => setActiveView('grades')}
                  className="text-xs text-indigo-600 font-medium hover:underline"
                >
                  Все оценки &rarr;
                </button>
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentGrades.map((g, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block text-sm">
                      {g.subject}
                    </span>
                    <span className="text-slate-400 text-[11px]">{g.type} • {g.date}</span>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-lg flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800">
                    {g.value}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Homework Due & Announcements */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Домашние задания"
              subtitle="Ближайшие дедлайны"
              action={
                <button
                  onClick={() => setActiveView('homework')}
                  className="text-xs text-indigo-600 font-medium hover:underline"
                >
                  Все &rarr;
                </button>
              }
            />

            <div className="space-y-3">
              {homeworkDue.map((h, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{h.subject}</span>
                    <Badge variant={h.urgent ? 'danger' : 'neutral'} size="sm">
                      {h.due}
                    </Badge>
                  </div>
                  <p className="text-slate-500 line-clamp-2">{h.title}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Объявления школы"
              action={
                <button
                  onClick={() => setActiveView('announcements')}
                  className="text-xs text-indigo-600 font-medium hover:underline"
                >
                  Все &rarr;
                </button>
              }
            />

            <div className="space-y-2.5">
              {announcements.slice(0, 2).map((a) => (
                <div key={a.id} className="text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{a.title}</p>
                  <p className="text-slate-500 mt-1 line-clamp-2">{a.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
