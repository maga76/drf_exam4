import React from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  CheckSquare,
  Users,
  AlertCircle,
  ArrowRight,
  FileText,
  Star,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { StatsCard } from '../components/ui/StatsCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const TeacherDashboardView = () => {
  const {
    currentUser,
    homeworkList,
    announcements,
    setActiveView
  } = useApp();

  const todaySchedule = [
    { number: 1, time: "08:00 – 08:45", class: "7А", subject: "Алгебра", room: "302", isCurrent: false, attendanceDone: true },
    { number: 2, time: "08:50 – 09:35", class: "9Б", subject: "Алгебра", room: "302", isCurrent: true, attendanceDone: false },
    { number: 3, time: "09:45 – 10:30", class: "11А", subject: "Геометрия", room: "302", isCurrent: false, attendanceDone: false },
    { number: 5, time: "11:35 – 12:20", class: "7Б", subject: "Замена: Английский", room: "102", isCurrent: false, attendanceDone: false },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Кабинет преподавателя: {currentUser.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Среда, 30 сентября 2026 г. • 4 урока сегодня • Нагрузка: 24 ч./нед.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={CheckSquare}
            onClick={() => setActiveView('attendance')}
          >
            Отметить посещаемость
          </Button>
          <Button
            size="sm"
            icon={Plus}
            onClick={() => setActiveView('homework')}
          >
            Задать ДЗ
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard
          title="Уроков сегодня"
          value="4"
          subtitle="2 проведено"
          icon={Calendar}
          color="indigo"
        />
        <StatsCard
          title="Мои классы"
          value="3"
          subtitle="7А, 9Б, 11А"
          icon={Users}
          color="teal"
        />
        <StatsCard
          title="ДЗ на проверке"
          value="18"
          subtitle="Новых ответов"
          icon={FileText}
          color="amber"
          onClick={() => setActiveView('homework')}
        />
        <StatsCard
          title="Ср. успеваемость"
          value="4.54"
          subtitle="По моим предметам"
          icon={Star}
          color="emerald"
          onClick={() => setActiveView('grades')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Schedule & Pending Attendance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Next Lesson Spotlight Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Сейчас идёт • 2-й урок
              </div>
              <h3 className="text-xl font-bold">
                9Б класс — Алгебра (Тема: «Многочлены»)
              </h3>
              <p className="text-indigo-100 text-xs sm:text-sm mt-1">
                Время: 08:50 – 09:35 • Кабинет 302 • Присутствуют 24 из 25 учеников
              </p>
            </div>

            <div className="flex sm:flex-col gap-2 shrink-0">
              <Button
                size="sm"
                className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-none font-semibold"
                onClick={() => setActiveView('attendance')}
              >
                Отметить класс
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
                onClick={() => setActiveView('grades')}
              >
                Журнал оценок
              </Button>
            </div>
          </div>

          {/* Today's Full Timeline */}
          <Card>
            <CardHeader
              title="Расписание на сегодня"
              subtitle="30 сентября, среда"
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

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {todaySchedule.map((lesson) => (
                <div
                  key={lesson.number}
                  className={`py-3.5 flex items-center justify-between gap-4 transition-colors ${
                    lesson.isCurrent ? 'bg-indigo-50/50 dark:bg-indigo-950/20 px-3 rounded-xl' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      lesson.isCurrent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {lesson.number}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                          {lesson.class} • {lesson.subject}
                        </span>
                        {lesson.isCurrent && (
                          <Badge variant="primary" size="sm">Текущий</Badge>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {lesson.time} • Каб. {lesson.room}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {lesson.attendanceDone ? (
                      <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                        ✓ Посещаемость внесена
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setActiveView('attendance')}
                      >
                        Отметить
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Homework to grade & Announcements */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Домашние задания"
              subtitle="Требуют проверки"
              action={
                <button
                  onClick={() => setActiveView('homework')}
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  Все &rarr;
                </button>
              }
            />

            <div className="space-y-3">
              {homeworkList.slice(0, 3).map((hw) => (
                <div
                  key={hw.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {hw.className} • {hw.subjectName}
                    </span>
                    <Badge variant={hw.status === 'dueSoon' ? 'warning' : 'neutral'} size="sm">
                      {hw.dueDate}
                    </Badge>
                  </div>
                  <p className="text-slate-500 line-clamp-1">{hw.title}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Сдали: {hw.submissionsCount} из {hw.totalCount} уч.</span>
                    <button
                      onClick={() => setActiveView('homework')}
                      className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    >
                      Проверить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Школьные объявления"
              action={
                <button
                  onClick={() => setActiveView('announcements')}
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  Все &rarr;
                </button>
              }
            />

            <div className="space-y-2.5">
              {announcements.slice(0, 2).map((a) => (
                <div key={a.id} className="text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{a.title}</p>
                  <p className="text-slate-500 mt-0.5 line-clamp-2">{a.content}</p>
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
