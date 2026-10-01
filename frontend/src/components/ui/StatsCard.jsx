import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend, // { value: "+4.2%", isPositive: true }
  color = 'indigo', // indigo | teal | emerald | amber | rose | violet | blue
  onClick,
  className = ''
}) => {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50/90 dark:bg-indigo-950/50",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-100 dark:border-indigo-900/60",
      glow: "hover:shadow-indigo-500/10",
      iconGlow: "shadow-indigo-500/25",
      accent: "from-indigo-500 to-purple-600",
      pill: "bg-indigo-500"
    },
    blue: {
      bg: "bg-blue-50/90 dark:bg-blue-950/50",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-100 dark:border-blue-900/60",
      glow: "hover:shadow-blue-500/10",
      iconGlow: "shadow-blue-500/25",
      accent: "from-blue-500 to-cyan-500",
      pill: "bg-blue-500"
    },
    teal: {
      bg: "bg-teal-50/90 dark:bg-teal-950/50",
      text: "text-teal-600 dark:text-teal-400",
      border: "border-teal-100 dark:border-teal-900/60",
      glow: "hover:shadow-teal-500/10",
      iconGlow: "shadow-teal-500/25",
      accent: "from-teal-500 to-emerald-500",
      pill: "bg-teal-500"
    },
    emerald: {
      bg: "bg-emerald-50/90 dark:bg-emerald-950/50",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/60",
      glow: "hover:shadow-emerald-500/10",
      iconGlow: "shadow-emerald-500/25",
      accent: "from-emerald-500 to-teal-600",
      pill: "bg-emerald-500"
    },
    amber: {
      bg: "bg-amber-50/90 dark:bg-amber-950/50",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-100 dark:border-amber-900/60",
      glow: "hover:shadow-amber-500/10",
      iconGlow: "shadow-amber-500/25",
      accent: "from-amber-500 to-orange-500",
      pill: "bg-amber-500"
    },
    rose: {
      bg: "bg-rose-50/90 dark:bg-rose-950/50",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-100 dark:border-rose-900/60",
      glow: "hover:shadow-rose-500/10",
      iconGlow: "shadow-rose-500/25",
      accent: "from-rose-500 to-pink-600",
      pill: "bg-rose-500"
    },
    violet: {
      bg: "bg-violet-50/90 dark:bg-violet-950/50",
      text: "text-violet-600 dark:text-violet-400",
      border: "border-violet-100 dark:border-violet-900/60",
      glow: "hover:shadow-violet-500/10",
      iconGlow: "shadow-violet-500/25",
      accent: "from-violet-500 to-fuchsia-600",
      pill: "bg-violet-500"
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${scheme.glow} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Top subtle gradient highlight line */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${scheme.accent} opacity-80 group-hover:opacity-100 transition-opacity`} />

      {/* Decorative soft glow background */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${scheme.accent} opacity-5 group-hover:opacity-15 blur-xl transition-all duration-300`} />

      <div className="relative flex items-center justify-between">
        <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${scheme.bg} ${scheme.text} shadow-md ${scheme.iconGlow} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="relative mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/60 shadow-sm shadow-emerald-500/10'
                : 'text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/60 shadow-sm shadow-rose-500/10'
            }`}
          >
            {trend.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="relative mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};
