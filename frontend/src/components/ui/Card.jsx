import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-[#101827] border border-slate-200/70 dark:border-white/10 rounded-[22px] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-[0_16px_40px_rgba(15,23,42,0.09)] hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-white/20 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        {title && <h3 className="font-bold text-[#14213d] dark:text-white text-base sm:text-lg leading-snug tracking-tight">{title}</h3>}
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
