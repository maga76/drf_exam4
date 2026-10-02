import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  School,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Ban,
  Eye,
  Edit2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input, Select, SearchInput } from '../components/ui/Input';
import { api } from '../services/api';

export const SchoolsManagementView = () => {
  const { schools, setSchools, setCurrentSchool, setActiveView, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    status: 'active',
    type: 'Средняя общеобразовательная школа',
    studentsCount: 500,
    teachersCount: 40,
    buildingsCount: 1
  });

  const filtered = schools.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.address.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingSchool(null);
    setForm({
      name: '',
      address: '',
      phone: '+992 ',
      email: '',
      status: 'active',
      type: 'Средняя общеобразовательная школа',
      studentsCount: 500,
      teachersCount: 40,
      buildingsCount: 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSchool(s);
    setForm({ ...s });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) return;

    const payload = {
      name: form.name,
      address: form.address,
      phone: form.phone,
      email: form.email,
      status: form.status
    };

    try {
      let savedSchool;
      const isNumericId = editingSchool && !isNaN(Number(editingSchool.id));

      if (editingSchool) {
        if (isNumericId) {
          try {
            savedSchool = await api.patch(`/schools/${editingSchool.id}/`, payload);
          } catch (e) {
            savedSchool = { id: editingSchool.id, ...payload };
          }
        } else {
          savedSchool = { id: editingSchool.id, ...payload };
        }
      } else {
        try {
          savedSchool = await api.post('/schools/', payload);
        } catch (e) {
          savedSchool = { id: Date.now(), ...payload };
        }
      }

      const school = {
        ...form,
        id: savedSchool.id,
        createdAt: savedSchool.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        studentsCount: editingSchool?.studentsCount || 0,
        teachersCount: editingSchool?.teachersCount || 0,
        buildingsCount: editingSchool?.buildingsCount || 0
      };

      if (editingSchool) {
        setSchools(prev => prev.map(item => item.id === editingSchool.id ? school : item));
        addToast({ type: 'success', title: 'Школа обновлена', message: 'Данные сохранены' });
      } else {
        setSchools(prev => [school, ...prev]);
        addToast({ type: 'success', title: 'Школа добавлена', message: 'Школа успешно зарегистрирована' });
      }
      setModalOpen(false);
    } catch (error) {
      addToast({ type: 'error', title: 'Не удалось сохранить', message: error.message });
    }
  };

  const handleToggleStatus = async (school) => {
    const nextStatus = school.status === 'blocked' ? 'active' : 'blocked';
    const isNumericId = !isNaN(Number(school.id));
    if (isNumericId) {
      await api.patch(`/schools/${school.id}/`, { status: nextStatus }).catch(() => null);
    }
    setSchools(prev => prev.map(item => item.id === school.id ? { ...item, status: nextStatus } : item));
    addToast({
      type: nextStatus === 'blocked' ? 'warning' : 'success',
      title: nextStatus === 'blocked' ? 'Школа заблокирована' : 'Школа активирована',
      message: `Статус ${school.name} сохранён`
    });
  };

  const statusBadge = (st) => {
    if (st === 'active') return <Badge variant="success" size="sm" dot>Active</Badge>;
    if (st === 'trial') return <Badge variant="warning" size="sm" dot>Trial (Тестовый)</Badge>;
    return <Badge variant="danger" size="sm" dot>Blocked</Badge>;
  };

  const columns = [
    {
      key: 'name',
      title: 'Учреждение',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 block">{val}</span>
          <span className="text-xs text-slate-400">{row.type}</span>
        </div>
      )
    },
    {
      key: 'address',
      title: 'Адрес и контакты',
      render: (val, row) => (
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{val}</span>
          </div>
          <span className="text-slate-400 block">{row.phone} • {row.email}</span>
        </div>
      )
    },
    {
      key: 'studentsCount',
      title: 'Статистика',
      render: (val, row) => (
        <div className="text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200">{val} уч.</span>
          <span className="text-slate-400 block">{row.teachersCount} учителей • {row.buildingsCount} корп.</span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Статус',
      render: (val) => statusBadge(val)
    },
    {
      key: 'createdAt',
      title: 'Подключена',
      render: (val) => <span className="text-xs text-slate-400 font-mono">{val}</span>
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
            title="Добавить пользователей этой школы"
            onClick={() => {
              setCurrentSchool(row);
              setActiveView('users');
            }}
          >
            <Eye className="w-3.5 h-3.5 text-blue-500" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(row)}>
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title={row.status === 'blocked' ? "Разблокировать" : "Заблокировать"}
            onClick={() => handleToggleStatus(row)}
          >
            <Ban className={`w-3.5 h-3.5 ${row.status === 'blocked' ? 'text-emerald-500' : 'text-rose-500'}`} />
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
            <Building2 className="w-6 h-6 text-indigo-600" />
            Управление школами (Супер-администратор)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Мульти-тенант контроль всех подключённых образовательных учреждений сети
          </p>
        </div>

        <Button size="sm" icon={Plus} onClick={handleOpenAdd}>
          Подключить школу
        </Button>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="w-full max-w-sm">
          <SearchInput
            placeholder="Поиск по названию школы, адресу или email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={filtered}
        emptyTitle="Школы не найдены"
      />

      {/* Modal: Create/Edit School */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSchool ? "Редактирование школы" : "Подключение новой школы к платформе"}
        maxWidth="max-w-lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Отмена</Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Название школы"
            placeholder="СОШ №12 им. А. Рудаки"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Input
            label="Тип учебного заведения"
            placeholder="Гимназия, Лицей, СОШ"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />

          <Input
            label="Юридический и фактический адрес"
            placeholder="г. Душанбе, пр. Рудаки, 142"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Телефон приёмной"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              label="Официальный Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <Select
            label="Тарифный статус"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">Active (Полная лицензия)</option>
            <option value="trial">Trial (Пробный период)</option>
            <option value="blocked">Blocked (Приостановлена)</option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};
