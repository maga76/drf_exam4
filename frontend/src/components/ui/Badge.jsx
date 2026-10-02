import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral', // primary | accent | success | warning | danger | neutral | purple | gradient
  size = 'md', // sm | md | lg
  dot = false,
  className = ''
}) => {
  const sizes = {
    sm: "px-2 py-0.5 text-[11px] font-medium rounded gap-1.5",
    md: "px-2.5 py-0.5 text-xs font-medium rounded-md gap-1.5",
    lg: "px-3 py-1 text-xs font-semibold rounded-md gap-2"
  };

  const variants = {
    primary: "bg-sky-50 text-sky-700 border border-sky-200/80 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800",
    accent: "bg-teal-50 text-teal-700 border border-teal-200/80 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
    warning: "bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
    danger: "bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800",
    purple: "bg-purple-50 text-purple-700 border border-purple-200/80 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
    gradient: "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 border-0",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
  };

  const dotColors = {
    primary: "bg-sky-500",
    accent: "bg-teal-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    purple: "bg-purple-500",
    gradient: "bg-white",
    neutral: "bg-slate-400"
  };

  const currentDotColor = dotColors[variant] || 'bg-current';

  return (
    <span className={`inline-flex items-center tracking-tight transition-all rounded-full ${sizes[size]} ${variants[variant]} ${className}`}>
      {dot && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${currentDotColor}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${currentDotColor}`} />
        </span>
      )}
      {children}
    </span>
  );
};
