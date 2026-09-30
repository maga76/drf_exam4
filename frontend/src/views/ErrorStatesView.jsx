import React, { useState } from 'react';
import {
  ShieldAlert,
  FileQuestion,
  ServerCrash,
  Loader2,
  Inbox,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Home,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Skeleton, TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';

export const ErrorStatesView = () => {
  const { setActiveView, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('403');

  const tabs = [
    { id: '403', label: '403 Доступ запрещён' },
    { id: '404', label: '404 Не найдено' },
    { id: '500', label: '500 Ошибка сервера' },
    { id: 'skeleton', label: 'Скелетон загрузки' },
    { id: 'empty', label: 'Пустое состояние' },
    { id: 'validation', label: 'Ошибки валидации' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Системные состояния и экраны ошибок
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Интерактивная витрина UX-состояний: 403, 404, 500, скелетоны и валидация
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setActiveView('dashboard')}
        >
          На главную панель
        </Button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Screen 403: Forbidden */}
      {activeTab === '403' && (
        <div className="p-8 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-card space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Ошибка 403</span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Доступ к разделу ограничен
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            У вашей текущей учётной записи недостаточно прав для просмотра данного модуля. Для повышения уровня доступа обратитесь к школьному администратору.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Button variant="secondary" onClick={() => setActiveView('dashboard')}>
              Вернуться на главную
            </Button>
            <Button onClick={() => addToast({ type: 'info', title: 'Запрос отправлен', message: 'Уведомление передано завучу школы' })}>
              Запросить права доступа
            </Button>
          </div>
        </div>
      )}

      {/* Screen 404: Not Found */}
      {activeTab === '404' && (
        <div className="p-8 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-card space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <FileQuestion className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Ошибка 404</span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Страница или документ не найдены
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Запрашиваемый урок, профиль или документ был перемещён, удалён или ссылка содержит опечатку.
          </p>
          <div className="pt-2">
            <Button icon={Home} onClick={() => setActiveView('dashboard')}>
              Перейти на главную страницу
            </Button>
          </div>
        </div>
      )}

      {/* Screen 500: Server Error */}
      {activeTab === '500' && (
        <div className="p-8 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-card space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
            <ServerCrash className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Ошибка 500</span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Внутренняя ошибка сервиса
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Сервер школы временно недоступен или выполняет процедуру автоматического обновления. Данные находятся в безопасности.
          </p>
          <div className="pt-2">
            <Button
              icon={RefreshCw}
              onClick={() => addToast({ type: 'success', title: 'Связь проверена', message: 'Сервер отвечает в штатном режиме' })}
            >
              Повторить попытку
            </Button>
          </div>
        </div>
      )}

      {/* Loading Skeleton Demo */}
      {activeTab === 'skeleton' && (
        <div className="space-y-4">
          <Card>
            <CardHeader title="Демонстрация индикаторов загрузки (Skeleton UI)" />
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <TableSkeleton rows={4} cols={5} />
            </div>
          </Card>
        </div>
      )}

      {/* Empty State Demo */}
      {activeTab === 'empty' && (
        <Card>
          <EmptyState
            icon={Inbox}
            title="Нет актуальных домашних заданий"
            description="На текущую учебную неделю все запланированные задания проверены и закрыты."
            actionLabel="Создать новое задание"
            onAction={() => setActiveView('homework')}
          />
        </Card>
      )}

      {/* Form Validation Errors Demo */}
      {activeTab === 'validation' && (
        <Card>
          <CardHeader
            title="Отображение ошибок валидации форм"
            subtitle="Визуальное выделение некорректно заполненных полей"
          />

          <div className="space-y-4 max-w-md">
            <Input
              label="Электронная почта"
              defaultValue="invalid-email"
              error="Укажите корректный адрес электронной почты (например: name@school.tj)"
            />
            <Input
              label="Пароль"
              type="password"
              defaultValue="123"
              error="Пароль слишком простой. Требуется не менее 8 символов и цифра."
            />
            <Button variant="danger">
              Зафиксировать ошибки
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
