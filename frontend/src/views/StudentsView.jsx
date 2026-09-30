import React, { useState } from 'react';
import {
  Users,
  Plus,
  Upload,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  ArrowRightLeft,
  FileSpreadsheet,
  CheckCircle,
  Award,
  Phone,
  Calendar,
  Archive
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input, Select, SearchInput } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export const StudentsView = () => {
  const { students, setStudents, classes, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  // Modals
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    studentCode: '',
    classId: 'cls-7a',
    className: '7А',
    birthDate: '2012-05-10',
    gender: 'male',
    address: 'г. Душанбе'
  });

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [targetClassId, setTargetClassId] = useState('cls-7b');

  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
  const [studentToArchive, setStudentToArchive] = useState(null);

  const filteredStudents = students.filter(st => {
    const matchesSearch =
      st.fullName.toLowerCase().includes(search.toLowerCase()) ||
      st.studentCode.toLowerCase().includes(search.toLowerCase()) ||
      st.className.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === 'all' || st.classId === classFilter;
    return matchesSearch && matchesClass;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setStudentForm({
      fullName: '',
      studentCode: `СТ-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      classId: classes[0]?.id || 'cls-7a',
      className: classes[0]?.name || '7А',
      birthDate: '2012-05-10',
      gender: 'male',
      address: 'г. Душанбе'
    });
    setEditModalOpen(true);
  };

  const handleOpenEdit = (st) => {
    setEditingStudent(st);
    setStudentForm({ ...st });
    setEditModalOpen(true);
  };

  const handleSaveStudent = () => {
    if (!studentForm.fullName) return;
    const targetClass = classes.find(c => c.id === studentForm.classId);

    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? {
        ...s,
        ...studentForm,
        className: targetClass?.name || s.className
      } : s));
      addToast({ type: 'success', title: 'Ученик обновлён', message: 'Данные личного дела сохранены' });
    } else {
      const newSt = {
        id: 'std-' + Date.now(),
        ...studentForm,
        className: targetClass?.name || '7А',
        gpa: 4.5,
        attendanceRate: 98.0,
        status: 'active',
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
        parents: [
          { name: "Шарипова Лола", relation: "Мать", phone: "+992 (93) 111-22-44" }
        ]
      };
      setStudents(prev => [newSt, ...prev]);
      addToast({ type: 'success', title: 'Ученик зачислен', message: 'Новый ученик добавлен в класс' });
    }
    setEditModalOpen(false);
  };

  const handleTransfer = () => {
    const targetClass = classes.find(c => c.id === targetClassId);
    if (selectedStudent && targetClass) {
      setStudents(prev => prev.map(s => s.id === selectedStudent.id ? {
        ...s,
        classId: targetClass.id,
        className: targetClass.name
      } : s));
      addToast({ type: 'success', title: 'Перевод завершён', message: `Ученик переведён в ${targetClass.name}` });
      setTransferModalOpen(false);
      setProfileModalOpen(false);
    }
  };

  const handleArchive = () => {
    if (studentToArchive) {
      setStudents(prev => prev.filter(s => s.id !== studentToArchive.id));
      addToast({ type: 'info', title: 'Ученик архивирован', message: 'Дело перемещено в архив школы' });
      setArchiveConfirmOpen(false);
    }
  };

  const columns = [
    {
      key: 'fullName',
      title: 'Ученик',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={row.fullName}
            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 block">
              {row.fullName}
            </span>
            <span className="text-xs text-slate-400 font-mono">{row.studentCode}</span>
          </div>
        </div>
      )
    },
    {
      key: 'className',
      title: 'Класс',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 font-bold text-xs text-indigo-700 dark:text-indigo-300">
          {val}
        </span>
      )
    },
    {
      key: 'birthDate',
      title: 'Дата рожд.',
      render: (val) => <span className="text-xs text-slate-500">{val}</span>
    },
    {
      key: 'parents',
      title: 'Родители',
      render: (parents) => (
        <div className="text-xs">
          {parents && parents[0] ? (
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-300">{parents[0].name}</span>
              <span className="text-slate-400 block text-[11px]">{parents[0].phone}</span>
            </div>
          ) : (
            <span className="text-slate-400">—</span>
          )}
        </div>
      )
    },
    {
      key: 'gpa',
      title: 'Ср. балл',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
          ★ {val}
        </span>
      )
    },
    {
      key: 'attendanceRate',
      title: 'Посещаемость',
      sortable: true,
      render: (val) => <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{val}%</span>
    },
    {
      key: 'actions',
      title: 'Действия',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedStudent(row);
              setProfileModalOpen(true);
            }}
          >
            <Eye className="w-4 h-4 text-slate-500" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleOpenEdit(row)}
          >
            <Edit2 className="w-4 h-4 text-slate-500" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setStudentToArchive(row);
              setArchiveConfirmOpen(true);
            }}
          >
            <Archive className="w-4 h-4 text-rose-500" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Реестр учеников
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Всего {students.length} учащихся в текущей выборке • Успеваемость, контакты родителей и документы
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={Upload}
            onClick={() => setImportModalOpen(true)}
          >
            Массовый импорт (CSV)
          </Button>
          <Button
            size="sm"
            icon={Plus}
            onClick={handleOpenAdd}
          >
            Зачислить ученика
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full max-w-sm">
          <SearchInput
            placeholder="Поиск по ФИО, номеру дела или классу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-auto text-xs py-1.5"
          >
            <option value="all">Все классы</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Students Table */}
      <Table
        columns={columns}
        data={filteredStudents}
        emptyTitle="Ученики не найдены"
        emptyDescription="Попробуйте сбросить фильтры или добавить нового ученика"
      />

      {/* Modal: Student Detailed Profile */}
      {selectedStudent && (
        <Modal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          title={`Личное дело: ${selectedStudent.fullName}`}
          subtitle={`Класс: ${selectedStudent.className} • ID: ${selectedStudent.studentCode}`}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                icon={ArrowRightLeft}
                onClick={() => setTransferModalOpen(true)}
              >
                Перевести в другой класс
              </Button>
              <Button onClick={() => setProfileModalOpen(false)}>
                Закрыть
              </Button>
            </div>
          }
        >
          <div className="space-y-5 text-xs sm:text-sm">
            {/* Top row */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
              />
              <div className="space-y-1">
                <div className="font-bold text-base text-slate-900 dark:text-slate-100">
                  {selectedStudent.fullName}
                </div>
                <div className="text-slate-500">Дата рождения: {selectedStudent.birthDate} • Адрес: {selectedStudent.address}</div>
                <div className="flex items-center gap-3 pt-1">
                  <span className="font-semibold text-emerald-600">Средний балл: {selectedStudent.gpa}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-indigo-600">Посещаемость: {selectedStudent.attendanceRate}%</span>
                </div>
              </div>
            </div>

            {/* Parents block */}
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Родители и законные представители
              </h4>
              <div className="space-y-2">
                {selectedStudent.parents?.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{p.name} ({p.relation})</span>
                      <p className="text-xs text-slate-500 mt-0.5">{p.phone}</p>
                    </div>
                    <Button size="sm" variant="secondary" icon={Phone}>Позвонить</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Transfer Class */}
      <Modal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        title="Перевод ученика в другой класс"
        subtitle={`Перевод учащегося ${selectedStudent?.fullName} из ${selectedStudent?.className}`}
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setTransferModalOpen(false)}>Отмена</Button>
            <Button onClick={handleTransfer}>Подтвердить перевод</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Целевой класс"
            value={targetClassId}
            onChange={(e) => setTargetClassId(e.target.value)}
          >
            {classes.filter(c => c.name !== selectedStudent?.className).map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.homeroomTeacher})</option>
            ))}
          </Select>
          <Input label="Причина перевода" placeholder="Заявление родителей, смена профиля..." />
        </div>
      </Modal>

      {/* Modal: Bulk Import */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Массовый импорт учеников (Excel / CSV)"
        subtitle="Загрузите файл со списком учащихся для быстрой регистрации"
        maxWidth="max-w-lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setImportModalOpen(false)}>Отмена</Button>
            <Button
              onClick={() => {
                addToast({ type: 'success', title: 'Импорт успешен', message: 'Загружено 24 новых ученика' });
                setImportModalOpen(false);
              }}
            >
              Импортировать файл
            </Button>
          </>
        }
      >
        <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center space-y-3">
          <FileSpreadsheet className="w-10 h-10 text-indigo-600 mx-auto" />
          <div>
            <span className="font-semibold text-sm">Перетащите сюда файл .xlsx или .csv</span>
            <p className="text-xs text-slate-400 mt-1">Или нажмите для выбора файла на диске</p>
          </div>
          <button className="text-xs text-indigo-600 hover:underline font-medium">
            Скачать типовой шаблон Excel &darr;
          </button>
        </div>
      </Modal>

      {/* Modal: Add/Edit Student */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={editingStudent ? "Редактирование ученика" : "Зачисление нового ученика"}
        maxWidth="max-w-lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Отмена</Button>
            <Button onClick={handleSaveStudent}>Сохранить</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="ФИО ученика"
            placeholder="Шарипов Алишер Фарходович"
            value={studentForm.fullName}
            onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Класс"
              value={studentForm.classId}
              onChange={(e) => setStudentForm({ ...studentForm, classId: e.target.value })}
            >
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>

            <Input
              label="Дата рождения"
              type="date"
              value={studentForm.birthDate}
              onChange={(e) => setStudentForm({ ...studentForm, birthDate: e.target.value })}
            />
          </div>

          <Input
            label="Домашний адрес"
            placeholder="г. Душанбе, ул. Рудаки..."
            value={studentForm.address}
            onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
          />
        </div>
      </Modal>

      {/* Confirm Archive Dialog */}
      <ConfirmDialog
        isOpen={archiveConfirmOpen}
        onClose={() => setArchiveConfirmOpen(false)}
        onConfirm={handleArchive}
        title="Архивация личного дела"
        message={`Переместить личное дело учащегося «${studentToArchive?.fullName}» в архив школы? Доступ к дневнику будет приостановлен.`}
        confirmText="Архивировать"
      />
    </div>
  );
};
