import React, { useState } from 'react';
import {
  Wand2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Settings,
  Layers,
  Calendar,
  Users,
  DoorOpen,
  Check,
  RefreshCw,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const ScheduleWizardView = () => {
  const { classes, teachers, subjects, classrooms, setActiveView, addToast } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationFinished, setGenerationFinished] = useState(false);

  // Conflicts list in step 7 / results
  const [conflicts, setConflicts] = useState([
    { id: 1, text: "Кабинет 201 (Компьютерный): превышение лимита групп в среду", resolved: false },
    { id: 2, text: "Учитель Каримова М. Р. (Алгебра): 6 уроков подряд без «окна» в пятницу", resolved: false },
  ]);

  const steps = [
    { number: 1, title: "Год и смена" },
    { number: 2, title: "Классы" },
    { number: 3, title: "Часы предметов" },
    { number: 4, title: "Доступность учителей" },
    { number: 5, title: "Ограничения кабинетов" },
    { number: 6, title: "Предварительная проверка" },
    { number: 7, title: "Генерация и результат" }
  ];

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationFinished(false);

    let p = 0;
    const interval = setInterval(() => {
      p += 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setIsGenerating(false);
        setGenerationFinished(true);
        addToast({ type: 'success', title: 'Генерация завершена!', message: 'Расписание для 5 параллелей успешно составлено' });
      }
      setGenerationProgress(p);
    }, 300);
  };

  const resolveConflict = (id) => {
    setConflicts(prev => prev.map(c => c.id === id ? { ...c, resolved: true } : c));
    addToast({ type: 'info', title: 'Конфликт скорректирован', message: 'Алгоритм применил альтернативный временной слот' });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-indigo-600" />
            Мастер автоматической генерации расписания
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Интеллектуальное распределение предметов, учителей и кабинетов без наложений
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setActiveView('schedule')}
        >
          Вернуться к расписанию
        </Button>
      </div>

      {/* 7-Step Progress Stepper */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {steps.map((s) => {
            const isDone = currentStep > s.number;
            const isCurrent = currentStep === s.number;
            return (
              <div
                key={s.number}
                onClick={() => setCurrentStep(s.number)}
                className={`p-2.5 rounded-xl cursor-pointer text-center transition-all ${
                  isCurrent
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : isDone
                    ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                <div className="text-xs mb-1 font-mono">
                  {isDone ? '✓' : s.number}
                </div>
                <div className="text-[11px] leading-tight line-clamp-2">
                  {s.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Step Content */}
      <Card>
        {/* Step 1: Year & Shift */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Шаг 1: Выбор учебного года и рабочей смены
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Укажите академический период и целевую смену для автоматического составления расписания.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 dark:bg-indigo-950/30">
                <span className="text-xs font-bold uppercase text-indigo-600 block mb-1">Учебный год</span>
                <div className="font-semibold text-base text-slate-800 dark:text-slate-200">2025–2026 уч. год (Активный)</div>
                <p className="text-xs text-slate-500 mt-1">1 сентября 2025 — 25 мая 2026</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50">
                <span className="text-xs font-bold uppercase text-slate-500 block mb-1">Смена</span>
                <div className="font-semibold text-base text-slate-800 dark:text-slate-200">1-я смена (08:00 – 13:05)</div>
                <p className="text-xs text-slate-500 mt-1">6 уроков по 45 минут, большая перемена 15 минут</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Classes */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Шаг 2: Выбор классов для генерации
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Отметьте классы, для которых требуется составить новое расписание.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {classes.map(c => (
                <label key={c.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded" />
                  <div>
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{c.name}</span>
                    <p className="text-[11px] text-slate-400">{c.studentsCount} учеников • Каб. {c.roomNumber}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Subject Hours */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Шаг 3: Часы предметов (Учебный план)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Нормативы недельной нагрузки по предметам согласно государственному стандарту.
            </p>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto pr-2">
              {subjects.map(s => (
                <div key={s.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{s.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-700 dark:text-indigo-300">
                      {s.weeklyHours} ч./нед.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Teacher Availability */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Шаг 4: Доступность учителей и методические дни
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Укажите предпочтительные дни и дни без уроков для преподавателей.
            </p>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {teachers.slice(0, 5).map(t => (
                <div key={t.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{t.fullName}</span>
                    <p className="text-slate-400">{t.subjectName} • Макс: {t.maxHours} ч.</p>
                  </div>
                  <Badge variant="success">Все дни доступны</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Rooms & Constraints */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Шаг 5: Ограничения кабинетов
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Специализированные кабинеты (Информатика, Физика, Химия, Спортзал).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 text-xs space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">Компьютерные классы (201)</span>
                <p className="text-slate-500">Требуется деление классов на 2 подгруппы.</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 text-xs space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">Лаборатории (204 Физика, 208 Химия)</span>
                <p className="text-slate-500">Не более 2 спаренных уроков подряд в один день.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Verification */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Шаг 6: Предварительная валидация данных
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Система проверила вводные параметры на математическую сходимость.
            </p>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
              <div className="flex items-center gap-2 font-semibold">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Все предварительные проверки успешно пройдены!
              </div>
              <p>• Количество учебных часов соответствует фонду оплаты труда</p>
              <p>• Специализированных кабинетов достаточно для удовлетворения требований</p>
              <p>• Временные окна для переходов между корпусами учтены</p>
            </div>
          </div>
        )}

        {/* Step 7: Generation & Results */}
        {currentStep === 7 && (
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Шаг 7: Автоматическая генерация расписания
            </h3>

            {isGenerating ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 mx-auto flex items-center justify-center animate-spin">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-base">Идёт расчёт расписания...</h4>
                  <p className="text-xs text-slate-500 mt-1">Оптимизация окон, учителей и кабинетов: {generationProgress}%</p>
                </div>
                <div className="w-full max-w-md mx-auto bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${generationProgress}%` }} />
                </div>
              </div>
            ) : generationFinished ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">
                      Расписание успешно сформировано!
                    </h5>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                      Сгенерировано 142 урока для 5 классов. Средний коэффициент загрузки кабинетов: 84%.
                    </p>
                  </div>
                </div>

                {/* Conflicts detector section */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
                  <h5 className="font-semibold text-amber-800 dark:text-amber-300 text-xs sm:text-sm flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Обнаруженные некритические коллизии ({conflicts.filter(c => !c.resolved).length})
                  </h5>
                  <div className="space-y-2 pt-1">
                    {conflicts.map(c => (
                      <div key={c.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between gap-3 text-xs">
                        <span className={c.resolved ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                          {c.text}
                        </span>
                        {c.resolved ? (
                          <Badge variant="success" size="sm">Исправлено</Badge>
                        ) : (
                          <button
                            onClick={() => resolveConflict(c.id)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 shrink-0"
                          >
                            Исправить
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Button
                    onClick={() => {
                      addToast({ type: 'success', title: 'Опубликовано', message: 'Новое расписание опубликовано' });
                      setActiveView('schedule');
                    }}
                  >
                    Применить и опубликовать расписание
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleStartGeneration}
                  >
                    Перегенерировать
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Параметры сконфигурированы. Нажмите кнопку ниже для запуска алгоритма генерации расписания.
                </p>
                <Button size="lg" icon={Sparkles} onClick={handleStartGeneration}>
                  Запустить алгоритм генерации
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Button
            variant="secondary"
            icon={ArrowLeft}
            disabled={currentStep === 1 || isGenerating}
            onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
          >
            Назад
          </Button>

          {currentStep < 7 ? (
            <Button
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => setCurrentStep(p => Math.min(7, p + 1))}
            >
              Далее
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
};
