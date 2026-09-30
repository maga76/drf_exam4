import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend, // { value: "+4.2%", isPositive: true }
  color = 'indigo', // indigo | teal | emerald | amber | rose | violet
  onClick,
  className = ''
}) => {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-100 dark:border-indigo-900/50"
    },
    teal: {
      bg: "bg-teal-50 dark:bg-teal-950/40",
      text: "text-teal-600 dark:text-teal-400",
      border: "border-teal-100 dark:border-teal-900/50"
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/50"
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-100 dark:border-amber-900/50"
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-100 dark:border-rose-900/50"
    },
    violet: {
      bg: "bg-violet-50 dark:bg-violet-950/40",
      text: "text-violet-600 dark:text-violet-400",
      border: "border-violet-100 dark:border-violet-900/50"
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-card transition-all duration-200 ${
        onClick ? 'hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${scheme.bg} ${scheme.text}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${
              trend.isPositive
                ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40'
                : 'text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/40'
            }`}
          >
            {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};
