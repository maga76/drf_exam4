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
      className={`frappe-card p-5 sm:p-6 ${
        hoverEffect ? 'hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer' : ''
      } ${className}`}
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
