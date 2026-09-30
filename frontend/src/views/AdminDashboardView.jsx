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
  UsersRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';


const Metric = ({ icon: Icon, label, value, detail, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
    violet: 'bg-violet-50 text-violet-700'
  };

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[24px] leading-none font-extrabold tracking-tight text-[#14213d] dark:text-white">{value}</div>
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1 truncate">{label}</div>
        <div className="text-[10px] text-slate-400 mt-0.5 truncate">{detail}</div>
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
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] bg-[#0b1739] text-white px-6 py-6 sm:px-8 sm:py-7 shadow-[0_20px_50px_rgba(11,23,57,0.18)]">
        <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full border-[42px] border-blue-400/10" />
        <div className="absolute right-28 bottom-[-80px] w-52 h-52 rounded-full bg-blue-500/10 blur-2xl" />

        <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-end">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-blue-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Школа работает штатно
            </div>
            <h1 className="mt-4 text-2xl sm:text-[32px] leading-tight font-extrabold tracking-[-0.03em]">
              Добрый день, {currentUser.name.split(' ')[0] || 'директор'}
            </h1>
            <p className="mt-2 text-sm text-blue-100/65 max-w-xl">
              Вторник, 30 сентября · {currentSchool.name}. На сегодня запланировано {dashboardStats?.lessons ?? 184} урока.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" icon={Repeat2} className="!border-white/20 !bg-white/10 !text-white hover:!bg-white/15" onClick={() => setActiveView('substitutions')}>
              Оформить замену
            </Button>
            <Button icon={Plus} className="!bg-amber-400 !text-[#0b1739] hover:!bg-amber-300" onClick={() => setActiveView('announcements')}>
              Объявление
            </Button>
          </div>
        </div>
      </section>

      <Card className="!p-5 sm:!p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:divide-x divide-slate-100 dark:divide-white/10">
          <Metric icon={GraduationCap} label="Учителей" value={dashboardStats?.teachers ?? teachers.length} detail={`${freeTeachers.length} свободны сейчас`} color="blue" />
          <div className="lg:pl-6"><Metric icon={UsersRound} label="Классов" value={dashboardStats?.grades ?? classes.length} detail="31 класс в двух сменах" color="violet" /></div>
          <div className="lg:pl-6"><Metric icon={CalendarDays} label="Уроков сегодня" value={dashboardStats?.lessons ?? 184} detail={`${activeLessons.length} идут прямо сейчас`} color="green" /></div>
          <div className="lg:pl-6"><Metric icon={CircleAlert} label="Требуют внимания" value={(dashboardStats?.absent_teachers ?? absentTeachers.length) + 2} detail="Отсутствия и замены" color="amber" /></div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.8fr] gap-6">
        <Card className="!p-0 overflow-hidden">
          <div className="px-5 sm:px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-500" />
                <h2 className="font-bold text-lg text-[#14213d] dark:text-white">Школа сейчас</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">2-й урок · 08:50–09:35 · осталось 17 минут</p>
            </div>
            <button onClick={() => setActiveView('liveLessons')} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
              Открыть монитор <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/10">
            {activeLessons.slice(0, 5).map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => setActiveView('liveLessons')}
                className="w-full px-5 sm:px-6 py-4 flex items-center gap-4 hover:bg-blue-50/40 dark:hover:bg-white/[0.03] text-left transition-colors"
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm ${index % 3 === 0 ? 'bg-blue-50 text-blue-700' : index % 3 === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {lesson.className}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-800 dark:text-white truncate">{lesson.subject}</div>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">{lesson.teacher} · {lesson.room}</div>
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {lesson.attendanceChecked ? `${lesson.presentCount}/${lesson.totalStudents} в классе` : 'Не отмечено'}
                  </div>
                  <div className={`text-[10px] mt-1 font-bold ${lesson.attendanceChecked ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {lesson.attendanceChecked ? 'Посещаемость заполнена' : 'Нужна отметка'}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300" />
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Нужно решить сегодня" subtitle="Задачи, которые нельзя пропустить" />
            <div className="space-y-2.5">
              <button onClick={() => setActiveView('substitutions')} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-amber-50/80 hover:bg-amber-50 text-left">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center"><Repeat2 className="w-4 h-4" /></div>
                <div className="flex-1"><div className="text-sm font-bold text-slate-800">2 замены без подтверждения</div><div className="text-[11px] text-slate-500 mt-0.5">Первый урок начнётся через 40 минут</div></div>
                <ChevronRight className="w-4 h-4 text-amber-500" />
              </button>
              <button onClick={() => setActiveView('attendance')} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-blue-50/70 hover:bg-blue-50 text-left">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center"><UserRoundCheck className="w-4 h-4" /></div>
                <div className="flex-1"><div className="text-sm font-bold text-slate-800">7 журналов не заполнены</div><div className="text-[11px] text-slate-500 mt-0.5">За вчерашнюю вторую смену</div></div>
                <ChevronRight className="w-4 h-4 text-blue-500" />
              </button>
              <button onClick={() => setActiveView('schedule')} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-50 text-left">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
                <div className="flex-1"><div className="text-sm font-bold text-slate-800">Расписание готово</div><div className="text-[11px] text-slate-500 mt-0.5">Можно опубликовать изменения</div></div>
                <ChevronRight className="w-4 h-4 text-emerald-500" />
              </button>
            </div>
          </Card>

          <Card className="!bg-blue-600 !border-blue-600 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-blue-100 uppercase tracking-wider">AI-помощник</div>
                <h3 className="mt-2 text-lg font-bold">Собрать расписание без конфликтов</h3>
                <p className="text-xs text-blue-100/75 mt-2 leading-relaxed">Учтём смены, кабинеты, нагрузку и доступность учителей.</p>
                <button onClick={() => setActiveView('scheduleWizard')} className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-blue-700 text-xs font-bold">
                  <Sparkles className="w-4 h-4" /> Запустить генератор
                </button>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0"><Sparkles className="w-6 h-6" /></div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Свободные ресурсы" subtitle="Доступны до конца текущего урока" />
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setActiveView('teachers')} className="p-4 rounded-2xl bg-[#f4f7fb] dark:bg-white/5 text-left">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <div className="mt-3 text-2xl font-extrabold text-[#14213d] dark:text-white">{freeTeachers.length}</div>
              <div className="text-xs text-slate-500">свободных учителей</div>
            </button>
            <button onClick={() => setActiveView('classrooms')} className="p-4 rounded-2xl bg-[#f4f7fb] dark:bg-white/5 text-left">
              <DoorOpen className="w-5 h-5 text-emerald-600" />
              <div className="mt-3 text-2xl font-extrabold text-[#14213d] dark:text-white">{freeRooms.length}</div>
              <div className="text-xs text-slate-500">свободных кабинетов</div>
            </button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Ближайшие замены" subtitle="Сегодня и завтра" action={<button onClick={() => setActiveView('substitutions')} className="text-xs font-bold text-blue-600">Все</button>} />
          <div className="space-y-3">
            {substitutions.slice(0, 2).map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 font-extrabold text-xs flex items-center justify-center">{item.className}</div>
                <div className="flex-1 min-w-0"><div className="text-sm font-bold text-slate-800 dark:text-white truncate">{item.subject}</div><div className="text-[11px] text-slate-400 truncate">{item.replacementTeacher} · {item.lessonNumber}-й урок</div></div>
                <Badge variant={item.status === 'confirmed' ? 'success' : 'warning'} size="sm">{item.status === 'confirmed' ? 'Готово' : 'Ждёт'}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Новости школы" subtitle="Последние объявления" action={<button onClick={() => setActiveView('announcements')} className="text-xs font-bold text-blue-600">Открыть</button>} />
          <div className="space-y-3">
            {announcements.slice(0, 2).map(item => (
              <button key={item.id} onClick={() => setActiveView('announcements')} className="w-full text-left flex gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><Megaphone className="w-4 h-4" /></div>
                <div className="min-w-0"><div className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-blue-600">{item.title}</div><div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.content}</div></div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="text-center text-[11px] text-slate-400 pb-2">
        {backendConnected ? 'Данные синхронизированы с сервером' : 'Показаны демонстрационные данные'} · Последнее обновление сейчас
      </div>
    </div>
  );
};
