import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  School,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

export const AuthView = () => {
  const {
    currentSchool,
    schools,
    setCurrentSchool,
    setActiveView,
    switchRole,
    loginUser,
    addToast
  } = useApp();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(username, password);
      addToast({
        type: 'success',
        title: 'Успешная авторизация',
        message: 'Добро пожаловать в систему Smart School!'
      });
    } catch (loginError) {
      setError(loginError.message || 'Не удалось подключиться к серверу.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleKey, userLogin) => {
    switchRole(roleKey);
    setUsername(userLogin);
    setPassword('demo2026');
    addToast({
      type: 'info',
      title: 'Демо вход',
      message: `Выполнен вход под ролью: ${roleKey}`
    });
    setActiveView('dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card">
        {/* Brand Logo & Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Smart School
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Единая цифровая образовательная экосистема
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* School Selector (Multi-School requirement) */}
          <Select
            label="Образовательное учреждение"
            value={currentSchool.id}
            onChange={(e) => {
              const selected = schools.find(s => s.id === e.target.value);
              if (selected) setCurrentSchool(selected);
            }}
          >
            {schools.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>

          {/* Login / Email */}
          <Input
            label="Логин или Email"
            type="text"
            icon={Mail}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите ваш логин или email"
            required
          />

          {/* Password */}
          <div>
            <div className="relative">
              <Input
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
              />
              <span className="text-slate-600 dark:text-slate-300">Запомнить меня</span>
            </label>

            <button
              type="button"
              onClick={() => {
                setForgotSubmitted(false);
                setForgotModalOpen(true);
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Забыли пароль?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={loading}
          >
            Войти в систему
          </Button>
        </form>

        {/* Quick Demo Switcher Section */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
            Быстрый вход для проверки ролей (Демо)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin.school12@smartschool.tj')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
            >
              <div className="font-semibold text-slate-800 dark:text-slate-200">Администратор</div>
              <div className="text-[10px] text-slate-400">Управление школой</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('teacher', 'karimova.m@school12.tj')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
            >
              <div className="font-semibold text-slate-800 dark:text-slate-200">Учитель</div>
              <div className="text-[10px] text-slate-400">Каримова М. Р.</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('student', 'sharipov.alisher')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
            >
              <div className="font-semibold text-slate-800 dark:text-slate-200">Ученик</div>
              <div className="text-[10px] text-slate-400">Шарипов А. (7А)</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('parent', 'sharipov.parent')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
            >
              <div className="font-semibold text-slate-800 dark:text-slate-200">Родитель</div>
              <div className="text-[10px] text-slate-400">Шарипов Ф. Н.</div>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Восстановление доступа"
        subtitle="Инструкция будет отправлена на привязанную почту"
        maxWidth="max-w-md"
        footer={
          forgotSubmitted ? (
            <Button onClick={() => setForgotModalOpen(false)}>
              Понятно
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setForgotModalOpen(false)}>
                Отмена
              </Button>
              <Button
                onClick={() => {
                  if (forgotEmail) {
                    setForgotSubmitted(true);
                  }
                }}
              >
                Отправить инструкцию
              </Button>
            </>
          )
        }
      >
        {forgotSubmitted ? (
          <div className="text-center py-4 space-y-2">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              Письмо отправлено!
            </h4>
            <p className="text-xs sm:text-sm text-slate-500">
              Мы отправили ссылку для сброса пароля на адрес <span className="font-medium text-slate-800 dark:text-slate-200">{forgotEmail}</span>. Проверьте папку «Входящие» и «Спам».
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Укажите email или телефон, указанный при регистрации аккаунта в школе.
            </p>
            <Input
              label="Email или телефон"
              icon={Mail}
              placeholder="example@mail.ru"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
