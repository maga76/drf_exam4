import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Globe,
  Sun,
  Moon,
  LogOut,
  Save,
  CheckCircle,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';

export const UserProfileView = () => {
  const {
    currentUser,
    setCurrentUser,
    language,
    setLanguage,
    theme,
    toggleTheme,
    logoutUser,
    addToast
  } = useApp();

  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = () => {
    setCurrentUser(prev => ({
      ...prev,
      name: form.name,
      email: form.email,
      phone: form.phone
    }));
    addToast({
      type: 'success',
      title: 'Профиль сохранён',
      message: 'Персональные данные обновлены'
    });
  };

  const handlePasswordChange = () => {
    if (form.newPassword && form.newPassword === form.confirmPassword) {
      addToast({
        type: 'success',
        title: 'Пароль изменён',
        message: 'Новый пароль успешно сохранён'
      });
      setForm(prev => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
    } else {
      addToast({
        type: 'error',
        title: 'Ошибка пароля',
        message: 'Введённые пароли не совпадают'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Профиль пользователя
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Управление личными данными, безопасностью и персональными предпочтениями
        </p>
      </div>

      {/* User Bio Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/20"
          />
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {currentUser.name}
            </h3>
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {currentUser.roleTitle}
            </p>
            <p className="text-xs text-slate-500">
              СОШ №12 им. А. Рудаки • Активный сеанс
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-rose-600 hover:bg-rose-50"
            icon={LogOut}
            onClick={logoutUser}
          >
            Выйти
          </Button>
        </div>
      </Card>

      {/* Personal Info Edit */}
      <Card>
        <CardHeader
          title="Личные данные"
          subtitle="Контактная информация для связи"
          action={
            <Button size="sm" icon={Save} onClick={handleSaveProfile}>
              Сохранить данные
            </Button>
          }
        />

        <div className="space-y-4">
          <Input
            label="ФИО"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Электронная почта"
              type="email"
              icon={Mail}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Номер телефона"
              icon={Phone}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Security & Password */}
      <Card>
        <CardHeader
          title="Безопасность и смена пароля"
          subtitle="Регулярно обновляйте пароль для защиты вашего аккаунта"
          action={
            <Button size="sm" variant="secondary" onClick={handlePasswordChange}>
              Обновить пароль
            </Button>
          }
        />

        <div className="space-y-3">
          <Input
            label="Текущий пароль"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={form.oldPassword}
            onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Новый пароль"
              type="password"
              placeholder="••••••••"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
            <Input
              label="Повторите новый пароль"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Interface Preferences */}
      <Card>
        <CardHeader
          title="Индивидуальные настройки интерфейса"
          subtitle="Язык и цветовая схема приложения"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Язык интерфейса"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="ru">Русский (RU)</option>
            <option value="tj">Тоҷикӣ (TJ)</option>
            <option value="en">English (EN)</option>
          </Select>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Тема оформления
            </label>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span>{theme === 'dark' ? 'Тёмная тема (Night)' : 'Светлая тема (Day)'}</span>
              {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
