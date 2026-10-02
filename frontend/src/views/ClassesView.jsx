import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  LayoutGrid,
  List,
  Users,
  DoorOpen,
  Calendar,
  Award,
  Eye,
  Edit2,
  Trash2,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input, Select, SearchInput } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const ClassesView = () => {
  const { classes, setClasses, teachers, classrooms, students, schedule, addToast, setActiveView } = useApp();

  const [viewMode, setViewMode] = useState('cards'); // cards | table
  const [search, setSearch] = useState('');

  // Class Profile Modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // Add / Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [form, setForm] = useState({
    grade: 7,
    letter: 'А',
    name: '7А',
    shift: 1,
    homeroomTeacher: 'Саидова Нигора Акмаловна',
    roomNumber: '101',
    studentsCount: 28
  });

  const filtered = classes.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.homeroomTeacher || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.roomNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingClass(null);
    setForm({
      grade: 8,
      letter: 'А',
      name: '8А',
      shift: 1,
      homeroomTeacher: teachers[0]?.fullName || '',
      roomNumber: classrooms[0]?.number || '101',
      studentsCount: 25
    });
    setEditModalOpen(true);
  };

  const handleOpenEdit = (cls) => {
    setEditingClass(cls);
    setForm({ ...cls });
    setEditModalOpen(true);
  };

  const handleSave = () => {
    const className = `${form.grade}${form.letter}`;
    if (editingClass) {
      setClasses(prev => prev.map(c => c.id === editingClass.id ? { ...c, ...form, name: className } : c));
      addToast({ type: 'success', title: 'Класс обновлён', message: 'Данные класса сохранены' });
    } else {
      const newClass = {
        id: 'cls-' + Date.now(),
        ...form,
        name: className,
        gpa: 4.4,
        attendanceRate: 97.0
      };
      setClasses(prev => [newClass, ...prev]);
      addToast({ type: 'success', title: 'Класс создан', message: 'Новый класс добавлен в структуру школы' });
    }
    setEditModalOpen(false);
  };

  const columns = [
    {
      key: 'name',
      title: 'Класс',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-sm text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-xl">
          {val}
        </span>
      )
    },
    {
      key: 'shift',
      title: 'Смена',
      render: (val) => <span className="text-xs text-slate-500 font-medium">{val}-я смена</span>
    },
    {
      key: 'homeroomTeacher',
      title: 'Классный руководитель',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-800 dark:text-slate-200">{val}</span>
    },
    {
      key: 'roomNumber',
      title: 'Основной кабинет',
      render: (val) => <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Каб. {val}</span>
    },
    {
      key: 'studentsCount',
      title: 'Учеников',
      sortable: true,
      render: (val) => <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{val} уч.</span>
    },
    {
      key: 'gpa',
      title: 'Ср. балл',
      sortable: true,
      render: (val) => <span className="text-xs font-bold text-emerald-600">★ {val}</span>
    },
    {
      key: 'actions',
      title: 'Действия',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedClass(row);
              setProfileModalOpen(true);
            }}
          >
            <Eye className="w-4 h-4 text-slate-500" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleOpenEdit(row)}
          >
            <Edit2 className="w-4 h-4 text-slate-500" />
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
            <FolderKanban className="w-6 h-6 text-indigo-600" />
            Классы и параллели
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Всего {classes.length} классов • Классное руководство, кабинеты и средняя успеваемость
          </p>
        </div>

        <Button size="sm" icon={Plus} onClick={handleOpenAdd}>
          Создать класс
        </Button>
      </div>

      {/* Toolbar: Search & View Switcher (Cards / Table) */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-between gap-4">
        <div className="w-full max-w-sm">
          <SearchInput
            placeholder="Поиск по названию класса или классному руководителю..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Cards vs Table view pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            title="Карточки"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            title="Таблица"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cls) => (
            <div
              key={cls.id}
              onClick={() => {
                setSelectedClass(cls);
                setProfileModalOpen(true);
              }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-xl flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
                      {cls.name}
                    </span>
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block uppercase">Параллель {cls.grade}</span>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{cls.shift}-я смена</span>
                    </div>
                  </div>

                  <Badge variant="success" size="sm">★ {cls.gpa}</Badge>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Кл. руководитель:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{cls.homeroomTeacher}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Закреплённый кабинет:</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">Каб. {cls.roomNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Количество учеников:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{cls.studentsCount} человек</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-emerald-600 font-semibold">Посещаемость {cls.attendanceRate}%</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Подробнее &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <Table
          columns={columns}
          data={filtered}
          emptyTitle="Классы не найдены"
        />
      )}

      {/* Modal: Class Profile (Full Details) */}
      {selectedClass && (
        <Modal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          title={`Профиль класса: ${selectedClass.name}`}
          subtitle={`Классный руководитель: ${selectedClass.homeroomTeacher} • Кабинет ${selectedClass.roomNumber}`}
          maxWidth="max-w-2xl"
          footer={
            <Button onClick={() => setProfileModalOpen(false)}>Закрыть</Button>
          }
        >
          <div className="space-y-5 text-xs sm:text-sm">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-400 block">Учеников</span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedClass.studentsCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-400 block">Средний балл</span>
                <span className="text-lg font-bold text-emerald-600">★ {selectedClass.gpa}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-400 block">Посещаемость</span>
                <span className="text-lg font-bold text-indigo-600">{selectedClass.attendanceRate}%</span>
              </div>
            </div>

            {/* Students list preview */}
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-between">
                <span>Список учащихся класса ({selectedClass.studentsCount})</span>
                <button
                  onClick={() => {
                    setProfileModalOpen(false);
                    setActiveView('students');
                  }}
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  Открыть реестр учеников &rarr;
                </button>
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {students.filter(s => s.className === selectedClass.name).map((st, i) => (
                  <div key={st.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{i + 1}. {st.fullName}</span>
                    <span className="text-emerald-600 font-bold">★ {st.gpa}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Add/Edit Class */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={editingClass ? "Редактирование класса" : "Создание нового класса"}
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Отмена</Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Параллель (номер)"
              type="number"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })}
            />
            <Input
              label="Буква"
              value={form.letter}
              onChange={(e) => setForm({ ...form, letter: e.target.value.toUpperCase() })}
            />
          </div>

          <Select
            label="Смена"
            value={form.shift}
            onChange={(e) => setForm({ ...form, shift: Number(e.target.value) })}
          >
            <option value="1">1-я смена (Утренняя)</option>
            <option value="2">2-я смена (Дневная)</option>
          </Select>

          <Select
            label="Классный руководитель"
            value={form.homeroomTeacher}
            onChange={(e) => setForm({ ...form, homeroomTeacher: e.target.value })}
          >
            {teachers.map(t => <option key={t.id} value={t.fullName}>{t.fullName}</option>)}
          </Select>

          <Select
            label="Основной кабинет"
            value={form.roomNumber}
            onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
          >
            {classrooms.map(r => <option key={r.id} value={r.number}>Каб. {r.number} ({r.type})</option>)}
          </Select>
        </div>
      </Modal>
    </div>
  );
};
