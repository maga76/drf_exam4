import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  UserCheck,
  Eye,
  Edit2,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input, SearchInput } from '../components/ui/Input';

export const ParentsView = () => {
  const { parents, setParents, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    occupation: '',
    address: ''
  });

  const filtered = parents.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingParent(null);
    setForm({ fullName: '', phone: '+992 ', email: '', occupation: '', address: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingParent(p);
    setForm({ ...p });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.fullName) return;

    if (editingParent) {
      setParents(prev => prev.map(p => p.id === editingParent.id ? { ...p, ...form } : p));
      addToast({ type: 'success', title: 'Родитель обновлён', message: 'Данные профиля родителя сохранены' });
    } else {
      const newParent = {
        id: 'par-' + Date.now(),
        ...form,
        children: [{ studentId: 'std-101', name: 'Шарипов Алишер', className: '7А' }]
      };
      setParents(prev => [newParent, ...prev]);
      addToast({ type: 'success', title: 'Родитель добавлен', message: 'Законный представитель зарегистрирован' });
    }
    setModalOpen(false);
  };

  const columns = [
    {
      key: 'fullName',
      title: 'ФИО Родителя',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 block">{val}</span>
          <span className="text-xs text-slate-400">{row.occupation}</span>
        </div>
      )
    },
    {
      key: 'phone',
      title: 'Контакты',
      render: (val, row) => (
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{val}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Mail className="w-3.5 h-3.5" />
            <span>{row.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'children',
      title: 'Связанные дети',
      render: (children) => (
        <div className="flex gap-1.5 flex-wrap">
          {children?.map((ch, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200/60 dark:border-indigo-800/40"
            >
              {ch.name} <span className="opacity-70 text-[10px]">({ch.className})</span>
            </span>
          ))}
        </div>
      )
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
            <Users className="w-6 h-6 text-indigo-600" />
            Родители и представители
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Связь законных представителей с личными делами учащихся
          </p>
        </div>

        <Button size="sm" icon={Plus} onClick={handleOpenAdd}>
          Добавить родителя
        </Button>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="w-full max-w-sm">
          <SearchInput
            placeholder="Поиск родителя по ФИО, телефону или email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={filtered}
        emptyTitle="Родители не найдены"
        emptyDescription="В базе отсутствуют подходящие записи"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingParent ? "Редактирование данных родителя" : "Регистрация нового родителя"}
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
            label="ФИО родителя"
            placeholder="Шарипов Фарход Назирович"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
          <Input
            label="Телефон"
            placeholder="+992 (93) 111-22-33"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="parent@gmail.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Род занятий / должность"
            placeholder="Инженер, врач, предприниматель..."
            value={form.occupation}
            onChange={(e) => setForm({ ...form, occupation: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
};
