import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  PieChart,
  Users,
  Award,
  DoorOpen,
  Repeat
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { StatsCard } from '../components/ui/StatsCard';

export const ReportsView = () => {
  const { classes, teachers, subjects, addToast } = useApp();

  const [period, setPeriod] = useState('term1');
  const [filterClass, setFilterClass] = useState('all');

  const attendanceData = [
    { day: "Пн", rate: 97.4 },
    { day: "Вт", rate: 96.8 },
    { day: "Ср", rate: 98.1 },
    { day: "Чт", rate: 95.9 },
    { day: "Пт", rate: 96.5 },
    { day: "Сб", rate: 97.0 },
  ];

  const gradeDistribution = [
    { label: "Отлично (5)", percent: 42, color: "#10b981" },
    { label: "Хорошо (4)", percent: 38, color: "#06b6d4" },
    { label: "Удовл. (3)", percent: 18, color: "#f59e0b" },
    { label: "Неудовл. (2)", percent: 2, color: "#f43f5e" },
  ];

  const teacherWorkloads = [
    { name: "Каримова М. Р.", hours: 24, max: 28 },
    { name: "Иванов А. С.", hours: 22, max: 26 },
    { name: "Саидова Н. А.", hours: 26, max: 28 },
    { name: "Рахимов Ф. З.", hours: 20, max: 24 },
    { name: "Холматов Б. С.", hours: 18, max: 24 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Отчёты и аналитическая сводка
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Сводная аналитика посещаемости, качества знаний, загрузки педагогов и кабинетов
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={FileSpreadsheet}
            onClick={() => addToast({ type: 'info', title: 'Экспорт в Excel', message: 'Сводная аналитическая таблица скачана' })}
          >
            Экспорт Excel
          </Button>
          <Button
            size="sm"
            icon={FileText}
            onClick={() => addToast({ type: 'success', title: 'Экспорт в PDF', message: 'Отчёт для управления образования подготовлен' })}
          >
            Экспорт PDF
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-wrap items-center gap-3">
        <div className="w-48">
          <Select
            label="Период"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="term1">1-я четверть (Сентябрь — Октябрь)</option>
            <option value="month">Текущий месяц (Сентябрь)</option>
            <option value="week">Текущая неделя</option>
            <option value="year">Весь учебный год</option>
          </Select>
        </div>

        <div className="w-44">
          <Select
            label="Параллель / Класс"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="all">Вся школа (Все классы)</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard
          title="Общая посещаемость"
          value="96.9%"
          subtitle="Целевой показатель > 95%"
          icon={Users}
          trend={{ value: "+1.1%", isPositive: true }}
          color="emerald"
        />
        <StatsCard
          title="Качество знаний"
          value="74.2%"
          subtitle="Доля оценок 4 и 5"
          icon={Award}
          trend={{ value: "+2.8%", isPositive: true }}
          color="indigo"
        />
        <StatsCard
          title="Занятость кабинетов"
          value="86.5%"
          subtitle="Эффективность использования"
          icon={DoorOpen}
          color="teal"
        />
        <StatsCard
          title="Оформлено замен"
          value="18"
          subtitle="За текущий месяц"
          icon={Repeat}
          color="violet"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend (Bar Chart SVG) */}
        <Card>
          <CardHeader
            title="Динамика посещаемости по дням недели"
            subtitle="Процент присутствующих учащихся"
          />

          <div className="pt-4">
            <div className="flex items-end justify-between gap-4 h-48 px-2 border-b border-slate-200 dark:border-slate-800">
              {attendanceData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.rate}%
                  </span>
                  <div
                    className="w-full max-w-[42px] bg-gradient-to-t from-indigo-600 to-indigo-500 rounded-t-xl transition-all duration-300 group-hover:brightness-110"
                    style={{ height: `${(d.rate - 90) * 10}%` }}
                  />
                  <span className="text-xs font-semibold text-slate-500 mt-2">
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Минимум: 95.9% (Чт)</span>
              <span>Максимум: 98.1% (Ср)</span>
            </div>
          </div>
        </Card>

        {/* Grade Distribution (Donut / Progress breakdown) */}
        <Card>
          <CardHeader
            title="Распределение оценок (Качество знаний)"
            subtitle="Доля полученных баллов за период"
          />

          <div className="space-y-4 pt-2">
            {gradeDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{item.label}</span>
                  <span className="text-slate-500">{item.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Всего выставлено: 1,480 оценок</span>
              <span className="font-bold text-emerald-600">Успеваемость: 98%</span>
            </div>
          </div>
        </Card>

        {/* Teacher Workload Comparison (Horizontal Bar Chart) */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Педагогическая нагрузка ключевых преподавателей"
            subtitle="Фактические часы против максимальной допустимой ставки"
          />

          <div className="space-y-3 pt-2">
            {teacherWorkloads.map((tw, idx) => {
              const pct = (tw.hours / tw.max) * 100;
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{tw.name}</span>
                    <span className="text-slate-500 font-mono">
                      {tw.hours} ч. из {tw.max} ч. ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${pct > 90 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
