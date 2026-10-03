import React, { useState } from 'react';
import {
  Repeat,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Calendar,
  UserX,
  Send,
  FileText,
  UserCheck,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Modal } from '../components/ui/Modal';
import { Input, Select, SearchInput } from '../components/ui/Input';
import { Table } from '../components/ui/Table';

export const SubstitutionsView = () => {
  const {
    substitutions,
    setSubstitutions,
    teachers,
    classes,
    classrooms,
    currentUser,
    notifications,
    setNotifications,
    addToast,
    role
  } = useApp();

  const isTeacher = ['teacher', 'homeroom_teacher'].includes(role);
  const canManageSubstitutions = ['super_admin', 'admin', 'curriculum_director'].includes(role);

  // Helper date generators (Today & Tomorrow in YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const [activeTab, setActiveTab] = useState(isTeacher ? 'my' : 'all'); // all | my | pending | confirmed | cancelled
  const [search, setSearch] = useState('');

  // Admin Direct Substitution Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newSubForm, setNewSubForm] = useState({
    date: todayStr,
    lessonNumber: 1,
    classId: classes[0]?.id || 'cls-7a',
    originalTeacherId: teachers[0]?.id || 'tch-3',
    replacementTeacherId: teachers[1]?.id || 'tch-4',
    room: classrooms[0]?.number || '101',
    reason: 'Больничный лист (ОРВИ)'
  });

  // Teacher Absence / Leave Request Modal
  const [teacherAbsenceModalOpen, setTeacherAbsenceModalOpen] = useState(false);
  const [absenceDateType, setAbsenceDateType] = useState('today'); // today | tomorrow | custom
  const [absenceForm, setAbsenceForm] = useState({
    date: todayStr,
    scope: 'all_day', // all_day | specific_lessons
    lessons: [1, 2, 3, 4],
    reasonCategory: 'sick', // sick | family | course | business | other
    customReason: 'ОРВИ, высокая температура',
    preferredSubstituteId: '',
    lessonAssignment: 'Дать самостоятельную работу по параграфу в учебнике'
  });

  // Details & Approval Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSubst, setSelectedSubst] = useState(null);
  const [assigningTeacherId, setAssigningTeacherId] = useState('');
  const [assigningRoom, setAssigningRoom] = useState('');

  const mySubstitutions = substitutions.filter(s =>
    s.originalTeacher?.toLowerCase().includes(currentUser.name.toLowerCase()) ||
    s.createdBy?.toLowerCase().includes(currentUser.name.toLowerCase()) ||
    s.replacementTeacher?.toLowerCase().includes(currentUser.name.toLowerCase())
  );

  const tabs = [
    ...(isTeacher ? [{ id: 'my', label: 'Мои заявки и замены', badge: mySubstitutions.length }] : []),
    { id: 'all', label: 'Все замены', badge: substitutions.length },
    { id: 'pending', label: 'Ожидают подтверждения', badge: substitutions.filter(s => s.status === 'pending').length },
    { id: 'confirmed', label: 'Подтверждённые', badge: substitutions.filter(s => s.status === 'confirmed').length },
    { id: 'cancelled', label: 'Отменённые', badge: substitutions.filter(s => s.status === 'cancelled').length },
  ];

  const filtered = substitutions.filter(s => {
    let matchesTab = true;
    if (activeTab === 'my') {
      matchesTab =
        s.originalTeacher?.toLowerCase().includes(currentUser.name.toLowerCase()) ||
        s.createdBy?.toLowerCase().includes(currentUser.name.toLowerCase()) ||
        s.replacementTeacher?.toLowerCase().includes(currentUser.name.toLowerCase());
    } else if (activeTab !== 'all') {
      matchesTab = s.status === activeTab;
    }

    const matchesSearch =
      (s.className || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.subject || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.originalTeacher || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.replacementTeacher || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.reason || '').toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Teacher submits absence request
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

    // Send notification to Admin & Deputy
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
      message: `Заявка на отсутствие на ${dateToUse} успешно отправлена завучу и директору`
    });

    setTeacherAbsenceModalOpen(false);
  };

  // Admin approves substitution
  const handleConfirmSub = (id) => {
    if (!canManageSubstitutions) return;
    
    setSubstitutions(prev => prev.map(s => {
      if (s.id === id) {
        const replTeacherObj = teachers.find(t => t.id === assigningTeacherId);
        return {
          ...s,
          status: 'confirmed',
          replacementTeacher: replTeacherObj ? replTeacherObj.fullName : s.replacementTeacher,
          room: assigningRoom || s.room
        };
      }
      return s;
    }));

    addToast({
      type: 'success',
      title: 'Замена утверждена',
      message: 'Уведомление отправлено учителю и добавлено в расписание'
    });
    setDetailModalOpen(false);
  };

  // Admin cancels / rejects substitution
  const handleCancelSub = (id) => {
    if (!canManageSubstitutions) return;
    setSubstitutions(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelled' } : s));
    addToast({
      type: 'info',
      title: 'Замена отклонена',
      message: 'Заявка помечена как отклонённая'
    });
    setDetailModalOpen(false);
  };

  // Admin direct creation
  const handleCreateSub = () => {
    if (!canManageSubstitutions) {
      addToast({ type: 'danger', title: 'Отказ в доступе', message: 'Оформлять прямые замены может только администрация школы' });
      return;
    }
    const selectedClass = classes.find(c => c.id === newSubForm.classId);
    const origTeacher = teachers.find(t => t.id === newSubForm.originalTeacherId);
    const replTeacher = teachers.find(t => t.id === newSubForm.replacementTeacherId);

    const newEntry = {
      id: 'subst-' + Date.now(),
      date: newSubForm.date,
      lessonNumber: Number(newSubForm.lessonNumber),
      className: selectedClass?.name || '7А',
      subject: origTeacher?.subjectName || 'Предмет',
      originalTeacher: origTeacher?.fullName || 'Основной учитель',
      replacementTeacher: replTeacher?.fullName || 'Заменяющий',
      room: newSubForm.room,
      reason: newSubForm.reason,
      status: 'pending',
      createdBy: currentUser.name || 'Администратор школы',
      createdAt: 'Сегодня в ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSubstitutions(prev => [newEntry, ...prev]);
    addToast({ type: 'success', title: 'Замена оформлена', message: 'Запись добавлена в график замен' });
    setCreateModalOpen(false);
  };

  const columns = [
    {
      key: 'date',
      title: 'Дата и урок',
      sortable: true,
      render: (_, row) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {row.date === todayStr ? '⚡ Сегодня' : row.date === tomorrowStr ? '📅 Завтра' : row.date}
          </span>
          <span className="text-xs text-slate-400 block">{row.lessonNumber}-й урок</span>
        </div>
      )
    },
    {
      key: 'className',
      title: 'Класс и предмет',
      render: (_, row) => (
        <div>
          <span className="font-bold text-indigo-700 dark:text-indigo-400">{row.className}</span>
          <span className="text-xs text-slate-500 block">{row.subject}</span>
        </div>
      )
    },
    {
      key: 'originalTeacher',
      title: 'Отсутствующий учитель',
      render: (val) => (
        <div>
          <span className="text-slate-700 dark:text-slate-300 font-medium">{val}</span>
          <span className="text-[10px] text-rose-500 block">Отсутствует</span>
        </div>
      )
    },
    {
      key: 'replacementTeacher',
      title: 'Заменяющий педагог',
      render: (val, row) => (
        <div>
          <span className={`font-semibold ${val === 'Назначается завучем' ? 'text-amber-600 dark:text-amber-400 italic' : 'text-slate-800 dark:text-slate-200'}`}>
            {val}
          </span>
          {val !== 'Назначается завучем' && (
            <span className="text-xs text-indigo-600 dark:text-indigo-400 block">Каб. {row.room}</span>
          )}
        </div>
      )
    },
    {
      key: 'reason',
      title: 'Причина',
      render: (val) => <span className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 max-w-[200px]">{val}</span>
    },
    {
      key: 'status',
      title: 'Статус',
      render: (val) => {
        if (val === 'confirmed') return <Badge variant="success" size="sm">✓ Одобрено</Badge>;
        if (val === 'pending') return <Badge variant="warning" size="sm">⏳ На рассмотрении</Badge>;
        return <Badge variant="danger" size="sm">✕ Отклонено</Badge>;
      }
    },
    {
      key: 'actions',
      title: 'Действие',
      align: 'right',
      render: (_, row) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setSelectedSubst(row);
            setAssigningTeacherId(teachers.find(t => t.fullName === row.replacementTeacher)?.id || teachers[0]?.id || '');
            setAssigningRoom(row.room || classrooms[0]?.number || '101');
            setDetailModalOpen(true);
          }}
        >
          {canManageSubstitutions && row.status === 'pending' ? 'Назначить' : 'Детали'}
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Repeat className="w-6 h-6 text-indigo-600" />
            Замены и заявки на отсутствие
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Подача заявлений на отсутствие (больничный, личные) и оперативное назначение заменяющих учителей
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Teacher Request Button */}
          <Button
            size="sm"
            variant="vibrant"
            icon={UserX}
            onClick={() => setTeacherAbsenceModalOpen(true)}
            className="shadow-md shadow-indigo-500/20"
          >
            Заявить об отсутствии
          </Button>

          {/* Admin Manual Substitution Button */}
          {canManageSubstitutions && (
            <Button
              size="sm"
              variant="outline"
              icon={Plus}
              onClick={() => setCreateModalOpen(true)}
            >
              Оформить замену
            </Button>
          )}
        </div>
      </div>

      {/* Teacher Quick Helper Banner */}
      {isTeacher && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/60 dark:border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Не сможете провести уроки сегодня или завтра?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Подайте онлайн-заявку за 30 секунд — завуч получит уведомление и распределит замену.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            icon={Send}
            onClick={() => setTeacherAbsenceModalOpen(true)}
            className="shrink-0"
          >
            Подать заявку
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Filter toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-between gap-4">
        <div className="w-full max-w-sm">
          <SearchInput
            placeholder="Поиск по учителям, предметам, классам..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filtered}
        emptyTitle="Замен не найдено"
        emptyDescription="В выбранной вкладке нет активных записей о заменах"
      />

      {/* MODAL 1: Teacher Absence / Leave Request */}
      <Modal
        isOpen={teacherAbsenceModalOpen}
        onClose={() => setTeacherAbsenceModalOpen(false)}
        title="Заявление об отсутствии на уроках"
        subtitle="Заявка мгновенно передается завучу и директору для назначения замен"
        maxWidth="max-w-lg"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button variant="secondary" onClick={() => setTeacherAbsenceModalOpen(false)}>
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

      {/* MODAL 2: Admin Direct Create Substitution */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Оформление новой замены"
        subtitle="Система автоматически проверяет учителей и кабинеты на занятость"
        maxWidth="max-w-lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateSub}>
              Создать замену
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Дата замены"
              type="date"
              value={newSubForm.date}
              onChange={(e) => setNewSubForm({ ...newSubForm, date: e.target.value })}
            />
            <Select
              label="Номер урока"
              value={newSubForm.lessonNumber}
              onChange={(e) => setNewSubForm({ ...newSubForm, lessonNumber: e.target.value })}
            >
              <option value="1">1-й урок (08:00)</option>
              <option value="2">2-й урок (08:50)</option>
              <option value="3">3-й урок (09:45)</option>
              <option value="4">4-й урок (10:45)</option>
              <option value="5">5-й урок (11:35)</option>
            </Select>
          </div>

          <Select
            label="Класс"
            value={newSubForm.classId}
            onChange={(e) => setNewSubForm({ ...newSubForm, classId: e.target.value })}
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>

          <Select
            label="Основной учитель (Кого заменяют)"
            value={newSubForm.originalTeacherId}
            onChange={(e) => setNewSubForm({ ...newSubForm, originalTeacherId: e.target.value })}
          >
            {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName} ({t.subjectName})</option>)}
          </Select>

          <Select
            label="Заменяющий учитель"
            value={newSubForm.replacementTeacherId}
            onChange={(e) => setNewSubForm({ ...newSubForm, replacementTeacherId: e.target.value })}
          >
            {teachers.map(t => <option key={t.id} value={t.id}>✓ {t.fullName} ({t.subjectName})</option>)}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Кабинет проведения"
              value={newSubForm.room}
              onChange={(e) => setNewSubForm({ ...newSubForm, room: e.target.value })}
            >
              {classrooms.map(r => <option key={r.id} value={r.number}>Каб. {r.number}</option>)}
            </Select>
            <Input
              label="Причина замены"
              placeholder="Больничный, отпуск, командировка"
              value={newSubForm.reason}
              onChange={(e) => setNewSubForm({ ...newSubForm, reason: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* MODAL 3: Substitution Details & Admin Decision */}
      {selectedSubst && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title="Детали заявки на замену"
          subtitle={`Заявка от ${selectedSubst.createdAt}`}
          maxWidth="max-w-md"
          footer={
            <div className="flex items-center justify-between w-full">
              {canManageSubstitutions && selectedSubst.status === 'pending' ? (
                <>
                  <Button variant="danger" size="sm" onClick={() => handleCancelSub(selectedSubst.id)}>
                    Отклонить
                  </Button>
                  <Button variant="primary" size="sm" icon={CheckCircle2} onClick={() => handleConfirmSub(selectedSubst.id)}>
                    Утвердить и назначить
                  </Button>
                </>
              ) : (
                <Button variant="secondary" size="sm" className="ml-auto" onClick={() => setDetailModalOpen(false)}>
                  Закрыть
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Дата и урок:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedSubst.date}, {selectedSubst.lessonNumber}-й урок
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Класс и предмет:</span>
              <span className="font-semibold text-indigo-600">{selectedSubst.className} • {selectedSubst.subject}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Отсутствующий педагог:</span>
              <span className="text-slate-700 dark:text-slate-200 font-semibold">{selectedSubst.originalTeacher}</span>
            </div>

            {/* Admin assignment controls */}
            {canManageSubstitutions && selectedSubst.status === 'pending' ? (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-200/60 dark:border-slate-700/60 my-2">
                <div className="font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                  Назначение заменяющего педагога:
                </div>
                <Select
                  label="Педагог на замену"
                  value={assigningTeacherId}
                  onChange={(e) => setAssigningTeacherId(e.target.value)}
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.subjectName})
                    </option>
                  ))}
                </Select>
                <Select
                  label="Кабинет"
                  value={assigningRoom}
                  onChange={(e) => setAssigningRoom(e.target.value)}
                >
                  {classrooms.map(r => (
                    <option key={r.id} value={r.number}>Каб. {r.number} ({r.name})</option>
                  ))}
                </Select>
              </div>
            ) : (
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Заменяющий педагог:</span>
                <span className="font-semibold text-emerald-600">{selectedSubst.replacementTeacher} (Каб. {selectedSubst.room})</span>
              </div>
            )}

            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Причина:</span>
              <span className="text-slate-700 dark:text-slate-300">{selectedSubst.reason}</span>
            </div>

            {selectedSubst.notes && (
              <div className="py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Задание для класса:</span>
                <span className="text-slate-700 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg block">
                  {selectedSubst.notes}
                </span>
              </div>
            )}

            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Инициатор:</span>
              <span className="text-slate-500">{selectedSubst.createdBy}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
