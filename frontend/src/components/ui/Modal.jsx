import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-xl', // max-w-sm | max-w-md | max-w-xl | max-w-2xl | max-w-4xl
  className = ''
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 max-sm:p-0 max-sm:items-end overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-backdrop-fade"
        onClick={onClose}
      />

      {/* Modal Card / Mobile Bottom Sheet */}
      <div
        className={`relative w-full ${maxWidth} bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl max-sm:rounded-b-none max-sm:rounded-t-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 max-sm:border-b-0 overflow-hidden transform transition-all z-10 my-8 max-sm:my-0 max-sm:max-h-[92vh] animate-modal-pop max-sm:animate-bottom-sheet ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Indicator */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
          <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 max-sm:px-5 max-sm:py-3 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 py-5 max-h-[calc(85vh-130px)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
