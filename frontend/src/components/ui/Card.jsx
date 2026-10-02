import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  gradientBorder = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl transition-all duration-300 ${
        glass
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800/80 shadow-card'
          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-card'
      } ${
        hoverEffect
          ? 'hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-400/40 dark:hover:border-indigo-500/40 cursor-pointer'
          : ''
      } ${
        gradientBorder
          ? 'relative before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 before:rounded-2xl before:-z-10'
          : ''
      } p-5 sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800 ${className}`}>
      <div>
        {title && <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-snug tracking-tight">{title}</h3>}
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
