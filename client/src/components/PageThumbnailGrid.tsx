import React from 'react';
import { RotateCw, Trash2, CheckCircle2, Circle, ArrowLeft, ArrowRight } from 'lucide-react';

export interface PageItem {
  pageNumber: number; // 1-indexed
  rotation: number; // 0, 90, 180, 270
  selected: boolean;
}

interface PageThumbnailGridProps {
  pages: PageItem[];
  onRotatePage?: (pageNumber: number) => void;
  onDeletePage?: (pageNumber: number) => void;
  onToggleSelectPage?: (pageNumber: number) => void;
  onMovePage?: (fromIndex: number, toIndex: number) => void;
  selectable?: boolean;
}

export const PageThumbnailGrid: React.FC<PageThumbnailGridProps> = ({
  pages,
  onRotatePage,
  onDeletePage,
  onToggleSelectPage,
  onMovePage,
  selectable = false,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Document Pages ({pages.length})
        </h4>
        <span className="text-xs text-slate-400">
          {selectable ? 'Click pages to select/unselect' : 'Click rotate or delete on any page'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {pages.map((p, idx) => (
          <div
            key={p.pageNumber}
            className={`group relative flex flex-col items-center rounded-xl border p-3 transition ${
              p.selected
                ? 'border-brand-500 bg-brand-50/30 ring-2 ring-brand-500/20 dark:bg-brand-950/20'
                : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40'
            }`}
          >
            {/* Visual Page Mockup */}
            <div
              onClick={() => selectable && onToggleSelectPage && onToggleSelectPage(p.pageNumber)}
              className={`relative flex h-36 w-28 cursor-pointer flex-col justify-between rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm transition-transform duration-200 group-hover:scale-105 dark:border-slate-700 dark:bg-slate-800`}
              style={{
                transform: `rotate(${p.rotation}deg)`,
              }}
            >
              {/* Fake lines on page */}
              <div className="space-y-1.5 opacity-40">
                <div className="h-1.5 w-12 rounded bg-slate-400 dark:bg-slate-500" />
                <div className="h-1 w-full rounded bg-slate-300 dark:bg-slate-600" />
                <div className="h-1 w-5/6 rounded bg-slate-300 dark:bg-slate-600" />
                <div className="h-1 w-4/6 rounded bg-slate-300 dark:bg-slate-600" />
                <div className="h-1 w-full rounded bg-slate-300 dark:bg-slate-600" />
                <div className="h-1 w-3/4 rounded bg-slate-300 dark:bg-slate-600" />
              </div>

              <div className="text-center text-[10px] font-bold text-slate-400">
                {p.pageNumber}
              </div>
            </div>

            {/* Selection Checkmark */}
            {selectable && (
              <button
                type="button"
                onClick={() => onToggleSelectPage && onToggleSelectPage(p.pageNumber)}
                className="absolute right-2 top-2 rounded-full bg-white text-brand-500 shadow-sm dark:bg-slate-800"
              >
                {p.selected ? (
                  <CheckCircle2 className="h-5 w-5 fill-brand-500 text-white" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                )}
              </button>
            )}

            {/* Controls Bar */}
            <div className="mt-3 flex items-center justify-between w-full px-1">
              <span className="text-[11px] font-semibold text-slate-500">
                Page {p.pageNumber}
              </span>

              <div className="flex items-center gap-1">
                {onMovePage && idx > 0 && (
                  <button
                    onClick={() => onMovePage(idx, idx - 1)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    title="Move Left"
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </button>
                )}
                {onMovePage && idx < pages.length - 1 && (
                  <button
                    onClick={() => onMovePage(idx, idx + 1)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    title="Move Right"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
                {onRotatePage && (
                  <button
                    onClick={() => onRotatePage(p.pageNumber)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
                    title="Rotate 90°"
                  >
                    <RotateCw className="h-3 w-3" />
                  </button>
                )}
                {onDeletePage && (
                  <button
                    onClick={() => onDeletePage(p.pageNumber)}
                    className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/40"
                    title="Delete page"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
