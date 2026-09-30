import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Pin,
  Search,
  Filter,
  Users,
  Calendar,
  Eye,
  Trash2,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input, Select, Textarea, SearchInput } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';

export const AnnouncementsView = () => {
  const { announcements, setAnnouncements, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('all');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedAnn, setSelectedAnn] = useState(null);

  const [form, setForm] = useState({
    title: '',
    targetAudience: 'all',
    pinned: false,
    content: ''
  });

  const filtered = announcements.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase());
    const matchesAudience = audienceFilter === 'all' || a.targetAudience === audienceFilter;
    return matchesSearch && matchesAudience;
  });

  const handleCreate = () => {
    if (!form.title) return;
    const newAnn = {
      id: 'ann-' + Date.now(),
      title: form.title,
      author: 'Дирекция школы',
      authorRole: 'Администратор',
      date: 'Сегодня',
      targetAudience: form.targetAudience,
      pinned: form.pinned,
      content: form.content
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    addToast({ type: 'success', title: 'Опубликовано', message: 'Новость добавлена в общую ленту' });
    setCreateModalOpen(false);
  };

  const audienceLabels = {
    all: "Все пользователи",
    teachers: "Только учителя",
    parents: "Только родители",
    students: "Только учащиеся"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600" />
            Школьные объявления и новости
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Официальные уведомления дирекции, приказы и события школы
          </p>
        </div>

        <Button size="sm" icon={Plus} onClick={() => setCreateModalOpen(true)}>
          Создать объявление
        </Button>
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full max-w-sm">
          <SearchInput
            placeholder="Поиск по тексту или теме объявления..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="w-auto text-xs py-1.5"
          >
            <option value="all">Вся аудитория</option>
            <option value="teachers">Для учителей</option>
            <option value="parents">Для родителей</option>
            <option value="students">Для учащихся</option>
          </Select>
        </div>
      </div>

      {/* Announcements Feed */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Объявлений не найдено"
          description="По вашему запросу нет опубликованных новостей"
          actionLabel="Создать первое объявление"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((ann) => (
            <div
              key={ann.id}
              onClick={() => {
                setSelectedAnn(ann);
                setDetailModalOpen(true);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-card hover:shadow-card-hover ${
                ann.pinned
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {ann.pinned && (
                    <Badge variant="primary" size="sm">
                      <Pin className="w-3 h-3 mr-0.5 fill-current" /> Закреплено
                    </Badge>
                  )}
                  <Badge variant="neutral" size="sm">
                    {audienceLabels[ann.targetAudience] || "Все"}
                  </Badge>
                  <span className="text-xs text-slate-400">• {ann.date}</span>
                </div>

                <span className="text-xs text-slate-400 font-medium">{ann.authorRole}</span>
              </div>

              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight">
                {ann.title}
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {ann.content}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Автор: {ann.author}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  Читать полностью &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Announcement */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Создание объявления"
        maxWidth="max-w-lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>Отмена</Button>
            <Button onClick={handleCreate}>Опубликовать</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Заголовок"
            placeholder="Например: Праздничная линейка 1 сентября"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Кому предназначено"
              value={form.targetAudience}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
            >
              <option value="all">Всем пользователям</option>
              <option value="teachers">Только учителям</option>
              <option value="parents">Только родителям</option>
              <option value="students">Только учащимся</option>
            </Select>

            <div className="pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={form.pinned}
                  onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span>Закрепить наверху ленты</span>
              </label>
            </div>
          </div>

          <Textarea
            label="Полный текст сообщения"
            rows={5}
            placeholder="Опишите подробности мероприятия, сроки или инструкции..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>
      </Modal>

      {/* Modal: Announcement Details */}
      {selectedAnn && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={selectedAnn.title}
          subtitle={`Опубликовано: ${selectedAnn.date} • ${selectedAnn.author}`}
          maxWidth="max-w-xl"
          footer={<Button onClick={() => setDetailModalOpen(false)}>Закрыть</Button>}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex gap-2">
              {selectedAnn.pinned && <Badge variant="primary" size="sm">Закреплено</Badge>}
              <Badge variant="neutral" size="sm">{audienceLabels[selectedAnn.targetAudience]}</Badge>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {selectedAnn.content}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
