import React, { forwardRef } from 'react';
import { Search } from 'lucide-react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-xl">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={`w-full rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-800 ${
            Icon && iconPosition === 'left' ? 'pl-9' : 'pl-3.5'
          } ${Icon && iconPosition === 'right' ? 'pr-9' : 'pr-3.5'} py-2 ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-500'
          } ${className}`}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-rose-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
});

export const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  children,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={`w-full rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm px-3.5 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
          error
            ? 'border-rose-400 focus:border-rose-500'
            : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-500'
        } ${className}`}
        {...props}
      >
        {children || options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
});

export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  rows = 3,
  id,
  ...props
}, ref) => {
  const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={areaId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        ref={ref}
        rows={rows}
        className={`w-full rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm px-3.5 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
          error
            ? 'border-rose-400 focus:border-rose-500'
            : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-500'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
});

export const SearchInput = ({
  placeholder = "Поиск...",
  value,
  onChange,
  onClear,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-9 pr-4 py-2 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-transparent focus:border-slate-300 dark:focus:border-slate-700 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/10 placeholder-slate-400"
      />
    </div>
  );
};
