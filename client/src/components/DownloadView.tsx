import React, { useEffect } from 'react';
import { Download, CheckCircle2, RotateCcw, Share2, Copy, Clock, HardDrive } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DownloadViewProps {
  fileName: string;
  downloadUrl?: string;
  onDownloadDirect?: () => void;
  onReset: () => void;
  fileSizeBytes?: number;
  originalSizeBytes?: number;
  savingsPercentage?: number;
  processingTimeMs?: number;
}

export const DownloadView: React.FC<DownloadViewProps> = ({
  fileName,
  downloadUrl,
  onDownloadDirect,
  onReset,
  fileSizeBytes,
  originalSizeBytes,
  savingsPercentage,
  processingTimeMs,
}) => {
  useEffect(() => {
    // Fire confetti on complete
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e5322d', '#3b82f6', '#10b981', '#f59e0b'],
      });
    } catch {}
  }, []);

  const formatSize = (bytes?: number) => {
    if (!bytes) return null;
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (onDownloadDirect) {
      onDownloadDirect();
    } else if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-500 shadow-inner dark:bg-emerald-950/40">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
        PDF Processed Successfully!
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Your document is ready for instant download.
      </p>

      {/* Metrics Card */}
      <div className="mt-6 w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
          {fileName}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          {fileSizeBytes && (
            <div className="flex items-center gap-1.5">
              <HardDrive className="h-3.5 w-3.5 text-slate-400" />
              <span>{formatSize(fileSizeBytes)}</span>
            </div>
          )}

          {savingsPercentage !== undefined && savingsPercentage > 0 && (
            <div className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-bold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
              -{savingsPercentage}% smaller
            </div>
          )}

          {processingTimeMs && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{processingTimeMs} ms</span>
            </div>
          )}
        </div>
      </div>

      {/* Download Action */}
      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <button
          onClick={handleDownload}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-500 px-6 py-4 text-base font-bold text-white shadow-xl shadow-brand-500/25 transition hover:bg-brand-600 active:scale-95"
        >
          <Download className="h-5 w-5" /> Download File
        </button>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-4 w-4" /> Process Another
        </button>
      </div>
    </div>
  );
};
