import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  User,
  Phone,
  Sparkles,
  ShieldCheck,
  CalendarDays,
  BookOpen,
  Radio,
  School
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

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Register form state
  const [registerRole, setRegisterRole] = useState('student'); // 'student' | 'teacher' | 'parent'
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
  const [registerAgree, setRegisterAgree] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

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

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!registerFullName.trim()) {
      setError('Пожалуйста, укажите ФИО.');
      return;
    }
    if (!registerEmail.trim() && !registerPhone.trim()) {
      setError('Укажите email или телефон для связи.');
      return;
    }
    if (registerPassword.length < 6) {
      setError('Пароль должен содержать не менее 6 символов.');
      return;
    }
    if (registerPassword !== registerPasswordConfirm) {
      setError('Введённые пароли не совпадают.');
      return;
    }
    if (!registerAgree) {
      setError('Необходимо согласиться с правилами обработки данных.');
      return;
    }

    setRegisterLoading(true);

    setTimeout(() => {
      setRegisterLoading(false);
      addToast({
        type: 'success',
        title: 'Заявка отправлена',
        message: 'Учётная запись зарегистрирована. Войдите с новым паролем.'
      });
      setUsername(registerEmail || registerFullName.toLowerCase().replace(/\s+/g, '.'));
      setPassword(registerPassword);
      setAuthMode('login');
    }, 700);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-100/70 dark:bg-slate-950 font-sans">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Side: Brand & Feature Highlights */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center justify-center shadow-inner">
                <GraduationCap className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white block">Smart School</span>
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Education Desk UI</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 leading-snug">
              Цифровая экосистема вашей школы
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Единая платформа для расписания, электронного журнала, мониторинга посещаемости и управления заменами.
            </p>

            {/* Feature Bullets */}
            <div className="mt-8 space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Интерактивное расписание</h4>
                  <p className="text-[11px] text-slate-400">Автоматический учет кабинетов и смен без накладок</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Электронный журнал и оценки</h4>
                  <p className="text-[11px] text-slate-400">Средневзвешенные баллы, четверти и прозрачная статистика</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Школа сейчас (Live Lessons)</h4>
                  <p className="text-[11px] text-slate-400">Мониторинг текущих уроков и оперативное оформление замен</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Ролевой контроль доступа</h4>
                  <p className="text-[11px] text-slate-400">Безопасная изоляция данных учеников, родителей и учителей</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="mt-8 pt-6 border-t border-white/10 relative z-10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Серверы школы онлайн
            </span>
            <span>Версия 2.4 Desk</span>
          </div>
        </div>

        {/* Right Side: Auth Form with Tabs */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div>
            {/* Tab Switcher: Вход / Регистрация */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setError(''); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    authMode === 'login'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Вход в систему
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setError(''); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    authMode === 'register'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Регистрация
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[160px] font-medium">{currentSchool?.name}</span>
              </div>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Select
                    label="Образовательное учреждение"
                    value={currentSchool.id}
                    onChange={(e) => {
                      const selected = schools.find(s => String(s.id) === e.target.value);
                      if (selected) setCurrentSchool(selected);
                    }}
                  >
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code || 'Корпус 1'})
                      </option>
                    ))}
                  </Select>
                </div>

                <Input
                  label="Логин или Email"
                  type="text"
                  icon={Mail}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin или email@school.tj"
                  required
                />

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
                      className="absolute right-3 top-[32px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-slate-900 focus:ring-slate-900 border-slate-300 dark:border-slate-700"
                    />
                    <span className="text-slate-600 dark:text-slate-400">Запомнить меня</span>
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
                  icon={ArrowRight}
                >
                  Войти в личный кабинет
                </Button>

                {/* Quick Super Admin Fill Button */}
                <button
                  type="button"
                  onClick={() => {
                    setUsername('admin');
                    setPassword('admin123');
                    addToast({ type: 'info', title: 'Заполнено', message: 'Данные супер-администратора подставлены' });
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">Тестовый доступ администратора</span>
                    <span className="block text-[11px] text-slate-400">Логин: admin • Пароль: admin123</span>
                  </div>
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Подставить &rarr;</span>
                </button>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegister} className="space-y-3.5">
                {/* Role Switcher */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Кем вы регистрируетесь?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'student', label: 'Ученик' },
                      { id: 'parent', label: 'Родитель' },
                      { id: 'teacher', label: 'Учитель' },
                    ].map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRegisterRole(r.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                          registerRole === r.id
                            ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Select
                  label="Школа"
                  value={currentSchool.id}
                  onChange={(e) => {
                    const selected = schools.find(s => String(s.id) === e.target.value);
                    if (selected) setCurrentSchool(selected);
                  }}
                >
                  {schools.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>

                <Input
                  label="Фамилия, Имя и Отчество"
                  type="text"
                  icon={User}
                  value={registerFullName}
                  onChange={(e) => setRegisterFullName(e.target.value)}
                  placeholder="Иванов Алексей Петрович"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Электронная почта"
                    type="email"
                    icon={Mail}
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                  <Input
                    label="Номер телефона"
                    type="tel"
                    icon={Phone}
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    placeholder="+992 900 12 34 56"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Пароль"
                    type="password"
                    icon={Lock}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Минимум 6 знаков"
                    required
                  />
                  <Input
                    label="Повтор пароля"
                    type="password"
                    icon={Lock}
                    value={registerPasswordConfirm}
                    onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                    placeholder="Повторите пароль"
                    required
                  />
                </div>

                <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={registerAgree}
                    onChange={(e) => setRegisterAgree(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-slate-900 focus:ring-slate-900 border-slate-300 dark:border-slate-700 mt-0.5"
                  />
                  <span className="text-[11px] text-slate-500 leading-tight">
                    Я согласен с регламентом школы и даю согласие на обработку персональных данных в системе Smart School.
                  </span>
                </label>

                <Button
                  type="submit"
                  className="w-full mt-2"
                  isLoading={registerLoading}
                  icon={CheckCircle2}
                >
                  Создать аккаунт
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Восстановление пароля"
        subtitle="Инструкция по сбросу будет выслана на указанный адрес"
        maxWidth="max-w-md"
        footer={
          forgotSubmitted ? (
            <Button onClick={() => setForgotModalOpen(false)}>
              Понятно
            </Button>
          ) : (
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setForgotModalOpen(false)}>
                Отмена
              </Button>
              <Button
                onClick={() => {
                  if (forgotEmail) {
                    setForgotSubmitted(true);
                    addToast({
                      type: 'success',
                      title: 'Запрос принят',
                      message: 'Ссылка для восстановления отправлена на почту'
                    });
                  }
                }}
              >
                Отправить ссылку
              </Button>
            </div>
          )
        }
      >
        {forgotSubmitted ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Письмо отправлено!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Проверьте входящие сообщения на <span className="font-semibold">{forgotEmail}</span>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Введите email, привязанный к вашему профилю в школе. Мы отправим одноразовую ссылку для смены пароля.
            </p>
            <Input
              label="Электронная почта"
              type="email"
              placeholder="user@school.tj"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuthView;
