import React, { useState } from 'react';
import {
  CalendarRange,
  Plus,
  Clock,
  Layers,
  CheckCircle2,
  Edit2,
  Trash2,
  Save,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';

export const AcademicYearsView = () => {
  const {
    academicYears,
    setAcademicYears,
    activeAcademicYear,
    setActiveAcademicYear,
    shiftsConfig,
    setShiftsConfig,
    addToast
  } = useApp();

  const [activeShiftTab, setActiveShiftTab] = useState(1); // 1 | 2
  const [yearModalOpen, setYearModalOpen] = useState(false);
  const [yearForm, setYearForm] = useState({
    name: '2026–2027',
    startDate: '2026-09-01',
    endDate: '2027-05-25'
  });

  const currentShift = shiftsConfig.find(s => s.shiftId === activeShiftTab) || shiftsConfig[0];

  const handleSlotTimeChange = (slotNumber, field, value) => {
    setShiftsConfig(prev => prev.map(s => {
      if (s.shiftId !== activeShiftTab) return s;
      return {
        ...s,
        slots: s.slots.map(sl => sl.number === slotNumber ? { ...sl, [field]: value } : sl)
      };
    }));
  };

  const handleSaveSlots = () => {
    addToast({
      type: 'success',
      title: 'Слоты сохранены',
      message: `Временная сетка ${currentShift.name} успешно обновлена`
    });
  };

  const handleCreateYear = () => {
    const newYear = {
      id: 'ay-' + Date.now(),
      name: yearForm.name,
      startDate: yearForm.startDate,
      endDate: yearForm.endDate,
      isActive: false,
      terms: ["1 четверть", "2 четверть", "3 четверть", "4 четверть"]
    };
    setAcademicYears(prev => [...prev, newYear]);
    addToast({ type: 'success', title: 'Учебный год добавлен', message: `Создан период ${yearForm.name}` });
    setYearModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarRange className="w-6 h-6 text-indigo-600" />
            Учебные годы и временные смены
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Календарные периоды, четверти и визуальная настройка звонков уроков
          </p>
        </div>

        <Button size="sm" icon={Plus} onClick={() => setYearModalOpen(true)}>
          Добавить учебный год
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic Years List */}
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Учебные периоды"
              subtitle="Выберите активный учебный год"
            />
            <div className="space-y-3">
              {academicYears.map((ay) => {
                const isSelected = activeAcademicYear === ay.name;
                return (
                  <div
                    key={ay.id}
                    onClick={() => {
                      setActiveAcademicYear(ay.name);
                      addToast({ type: 'info', title: 'Период изменён', message: `Установлен учебный год ${ay.name}` });
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-base text-slate-900 dark:text-slate-100">{ay.name}</span>
                      {isSelected ? (
                        <Badge variant="primary" size="sm">Активен</Badge>
                      ) : (
                        <span className="text-xs text-slate-400">Архивный</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {ay.startDate} — {ay.endDate}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Visual Shift & Lesson Timing Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader
              title="Визуальный редактор временных слотов (Звонки)"
              subtitle="Настройка продолжительности уроков и перемен"
              action={
                <Button size="sm" icon={Save} onClick={handleSaveSlots}>
                  Сохранить звонки
                </Button>
              }
            />

            {/* Shift Switcher */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
              <button
                onClick={() => setActiveShiftTab(1)}
                className={`flex-1 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeShiftTab === 1
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                1-я смена (08:00 – 13:05)
              </button>
              <button
                onClick={() => setActiveShiftTab(2)}
                className={`flex-1 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeShiftTab === 2
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                2-я смена (13:30 – 18:35)
              </button>
            </div>

            {/* Slots List Editor */}
            <div className="space-y-3">
              {currentShift.slots.map((slot) => (
                <div
                  key={slot.number}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {slot.number}
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {slot.number}-й урок (45 минут)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 text-xs">Начало:</span>
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => handleSlotTimeChange(slot.number, 'start', e.target.value)}
                        className="px-2.5 py-1 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                      />
                    </div>
                    <span className="text-slate-400">—</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 text-xs">Конец:</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => handleSlotTimeChange(slot.number, 'end', e.target.value)}
                        className="px-2.5 py-1 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal: Create Year */}
      <Modal
        isOpen={yearModalOpen}
        onClose={() => setYearModalOpen(false)}
        title="Новый учебный год"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setYearModalOpen(false)}>Отмена</Button>
            <Button onClick={handleCreateYear}>Создать период</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Название учебного года"
            placeholder="2026–2027"
            value={yearForm.name}
            onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Дата начала"
              type="date"
              value={yearForm.startDate}
              onChange={(e) => setYearForm({ ...yearForm, startDate: e.target.value })}
            />
            <Input
              label="Дата окончания"
              type="date"
              value={yearForm.endDate}
              onChange={(e) => setYearForm({ ...yearForm, endDate: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
