import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend, // { value: "+4.2%", isPositive: true }
  color = 'indigo',
  onClick,
  className = ''
}) => {
  const colorMap = {
    indigo: "from-indigo-500/15 to-purple-500/15 text-indigo-600 dark:text-indigo-400 group-hover:scale-110",
    emerald: "from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400 group-hover:scale-110",
    amber: "from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 group-hover:scale-110",
    rose: "from-rose-500/15 to-pink-500/15 text-rose-600 dark:text-rose-400 group-hover:scale-110",
    blue: "from-blue-500/15 to-cyan-500/15 text-blue-600 dark:text-blue-400 group-hover:scale-110"
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-xl hover:-translate-y-1 hover:border-indigo-400/40 dark:hover:border-indigo-500/40 transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Top subtle glow bar on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500 transition-all duration-500" />

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colorMap[color] || colorMap.indigo} flex items-center justify-center shrink-0 transition-transform duration-300 shadow-xs`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80'
                : 'text-rose-700 bg-rose-50/90 border border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80'
            }`}
          >
            {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};
