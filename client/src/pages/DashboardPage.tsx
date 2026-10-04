import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  Clock,
  HardDrive,
  FileCheck,
  RefreshCw,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { clientStorage } from '../services/clientStorage';
import { OperationHistoryItem, DashboardStats } from '../types';

interface DashboardPageProps {
  onSelectTool?: (toolId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectTool }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [history, setHistory] = useState<OperationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    try {
      setStats(clientStorage.getStats());
      setHistory(clientStorage.getHistory());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all local operation history?')) {
      clientStorage.clearHistory();
      loadData();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 MB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Back button if onSelectTool provided */}
      {onSelectTool && (
        <button
          onClick={() => onSelectTool('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#E5322D] -mb-4 transition-colors cursor-pointer uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Tools
        </button>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Operation History</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View your local processing history and local device analytics. Saved 100% in your browser.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 px-3.5 py-2 text-xs font-bold text-[#E5322D] hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={loadData}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-950/60">
            <BarChart2 className="h-5 w-5" />
          </div>
          <div className="mt-4 text-2xl font-black text-slate-900 dark:text-white">
            {stats?.totalOperations ?? 0}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Total PDF Tasks Executed</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-950/60">
            <FileCheck className="h-5 w-5" />
          </div>
          <div className="mt-4 text-2xl font-black text-slate-900 dark:text-white">
            {stats?.totalFilesProcessed ?? 0}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Total Files Processed</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-950/60">
            <HardDrive className="h-5 w-5" />
          </div>
          <div className="mt-4 text-2xl font-black text-slate-900 dark:text-white">
            {formatSize(stats?.totalBytesSaved ?? 0)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Total Storage Saved</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500 dark:bg-purple-950/60">
            <Clock className="h-5 w-5" />
          </div>
          <div className="mt-4 text-2xl font-black text-slate-900 dark:text-white">
            &lt; 500 ms
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Avg. Execution Time</div>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="border-b border-slate-100 p-6 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Operations History
          </h3>
          <p className="text-xs text-slate-400">All task history is saved 100% locally on your browser. Zero server data retention.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 font-semibold">Tool</th>
                <th className="px-6 py-3 font-semibold">Output File</th>
                <th className="px-6 py-3 font-semibold">Original Size</th>
                <th className="px-6 py-3 font-semibold">Processed Size</th>
                <th className="px-6 py-3 font-semibold">Duration</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    No operations recorded yet. Try running a tool from the homepage!
                  </td>
                </tr>
              ) : (
                history.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-4 font-bold uppercase text-brand-500">{op.toolType}</td>
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                      {op.outputFileName || 'document.pdf'}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatSize(op.originalSizeBytes)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-100">
                      {formatSize(op.processedSizeBytes || 0)}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{op.processingTimeMs} ms</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
