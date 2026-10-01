import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  Lock,
  UserX,
  KeyRound,
  Grid,
  Check,
  X,
  Edit2,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input, Select, SearchInput } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { api } from '../services/api';

export const UsersView = () => {
  const { users, setUsers, schools, currentSchool, permissionsMatrix, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    password: '',
    role: 'teacher',
    schoolId: currentSchool.id,
    school: currentSchool.name,
    phone: '',
    status: 'active'
  });

  const [matrixModalOpen, setMatrixModalOpen] = useState(false);
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);

  const roleLabels = {
    super_admin: "Супер-администратор",
    admin: "Администратор школы",
    curriculum_director: "Завуч",
    teacher: "Учитель",
    homeroom_teacher: "Классный руководитель",
    student: "Ученик",
    parent: "Родитель"
  };

  const filtered = users.filter(u => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.school.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setForm({
      fullName: '',
      username: '',
      password: '',
      role: 'teacher',
      schoolId: currentSchool.id,
      school: currentSchool.name,
      phone: '+992 ',
      status: 'active'
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setForm({ ...u, password: '' });
    setCreateModalOpen(true);
  };

  const roleToBackend = {
    admin: 'school_admin',
    curriculum_director: 'deputy',
    homeroom_teacher: 'class_teacher'
  };

  const handleSave = async () => {
    if (!form.fullName || !form.username || (!editingUser && !form.password)) return;

    const nameParts = form.fullName.trim().split(/\s+/);
    const selectedSchool = schools.find(item => String(item.id) === String(form.schoolId));
    const payload = {
      username: form.username,
      email: form.username.includes('@') ? form.username : '',
      last_name: nameParts[0] || '',
      first_name: nameParts[1] || '',
      middle_name: nameParts.slice(2).join(' '),
      phone: form.phone,
      role: roleToBackend[form.role] || form.role,
      school: form.role === 'super_admin' ? null : Number(form.schoolId),
      is_active: form.status === 'active'
    };

    if (form.password) payload.password = form.password;

    try {
      const savedUser = editingUser
        ? await api.patch(`/users/${editingUser.id}/`, payload)
        : await api.post('/users/', payload);
      const user = {
        ...form,
        id: savedUser.id,
        schoolId: savedUser.school,
        school: savedUser.school_name || selectedSchool?.name || 'Все школы',
        password: '',
        lastLogin: editingUser?.lastLogin || 'Никогда'
      };

      if (editingUser) {
        setUsers(prev => prev.map(item => item.id === editingUser.id ? user : item));
        addToast({ type: 'success', title: 'Доступ обновлён', message: 'Роль и данные пользователя сохранены' });
      } else {
        setUsers(prev => [user, ...prev]);
        addToast({ type: 'success', title: 'Доступ создан', message: `${form.username} теперь может войти в систему` });
      }
      setCreateModalOpen(false);
    } catch (error) {
      addToast({ type: 'error', title: 'Не удалось создать доступ', message: error.message });
    }
  };

  const handleResetPassword = (user) => {
    handleOpenEdit(user);
    addToast({
      type: 'info',
      title: 'Изменение пароля',
      message: `Введите новый пароль для ${user.username} и сохраните`
    });
  };

  const handleToggleBlock = async () => {
    if (userToBlock) {
      const newStatus = userToBlock.status === 'blocked' ? 'active' : 'blocked';
      try {
        await api.patch(`/users/${userToBlock.id}/`, { is_active: newStatus === 'active' });
        setUsers(prev => prev.map(item => item.id === userToBlock.id ? { ...item, status: newStatus } : item));
        addToast({
          type: newStatus === 'blocked' ? 'warning' : 'success',
          title: newStatus === 'blocked' ? 'Пользователь заблокирован' : 'Доступ восстановлен',
          message: `Статус аккаунта ${userToBlock.username} сохранён`
        });
        setBlockConfirmOpen(false);
      } catch (error) {
        addToast({ type: 'error', title: 'Ошибка', message: error.message });
      }
    }
  };

  const columns = [
    {
      key: 'fullName',
      title: 'Пользователь',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 block">{val}</span>
          <span className="text-xs text-slate-400 font-mono">{row.username}</span>
        </div>
      )
    },
    {
      key: 'role',
      title: 'Роль',
      sortable: true,
      render: (val) => (
        <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
          {roleLabels[val] || val}
        </span>
      )
    },
    {
      key: 'school',
      title: 'Школа',
      render: (val) => <span className="text-xs text-slate-500">{val}</span>
    },
    {
      key: 'phone',
      title: 'Телефон',
      render: (val) => <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">{val}</span>
    },
    {
      key: 'status',
      title: 'Статус',
      render: (val) => (
        <Badge variant={val === 'active' ? 'success' : 'danger'} size="sm" dot>
          {val === 'active' ? 'Активен' : 'Заблокирован'}
        </Badge>
      )
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
            title="Сбросить пароль"
            onClick={() => handleResetPassword(row)}
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Редактировать"
            onClick={() => handleOpenEdit(row)}
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title={row.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'}
            onClick={() => {
              setUserToBlock(row);
              setBlockConfirmOpen(true);
            }}
          >
            <UserX className="w-3.5 h-3.5 text-rose-500" />
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
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            Пользователи и распределение ролей
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Управление правами доступа, ролевая модель и блокировка учётных записей
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={Grid}
            onClick={() => setMatrixModalOpen(true)}
          >
            Матрица разрешений
          </Button>
          <Button size="sm" icon={Plus} onClick={handleOpenAdd}>
            Создать пользователя
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full max-w-sm">
          <SearchInput
            placeholder="Поиск по ФИО, логину или школе..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-auto text-xs py-1.5"
          >
            <option value="all">Все роли</option>
            <option value="super_admin">Супер-администраторы</option>
            <option value="admin">Администраторы школ</option>
            <option value="curriculum_director">Завучи</option>
            <option value="teacher">Учителя</option>
            <option value="student">Ученики</option>
            <option value="parent">Родители</option>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <Table
        columns={columns}
        data={filtered}
        emptyTitle="Пользователи не найдены"
      />

      {/* Modal: Create / Edit User */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={editingUser ? "Редактирование пользователя" : "Создание пользователя"}
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>Отмена</Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="ФИО пользователя"
            placeholder="Иванов Алексей Сергеевич"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />

          <Input
            label="Логин или Email"
            placeholder="ivanov@smartschool.tj"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          <Input
            label={editingUser ? 'Новый пароль (если хотите изменить)' : 'Пароль для входа'}
            type="password"
            placeholder={editingUser ? 'Оставьте пустым без изменения' : 'Минимум 8 символов'}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editingUser}
          />

          <Select
            label="Школа"
            value={form.schoolId}
            onChange={(e) => {
              const selectedSchool = schools.find(item => String(item.id) === e.target.value);
              setForm({ ...form, schoolId: e.target.value, school: selectedSchool?.name || '' });
            }}
            disabled={form.role === 'super_admin'}
          >
            {schools.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Роль в системе"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="super_admin">Супер-администратор</option>
              <option value="admin">Директор / администратор школы</option>
              <option value="curriculum_director">Завуч</option>
              <option value="teacher">Учитель</option>
              <option value="homeroom_teacher">Классный руководитель</option>
              <option value="student">Ученик</option>
              <option value="parent">Родитель</option>
            </Select>

            <Input
              label="Телефон"
              placeholder="+992 (93) 000-00-00"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <Select
            label="Статус аккаунта"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">Активен</option>
            <option value="blocked">Заблокирован</option>
          </Select>
        </div>
      </Modal>

      {/* Modal: Permissions Matrix */}
      <Modal
        isOpen={matrixModalOpen}
        onClose={() => setMatrixModalOpen(false)}
        title="Матрица прав доступа по ролям"
        subtitle="Глобальная конфигурация политик безопасности системы"
        maxWidth="max-w-4xl"
        footer={<Button onClick={() => setMatrixModalOpen(false)}>Закрыть</Button>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b bg-slate-50 dark:bg-slate-800">
                <th className="p-2.5 font-bold">Модуль / Действие</th>
                <th className="p-2.5 text-center">Супер-админ</th>
                <th className="p-2.5 text-center">Админ</th>
                <th className="p-2.5 text-center">Завуч</th>
                <th className="p-2.5 text-center">Учитель</th>
                <th className="p-2.5 text-center">Ученик</th>
                <th className="p-2.5 text-center">Родитель</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-2.5 font-medium">{item.module}</td>
                  <td className="p-2.5 text-center">{item.super_admin ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                  <td className="p-2.5 text-center">{item.admin ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                  <td className="p-2.5 text-center">{item.curriculum_director ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                  <td className="p-2.5 text-center">{item.teacher ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                  <td className="p-2.5 text-center">{item.student ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                  <td className="p-2.5 text-center">{item.parent ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Confirm Block Dialog */}
      <ConfirmDialog
        isOpen={blockConfirmOpen}
        onClose={() => setBlockConfirmOpen(false)}
        onConfirm={handleToggleBlock}
        title={userToBlock?.status === 'blocked' ? "Разблокировка аккаунта" : "Блокировка доступа"}
        message={
          userToBlock?.status === 'blocked'
            ? `Восстановить доступ для пользователя ${userToBlock?.fullName}?`
            : `Вы действительно хотите заблокировать доступ пользователю ${userToBlock?.fullName}? Он потеряет возможность входа в систему.`
        }
        confirmText={userToBlock?.status === 'blocked' ? "Разблокировать" : "Заблокировать"}
      />
    </div>
  );
};
