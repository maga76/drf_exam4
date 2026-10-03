import React, { useState } from 'react';
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
  Plus,
  UserX,
  Send,
  CalendarDays,
  CheckCircle2,
  Repeat
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { StatsCard } from '../components/ui/StatsCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';

export const TeacherDashboardView = () => {
  const {
    currentUser,
    homeworkList,
    announcements,
    substitutions,
    setSubstitutions,
    teachers,
    classes,
    classrooms,
    setNotifications,
    addToast,
    setActiveView
  } = useApp();

  // Helper date strings
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  // Teacher Absence / Leave Request Modal State
  const [absenceModalOpen, setAbsenceModalOpen] = useState(false);
  const [absenceDateType, setAbsenceDateType] = useState('today'); // today | tomorrow | custom
  const [absenceForm, setAbsenceForm] = useState({
    date: todayStr,
    scope: 'all_day',
    lessons: [1, 2, 3, 4],
    reasonCategory: 'sick',
    customReason: 'ОРВИ, высокая температура',
    preferredSubstituteId: '',
    lessonAssignment: 'Дать самостоятельную работу по учебнику'
  });

  const todaySchedule = [
    { number: 1, time: "08:00 – 08:45", class: "7А", subject: "Алгебра", room: "302", isCurrent: false, attendanceDone: true },
    { number: 2, time: "08:50 – 09:35", class: "9Б", subject: "Алгебра", room: "302", isCurrent: true, attendanceDone: false },
    { number: 3, time: "09:45 – 10:30", class: "11А", subject: "Геометрия", room: "302", isCurrent: false, attendanceDone: false },
    { number: 5, time: "11:35 – 12:20", class: "7Б", subject: "Замена: Английский", room: "102", isCurrent: false, attendanceDone: false },
  ];

  // Teacher's my absence requests
  const myAbsenceRequests = substitutions.filter(s =>
    s.originalTeacher?.toLowerCase().includes(currentUser.name.toLowerCase()) ||
    s.createdBy?.toLowerCase().includes(currentUser.name.toLowerCase())
  );

  const handleTeacherSubmitAbsence = (e) => {
    e?.preventDefault();

    const dateToUse = absenceDateType === 'today'
      ? todayStr
      : absenceDateType === 'tomorrow'
        ? tomorrowStr
        : absenceForm.date;

    const reasonLabelMap = {
      sick: 'Больничный лист (Болезнь / ОРВИ)',
      family: 'Семейные / Личные обстоятельства',
      course: 'Курсы повышения квалификации',
      business: 'Командировка / Олимпиада',
      other: 'Личное заявление'
    };

    const fullReason = `${reasonLabelMap[absenceForm.reasonCategory] || 'Отсутствие'}: ${absenceForm.customReason}`;
    const preferredTeacher = teachers.find(t => t.id === absenceForm.preferredSubstituteId);

    const lessonsToReplace = absenceForm.scope === 'all_day'
      ? [1, 2, 3, 4]
      : absenceForm.lessons.length > 0 ? absenceForm.lessons : [1];

    const newEntries = lessonsToReplace.map((lessonNum, idx) => ({
      id: `absence-${Date.now()}-${idx}`,
      date: dateToUse,
      lessonNumber: lessonNum,
      className: classes[idx % classes.length]?.name || '7А',
      subject: 'Учебный предмет',
      originalTeacher: currentUser.name,
      replacementTeacher: preferredTeacher ? preferredTeacher.fullName : 'Назначается завучем',
      room: classrooms[0]?.number || '101',
      reason: fullReason,
      notes: absenceForm.lessonAssignment,
      status: 'pending',
      createdBy: `Учитель: ${currentUser.name}`,
      createdAt: 'Сегодня в ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    setSubstitutions(prev => [...newEntries, ...prev]);

    // Send notification to administration
    const newNotif = {
      id: 'notif-' + Date.now(),
      title: '🚨 Заявка на отсутствие от учителя',
      message: `Учитель ${currentUser.name} не сможет присутствовать на уроках (${dateToUse === todayStr ? 'Сегодня' : dateToUse === tomorrowStr ? 'Завтра' : dateToUse}). Причина: ${fullReason}`,
      date: 'Только что',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    addToast({
      type: 'success',
      title: 'Заявка отправлена',
      message: `Заявка на отсутствие на ${dateToUse} успешно передана администрации школы`
    });

    setAbsenceModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Кабинет преподавателя: {currentUser.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {todayStr} • 4 урока сегодня • Нагрузка: 24 ч./нед.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="vibrant"
            icon={UserX}
            onClick={() => setAbsenceModalOpen(true)}
            className="shadow-md shadow-indigo-500/20"
          >
            Заявить об отсутствии
          </Button>
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

      {/* Quick Action Alert Banner for Teacher */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/60 dark:border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Не сможете провести уроки сегодня или завтра?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Подайте онлайн-заявку об отсутствии (больничный, личные) — завуч назначит замену и оповестит классы.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          icon={Send}
          onClick={() => setAbsenceModalOpen(true)}
          className="shrink-0"
        >
          Подать заявку на замену
        </Button>
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
              subtitle={`${todayStr}, рабочий день`}
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

        {/* Right Column: Absences status, Homework, Announcements */}
        <div className="space-y-6">
          {/* My Absence Requests Tracking Widget */}
          <Card>
            <CardHeader
              title="Мои заявки на отсутствие"
              subtitle="Статус рассмотрения завучем"
              action={
                <button
                  onClick={() => setActiveView('substitutions')}
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  Все &rarr;
                </button>
              }
            />

            <div className="space-y-2.5">
              {myAbsenceRequests.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400">
                  Активных заявок на отсутствие нет
                </div>
              ) : (
                myAbsenceRequests.slice(0, 3).map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {sub.date === todayStr ? '⚡ Сегодня' : sub.date === tomorrowStr ? '📅 Завтра' : sub.date}, {sub.lessonNumber}-й урок
                      </span>
                      {sub.status === 'confirmed' ? (
                        <Badge variant="success" size="sm">✓ Одобрено</Badge>
                      ) : sub.status === 'pending' ? (
                        <Badge variant="warning" size="sm">⏳ На рассмотрении</Badge>
                      ) : (
                        <Badge variant="danger" size="sm">✕ Отклонено</Badge>
                      )}
                    </div>
                    <div className="text-slate-500 truncate">{sub.reason}</div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                      Заменяет: {sub.replacementTeacher}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Homework to grade */}
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

          {/* School Announcements */}
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

      {/* MODAL: Teacher Absence Request Modal */}
      <Modal
        isOpen={absenceModalOpen}
        onClose={() => setAbsenceModalOpen(false)}
        title="Заявление об отсутствии на уроках"
        subtitle="Заявка мгновенно передается завучу и директору для назначения замен"
        maxWidth="max-w-lg"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button variant="secondary" onClick={() => setAbsenceModalOpen(false)}>
              Отмена
            </Button>
            <Button icon={Send} onClick={handleTeacherSubmitAbsence}>
              Отправить заявку завучу
            </Button>
          </div>
        }
      >
        <form onSubmit={handleTeacherSubmitAbsence} className="space-y-4 text-xs sm:text-sm">
          {/* Quick Date Switcher */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Когда вас не будет?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAbsenceDateType('today');
                  setAbsenceForm({ ...absenceForm, date: todayStr });
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  absenceDateType === 'today'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                ⚡ Сегодня
              </button>

              <button
                type="button"
                onClick={() => {
                  setAbsenceDateType('tomorrow');
                  setAbsenceForm({ ...absenceForm, date: tomorrowStr });
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  absenceDateType === 'tomorrow'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                📅 Завтра
              </button>

              <button
                type="button"
                onClick={() => setAbsenceDateType('custom')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  absenceDateType === 'custom'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                📆 Другая дата
              </button>
            </div>

            {absenceDateType === 'custom' && (
              <div className="mt-2.5">
                <Input
                  label="Выберите дату"
                  type="date"
                  value={absenceForm.date}
                  onChange={(e) => setAbsenceForm({ ...absenceForm, date: e.target.value })}
                  required
                />
              </div>
            )}
          </div>

          {/* Scope: All day vs specific lessons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Период отсутствия
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAbsenceForm({ ...absenceForm, scope: 'all_day' })}
                className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                  absenceForm.scope === 'all_day'
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div>Весь учебный день</div>
                <div className="text-[10px] text-slate-400 font-normal">Все запланированные уроки</div>
              </button>

              <button
                type="button"
                onClick={() => setAbsenceForm({ ...absenceForm, scope: 'specific_lessons' })}
                className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                  absenceForm.scope === 'specific_lessons'
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div>Отдельные уроки</div>
                <div className="text-[10px] text-slate-400 font-normal">Выбрать номера уроков</div>
              </button>
            </div>
          </div>

          {/* Reason Category */}
          <Select
            label="Причина отсутствия"
            value={absenceForm.reasonCategory}
            onChange={(e) => setAbsenceForm({ ...absenceForm, reasonCategory: e.target.value })}
          >
            <option value="sick">Больничный лист / Болезнь (ОРВИ, грипп, врач)</option>
            <option value="family">Семейные / Личные обстоятельства</option>
            <option value="course">Курсы повышения квалификации / Семинар</option>
            <option value="business">Командировка / Олимпиада / Конференция</option>
            <option value="other">Иная причина</option>
          </Select>

          {/* Details / Comment */}
          <Input
            label="Подробности / Причина (для завуча)"
            placeholder="Например: Температура 38.5, вызов врача на дом"
            value={absenceForm.customReason}
            onChange={(e) => setAbsenceForm({ ...absenceForm, customReason: e.target.value })}
            required
          />

          {/* Assignment for substitute */}
          <Input
            label="Задание для заменяющего учителя / учеников"
            placeholder="Например: Прорешать № 241, 243, параграф 12"
            value={absenceForm.lessonAssignment}
            onChange={(e) => setAbsenceForm({ ...absenceForm, lessonAssignment: e.target.value })}
          />

          {/* Preferred substitute */}
          <Select
            label="Предпочтительный заменяющий педагог (по желанию)"
            value={absenceForm.preferredSubstituteId}
            onChange={(e) => setAbsenceForm({ ...absenceForm, preferredSubstituteId: e.target.value })}
          >
            <option value="">-- На усмотрение завуча --</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.fullName} ({t.subjectName})</option>
            ))}
          </Select>
        </form>
      </Modal>
    </div>
  );
};
