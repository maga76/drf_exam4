import React, { useState } from 'react';
import {
  BookOpen,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
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
  const [activeCell, setActiveCell] = useState(null);
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
        title: 'Оценка выставлена',
        message: `Балл ${selectedScore} для ${activeCell.studentName}`
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
    5: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    4: "bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800",
    3: "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    2: "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            Электронный журнал оценок
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Успеваемость по четвертям и текущим урокам · Средний балл рассчитывается автоматически
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={Download}
            onClick={() => addToast({ type: 'info', title: 'Экспорт журнала', message: 'Ведомость выгружена в Excel' })}
          >
            Экспорт в Excel
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-3">
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
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-xs overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40">
              <th className="p-3 w-10 text-xs font-semibold text-slate-400 text-center uppercase">
                №
              </th>
              <th className="p-3 w-60 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Учащийся
              </th>

              {columns.map((col) => (
                <th
                  key={col.id}
                  className={`p-2.5 text-center border-l border-slate-200/80 dark:border-slate-800 min-w-[80px] ${
                    col.type === 'control' ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {col.date}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[75px] mx-auto" title={col.topic}>
                    {col.type === 'control' ? 'Контрольная' : col.type === 'quiz' ? 'Сам. раб.' : 'Урок'}
                  </div>
                </th>
              ))}

              <th className="p-3 w-24 text-center border-l border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                Ср. балл
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {classStudents.map((st, idx) => {
              const avg = calculateStudentAvg(st.id);
              return (
                <tr key={st.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 text-center text-xs text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="p-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedStudentForReport(st);
                        setStudentModalOpen(true);
                      }}
                      className="hover:underline text-left"
                    >
                      {st.fullName}
                    </button>
                  </td>

                  {columns.map((col) => {
                    const gradeVal = gradesMatrix.grades[st.id]?.[col.id];
                    return (
                      <td
                        key={col.id}
                        onClick={() => handleCellClick(st, col)}
                        className={`p-1.5 text-center border-l border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors select-none ${
                          col.type === 'control' ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''
                        }`}
                      >
                        {gradeVal ? (
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded font-bold text-xs border ${
                            gradePillColors[gradeVal] || gradePillColors[5]
                          }`}>
                            {gradeVal}
                          </span>
                        ) : (
                          <span className="inline-block w-7 h-7 rounded border border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-400" />
                        )}
                      </td>
                    );
                  })}

                  <td className="p-3 text-center border-l border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200 bg-slate-50/30">
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
          subtitle={`${activeCell.colDate} · ${activeCell.colTopic}`}
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
                <Button size="sm" onClick={handleSaveGrade}>Сохранить</Button>
              </div>
            </div>
          }
        >
          <div className="space-y-3">
            <span className="text-xs font-medium text-slate-500 block uppercase">Выберите балл:</span>
            <div className="grid grid-cols-4 gap-2.5">
              {[5, 4, 3, 2].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setSelectedScore(score)}
                  className={`py-2.5 rounded-lg font-bold text-lg border transition-all ${
                    selectedScore === score
                      ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>

            <Input
              label="Комментарий к оценке"
              placeholder="За работу у доски, домашнее задание..."
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
          title={`Успеваемость: ${selectedStudentForReport.fullName}`}
          subtitle={`${selectedStudentForReport.className} класс · Средний балл: ★ ${selectedStudentForReport.gpa}`}
          maxWidth="max-w-md"
          footer={<Button size="sm" onClick={() => setStudentModalOpen(false)}>Закрыть</Button>}
        >
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
              <span className="text-xs text-slate-400">Предмет:</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200">{currentSubject.name}</div>
            </div>
            <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Линейные уравнения:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">5 (отлично)</span>
              </div>
              <div className="flex justify-between">
                <span>Самостоятельная работа:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">5 (отлично)</span>
              </div>
              <div className="flex justify-between">
                <span>Свойства степеней:</span>
                <span className="font-semibold text-teal-700 dark:text-teal-400">4 (хорошо)</span>
              </div>
              <div className="flex justify-between">
                <span>Контрольная работа №1:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">5 (отлично)</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
