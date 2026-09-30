import React, { useState, useRef, useEffect } from 'react';

export const Dropdown = ({
  trigger,
  children,
  align = 'right', // left | right
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-40 mt-1.5 min-w-[200px] w-max bg-white dark:bg-slate-900 rounded-xl shadow-dropdown border border-slate-200/80 dark:border-slate-800 py-1 text-sm animate-fade-in ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
  icon: Icon,
  children,
  onClick,
  danger = false,
  className = ''
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs sm:text-sm text-left transition-colors ${
        danger
          ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:text-rose-400'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      } ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0 opacity-70" />}
      <span className="truncate">{children}</span>
    </button>
  );
};

export const DropdownDivider = () => (
  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
);
