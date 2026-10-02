import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  DoorOpen,
  Calendar,
  Clock,
  BarChart2,
  Repeat,
  CheckCircle,
  Eye,
  Edit2,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input, Select, SearchInput } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export const TeachersView = () => {
  const { teachers, setTeachers, subjects, classrooms, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Animation states for addition and deletion
  const [deletingTeacherId, setDeletingTeacherId] = useState(null);
  const [newlyAddedTeacherId, setNewlyAddedTeacherId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  // Teacher Profile Modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Add / Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teacherForm, setTeacherForm] = useState({
    fullName: '',
    subjectName: 'Математика / Алгебра',
    email: '',
    phone: '',
    roomNumber: '101',
    workloadHours: 20,
    maxHours: 26,
    status: 'free',
    experienceYears: 5,
    qualification: 'Первая категория'
  });

  const statusMap = {
    free: { label: "Свободен", variant: "success" },
    in_lesson: { label: "На уроке", variant: "primary" },
    absent: { label: "Отсутствует", variant: "neutral" },
    sick: { label: "Болеет", variant: "danger" },
    vacation: { label: "В отпуске", variant: "warning" }
  };

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch =
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setTeacherForm({
      fullName: '',
      subjectName: 'Математика / Алгебра',
      email: '',
      phone: '+992 ',
      roomNumber: '101',
      workloadHours: 20,
      maxHours: 26,
      status: 'free',
      experienceYears: 5,
      qualification: 'Первая категория'
    });
    setEditModalOpen(true);
  };

  const handleOpenEdit = (tch) => {
    setEditingTeacher(tch);
    setTeacherForm({ ...tch });
    setEditModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!teacherToDelete) return;
    const targetId = teacherToDelete.id;
    setDeletingTeacherId(targetId);
    setConfirmDeleteOpen(false);

    setTimeout(() => {
      setTeachers(prev => prev.filter(t => t.id !== targetId));
      setDeletingTeacherId(null);
      setTeacherToDelete(null);
      addToast({ type: 'info', title: 'Учитель удалён', message: 'Преподаватель успешно исключён из системы' });
    }, 320);
  };

  const handleSave = () => {
    if (!teacherForm.fullName) return;

    if (editingTeacher) {
      setTeachers(prev => prev.map(t => t.id === editingTeacher.id ? { ...t, ...teacherForm } : t));
      addToast({ type: 'success', title: 'Учитель обновлён', message: 'Данные профиля успешно изменены' });
    } else {
      const newId = 'tch-' + Date.now();
      const newTeacher = {
        id: newId,
        ...teacherForm,
        classes: ['7А', '9Б'],
        substitutionsCount: 0,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
      };
      setTeachers(prev => [newTeacher, ...prev]);
      setNewlyAddedTeacherId(newId);
      setTimeout(() => setNewlyAddedTeacherId(null), 1800);
      addToast({ type: 'success', title: 'Учитель добавлен', message: 'Новый преподаватель внесён в реестр' });
    }
    setEditModalOpen(false);
  };

  const columns = [
    {
      key: 'fullName',
      title: 'Преподаватель',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={row.fullName}
            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shadow-xs"
          />
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 block">
              {row.fullName}
            </span>
            <span className="text-xs text-slate-400">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'subjectName',
      title: 'Предмет',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-700 dark:text-slate-300">{val}</span>
    },
    {
      key: 'classes',
      title: 'Классы',
      render: (val) => (
        <div className="flex gap-1 flex-wrap">
          {val?.map((c, i) => (
            <span key={i} className="px-2 py-0.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200/50 dark:border-slate-700/50">
              {c}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'roomNumber',
      title: 'Кабинет',
      render: (val) => <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Каб. {val}</span>
    },
    {
      key: 'workloadHours',
      title: 'Нагрузка',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-slate-800 dark:text-slate-200">{val} ч.</span>
            <span className="text-slate-400">из {row.maxHours}</span>
          </div>
          <div className="w-20 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                val > row.maxHours ? 'bg-rose-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(100, (val / row.maxHours) * 100)}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Статус',
      render: (val) => {
        const item = statusMap[val] || statusMap.free;
        return <Badge variant={item.variant} size="sm" dot>{item.label}</Badge>;
      }
    },
    {
      key: 'actions',
      title: 'Действия',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            title="Профиль"
            onClick={() => {
              setSelectedTeacher(row);
              setProfileModalOpen(true);
            }}
          >
            <Eye className="w-4 h-4 text-slate-500 hover:text-indigo-600 transition-colors" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Редактировать"
            onClick={() => handleOpenEdit(row)}
          >
            <Edit2 className="w-4 h-4 text-slate-500 hover:text-amber-600 transition-colors" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Удалить"
            onClick={() => {
              setTeacherToDelete(row);
              setConfirmDeleteOpen(true);
            }}
            className="hover:bg-rose-50 dark:hover:bg-rose-950/50"
          >
            <Trash2 className="w-4 h-4 text-slate-400 hover:text-rose-600 transition-colors" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            Педагогический состав (Учителя)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Всего {teachers.length} преподавателей • Контроль нагрузки, расписания и замен
          </p>
        </div>

        <Button
          size="sm"
          icon={Plus}
          onClick={handleOpenAdd}
        >
          Добавить учителя
        </Button>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full max-w-sm">
          <SearchInput
            placeholder="Поиск по ФИО, предмету или email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-auto text-xs py-1.5"
          >
            <option value="all">Все статусы</option>
            <option value="free">Свободен</option>
            <option value="in_lesson">На уроке</option>
            <option value="absent">Отсутствует</option>
            <option value="sick">Болеет</option>
            <option value="vacation">В отпуске</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredTeachers}
        pageSize={8}
        rowClassName={(row) =>
          row.id === deletingTeacherId
            ? 'animate-row-delete bg-rose-50/70 dark:bg-rose-950/40'
            : row.id === newlyAddedTeacherId
            ? 'animate-item-appear ring-2 ring-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20'
            : ''
        }
        emptyTitle="Преподаватели не найдены"
        emptyDescription="Попробуйте изменить поисковый фильтр"
      />

      {/* Modal: Teacher Profile Details (Full Profile drawer/modal) */}
      {selectedTeacher && (
        <Modal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          title={`Профиль: ${selectedTeacher.fullName}`}
          subtitle={selectedTeacher.qualification}
          maxWidth="max-w-2xl"
          footer={
            <Button onClick={() => setProfileModalOpen(false)}>
              Закрыть
            </Button>
          }
        >
          <div className="space-y-6 text-xs sm:text-sm">
            {/* Top row: Avatar & basic contacts */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <img
                src={selectedTeacher.avatar}
                alt={selectedTeacher.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
              />
              <div className="space-y-1">
                <div className="font-bold text-base text-slate-900 dark:text-slate-100">
                  {selectedTeacher.fullName}
                </div>
                <div className="text-slate-500">{selectedTeacher.subjectName} • Стаж {selectedTeacher.experienceYears} лет</div>
                <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-indigo-500" /> {selectedTeacher.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-indigo-500" /> {selectedTeacher.email}</span>
                </div>
              </div>
            </div>

            {/* Workload hours comparison */}
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                Преподавательская нагрузка и лимит часов
              </h4>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Фактическая нагрузка: {selectedTeacher.workloadHours} часов в неделю</span>
                  <span className="text-slate-400">Максимум: {selectedTeacher.maxHours} ч.</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(selectedTeacher.workloadHours / selectedTeacher.maxHours) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Закреплённый кабинет: <strong className="text-slate-700 dark:text-slate-300">Каб. {selectedTeacher.roomNumber}</strong> • Проведено замен: <strong className="text-slate-700 dark:text-slate-300">{selectedTeacher.substitutionsCount}</strong>
                </p>
              </div>
            </div>

            {/* Availability Days */}
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" />
                Доступность по дням недели
              </h4>
              <div className="grid grid-cols-6 gap-2 text-center text-xs">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map((day, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">{day}</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Доступен</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Add/Edit Teacher */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={editingTeacher ? "Редактирование данных учителя" : "Добавление нового учителя"}
        maxWidth="max-w-lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave}>
              Сохранить
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="ФИО преподавателя"
            placeholder="Каримова Мадина Рустамовна"
            value={teacherForm.fullName}
            onChange={(e) => setTeacherForm({ ...teacherForm, fullName: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Основной предмет"
              value={teacherForm.subjectName}
              onChange={(e) => setTeacherForm({ ...teacherForm, subjectName: e.target.value })}
            >
              {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </Select>

            <Select
              label="Закреплённый кабинет"
              value={teacherForm.roomNumber}
              onChange={(e) => setTeacherForm({ ...teacherForm, roomNumber: e.target.value })}
            >
              {classrooms.map(r => <option key={r.id} value={r.number}>Каб. {r.number}</option>)}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email"
              type="email"
              placeholder="teacher@school12.tj"
              value={teacherForm.email}
              onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
            />
            <Input
              label="Телефон"
              placeholder="+992 (93) 123-45-67"
              value={teacherForm.phone}
              onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Часов в нед."
              type="number"
              value={teacherForm.workloadHours}
              onChange={(e) => setTeacherForm({ ...teacherForm, workloadHours: Number(e.target.value) })}
            />
            <Input
              label="Макс. часов"
              type="number"
              value={teacherForm.maxHours}
              onChange={(e) => setTeacherForm({ ...teacherForm, maxHours: Number(e.target.value) })}
            />
            <Select
              label="Текущий статус"
              value={teacherForm.status}
              onChange={(e) => setTeacherForm({ ...teacherForm, status: e.target.value })}
            >
              <option value="free">Свободен</option>
              <option value="in_lesson">На уроке</option>
              <option value="absent">Отсутствует</option>
              <option value="sick">Болеет</option>
              <option value="vacation">В отпуске</option>
            </Select>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Удаление преподавателя"
        message={`Вы действительно хотите удалить ${teacherToDelete?.fullName || 'этого преподавателя'}? Занятия в расписании будут освобождены.`}
        confirmText="Удалить учителя"
      />
    </div>
  );
};
