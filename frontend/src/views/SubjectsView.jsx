import React, { useState } from 'react';
import {
  Bookmark,
  Plus,
  Search,
  DoorOpen,
  Users,
  Clock,
  Edit2,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input, Select, SearchInput } from '../components/ui/Input';

export const SubjectsView = () => {
  const { subjects, setSubjects, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [form, setForm] = useState({
    name: '',
    shortName: '',
    code: '',
    roomType: 'regular',
    weeklyHours: 3
  });

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.shortName.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setForm({ name: '', shortName: '', code: '', roomType: 'regular', weeklyHours: 3 });
    setModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSubject(s);
    setForm({ ...s });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name) return;

    if (editingSubject) {
      setSubjects(prev => prev.map(s => s.id === editingSubject.id ? { ...s, ...form } : s));
      addToast({ type: 'success', title: 'Предмет обновлён', message: 'Данные учебной дисциплины изменены' });
    } else {
      const newSub = {
        id: 'sub-' + Date.now(),
        ...form,
        color: 'indigo'
      };
      setSubjects(prev => [...prev, newSub]);
      addToast({ type: 'success', title: 'Предмет добавлен', message: 'Новая дисциплина внесена в учебный план' });
    }
    setModalOpen(false);
  };

  const columns = [
    {
      key: 'name',
      title: 'Название предмета',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 block">{val}</span>
          <span className="text-xs text-slate-400">Сокращение: {row.shortName} ({row.code})</span>
        </div>
      )
    },
    {
      key: 'weeklyHours',
      title: 'Часов в неделю',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-xs text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-lg">
          {val} ч./нед.
        </span>
      )
    },
    {
      key: 'roomType',
      title: 'Требование к кабинету',
      render: (val) => {
        if (val === 'regular') return <span className="text-xs text-slate-500">Обычный класс</span>;
        return <Badge variant="warning" size="sm">Спец. кабинет ({val})</Badge>;
      }
    },
    {
      key: 'actions',
      title: 'Действия',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(row)}>
            <Edit2 className="w-4 h-4 text-slate-500" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-600" />
            Учебные предметы и дисциплины
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Каталог предметов, норма часов и требования к специализированным кабинетам
          </p>
        </div>

        <Button size="sm" icon={Plus} onClick={handleOpenAdd}>
          Добавить предмет
        </Button>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="w-full max-w-sm">
          <SearchInput
            placeholder="Поиск по названию или коду предмета..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={filtered}
        emptyTitle="Предметы не найдены"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSubject ? "Редактирование предмета" : "Добавление нового предмета"}
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Отмена</Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Полное название"
            placeholder="Математика / Алгебра"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Краткое название"
              placeholder="Алгебра"
              value={form.shortName}
              onChange={(e) => setForm({ ...form, shortName: e.target.value })}
            />
            <Input
              label="Код"
              placeholder="МАТ"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Часов в неделю"
              type="number"
              value={form.weeklyHours}
              onChange={(e) => setForm({ ...form, weeklyHours: Number(e.target.value) })}
            />
            <Select
              label="Требуемый кабинет"
              value={form.roomType}
              onChange={(e) => setForm({ ...form, roomType: e.target.value })}
            >
              <option value="regular">Обычный класс</option>
              <option value="computer">Компьютерный класс</option>
              <option value="physics">Лаборатория физики</option>
              <option value="chemistry">Лаборатория химии</option>
              <option value="gym">Спортивный зал</option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
};
