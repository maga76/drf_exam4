import React, { useState } from 'react';
import {
  DoorOpen,
  Plus,
  Search,
  Filter,
  Users,
  Building,
  CheckCircle,
  Clock,
  Calendar,
  Sparkles,
  Edit2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input, Select, SearchInput } from '../components/ui/Input';

export const ClassroomsView = () => {
  const { classrooms, setClassrooms, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({
    number: '',
    building: 'Главный корпус',
    floor: 1,
    type: 'regular',
    capacity: 30,
    status: 'free'
  });

  const [finderModalOpen, setFinderModalOpen] = useState(false);

  const roomTypes = {
    regular: { label: "Обычный класс", color: "indigo" },
    computer: { label: "Компьютерный", color: "cyan" },
    physics: { label: "Физика (Лаб)", color: "amber" },
    chemistry: { label: "Химия (Лаб)", color: "rose" },
    gym: { label: "Спортзал", color: "lime" },
    art: { label: "Актовый зал", color: "purple" }
  };

  const filtered = classrooms.filter(r => {
    const matchesSearch =
      r.number.toLowerCase().includes(search.toLowerCase()) ||
      r.building.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setRoomForm({
      number: '',
      building: 'Главный корпус',
      floor: 1,
      type: 'regular',
      capacity: 30,
      status: 'free'
    });
    setEditModalOpen(true);
  };

  const handleOpenEdit = (r) => {
    setEditingRoom(r);
    setRoomForm({ ...r });
    setEditModalOpen(true);
  };

  const handleSave = () => {
    if (!roomForm.number) return;

    if (editingRoom) {
      setClassrooms(prev => prev.map(r => r.id === editingRoom.id ? { ...r, ...roomForm } : r));
      addToast({ type: 'success', title: 'Кабинет обновлён', message: 'Данные аудитории сохранены' });
    } else {
      const newRoom = {
        id: 'room-' + Date.now(),
        ...roomForm
      };
      setClassrooms(prev => [newRoom, ...prev]);
      addToast({ type: 'success', title: 'Кабинет добавлен', message: 'Новая аудитория внесена в фонд школы' });
    }
    setEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <DoorOpen className="w-6 h-6 text-indigo-600" />
            Кабинеты и фонд аудиторий
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            2 корпуса • {classrooms.length} аудиторий • Вместимость и текущая доступность
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={Sparkles}
            onClick={() => setFinderModalOpen(true)}
          >
            Найти свободный кабинет
          </Button>
          <Button size="sm" icon={Plus} onClick={handleOpenAdd}>
            Добавить кабинет
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full max-w-sm">
          <SearchInput
            placeholder="Поиск по номеру кабинета или корпусу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-auto text-xs py-1.5"
          >
            <option value="all">Все типы кабинетов</option>
            <option value="regular">Обычные</option>
            <option value="computer">Компьютерные</option>
            <option value="physics">Физика</option>
            <option value="chemistry">Химия</option>
            <option value="gym">Спортзалы</option>
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-auto text-xs py-1.5"
          >
            <option value="all">Все статусы</option>
            <option value="free">Свободен прямо сейчас</option>
            <option value="in_use">Занят уроком</option>
          </Select>
        </div>
      </div>

      {/* Classrooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((room) => {
          const typeInfo = roomTypes[room.type] || roomTypes.regular;
          const isFree = room.status === 'free';

          return (
            <div
              key={room.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                      Кабинет {room.number}
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      {room.building} • {room.floor} этаж
                    </span>
                  </div>

                  <Badge variant={isFree ? 'success' : 'neutral'} dot size="sm">
                    {isFree ? 'Свободен' : 'Занят'}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Назначение:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{typeInfo.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Вместимость:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{room.capacity} посадочных мест</span>
                  </div>
                  {!isFree && room.currentClass && (
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex justify-between font-medium">
                      <span>Идёт урок: {room.currentSubject}</span>
                      <span className="font-bold text-indigo-600">{room.currentClass}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => addToast({ type: 'info', title: 'Расписание кабинета', message: `Открыто расписание кабинета ${room.number}` })}
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  Посмотреть расписание &rarr;
                </button>
                <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(room)}>
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add/Edit Room */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={editingRoom ? "Редактирование кабинета" : "Добавление нового кабинета"}
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Отмена</Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Номер кабинета"
            placeholder="101, 204, Спортзал №2"
            value={roomForm.number}
            onChange={(e) => setRoomForm({ ...roomForm, number: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Корпус"
              value={roomForm.building}
              onChange={(e) => setRoomForm({ ...roomForm, building: e.target.value })}
            >
              <option value="Главный корпус">Главный корпус</option>
              <option value="Спортивный корпус">Спортивный корпус</option>
              <option value="Начальная школа">Начальная школа</option>
            </Select>

            <Input
              label="Этаж"
              type="number"
              value={roomForm.floor}
              onChange={(e) => setRoomForm({ ...roomForm, floor: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Тип кабинета"
              value={roomForm.type}
              onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
            >
              <option value="regular">Обычный класс</option>
              <option value="computer">Компьютерный</option>
              <option value="physics">Физика (Лаб)</option>
              <option value="chemistry">Химия (Лаб)</option>
              <option value="gym">Спортзал</option>
              <option value="art">Актовый зал</option>
            </Select>

            <Input
              label="Вместимость (мест)"
              type="number"
              value={roomForm.capacity}
              onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })}
            />
          </div>
        </div>
      </Modal>

      {/* Modal: Room Finder Tool */}
      <Modal
        isOpen={finderModalOpen}
        onClose={() => setFinderModalOpen(false)}
        title="Поиск свободного кабинета"
        subtitle="Быстрый подбор аудитории на выбранную дату и время"
        maxWidth="max-w-md"
        footer={<Button onClick={() => setFinderModalOpen(false)}>Понятно</Button>}
      >
        <div className="space-y-3 text-xs sm:text-sm">
          <p className="text-slate-500">Прямо сейчас свободны 4 учебных кабинета:</p>
          <div className="space-y-2">
            <div className="p-3 rounded-xl border bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex justify-between">
              <span className="font-bold">Кабинет 102</span>
              <span>30 мест (Обычный класс)</span>
            </div>
            <div className="p-3 rounded-xl border bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex justify-between">
              <span className="font-bold">Кабинет 208</span>
              <span>28 мест (Химия)</span>
            </div>
            <div className="p-3 rounded-xl border bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex justify-between">
              <span className="font-bold">Кабинет 305</span>
              <span>30 мест (Обычный класс)</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
