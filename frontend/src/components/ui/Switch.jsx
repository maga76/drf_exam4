import React from 'react';

export const Switch = ({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  className = ''
}) => {
  return (
    <label className={`flex items-start gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative inline-flex items-center shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
            checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
          }`}
        />
        <div
          className={`absolute left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
      {(label || description) && (
        <div>
          {label && <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</div>}
          {description && <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</div>}
        </div>
      )}
    </label>
  );
};
