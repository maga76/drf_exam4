import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Save,
  Award,
  Filter,
  TrendingUp,
  Download,
  Eye,
  Plus,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Select, Input } from '../components/ui/Input';

export const GradesView = () => {
  const { classes, subjects, students, gradesMatrix, setGradesMatrix, addToast } = useApp();

  const [selectedClassId, setSelectedClassId] = useState('cls-7a');
  const [selectedSubjectId, setSelectedSubjectId] = useState('sub-1');
  const [selectedPeriod, setSelectedPeriod] = useState('term1');

  // Inline Grade Editor Modal
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [activeCell, setActiveCell] = useState(null); // { studentId, studentName, colId, colTopic, currentGrade }
  const [selectedScore, setSelectedScore] = useState(5);
  const [teacherComment, setTeacherComment] = useState('');

  // Individual Student Grades Drawer/Modal
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState(null);

  const classStudents = students.filter(s => s.classId === selectedClassId);
  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  const columns = gradesMatrix.columns;

  const handleCellClick = (student, col) => {
    const currentVal = gradesMatrix.grades[student.id]?.[col.id] || null;
    setActiveCell({
      studentId: student.id,
      studentName: student.fullName,
      colId: col.id,
      colDate: col.date,
      colTopic: col.topic,
      colType: col.type,
      currentGrade: currentVal
    });
    setSelectedScore(currentVal || 5);
    setTeacherComment('');
    setGradeModalOpen(true);
  };

  const handleSaveGrade = () => {
    if (activeCell) {
      setGradesMatrix(prev => ({
        ...prev,
        grades: {
          ...prev.grades,
          [activeCell.studentId]: {
            ...prev.grades[activeCell.studentId],
            [activeCell.colId]: selectedScore
          }
        }
      }));
      addToast({
        type: 'success',
        title: 'Оценка сохранена',
        message: `Выставлена оценка «${selectedScore}» ученику ${activeCell.studentName}`
      });
      setGradeModalOpen(false);
    }
  };

  const handleClearGrade = () => {
    if (activeCell) {
      const updatedStudentGrades = { ...gradesMatrix.grades[activeCell.studentId] };
      delete updatedStudentGrades[activeCell.colId];
      setGradesMatrix(prev => ({
        ...prev,
        grades: {
          ...prev.grades,
          [activeCell.studentId]: updatedStudentGrades
        }
      }));
      addToast({ type: 'info', title: 'Оценка удалена', message: 'Ячейка очищена' });
      setGradeModalOpen(false);
    }
  };

  const calculateStudentAvg = (studentId) => {
    const studentGrades = gradesMatrix.grades[studentId] || {};
    const values = Object.values(studentGrades).filter(v => typeof v === 'number');
    if (values.length === 0) return '—';
    const sum = values.reduce((a, b) => a + b, 0);
    return (sum / values.length).toFixed(2);
  };

  const gradePillColors = {
    5: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    4: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    3: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    2: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            Электронный журнал оценок
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Текущая и итоговая успеваемость по четвертям с расчётом среднего балла
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={Download}
            onClick={() => addToast({ type: 'info', title: 'Экспорт журнала', message: 'Ведомость оценок выгружена в Excel' })}
          >
            Экспорт в Excel
          </Button>
        </div>
      </div>

      {/* Filter toolbar: Class, Subject, Period */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-wrap items-center gap-3">
        <div className="w-40">
          <Select
            label="Класс"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>

        <div className="w-56">
          <Select
            label="Предмет"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
          >
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
        </div>

        <div className="w-48">
          <Select
            label="Учебный период"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="term1">1 четверть (Текущая)</option>
            <option value="term2">2 четверть</option>
            <option value="term3">3 четверть</option>
            <option value="term4">4 четверть</option>
            <option value="year">Годовая оценка</option>
          </Select>
        </div>
      </div>

      {/* Gradebook Spreadsheet Matrix */}
      <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-card overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40">
              <th className="p-3.5 w-10 text-xs font-semibold text-slate-400 text-center uppercase">
                №
              </th>
              <th className="p-3.5 w-60 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Учащийся
              </th>

              {/* Lesson Date / Topic columns */}
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={`p-3 text-center border-l border-slate-100 dark:border-slate-800 min-w-[90px] ${
                    col.type === 'control' ? 'bg-amber-50/50 dark:bg-amber-950/30' : ''
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {col.date}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[80px] mx-auto" title={col.topic}>
                    {col.type === 'control' ? 'Контрольная' : col.type === 'quiz' ? 'Сам. раб.' : 'Урок'}
                  </div>
                </th>
              ))}

              <th className="p-3.5 w-24 text-center border-l border-slate-200 dark:border-slate-800 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase">
                Ср. балл
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {classStudents.map((st, idx) => {
              const avg = calculateStudentAvg(st.id);
              return (
                <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 text-center text-xs font-semibold text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="p-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedStudentForReport(st);
                        setStudentModalOpen(true);
                      }}
                      className="hover:text-indigo-600 hover:underline text-left"
                    >
                      {st.fullName}
                    </button>
                  </td>

                  {/* Grades columns */}
                  {columns.map((col) => {
                    const gradeVal = gradesMatrix.grades[st.id]?.[col.id];
                    return (
                      <td
                        key={col.id}
                        onClick={() => handleCellClick(st, col)}
                        className={`p-2 text-center border-l border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 transition-colors select-none ${
                          col.type === 'control' ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''
                        }`}
                      >
                        {gradeVal ? (
                          <span className={`inline-block w-8 h-8 leading-8 rounded-xl font-bold text-sm border ${
                            gradePillColors[gradeVal] || gradePillColors[5]
                          }`}>
                            {gradeVal}
                          </span>
                        ) : (
                          <span className="inline-block w-8 h-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400" />
                        )}
                      </td>
                    );
                  })}

                  {/* Average Grade Column */}
                  <td className="p-3 text-center border-l border-slate-200 dark:border-slate-800 font-extrabold text-sm text-indigo-700 dark:text-indigo-400 bg-slate-50/40 dark:bg-slate-800/20">
                    ★ {avg}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal: Fast Grade Picker Popover */}
      {activeCell && (
        <Modal
          isOpen={gradeModalOpen}
          onClose={() => setGradeModalOpen(false)}
          title={`Выставление оценки: ${activeCell.studentName}`}
          subtitle={`${activeCell.colDate} • ${activeCell.colTopic} (${activeCell.colType === 'control' ? 'Контрольная работа' : 'Текущий урок'})`}
          maxWidth="max-w-md"
          footer={
            <div className="flex items-center justify-between w-full">
              {activeCell.currentGrade && (
                <Button variant="danger" size="sm" onClick={handleClearGrade}>
                  Очистить
                </Button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="secondary" size="sm" onClick={() => setGradeModalOpen(false)}>Отмена</Button>
                <Button size="sm" onClick={handleSaveGrade}>Сохранить оценку</Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-500 block uppercase">Выберите балл:</span>
            <div className="grid grid-cols-4 gap-3">
              {[5, 4, 3, 2].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setSelectedScore(score)}
                  className={`py-3 rounded-2xl font-extrabold text-xl border-2 transition-all ${
                    selectedScore === score
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 scale-105 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>

            <Input
              label="Комментарий к оценке (опционально)"
              placeholder="Например: Отличная подготовка, замечаний нет"
              value={teacherComment}
              onChange={(e) => setTeacherComment(e.target.value)}
            />
          </div>
        </Modal>
      )}

      {/* Modal: Individual Student Report */}
      {selectedStudentForReport && (
        <Modal
          isOpen={studentModalOpen}
          onClose={() => setStudentModalOpen(false)}
          title={`Табель учащегося: ${selectedStudentForReport.fullName}`}
          subtitle={`${selectedStudentForReport.className} класс • Текущий средний балл: ★ ${selectedStudentForReport.gpa}`}
          maxWidth="max-w-md"
          footer={<Button onClick={() => setStudentModalOpen(false)}>Закрыть</Button>}
        >
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
              <span className="text-xs text-slate-400">Предмет:</span>
              <div className="font-bold text-slate-800 dark:text-slate-200">{currentSubject.name}</div>
            </div>
            <div className="p-3 border rounded-xl space-y-2">
              <div className="flex justify-between">
                <span>Линейные уравнения:</span>
                <span className="font-bold text-emerald-600">5 (отлично)</span>
              </div>
              <div className="flex justify-between">
                <span>Самостоятельная работа:</span>
                <span className="font-bold text-emerald-600">5 (отлично)</span>
              </div>
              <div className="flex justify-between">
                <span>Свойства степеней:</span>
                <span className="font-bold text-teal-600">4 (хорошо)</span>
              </div>
              <div className="flex justify-between">
                <span>Контрольная работа №1:</span>
                <span className="font-bold text-emerald-600">5 (отлично)</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
