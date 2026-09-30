import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />
  };

  const borderMap = {
    success: "border-emerald-200 dark:border-emerald-900/50",
    error: "border-rose-200 dark:border-rose-900/50",
    warning: "border-amber-200 dark:border-amber-900/50",
    info: "border-indigo-200 dark:border-indigo-900/50"
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 bg-white dark:bg-slate-900 border rounded-2xl shadow-modal animate-slide-in-right ${borderMap[toast.type] || borderMap.info}`}
        >
          {iconMap[toast.type] || iconMap.info}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {toast.title}
              </h5>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
