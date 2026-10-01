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
      className={`relative rounded-[24px] p-5 sm:p-6 transition-all duration-300 ${
        glass
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
          : 'bg-white/95 dark:bg-[#0e1629] border border-slate-200/80 dark:border-slate-800/80 shadow-[0_4px_24px_rgba(15,23,42,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)]'
      } ${
        gradientBorder ? 'before:absolute before:inset-0 before:rounded-[24px] before:p-[1px] before:bg-gradient-to-br before:from-indigo-500/20 before:via-purple-500/10 before:to-transparent before:-z-10' : ''
      } ${
        hoverEffect ? 'hover:shadow-[0_16px_40px_rgba(99,102,241,0.08)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:border-indigo-300/60 dark:hover:border-indigo-500/30 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={`flex items-start justify-between gap-4 mb-5 ${className}`}>
      <div>
        {title && <h3 className="font-extrabold text-[#0f172a] dark:text-white text-base sm:text-lg leading-snug tracking-tight">{title}</h3>}
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
