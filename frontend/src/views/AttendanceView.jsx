import React, { useState } from 'react';
import {
  CheckSquare,
  Calendar,
  Save,
  CheckCircle,
  AlertTriangle,
  UserX,
  Clock,
  BarChart3,
  Search,
  Filter,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Select, Input } from '../components/ui/Input';

export const AttendanceView = () => {
  const { classes, students, addToast, role } = useApp();
  const canEditAttendance = ['super_admin', 'admin', 'curriculum_director', 'teacher', 'homeroom_teacher'].includes(role);

  const [activeTab, setActiveTab] = useState('journal'); // journal | analytics
  const [selectedClassId, setSelectedClassId] = useState('cls-7a');
  const [selectedDate, setSelectedDate] = useState('2026-09-30');
  const [selectedLessonNum, setSelectedLessonNum] = useState(2);

  // Status mapping for each student: 'present' | 'absent' | 'late' | 'excused'
  const [attendanceMap, setAttendanceMap] = useState({
    'std-101': { status: 'present', comment: '' },
    'std-102': { status: 'present', comment: '' },
    'std-103': { status: 'late', comment: 'Опоздал на 10 минут (транспорт)' },
    'std-104': { status: 'present', comment: '' },
    'std-105': { status: 'excused', comment: 'Справка от врача' },
  });

  const classStudents = students.filter(s => s.classId === selectedClassId);

  const handleSetStatus = (studentId, status) => {
    if (!canEditAttendance) return;
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleSetComment = (studentId, comment) => {
    if (!canEditAttendance) return;
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        comment
      }
    }));
  };

  const handleMarkAllPresent = () => {
    if (!canEditAttendance) return;
    const updated = { ...attendanceMap };
    classStudents.forEach(st => {
      updated[st.id] = { status: 'present', comment: '' };
    });
    setAttendanceMap(updated);
    addToast({ type: 'info', title: 'Все присутствуют', message: 'Всем ученикам выставлен статус «Присутствует»' });
  };

  const handleSave = () => {
    if (!canEditAttendance) {
      addToast({ type: 'danger', title: 'Отказ в доступе', message: 'Отмечать посещаемость могут только педагоги' });
      return;
    }
    addToast({
      type: 'success',
      title: 'Журнал сохранён',
      message: 'Посещаемость зафиксирована в базе данных школы'
    });
  };

  const tabs = [
    { id: 'journal', label: 'Журнал урока' },
    { id: 'analytics', label: 'Аналитика и пропуски' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-600" />
            Электронный журнал посещаемости
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Оперативная фиксация присутствия, опозданий и уважительных причин
          </p>
        </div>

        {canEditAttendance && activeTab === 'journal' && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleMarkAllPresent}
            >
              Отметить всех присутствующими
            </Button>
            <Button
              size="sm"
              icon={Save}
              onClick={handleSave}
            >
              Сохранить журнал
            </Button>
          </div>
        )}
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'journal' ? (
        <div className="space-y-4">
          {/* Controls bar: Class, Date, Lesson */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-wrap items-center gap-3">
            <div className="w-40">
              <Select
                label="Класс"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.homeroomTeacher})</option>)}
              </Select>
            </div>

            <div className="w-40">
              <Input
                label="Дата"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="w-48">
              <Select
                label="Урок"
                value={selectedLessonNum}
                onChange={(e) => setSelectedLessonNum(Number(e.target.value))}
              >
                <option value="1">1-й урок (08:00 – 08:45)</option>
                <option value="2">2-й урок (08:50 – 09:35)</option>
                <option value="3">3-й урок (09:45 – 10:30)</option>
                <option value="4">4-й урок (10:45 – 11:30)</option>
                <option value="5">5-й урок (11:35 – 12:20)</option>
              </Select>
            </div>
          </div>

          {/* Roster Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                Список учащихся ({classStudents.length} чел.)
              </span>
              <span className="text-xs text-slate-400">
                Быстрые клавиши: [П] Присутствует, [Н] Отсутствует, [О] Опоздал, [У] Уважительная
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {classStudents.map((st, idx) => {
                const currentRecord = attendanceMap[st.id] || { status: 'present', comment: '' };
                return (
                  <div
                    key={st.id}
                    className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-xs font-bold text-slate-400">
                        {idx + 1}
                      </span>
                      <img
                        src={st.avatar}
                        alt={st.fullName}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 block">
                          {st.fullName}
                        </span>
                        <span className="text-xs text-slate-400">{st.studentCode}</span>
                      </div>
                    </div>

                    {/* Status Pill Toggle Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        disabled={!canEditAttendance}
                        onClick={() => handleSetStatus(st.id, 'present')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          !canEditAttendance ? 'cursor-default opacity-85' : 'cursor-pointer hover:bg-slate-200'
                        } ${
                          currentRecord.status === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Присутствует (П)
                      </button>

                      <button
                        type="button"
                        disabled={!canEditAttendance}
                        onClick={() => handleSetStatus(st.id, 'absent')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          !canEditAttendance ? 'cursor-default opacity-85' : 'cursor-pointer hover:bg-slate-200'
                        } ${
                          currentRecord.status === 'absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Отсутствует (Н)
                      </button>

                      <button
                        type="button"
                        disabled={!canEditAttendance}
                        onClick={() => handleSetStatus(st.id, 'late')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          !canEditAttendance ? 'cursor-default opacity-85' : 'cursor-pointer hover:bg-slate-200'
                        } ${
                          currentRecord.status === 'late'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Опоздал (О)
                      </button>

                      <button
                        type="button"
                        disabled={!canEditAttendance}
                        onClick={() => handleSetStatus(st.id, 'excused')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          !canEditAttendance ? 'cursor-default opacity-85' : 'cursor-pointer hover:bg-slate-200'
                        } ${
                          currentRecord.status === 'excused'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Уважительная (У)
                      </button>

                      {/* Comment Input for Absence */}
                      {currentRecord.status !== 'present' && (
                        <input
                          type="text"
                          placeholder="Причина (справка, записка)..."
                          value={currentRecord.comment}
                          onChange={(e) => handleSetComment(st.id, e.target.value)}
                          className="px-2.5 py-1 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none w-44"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Analytics Tab */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card text-center">
              <span className="text-xs text-slate-400 font-semibold uppercase">Средняя посещаемость</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">96.8%</div>
              <span className="text-xs text-emerald-600 font-semibold mt-1 block">+0.8% к прошлой неделе</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card text-center">
              <span className="text-xs text-slate-400 font-semibold uppercase">Пропусков по болезни</span>
              <div className="text-3xl font-extrabold text-blue-600 mt-1">42 ч.</div>
              <span className="text-xs text-slate-400 mt-1 block">Подтверждено справками</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card text-center">
              <span className="text-xs text-slate-400 font-semibold uppercase">Неуважительных пропусков</span>
              <div className="text-3xl font-extrabold text-rose-600 mt-1">6 ч.</div>
              <span className="text-xs text-rose-500 mt-1 block">Требуется работа соцпедагога</span>
            </div>
          </div>

          {/* Frequent Absentees List (Группа риска) */}
          <Card>
            <CardHeader
              title="Учащиеся с наибольшим количеством пропусков (Группа контроля)"
              subtitle="Требуют внимания классного руководителя и администрации"
            />
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <div className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Мирзоев Далер Собирович (7А)</span>
                  <p className="text-xs text-slate-400">12 уроков пропущено (8 по болезни, 4 без уваж. причины)</p>
                </div>
                <Badge variant="danger">88.4% посещаемость</Badge>
              </div>
              <div className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Раджабов Рустам Исмоилович (7А)</span>
                  <p className="text-xs text-slate-400">8 уроков пропущено (все по уважительной причине)</p>
                </div>
                <Badge variant="warning">92.0% посещаемость</Badge>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
