import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  statusText?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  statusText = 'Processing your document...',
}) => {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {statusText}
          </span>
        </div>
        <span className="text-xs font-bold text-brand-500">{progress}%</span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-rose-500 transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
        />
      </div>
    </div>
  );
};
