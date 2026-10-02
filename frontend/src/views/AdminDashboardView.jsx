import React from 'react';
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  DoorOpen,
  GraduationCap,
  Megaphone,
  Plus,
  Radio,
  Repeat2,
  UserRoundCheck,
  UsersRound,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatsCard } from '../components/ui/StatsCard';

export const AdminDashboardView = () => {
  const {
    currentUser,
    currentSchool,
    teachers,
    classes,
    classrooms,
    liveLessons,
    substitutions,
    announcements,
    dashboardStats,
    backendConnected,
    setActiveView
  } = useApp();

  const freeTeachers = teachers.filter(item => item.status === 'free');
  const absentTeachers = teachers.filter(item => ['absent', 'sick'].includes(item.status));
  const freeRooms = classrooms.filter(item => item.status === 'free');
  const activeLessons = liveLessons.filter(item => item.status !== 'cancelled');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Frappe Desk Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {currentSchool.name} · Школа работает штатно
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Обзор школы
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Сегодня запланировано {dashboardStats?.lessons ?? 184} уроков в {dashboardStats?.grades ?? classes.length} классах · Посещаемость 98.4%
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            icon={Repeat2}
            onClick={() => setActiveView('substitutions')}
          >
            Оформить замену
          </Button>
          <Button
            size="sm"
            icon={Plus}
            onClick={() => setActiveView('announcements')}
          >
            Новое объявление
          </Button>
        </div>
      </div>

      {/* Frappe Number Cards (KPI widgets) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Преподаватели"
          value={dashboardStats?.teachers ?? teachers.length}
          subtitle={`${freeTeachers.length} свободны прямо сейчас`}
          icon={GraduationCap}
          trend={{ value: "+2", isPositive: true }}
          onClick={() => setActiveView('teachers')}
        />
        <StatsCard
          title="Учебные классы"
          value={dashboardStats?.grades ?? classes.length}
          subtitle="2 смены обучения"
          icon={UsersRound}
          onClick={() => setActiveView('classes')}
        />
        <StatsCard
          title="Уроков сегодня"
          value={dashboardStats?.lessons ?? 184}
          subtitle={`${activeLessons.length} активны прямо сейчас`}
          icon={CalendarDays}
          trend={{ value: "100%", isPositive: true }}
          onClick={() => setActiveView('schedule')}
        />
        <StatsCard
          title="Требуют внимания"
          value={(dashboardStats?.absent_teachers ?? absentTeachers.length) + 2}
          subtitle="Замены и пропуски"
          icon={CircleAlert}
          trend={{ value: "Срочно", isPositive: false }}
          onClick={() => setActiveView('substitutions')}
        />
      </div>

      {/* Main Grid: Live Lessons and Right Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.8fr] gap-6">
        {/* Live Lessons Card */}
        <Card className="!p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <h2 className="font-semibold text-base text-slate-900 dark:text-white">Школа сейчас</h2>
                <Badge variant="danger" size="sm">LIVE</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Текущий урок · 08:50 – 09:35 · 17 мин до звонка
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setActiveView('liveLessons')}
              className="text-xs"
            >
              Открыть монитор <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {activeLessons.slice(0, 5).map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => setActiveView('liveLessons')}
                className="w-full px-5 py-3.5 flex items-center gap-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center justify-center text-slate-800 dark:text-slate-200 shrink-0">
                  {lesson.className}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                    {lesson.subject}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {lesson.teacher} · <span className="text-slate-700 dark:text-slate-300">Каб. {lesson.room}</span>
                  </div>
                </div>

                <div className="hidden sm:block text-right shrink-0">
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    {lesson.attendanceChecked ? `${lesson.presentCount}/${lesson.totalStudents} в классе` : 'Не отмечено'}
                  </div>
                  <div className="mt-0.5">
                    <Badge
                      variant={lesson.attendanceChecked ? 'success' : 'warning'}
                      size="sm"
                      dot
                    >
                      {lesson.attendanceChecked ? 'Заполнено' : 'Нужна отметка'}
                    </Badge>
                  </div>
                </div>

                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
              </div>
            ))}
          </div>
        </Card>

        {/* Right Sidebar: Urgent Tasks & AI Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Нужно решить сегодня" subtitle="Срочные задачи и согласования" />
            <div className="space-y-2">
              <button
                onClick={() => setActiveView('substitutions')}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-amber-200/80 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/40 hover:bg-amber-50 text-left transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 flex items-center justify-center shrink-0">
                  <Repeat2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    2 замены без подтверждения
                  </div>
                  <div className="text-[11px] text-amber-800 dark:text-amber-400 mt-0.5">
                    Урок начнётся через 40 мин
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveView('attendance')}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/70 text-left transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <UserRoundCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    7 журналов не заполнены
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    За вчерашнюю вторую смену
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveView('schedule')}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-emerald-200/80 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800/40 hover:bg-emerald-50 text-left transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    Новое расписание готово
                  </div>
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-400 mt-0.5">
                    Проверьте перед публикацией
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </Card>

          {/* AI Schedule Assistant Desk Card */}
          <Card className="border-slate-200 dark:border-slate-800 bg-slate-900 text-white dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  <Sparkles className="w-3 h-3 text-amber-300" /> AI-Оптимизатор
                </span>
                <h3 className="mt-2 text-sm font-bold text-white">
                  Собрать расписание без коллизий
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Автоматический расчет нагрузки, доступности кабинетов и санитарных норм.
                </p>
                <button
                  onClick={() => setActiveView('scheduleWizard')}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-medium hover:bg-slate-100 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Запустить мастер
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom 3 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Свободные ресурсы" subtitle="Доступны прямо сейчас в школе" />
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveView('teachers')}
              className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-left hover:bg-slate-100/70 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{freeTeachers.length}</div>
              <div className="text-xs text-slate-500">свободных учителей</div>
            </button>
            <button
              onClick={() => setActiveView('classrooms')}
              className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-left hover:bg-slate-100/70 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center">
                <DoorOpen className="w-4 h-4" />
              </div>
              <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{freeRooms.length}</div>
              <div className="text-xs text-slate-500">свободных кабинетов</div>
            </button>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Ближайшие замены"
            subtitle="Сегодня и завтра"
            action={<button onClick={() => setActiveView('substitutions')} className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium">Все ({substitutions.length})</button>}
          />
          <div className="space-y-2">
            {substitutions.slice(0, 3).map(item => (
              <div key={item.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                  {item.className}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 dark:text-white truncate">{item.subject}</div>
                  <div className="text-[11px] text-slate-500 truncate">{item.replacementTeacher} · {item.lessonNumber}-й урок</div>
                </div>
                <Badge variant={item.status === 'confirmed' ? 'success' : 'warning'} size="sm">
                  {item.status === 'confirmed' ? 'Готово' : 'Ожидает'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Новости и события"
            subtitle="Последние публикации"
            action={<button onClick={() => setActiveView('announcements')} className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium">Все</button>}
          />
          <div className="space-y-2">
            {announcements.slice(0, 3).map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView('announcements')}
                className="w-full text-left flex gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                  <Megaphone className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-800 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {item.content}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-400 pb-2">
        <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-500' : 'bg-slate-400'}`} />
        {backendConnected ? 'Сервер Django подключен и синхронизирован' : 'Демонстрационный режим Smart School Desk'} · Frappe UI Edition
      </div>
    </div>
  );
};
