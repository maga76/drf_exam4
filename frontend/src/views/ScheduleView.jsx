import React, { useState } from 'react';
import {
  Plus,
  Download,
  AlertTriangle,
  Edit2,
  Trash2,
  CircleCheck,
  CalendarRange,
  WandSparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export const ScheduleView = () => {
  const {
    schedule,
    setSchedule,
    classes,
    teachers,
    subjects,
    classrooms,
    setActiveView,
    addToast
  } = useApp();

  // View by: 'class' | 'teacher' | 'room'
  const [viewMode, setViewMode] = useState('class');
  const [selectedClassId, setSelectedClassId] = useState('cls-7a');
  const [selectedTeacherId, setSelectedTeacherId] = useState('tch-1');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('302');

  // Mobile day tab: 1 (Пн) .. 6 (Сб)
  const [mobileDay, setMobileDay] = useState(1);

  // Lesson Edit/Add Modal
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    day: 1,
    slotNumber: 1,
    classId: 'cls-7a',
    subjectName: 'Алгебра',
    teacherId: 'tch-1',
    roomNumber: '302',
    color: 'indigo'
  });

  // Delete Confirm Dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);

  // Conflict state simulation
  const [hasConflict, setHasConflict] = useState(true);

  const days = [
    { day: 1, name: "Понедельник", short: "Пн" },
    { day: 2, name: "Вторник", short: "Вт" },
    { day: 3, name: "Среда", short: "Ср" },
    { day: 4, name: "Четверг", short: "Чт" },
    { day: 5, name: "Пятница", short: "Пт" },
    { day: 6, name: "Суббота", short: "Сб" },
  ];

  const slots = [
    { number: 1, time: "08:00 – 08:45" },
    { number: 2, time: "08:50 – 09:35" },
    { number: 3, time: "09:45 – 10:30" },
    { number: 4, time: "10:45 – 11:30" },
    { number: 5, time: "11:35 – 12:20" },
    { number: 6, time: "12:25 – 13:05" },
  ];

  // Filter lessons based on viewMode
  const filteredSchedule = schedule.filter(item => {
    if (viewMode === 'class') return item.classId === selectedClassId;
    if (viewMode === 'teacher') return item.teacherId === selectedTeacherId;
    if (viewMode === 'room') return item.roomNumber === selectedRoomNumber;
    return true;
  });

  const getLessonForSlot = (day, slotNumber) => {
    return filteredSchedule.find(s => s.day === day && s.slotNumber === slotNumber);
  };

  const handleOpenAddModal = (day = 1, slot = 1) => {
    setEditingLesson(null);
    setLessonForm({
      day,
      slotNumber: slot,
      classId: selectedClassId,
      subjectName: 'Алгебра',
      teacherId: teachers[0]?.id || '',
      roomNumber: classrooms[0]?.number || '101',
      color: 'indigo'
    });
    setLessonModalOpen(true);
  };

  const handleOpenEditModal = (lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      day: lesson.day,
      slotNumber: lesson.slotNumber,
      classId: lesson.classId,
      subjectName: lesson.subjectName,
      teacherId: lesson.teacherId,
      roomNumber: lesson.roomNumber,
      color: lesson.color || 'indigo'
    });
    setLessonModalOpen(true);
  };

  const handleSaveLesson = () => {
    const selectedClass = classes.find(c => c.id === lessonForm.classId);
    const selectedTeacher = teachers.find(t => t.id === lessonForm.teacherId);
    const targetSlot = slots.find(s => s.number === Number(lessonForm.slotNumber));

    if (editingLesson) {
      // Update
      setSchedule(prev => prev.map(item => item.id === editingLesson.id ? {
        ...item,
        ...lessonForm,
        className: selectedClass?.name || item.className,
        teacherName: selectedTeacher?.fullName || item.teacherName,
        time: targetSlot ? targetSlot.time : item.time
      } : item));
      addToast({ type: 'success', title: 'Урок обновлён', message: 'Изменения сохранены в расписании' });
    } else {
      // Add
      const newLesson = {
        id: 'sch-' + Date.now(),
        ...lessonForm,
        className: selectedClass?.name || '7А',
        teacherName: selectedTeacher?.fullName || 'Учитель',
        time: targetSlot ? targetSlot.time : '08:00 – 08:45',
        dayName: days.find(d => d.day === Number(lessonForm.day))?.name || 'День'
      };
      setSchedule(prev => [...prev, newLesson]);
      addToast({ type: 'success', title: 'Урок добавлен', message: 'Новый урок внесён в сетку расписания' });
    }
    setLessonModalOpen(false);
  };

  const handleDeleteLesson = () => {
    if (lessonToDelete) {
      setSchedule(prev => prev.filter(item => item.id !== lessonToDelete.id));
      addToast({ type: 'info', title: 'Урок удалён', message: 'Занятие удалено из расписания' });
      setDeleteConfirmOpen(false);
      setLessonToDelete(null);
    }
  };

  const colorStyles = {
    indigo: "border-l-indigo-500 bg-indigo-50/50",
    blue: "border-l-blue-500 bg-blue-50/50",
    emerald: "border-l-emerald-500 bg-emerald-50/50",
    teal: "border-l-teal-500 bg-teal-50/50",
    amber: "border-l-amber-500 bg-amber-50/50",
    purple: "border-l-purple-500 bg-purple-50/50",
    violet: "border-l-violet-500 bg-violet-50/50",
    cyan: "border-l-cyan-500 bg-cyan-50/50",
    lime: "border-l-lime-500 bg-lime-50/50",
    rose: "border-l-rose-500 bg-rose-50/50",
    orange: "border-l-orange-500 bg-orange-50/50"
  };

  return (
    <div className="space-y-5">
      {/* Action Bar Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-2">
            <CalendarRange className="w-4 h-4" /> Учебный процесс
          </div>
          <h1 className="text-2xl sm:text-[30px] font-extrabold tracking-[-0.03em] text-[#14213d] dark:text-white">
            Расписание на неделю
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            29 сентября — 4 октября · первая смена
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            icon={WandSparkles}
            onClick={() => setActiveView('scheduleWizard')}
          >
            Собрать расписание
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={Download}
            onClick={() => addToast({ type: 'info', title: 'Экспорт', message: 'Файл расписания сформирован в Excel/PDF' })}
          >
            Экспорт
          </Button>
          <Button
            size="sm"
            icon={Plus}
            onClick={() => handleOpenAddModal(1, 1)}
          >
            Добавить урок
          </Button>
        </div>
      </div>

      {/* Conflict Warning Alert Banner */}
      {hasConflict && (
        <div className="p-4 rounded-[18px] bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-amber-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0"><AlertTriangle className="w-4 h-4 text-amber-700" /></div>
            <span><strong>Нужно проверить кабинет 102.</strong> В среду на 4-м уроке он назначен сразу для 7А и 9Б.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setHasConflict(false);
                addToast({ type: 'success', title: 'Конфликт устранён', message: 'Кабинет для 9Б перенесён в 208' });
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
            >
              Исправить автоматически
            </button>
          </div>
        </div>
      )}

      {/* Filter and View Switcher Toolbar */}
      <div className="p-3 rounded-[18px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-[0_6px_24px_rgba(15,23,42,0.04)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* View Mode Pills: by Class / by Teacher / by Room */}
        <div className="flex items-center gap-1 p-1 bg-[#f1f4f8] dark:bg-slate-800 rounded-xl self-start">
          <button
            onClick={() => setViewMode('class')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'class'
                ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            По классу
          </button>
          <button
            onClick={() => setViewMode('teacher')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'teacher'
                ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            По учителю
          </button>
          <button
            onClick={() => setViewMode('room')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'room'
                ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            По кабинету
          </button>
        </div>

        {/* Dynamic Selectors depending on viewMode */}
        <div className="flex items-center gap-3 flex-wrap">
          {viewMode === 'class' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Класс:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.homeroomTeacher})</option>
                ))}
              </select>
            </div>
          )}

          {viewMode === 'teacher' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Учитель:</span>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.fullName} ({t.subjectName})</option>
                ))}
              </select>
            </div>
          )}

          {viewMode === 'room' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Кабинет:</span>
              <select
                value={selectedRoomNumber}
                onChange={(e) => setSelectedRoomNumber(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                {classrooms.map(r => (
                  <option key={r.id} value={r.number}>Каб. {r.number} ({r.type})</option>
                ))}
              </select>
            </div>
          )}

          <Button
            size="sm"
            icon={CircleCheck}
            onClick={() => addToast({ type: 'success', title: 'Опубликовано', message: 'Расписание опубликовано для всех учеников и учителей' })}
          >
            Опубликовать
          </Button>
        </div>
      </div>

      {/* Mobile Day Tabs (Requirement: "отдельный удобный мобильный вид по дням") */}
      <div className="md:hidden flex items-center justify-between gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
        {days.map((d) => (
          <button
            key={d.day}
            onClick={() => setMobileDay(d.day)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex-1 text-center transition-all ${
              mobileDay === d.day
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            {d.short}
          </button>
        ))}
      </div>

      {/* Desktop Weekly Grid (Mon-Sat, 6 columns + time column) */}
      <div className="hidden md:block overflow-x-auto border border-slate-200/80 dark:border-slate-800 rounded-[22px] bg-white dark:bg-slate-900 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/40">
              <th className="p-3 w-28 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                Урок / Время
              </th>
              {days.map((d) => (
                <th key={d.day} className="p-3 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-l border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="block text-[11px]">{d.name}</span>
                    <span className="block mt-1 text-[11px] font-normal text-slate-400 normal-case">{28 + d.day} сентября</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {slots.map((slot) => (
              <tr key={slot.number} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                {/* Time Slot column */}
                <td className="p-3 text-center align-top bg-slate-50/40 dark:bg-slate-800/20">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {slot.number}-й урок
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 whitespace-nowrap">
                    {slot.time}
                  </div>
                </td>

                {/* Day Columns */}
                {days.map((d) => {
                  const lesson = getLessonForSlot(d.day, slot.number);
                  const isNowActive = d.day === 3 && slot.number === 2; // Wednesday 2nd lesson

                  return (
                    <td
                      key={d.day}
                      className="p-2 border-l border-slate-100 dark:border-slate-800 align-top h-24 min-w-[170px]"
                    >
                      {lesson ? (
                        <div
                          onClick={() => handleOpenEditModal(lesson)}
                          className={`p-3 rounded-xl border border-slate-200 border-l-[3px] text-xs cursor-pointer hover:border-slate-300 hover:shadow-md transition-all relative group ${
                            colorStyles[lesson.color] || colorStyles.indigo
                          } ${isNowActive ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                        >
                          {/* Subject & Quick actions */}
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="font-bold text-[13px] tracking-tight truncate text-slate-900">
                              {lesson.subjectName}
                            </span>
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLessonToDelete(lesson);
                                  setDeleteConfirmOpen(true);
                                }}
                                className="text-rose-500 hover:text-rose-700 p-0.5"
                                title="Удалить урок"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-500 truncate">
                            {viewMode === 'class' ? lesson.teacherName : lesson.className}
                          </div>

                          <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-slate-500 pt-1.5 border-t border-slate-200/70">
                            <span>Каб. {lesson.roomNumber}</span>
                            {isNowActive && (
                              <span className="text-blue-700 font-bold uppercase tracking-wider">
                                Сейчас
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenAddModal(d.day, slot.number)}
                          className="w-full h-full min-h-[76px] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-300 hover:bg-blue-50/30 text-slate-300 hover:text-blue-600 flex items-center justify-center transition-all group"
                          title="Добавить урок в этот слот"
                        >
                          <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Day-by-Day View */}
      <div className="md:hidden space-y-3">
        <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
          {days.find(d => d.day === mobileDay)?.name}
        </h4>
        {slots.map((slot) => {
          const lesson = getLessonForSlot(mobileDay, slot.number);
          return (
            <div
              key={slot.number}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                  {slot.number}
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">{slot.time}</div>
                  {lesson ? (
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{lesson.subjectName}</span>
                      <p className="text-slate-500 mt-0.5">{lesson.teacherName} • Каб. {lesson.roomNumber}</p>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Свободный слот</span>
                  )}
                </div>
              </div>

              {lesson ? (
                <Button size="sm" variant="ghost" onClick={() => handleOpenEditModal(lesson)}>
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => handleOpenAddModal(mobileDay, slot.number)}>
                  +
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Add / Edit Lesson */}
      <Modal
        isOpen={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        title={editingLesson ? "Редактирование урока" : "Добавление урока в расписание"}
        subtitle="Заполните информацию о предмете, преподавателе и кабинете"
        maxWidth="max-w-lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setLessonModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveLesson}>
              {editingLesson ? "Сохранить изменения" : "Добавить урок"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="День недели"
              value={lessonForm.day}
              onChange={(e) => setLessonForm({ ...lessonForm, day: Number(e.target.value) })}
            >
              {days.map(d => <option key={d.day} value={d.day}>{d.name}</option>)}
            </Select>

            <Select
              label="Номер урока"
              value={lessonForm.slotNumber}
              onChange={(e) => setLessonForm({ ...lessonForm, slotNumber: Number(e.target.value) })}
            >
              {slots.map(s => <option key={s.number} value={s.number}>{s.number}-й урок ({s.time})</option>)}
            </Select>
          </div>

          <Select
            label="Класс"
            value={lessonForm.classId}
            onChange={(e) => setLessonForm({ ...lessonForm, classId: e.target.value })}
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>

          <Select
            label="Предмет"
            value={lessonForm.subjectName}
            onChange={(e) => setLessonForm({ ...lessonForm, subjectName: e.target.value })}
          >
            {subjects.map(s => <option key={s.id} value={s.shortName}>{s.name}</option>)}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Преподаватель"
              value={lessonForm.teacherId}
              onChange={(e) => setLessonForm({ ...lessonForm, teacherId: e.target.value })}
            >
              {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
            </Select>

            <Select
              label="Кабинет"
              value={lessonForm.roomNumber}
              onChange={(e) => setLessonForm({ ...lessonForm, roomNumber: e.target.value })}
            >
              {classrooms.map(r => <option key={r.id} value={r.number}>Каб. {r.number} ({r.type})</option>)}
            </Select>
          </div>

          <Select
            label="Цветовое выделение карточки"
            value={lessonForm.color}
            onChange={(e) => setLessonForm({ ...lessonForm, color: e.target.value })}
          >
            <option value="indigo">Индиго (Основной)</option>
            <option value="blue">Синий (Точные науки)</option>
            <option value="emerald">Изумрудный (Языки)</option>
            <option value="teal">Бирюзовый (Литература)</option>
            <option value="amber">Янтарный (Физика)</option>
            <option value="rose">Розовый (Химия)</option>
            <option value="cyan">Голубой (Информатика)</option>
            <option value="lime">Лайм (Спорт)</option>
          </Select>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteLesson}
        title="Удаление урока"
        message={`Вы действительно хотите удалить урок «${lessonToDelete?.subjectName}» (${lessonToDelete?.className}) из сетки расписания?`}
        confirmText="Удалить урок"
      />
    </div>
  );
};
