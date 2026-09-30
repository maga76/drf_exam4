import React, { useState } from 'react';
import {
  Settings,
  Building,
  Clock,
  Globe,
  Award,
  Bell,
  Database,
  Save,
  Download,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';

export const SchoolSettingsView = () => {
  const { currentSchool, setCurrentSchool, addToast } = useApp();

  const [generalForm, setGeneralForm] = useState({
    name: currentSchool.name,
    address: currentSchool.address,
    phone: currentSchool.phone,
    email: currentSchool.email,
    timezone: "Asia/Dushanbe (UTC+5)",
    gradingScale: "5",
    autoPublishSchedule: true,
    enableParentSms: false
  });

  const handleSave = () => {
    setCurrentSchool(prev => ({
      ...prev,
      name: generalForm.name,
      address: generalForm.address,
      phone: generalForm.phone,
      email: generalForm.email
    }));
    addToast({
      type: 'success',
      title: 'Настройки сохранены',
      message: 'Параметры школы успешно обновлены'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            Настройки образовательного учреждения
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Реквизиты, шкала оценивания, часовой пояс и экспорт данных
          </p>
        </div>

        <Button icon={Save} onClick={handleSave}>
          Сохранить изменения
        </Button>
      </div>

      {/* Main Settings Sections */}
      <div className="space-y-6">
        {/* General Details */}
        <Card>
          <CardHeader
            title="Основная информация и контакты"
            subtitle="Отображаются в шапке расписания, дневниках и официальных отчётах"
          />

          <div className="space-y-4">
            <Input
              label="Официальное наименование школы"
              value={generalForm.name}
              onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
            />

            <Input
              label="Юридический адрес"
              value={generalForm.address}
              onChange={(e) => setGeneralForm({ ...generalForm, address: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Телефон канцелярии"
                value={generalForm.phone}
                onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
              />
              <Input
                label="Email для обращений"
                type="email"
                value={generalForm.email}
                onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Academic and Regional Settings */}
        <Card>
          <CardHeader
            title="Академические и региональные параметры"
            subtitle="Шкала оценивания и часовой пояс"
          />

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Система оценивания"
                value={generalForm.gradingScale}
                onChange={(e) => setGeneralForm({ ...generalForm, gradingScale: e.target.value })}
              >
                <option value="5">5-балльная шкала (Традиционная: 5, 4, 3, 2)</option>
                <option value="10">10-балльная шкала</option>
                <option value="100">100-балльная шкала (Рейтинговая ECTS)</option>
              </Select>

              <Select
                label="Часовой пояс школы"
                value={generalForm.timezone}
                onChange={(e) => setGeneralForm({ ...generalForm, timezone: e.target.value })}
              >
                <option value="Asia/Dushanbe (UTC+5)">Душанбе / Ташкент (UTC+5)</option>
                <option value="Europe/Moscow (UTC+3)">Москва (UTC+3)</option>
                <option value="Asia/Almaty (UTC+5)">Алматы (UTC+5)</option>
              </Select>
            </div>

            <div className="pt-2 space-y-3">
              <Switch
                label="Автоматическая публикация изменений расписания"
                description="Отправлять мгновенные оповещения при подтверждении замен"
                checked={generalForm.autoPublishSchedule}
                onChange={(v) => setGeneralForm({ ...generalForm, autoPublishSchedule: v })}
              />

              <Switch
                label="SMS-оповещения родителей об отсутствии"
                description="Отправлять SMS при пропуске первого урока без справки"
                checked={generalForm.enableParentSms}
                onChange={(v) => setGeneralForm({ ...generalForm, enableParentSms: v })}
              />
            </div>
          </div>
        </Card>

        {/* Backup and Data Export */}
        <Card>
          <CardHeader
            title="Резервное копирование и экспорт данных"
            subtitle="Выгрузка полной базы данных школы в форматах JSON и CSV"
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              icon={Download}
              onClick={() => addToast({ type: 'success', title: 'Экспорт готов', message: 'Резервная копия базы данных school_backup_2026.json скачана' })}
            >
              Скачать резервную копию (JSON)
            </Button>
            <Button
              variant="outline"
              icon={Upload}
              onClick={() => addToast({ type: 'info', title: 'Восстановление', message: 'Выберите файл архива для восстановления' })}
            >
              Восстановить из архива
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
