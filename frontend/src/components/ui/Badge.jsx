import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral', // primary | accent | success | warning | danger | neutral | purple | gradient
  size = 'md', // sm | md | lg
  dot = false,
  className = ''
}) => {
  const sizes = {
    sm: "px-2 py-0.5 text-[11px] font-medium rounded-md gap-1.5",
    md: "px-2.5 py-1 text-xs font-semibold rounded-lg gap-2",
    lg: "px-3.5 py-1.5 text-sm font-semibold rounded-xl gap-2.5"
  };

  const variants = {
    primary: "bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60 shadow-sm shadow-indigo-500/10",
    accent: "bg-teal-50/90 text-teal-700 border border-teal-200/80 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/60 shadow-sm shadow-teal-500/10",
    success: "bg-emerald-50/90 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60 shadow-sm shadow-emerald-500/10",
    warning: "bg-amber-50/90 text-amber-700 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60 shadow-sm shadow-amber-500/10",
    danger: "bg-rose-50/90 text-rose-700 border border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60 shadow-sm shadow-rose-500/10",
    purple: "bg-purple-50/90 text-purple-700 border border-purple-200/80 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60 shadow-sm shadow-purple-500/10",
    gradient: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-md shadow-indigo-500/25",
    neutral: "bg-slate-100/90 text-slate-700 border border-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700"
  };

  const dotColors = {
    primary: "bg-indigo-500",
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
    <span className={`inline-flex items-center tracking-tight transition-all duration-200 ${sizes[size]} ${variants[variant]} ${className}`}>
      {dot && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentDotColor}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${currentDotColor}`} />
        </span>
      )}
      {children}
    </span>
  );
};
