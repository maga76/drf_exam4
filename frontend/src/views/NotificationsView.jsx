import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Calendar,
  Repeat,
  BookOpen,
  FileText,
  AlertCircle,
  Settings,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Modal } from '../components/ui/Modal';
import { Switch } from '../components/ui/Switch';

export const NotificationsView = () => {
  const { notifications, setNotifications, markAllNotificationsRead, setActiveView } = useApp();

  const [filterType, setFilterType] = useState('all');
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Settings switches
  const [channels, setChannels] = useState({
    substitutions: true,
    scheduleChanges: true,
    grades: true,
    homework: true,
    announcements: true,
    emailAlerts: false,
    pushAlerts: true
  });

  const typeTabs = [
    { id: 'all', label: 'Все' },
    { id: 'unread', label: 'Непрочитанные' },
    { id: 'substitution', label: 'Замены' },
    { id: 'schedule', label: 'Расписание' },
    { id: 'grade', label: 'Оценки' },
    { id: 'homework', label: 'Домашние задания' },
  ];

  const filtered = notifications.filter(n => {
    if (filterType === 'unread') return !n.read;
    if (filterType !== 'all') return n.type === filterType;
    return true;
  });

  const handleMarkOne = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'substitution': return <Repeat className="w-4 h-4 text-purple-600" />;
      case 'schedule': return <Calendar className="w-4 h-4 text-indigo-600" />;
      case 'grade': return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'homework': return <FileText className="w-4 h-4 text-amber-600" />;
      default: return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600" />
            Центр уведомлений
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Оперативные оповещения об изменениях в расписании, оценках и школьных событиях
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={CheckCheck}
            onClick={markAllNotificationsRead}
          >
            Отметить все как прочитанные
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={Settings}
            onClick={() => setSettingsModalOpen(true)}
          >
            Настройки оповещений
          </Button>
        </div>
      </div>

      <Tabs tabs={typeTabs} activeTab={filterType} onChange={setFilterType} />

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-slate-400 text-sm">
            Уведомлений в данной категории нет
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                handleMarkOne(n.id);
                if (n.link) setActiveView(n.link);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 shadow-card hover:shadow-card-hover ${
                n.read
                  ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-80'
                  : 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      {n.title}
                    </span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-2 block">{n.timestamp}</span>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkOne(n.id);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Отметить прочитанным"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal: Notification Preferences */}
      <Modal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        title="Настройки каналов уведомлений"
        subtitle="Выберите, какие оповещения вы хотите получать"
        maxWidth="max-w-md"
        footer={<Button onClick={() => setSettingsModalOpen(false)}>Сохранить</Button>}
      >
        <div className="space-y-4">
          <Switch
            label="Замены преподавателей"
            description="Оповещать об изменениях в составе учителей"
            checked={channels.substitutions}
            onChange={(v) => setChannels({ ...channels, substitutions: v })}
          />
          <Switch
            label="Переносы кабинетов и уроков"
            description="Срочные изменения в текущем расписании"
            checked={channels.scheduleChanges}
            onChange={(v) => setChannels({ ...channels, scheduleChanges: v })}
          />
          <Switch
            label="Новые оценки в журнале"
            description="Мгновенные уведомления о выставлении баллов"
            checked={channels.grades}
            onChange={(v) => setChannels({ ...channels, grades: v })}
          />
          <Switch
            label="Школьные объявления"
            description="Новости и приказы администрации"
            checked={channels.announcements}
            onChange={(v) => setChannels({ ...channels, announcements: v })}
          />
        </div>
      </Modal>
    </div>
  );
};
