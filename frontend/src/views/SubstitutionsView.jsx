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
  Calendar
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
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // all | pending | confirmed | cancelled
  const [search, setSearch] = useState('');

  // Create Substitution Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newSubForm, setNewSubForm] = useState({
    date: '2026-10-02',
    lessonNumber: 3,
    classId: 'cls-7a',
    originalTeacherId: 'tch-6',
    replacementTeacherId: 'tch-1',
    room: '102',
    reason: 'Листок нетрудоспособности'
  });

  // Details Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSubst, setSelectedSubst] = useState(null);

  const tabs = [
    { id: 'all', label: 'Все замены', badge: substitutions.length },
    { id: 'pending', label: 'Ожидают подтверждения', badge: substitutions.filter(s => s.status === 'pending').length },
    { id: 'confirmed', label: 'Подтверждённые', badge: substitutions.filter(s => s.status === 'confirmed').length },
    { id: 'cancelled', label: 'Отменённые', badge: substitutions.filter(s => s.status === 'cancelled').length },
  ];

  const filtered = substitutions.filter(s => {
    const matchesTab = activeTab === 'all' || s.status === activeTab;
    const matchesSearch =
      s.className.toLowerCase().includes(search.toLowerCase()) ||
      s.subject.toLowerCase().includes(search.toLowerCase()) ||
      s.originalTeacher.toLowerCase().includes(search.toLowerCase()) ||
      s.replacementTeacher.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleConfirmSub = (id) => {
    setSubstitutions(prev => prev.map(s => s.id === id ? { ...s, status: 'confirmed' } : s));
    addToast({ type: 'success', title: 'Замена подтверждена', message: 'Уведомление отправлено заменяющему учителю' });
    setDetailModalOpen(false);
  };

  const handleCancelSub = (id) => {
    setSubstitutions(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelled' } : s));
    addToast({ type: 'info', title: 'Замена отменена', message: 'Статус заменён на отменённый' });
    setDetailModalOpen(false);
  };

  const handleCreateSub = () => {
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
      createdBy: 'Администратор школы',
      createdAt: 'Сегодня в 09:10'
    };

    setSubstitutions(prev => [newEntry, ...prev]);
    addToast({ type: 'success', title: 'Заявка создана', message: 'Замена добавлена в список ожидания' });
    setCreateModalOpen(false);
  };

  const columns = [
    {
      key: 'date',
      title: 'Дата и урок',
      sortable: true,
      render: (_, row) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{row.date}</span>
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
      title: 'Основной учитель',
      render: (val) => <span className="text-slate-500 line-through">{val}</span>
    },
    {
      key: 'replacementTeacher',
      title: 'Заменяющий учитель',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{val}</span>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 block">Каб. {row.room}</span>
        </div>
      )
    },
    {
      key: 'reason',
      title: 'Причина',
      render: (val) => <span className="text-xs text-slate-500">{val}</span>
    },
    {
      key: 'status',
      title: 'Статус',
      render: (val) => {
        if (val === 'confirmed') return <Badge variant="success" size="sm">Подтверждена</Badge>;
        if (val === 'pending') return <Badge variant="warning" size="sm">Ожидает</Badge>;
        return <Badge variant="danger" size="sm">Отменена</Badge>;
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
            setDetailModalOpen(true);
          }}
        >
          Детали
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
            Замены преподавателей
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Управление заменами уроков, поиск свободных педагогов и уведомление классов
          </p>
        </div>

        <Button
          size="sm"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
        >
          Оформить замену
        </Button>
      </div>

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

      {/* Modal: Create Substitution */}
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
              Создать заявку
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
            label="Заменяющий учитель (Свободен на этом уроке)"
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

      {/* Modal: Substitution Details */}
      {selectedSubst && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title="Детали замены урока"
          subtitle={`Заявка от ${selectedSubst.createdAt}`}
          maxWidth="max-w-md"
          footer={
            <div className="flex items-center justify-between w-full">
              {selectedSubst.status === 'pending' ? (
                <>
                  <Button variant="danger" size="sm" onClick={() => handleCancelSub(selectedSubst.id)}>
                    Отклонить
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleConfirmSub(selectedSubst.id)}>
                    Подтвердить замену
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
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedSubst.date}, {selectedSubst.lessonNumber}-й урок</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Класс и предмет:</span>
              <span className="font-semibold text-indigo-600">{selectedSubst.className} • {selectedSubst.subject}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Основной педагог:</span>
              <span className="text-slate-500 line-through">{selectedSubst.originalTeacher}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Заменяющий педагог:</span>
              <span className="font-semibold text-emerald-600">{selectedSubst.replacementTeacher}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Кабинет:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Каб. {selectedSubst.room}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Причина:</span>
              <span className="text-slate-700 dark:text-slate-300">{selectedSubst.reason}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Создал:</span>
              <span className="text-slate-500">{selectedSubst.createdBy}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
