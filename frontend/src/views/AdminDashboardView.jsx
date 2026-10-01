import React from 'react';
import {
  ArrowUpRight,
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
  Sparkles,
  UserRoundCheck,
  UsersRound,
  Activity,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';


const Metric = ({ icon: Icon, label, value, detail, color }) => {
  const colors = {
    blue: {
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      iconBox: 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25',
      accent: 'border-l-4 border-blue-500'
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      iconBox: 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25',
      accent: 'border-l-4 border-amber-500'
    },
    green: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      iconBox: 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md shadow-emerald-500/25',
      accent: 'border-l-4 border-emerald-500'
    },
    violet: {
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      iconBox: 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-500/25',
      accent: 'border-l-4 border-purple-500'
    }
  };

  const scheme = colors[color] || colors.blue;

  return (
    <div className={`flex items-center gap-3.5 min-w-0 p-2 sm:p-3 rounded-2xl transition-all duration-300 hover:bg-slate-50/80 dark:hover:bg-white/[0.03]`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${scheme.iconBox}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[26px] leading-none font-black tracking-tight text-slate-900 dark:text-white">{value}</div>
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 truncate">{label}</div>
        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate font-medium">{detail}</div>
      </div>
    </div>
  );
};


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
      {/* Vivid Header Hero Banner */}
      <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#0a132c] via-[#10204d] to-[#1e1346] text-white px-6 py-7 sm:px-9 sm:py-8 shadow-[0_25px_60px_rgba(10,19,44,0.25)] border border-white/10">
        {/* Ambient Gradient Orbs */}
        <div className="absolute -right-16 -top-20 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/25 to-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-36 -bottom-24 w-72 h-72 rounded-full bg-gradient-to-tr from-blue-500/20 to-teal-400/20 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

        <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-end">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-white shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              Школа работает штатно
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-emerald-300 font-medium">98.4% посещаемость</span>
            </div>

            <h1 className="mt-4 text-2xl sm:text-[34px] leading-tight font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-50 to-blue-200">
              Добрый день, {currentUser.name.split(' ')[0] || 'директор'}
            </h1>
            <p className="mt-2 text-sm text-blue-100/75 max-w-xl font-medium">
              {currentSchool.name}. Сегодня запланировано <span className="text-amber-300 font-bold">{dashboardStats?.lessons ?? 184}</span> уроков в <span className="text-white font-bold">{dashboardStats?.grades ?? classes.length}</span> классах.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              icon={Repeat2}
              className="!border-white/25 !bg-white/10 !text-white hover:!bg-white/20 backdrop-blur-md"
              onClick={() => setActiveView('substitutions')}
            >
              Оформить замену
            </Button>
            <Button
              variant="amber"
              icon={Plus}
              onClick={() => setActiveView('announcements')}
            >
              Объявление
            </Button>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <Card className="!p-3 sm:!p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 lg:divide-x divide-slate-100 dark:divide-white/10">
          <Metric icon={GraduationCap} label="Учителей" value={dashboardStats?.teachers ?? teachers.length} detail={`${freeTeachers.length} свободны сейчас`} color="blue" />
          <div className="lg:pl-4"><Metric icon={UsersRound} label="Классов" value={dashboardStats?.grades ?? classes.length} detail="Две активные смены" color="violet" /></div>
          <div className="lg:pl-4"><Metric icon={CalendarDays} label="Уроков сегодня" value={dashboardStats?.lessons ?? 184} detail={`${activeLessons.length} идут прямо сейчас`} color="green" /></div>
          <div className="lg:pl-4"><Metric icon={CircleAlert} label="Требуют внимания" value={(dashboardStats?.absent_teachers ?? absentTeachers.length) + 2} detail="Отсутствия и замены" color="amber" /></div>
        </div>
      </Card>

      {/* Main Grid: Live Lessons and Right Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.8fr] gap-6">
        {/* Live Lessons Card */}
        <Card className="!p-0 overflow-hidden border border-slate-200/80 dark:border-slate-800">
          <div className="px-5 sm:px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between gap-4 bg-gradient-to-r from-slate-50/80 via-white to-indigo-50/30 dark:from-slate-900 dark:to-slate-800/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
                <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">Школа сейчас</h2>
                <Badge variant="danger" size="sm">LIVE</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Текущий урок · 08:50 – 09:35 · 17 мин до звонка</p>
            </div>
            <button
              onClick={() => setActiveView('liveLessons')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
            >
              Открыть монитор <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/10">
            {activeLessons.slice(0, 5).map((lesson, index) => {
              const bgBadge = index % 3 === 0 
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20' 
                : index % 3 === 1 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20' 
                  : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20';

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveView('liveLessons')}
                  className="w-full px-5 sm:px-6 py-4 flex items-center gap-4 hover:bg-indigo-50/40 dark:hover:bg-white/[0.03] text-left transition-all duration-200 group"
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${bgBadge} group-hover:scale-105 transition-transform`}>
                    {lesson.className}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-slate-800 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {lesson.subject}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {lesson.teacher} · <span className="font-semibold text-slate-700 dark:text-slate-300">{lesson.room}</span>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {lesson.attendanceChecked ? `${lesson.presentCount}/${lesson.totalStudents} в классе` : 'Не отмечено'}
                    </div>
                    <div className="mt-1">
                      <Badge
                        variant={lesson.attendanceChecked ? 'success' : 'warning'}
                        size="sm"
                        dot={!lesson.attendanceChecked}
                      >
                        {lesson.attendanceChecked ? 'Заполнено' : 'Нужна отметка'}
                      </Badge>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>
              );
            })}
          </div>
        </Card>

        {/* Right Sidebar: Urgent Tasks & AI Card */}
        <div className="space-y-6">
          <Card className="border border-slate-200/80 dark:border-slate-800">
            <CardHeader title="Нужно решить сегодня" subtitle="Срочные задачи и согласования" />
            <div className="space-y-3">
              <button
                onClick={() => setActiveView('substitutions')}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50 hover:shadow-md hover:shadow-amber-500/10 text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <Repeat2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate">2 замены без подтверждения</div>
                  <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 font-medium">Первый урок начнётся через 40 мин</div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveView('attendance')}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 hover:shadow-md hover:shadow-indigo-500/10 text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <UserRoundCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate">7 журналов не заполнены</div>
                  <div className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-0.5 font-medium">За вчерашнюю вторую смену</div>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveView('schedule')}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 hover:shadow-md hover:shadow-emerald-500/10 text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate">Новое расписание готово</div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 font-medium">Проверьте перед публикацией</div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>

          {/* AI Schedule Assistant Card with Rich Gradient */}
          <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 p-6 text-white shadow-xl shadow-indigo-500/25 border border-white/20">
            <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-xl" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI-Оптимизатор
                </span>
                <h3 className="mt-3 text-lg font-black leading-snug">Собрать расписание без коллизий</h3>
                <p className="text-xs text-indigo-100/80 mt-2 leading-relaxed font-medium">
                  Алгоритм автоматически распределит уроки с учетом санитарных норм, доступности кабинетов и лимита часов.
                </p>
                <button
                  onClick={() => setActiveView('scheduleWizard')}
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 text-xs font-black shadow-lg shadow-black/10 hover:bg-indigo-50 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" /> Запустить мастер
                </button>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 3 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border border-slate-200/80 dark:border-slate-800">
          <CardHeader title="Свободные ресурсы" subtitle="Доступны прямо сейчас в школе" />
          <div className="grid grid-cols-2 gap-3.5">
            <button
              onClick={() => setActiveView('teachers')}
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/50 text-left hover:scale-[1.02] transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">{freeTeachers.length}</div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">свободных учителей</div>
            </button>
            <button
              onClick={() => setActiveView('classrooms')}
              className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-100 dark:border-emerald-900/50 text-left hover:scale-[1.02] transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <DoorOpen className="w-5 h-5" />
              </div>
              <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">{freeRooms.length}</div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">свободных кабинетов</div>
            </button>
          </div>
        </Card>

        <Card className="border border-slate-200/80 dark:border-slate-800">
          <CardHeader
            title="Ближайшие замены"
            subtitle="Сегодня и завтра"
            action={<button onClick={() => setActiveView('substitutions')} className="text-xs font-bold text-indigo-600 hover:underline">Все ({substitutions.length})</button>}
          />
          <div className="space-y-3">
            {substitutions.slice(0, 3).map(item => (
              <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-black text-xs flex items-center justify-center shrink-0">
                  {item.className}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-800 dark:text-white truncate">{item.subject}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.replacementTeacher} · {item.lessonNumber}-й урок</div>
                </div>
                <Badge variant={item.status === 'confirmed' ? 'success' : 'warning'} size="sm">
                  {item.status === 'confirmed' ? 'Готово' : 'Ожидает'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border border-slate-200/80 dark:border-slate-800">
          <CardHeader
            title="Новости и события"
            subtitle="Последние публикации"
            action={<button onClick={() => setActiveView('announcements')} className="text-xs font-bold text-indigo-600 hover:underline">Все</button>}
          />
          <div className="space-y-3">
            {announcements.slice(0, 3).map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView('announcements')}
                className="w-full text-left flex gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {item.content}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-400 pb-2 font-medium">
        <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-500' : 'bg-blue-400'}`} />
        {backendConnected ? 'Сервер Django подключен и синхронизирован' : 'Демонстрационный режим Smart School'} · Версия 1.0
      </div>
    </div>
  );
};
