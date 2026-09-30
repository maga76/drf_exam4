import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  CalendarDays,
  DoorOpen,
  UserX,
  Repeat,
  Radio,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Megaphone,
  CheckSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { StatsCard } from '../components/ui/StatsCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input, Select, Textarea } from '../components/ui/Input';

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
    setActiveView,
    addToast
  } = useApp();

  // Modals for Quick Actions
  const [newSubstModalOpen, setNewSubstModalOpen] = useState(false);
  const [newAnnounceModalOpen, setNewAnnounceModalOpen] = useState(false);
  const [newStudentModalOpen, setNewStudentModalOpen] = useState(false);

  // Form states
  const [announceForm, setAnnounceForm] = useState({ title: '', target: 'all', content: '' });

  const freeTeachers = teachers.filter(t => t.status === 'free');
  const absentTeachers = teachers.filter(t => t.status === 'absent' || t.status === 'sick');
  const freeRooms = classrooms.filter(c => c.status === 'free');

  return (
    <div className="space-y-6">
      {/* Top Greeting & Date Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Добрый день, {currentUser.name}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Среда, 30 сентября 2026 г. • 1-я смена • {currentSchool.name}
          </p>
          <p className={`text-xs mt-1 ${backendConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
            {backendConnected ? 'Backend connected' : 'Demo data'}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            icon={Sparkles}
            onClick={() => setActiveView('scheduleWizard')}
          >
            Генератор расписания
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={Repeat}
            onClick={() => setNewSubstModalOpen(true)}
          >
            Оформить замену
          </Button>
          <Button
            size="sm"
            icon={Megaphone}
            onClick={() => setNewAnnounceModalOpen(true)}
          >
            Создать объявление
          </Button>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Всего учителей"
          value={dashboardStats?.teachers ?? teachers.length}
          subtitle="В штате школы"
          icon={GraduationCap}
          trend={{ value: "+2", isPositive: true }}
          color="indigo"
          onClick={() => setActiveView('teachers')}
        />
        <StatsCard
          title="Классов"
          value={dashboardStats?.grades ?? classes.length}
          subtitle="1–11 классы"
          icon={Users}
          color="teal"
          onClick={() => setActiveView('classes')}
        />
        <StatsCard
          title="Уроков сегодня"
          value={dashboardStats?.lessons ?? 184}
          subtitle="Идут по графику"
          icon={CalendarDays}
          color="violet"
          onClick={() => setActiveView('schedule')}
        />
        <StatsCard
          title="Отсутствуют"
          value={dashboardStats?.absent_teachers ?? absentTeachers.length}
          subtitle="Учителей на больничном"
          icon={UserX}
          color="rose"
          onClick={() => setActiveView('substitutions')}
        />
        <StatsCard
          title="Свободные кабинеты"
          value={freeRooms.length}
          subtitle="Доступны прямо сейчас"
          icon={DoorOpen}
          color="emerald"
          onClick={() => setActiveView('classrooms')}
        />
      </div>

      {/* Main Grid: Live Lessons & Free Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Currently Live Lessons */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Сейчас идут уроки (2-й урок, 08:50 – 09:35)"
              subtitle="Мониторинг классов и посещаемости в реальном времени"
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => setActiveView('liveLessons')}
                >
                  Все живые уроки
                </Button>
              }
            />

            <div className="space-y-3">
              {liveLessons.slice(0, 4).map((lesson) => {
                const statusBadges = {
                  ongoing: <Badge variant="success" dot>Идёт</Badge>,
                  endingSoon: <Badge variant="warning" dot>Скоро закончится ({lesson.timeRemaining})</Badge>,
                  replacement: <Badge variant="purple" dot>Замена учителя</Badge>,
                  cancelled: <Badge variant="danger" dot>Отменён</Badge>
                };

                return (
                  <div
                    key={lesson.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0">
                        {lesson.className}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                            {lesson.subject}
                          </span>
                          {statusBadges[lesson.status]}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {lesson.teacher} • <span className="text-indigo-600 dark:text-indigo-400">{lesson.room}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                      {lesson.attendanceChecked ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> {lesson.presentCount}/{lesson.totalStudents} уч.
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Не отмечено
                        </span>
                      )}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setActiveView('attendance')}
                      >
                        Журнал
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Upcoming Substitutions Section */}
          <Card>
            <CardHeader
              title="Предстоящие замены"
              subtitle="Назначенные и требующие подтверждения замены преподавателей"
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => setActiveView('substitutions')}
                >
                  Все замены ({substitutions.length})
                </Button>
              }
            />

            <div className="space-y-2.5">
              {substitutions.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs sm:text-sm"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {sub.className} • {sub.subject} ({sub.lessonNumber}-й урок)
                      </span>
                      {sub.status === 'confirmed' ? (
                        <Badge variant="success" size="sm">Подтверждено</Badge>
                      ) : (
                        <Badge variant="warning" size="sm">Ожидает</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {sub.originalTeacher} &rarr; <span className="font-medium text-slate-700 dark:text-slate-300">{sub.replacementTeacher}</span> (Каб. {sub.room})
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-xs text-slate-400 block">{sub.date}</span>
                    <button
                      onClick={() => setActiveView('substitutions')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    >
                      Подробнее
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Attendance Rate, Free Resources & Recent Announcements */}
        <div className="space-y-6">
          {/* Attendance Widget */}
          <Card>
            <CardHeader
              title="Посещаемость сегодня"
              subtitle="Общешкольный показатель"
            />
            <div className="text-center py-2">
              <div className="inline-flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  96.8%
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                  +1.2%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">1,200 из 1,240 учеников в школе</p>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mt-3 overflow-hidden">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '96.8%' }} />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Болеют: 28</span>
              <span className="text-slate-500">Уважительная: 12</span>
              <button
                onClick={() => setActiveView('attendance')}
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                Подробная аналитика &rarr;
              </button>
            </div>
          </Card>

          {/* Free Rooms & Teachers Right Now */}
          <Card>
            <CardHeader
              title="Свободные ресурсы прямо сейчас"
              subtitle="Готовы для проведения уроков и консультаций"
            />

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Свободные кабинеты ({freeRooms.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {freeRooms.map(r => (
                    <span
                      key={r.id}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40"
                    >
                      Каб. {r.number} ({r.capacity} мест)
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Свободные учителя ({freeTeachers.length})
                </span>
                <div className="space-y-1.5">
                  {freeTeachers.map(t => (
                    <div
                      key={t.id}
                      className="text-xs flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">{t.fullName}</span>
                      <span className="text-slate-400">{t.subjectName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardHeader
              title="Последние объявления"
              action={
                <button
                  onClick={() => setActiveView('announcements')}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  Все &rarr;
                </button>
              }
            />

            <div className="space-y-3">
              {announcements.slice(0, 2).map(ann => (
                <div
                  key={ann.id}
                  onClick={() => setActiveView('announcements')}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer hover:bg-slate-100/60 transition-colors"
                >
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                    {ann.title}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {ann.date} • {ann.authorRole}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal: Create Announcement */}
      <Modal
        isOpen={newAnnounceModalOpen}
        onClose={() => setNewAnnounceModalOpen(false)}
        title="Новое школьное объявление"
        subtitle="Будет опубликовано в новостной ленте системы"
        maxWidth="max-w-lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setNewAnnounceModalOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={() => {
                if (announceForm.title) {
                  addToast({ type: 'success', title: 'Опубликовано', message: 'Объявление успешно создано и разослано' });
                  setNewAnnounceModalOpen(false);
                  setAnnounceForm({ title: '', target: 'all', content: '' });
                }
              }}
            >
              Опубликовать
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Заголовок объявления"
            placeholder="Например: График каникул или родительское собрание"
            value={announceForm.title}
            onChange={(e) => setAnnounceForm({ ...announceForm, title: e.target.value })}
            required
          />
          <Select
            label="Целевая аудитория"
            value={announceForm.target}
            onChange={(e) => setAnnounceForm({ ...announceForm, target: e.target.value })}
          >
            <option value="all">Все (Учителя, ученики, родители)</option>
            <option value="teachers">Только учителя</option>
            <option value="parents">Только родители</option>
            <option value="students">Только учащиеся</option>
          </Select>
          <Textarea
            label="Текст объявления"
            rows={4}
            placeholder="Подробный текст сообщения..."
            value={announceForm.content}
            onChange={(e) => setAnnounceForm({ ...announceForm, content: e.target.value })}
          />
        </div>
      </Modal>

      {/* Modal: Quick Substitution */}
      <Modal
        isOpen={newSubstModalOpen}
        onClose={() => setNewSubstModalOpen(false)}
        title="Оформление быстрой замены"
        subtitle="Автоматический поиск свободных учителей и кабинетов"
        maxWidth="max-w-lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setNewSubstModalOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={() => {
                addToast({ type: 'success', title: 'Замена оформлена', message: 'Уведомление отправлено учителю' });
                setNewSubstModalOpen(false);
              }}
            >
              Подтвердить замену
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select label="Класс">
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select label="Номер урока">
              <option value="1">1-й урок (08:00 - 08:45)</option>
              <option value="2">2-й урок (08:50 - 09:35)</option>
              <option value="3">3-й урок (09:45 - 10:30)</option>
              <option value="4">4-й урок (10:45 - 11:30)</option>
            </Select>
          </div>

          <Select label="Кого заменяем (Основной учитель)">
            {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName} ({t.subjectName})</option>)}
          </Select>

          <Select label="Заменяющий преподаватель (Свободен на этом уроке)">
            {freeTeachers.map(t => <option key={t.id} value={t.id}>✓ {t.fullName} ({t.subjectName})</option>)}
          </Select>

          <Input label="Причина замены" placeholder="Больничный, конференция, командировка..." />
        </div>
      </Modal>
    </div>
  );
};
