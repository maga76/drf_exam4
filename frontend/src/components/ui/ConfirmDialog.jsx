import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Подтверждение действия",
  message = "Вы уверены, что хотите выполнить это действие? Это действие нельзя отменить.",
  confirmText = "Удалить",
  cancelText = "Отмена",
  variant = "danger", // danger | warning | primary
  isLoading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={() => {
              onConfirm();
            }}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl shrink-0 ${
          variant === 'danger'
            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
        }`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};
