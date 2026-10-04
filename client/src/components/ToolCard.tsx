import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  badge?: string;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  badge,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
    >
      <div>
        <div className="flex items-center justify-between">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner transition-transform duration-200 group-hover:scale-110"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            <Icon className="h-7 w-7" />
          </div>
          {badge && (
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
              {badge}
            </span>
          )}
        </div>

        <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-brand-500 dark:text-white dark:group-hover:text-brand-400">
          {title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span>Open tool</span>
        <span>→</span>
      </div>
    </button>
  );
};
