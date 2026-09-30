import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Calendar,
  LayoutList,
  Paperclip,
  Clock,
  CheckCircle,
  AlertTriangle,
  Upload,
  Download,
  Filter,
  Eye,
  Trash2,
  File
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input, Select, Textarea, SearchInput } from '../components/ui/Input';

export const HomeworkView = () => {
  const { homeworkList, setHomeworkList, classes, subjects, teachers, addToast } = useApp();

  const [viewMode, setViewMode] = useState('list'); // list | calendar
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedHw, setSelectedHw] = useState(null);

  const [hwForm, setHwForm] = useState({
    classId: 'cls-7a',
    subjectId: 'sub-1',
    title: '',
    description: '',
    dueDate: '2026-10-04',
    dueTime: '08:00',
    fileName: ''
  });

  const filtered = homeworkList.filter(hw => {
    const matchesSearch =
      hw.title.toLowerCase().includes(search.toLowerCase()) ||
      hw.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      hw.className.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || hw.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateHw = () => {
    if (!hwForm.title) return;
    const targetClass = classes.find(c => c.id === hwForm.classId);
    const targetSubject = subjects.find(s => s.id === hwForm.subjectId);

    const newHw = {
      id: 'hw-' + Date.now(),
      classId: hwForm.classId,
      className: targetClass?.name || '7А',
      subjectId: hwForm.subjectId,
      subjectName: targetSubject?.name || 'Предмет',
      teacherName: 'Каримова М. Р.',
      title: hwForm.title,
      description: hwForm.description,
      dueDate: hwForm.dueDate,
      dueTime: hwForm.dueTime,
      status: 'new',
      hasAttachment: !!hwForm.fileName,
      fileName: hwForm.fileName || 'zadanie.pdf',
      fileSize: '1.2 MB',
      submissionsCount: 0,
      totalCount: targetClass?.studentsCount || 28
    };

    setHomeworkList(prev => [newHw, ...prev]);
    addToast({ type: 'success', title: 'Задание опубликовано', message: 'Домашнее задание доступно классу' });
    setCreateModalOpen(false);
  };

  const statusBadges = {
    new: <Badge variant="primary" size="sm">Новое</Badge>,
    dueSoon: <Badge variant="warning" size="sm">Срок скоро</Badge>,
    overdue: <Badge variant="danger" size="sm">Просрочено</Badge>
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Домашние задания
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Публикация заданий, контроль сроков сдачи и прикрепление материалов
          </p>
        </div>

        <Button size="sm" icon={Plus} onClick={() => setCreateModalOpen(true)}>
          Задать задание
        </Button>
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full max-w-sm">
          <SearchInput
            placeholder="Поиск по теме задания или предмету..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-auto text-xs py-1.5"
          >
            <option value="all">Все статусы</option>
            <option value="new">Новое</option>
            <option value="dueSoon">Срок скоро</option>
            <option value="overdue">Просрочено</option>
          </Select>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'
              }`}
              title="Список"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'calendar' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'
              }`}
              title="Календарь"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Homework Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((hw) => (
          <div
            key={hw.id}
            onClick={() => {
              setSelectedHw(hw);
              setDetailModalOpen(true);
            }}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-bold text-xs uppercase px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {hw.className} • {hw.subjectName}
                </span>
                {statusBadges[hw.status]}
              </div>

              {/* Title & Description */}
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug line-clamp-2 mt-1">
                {hw.title}
              </h4>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                {hw.description}
              </p>

              {/* File Attachment preview */}
              {hw.hasAttachment && (
                <div className="mt-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Paperclip className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate font-medium">{hw.fileName}</span>
                  <span className="text-[10px] text-slate-400 ml-auto">{hw.fileSize}</span>
                </div>
              )}
            </div>

            {/* Footer row */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Срок: {hw.dueDate}
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Сдано: {hw.submissionsCount}/{hw.totalCount}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Homework */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Новое домашнее задание"
        subtitle="Заполните описание и прикрепите файлы к заданию"
        maxWidth="max-w-lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>Отмена</Button>
            <Button onClick={handleCreateHw}>Опубликовать задание</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Класс"
              value={hwForm.classId}
              onChange={(e) => setHwForm({ ...hwForm, classId: e.target.value })}
            >
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>

            <Select
              label="Предмет"
              value={hwForm.subjectId}
              onChange={(e) => setHwForm({ ...hwForm, subjectId: e.target.value })}
            >
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </div>

          <Input
            label="Заголовок или номера упражнений"
            placeholder="Параграф 14, № 245, № 248"
            value={hwForm.title}
            onChange={(e) => setHwForm({ ...hwForm, title: e.target.value })}
            required
          />

          <Textarea
            label="Подробные указания и требования к оформлению"
            rows={3}
            placeholder="Укажите, что именно нужно выполнить в тетради или отправить в электронном виде..."
            value={hwForm.description}
            onChange={(e) => setHwForm({ ...hwForm, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Срок сдачи (Дата)"
              type="date"
              value={hwForm.dueDate}
              onChange={(e) => setHwForm({ ...hwForm, dueDate: e.target.value })}
            />
            <Input
              label="Время"
              type="time"
              value={hwForm.dueTime}
              onChange={(e) => setHwForm({ ...hwForm, dueTime: e.target.value })}
            />
          </div>

          {/* File Upload Simulation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Прикрепить методический файл / конспект (PDF, DOCX)
            </label>
            <div
              onClick={() => setHwForm({ ...hwForm, fileName: 'metodichka_urok_4.pdf' })}
              className="p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Upload className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {hwForm.fileName ? `✓ Прикреплён: ${hwForm.fileName}` : 'Нажмите для прикрепления файла'}
              </span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal: Homework Details */}
      {selectedHw && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={selectedHw.title}
          subtitle={`${selectedHw.className} класс • ${selectedHw.subjectName} • Учитель: ${selectedHw.teacherName}`}
          maxWidth="max-w-lg"
          footer={<Button onClick={() => setDetailModalOpen(false)}>Закрыть</Button>}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
              <span className="text-xs text-slate-400">Описание задания:</span>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{selectedHw.description}</p>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-400">Крайний срок:</span>
              <span className="font-semibold text-rose-600">{selectedHw.dueDate} до {selectedHw.dueTime}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-400">Прогресс выполнения классом:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedHw.submissionsCount} из {selectedHw.totalCount} сдали работу
              </span>
            </div>

            {selectedHw.hasAttachment && (
              <div className="p-3 rounded-xl border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium text-xs">{selectedHw.fileName}</span>
                </div>
                <Button size="sm" variant="secondary" icon={Download}>Скачать</Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
