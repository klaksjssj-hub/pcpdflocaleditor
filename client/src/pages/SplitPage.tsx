import React, { useState } from 'react';
import { Scissors, FileText, Check, ArrowRight } from 'lucide-react';
import { DropZone } from '../components/DropZone';
import { ProgressBar } from '../components/ProgressBar';
import { DownloadView } from '../components/DownloadView';
import { PageThumbnailGrid, PageItem } from '../components/PageThumbnailGrid';
import { UploadedFileItem } from '../types';
import { ClientPdfEngine } from '../services/clientPdfEngine';
import { clientStorage } from '../services/clientStorage';
import { PDFDocument } from 'pdf-lib';

export const SplitPage: React.FC = () => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [mode, setMode] = useState<'range' | 'extract' | 'splitEveryN'>('range');
  const [ranges, setRanges] = useState('1-2');
  const [splitEveryN, setSplitEveryN] = useState(1);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    fileName: string;
    downloadUrl?: string;
    directBytes?: Uint8Array;
    fileSizeBytes?: number;
    processingTimeMs?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    setError(null);
    const selected = newFiles[0];
    const item: UploadedFileItem = {
      id: `${Date.now()}`,
      file: selected,
      name: selected.name,
      size: selected.size,
      type: selected.type,
    };

    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();
      item.pageCount = count;
      const initialPages: PageItem[] = Array.from({ length: count }, (_, i) => ({
        pageNumber: i + 1,
        rotation: 0,
        selected: i === 0,
      }));
      setPages(initialPages);
    } catch {
      item.pageCount = 1;
    }

    setFiles([item]);
  };

  const handleToggleSelectPage = (pageNumber: number) => {
    setPages((prev) =>
      prev.map((p) =>
        p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p
      )
    );
  };

  const handleSplit = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setProgress(25);
    setError(null);
    const startTime = Date.now();

    try {
      const selectedPageNumbers = pages.filter((p) => p.selected).map((p) => p.pageNumber);
      setProgress(60);

      const splitBytes = await ClientPdfEngine.splitPdf(files[0].file, {
        mode,
        pageNumbers: mode === 'extract' ? selectedPageNumbers : undefined,
        ranges: mode === 'range' ? ranges : undefined,
        n: mode === 'splitEveryN' ? splitEveryN : undefined,
      });

      setProgress(100);
      const outFileName = `split_${files[0].name}`;
      const timeMs = Date.now() - startTime;

      setResult({
        fileName: outFileName,
        directBytes: splitBytes,
        fileSizeBytes: splitBytes.length,
        processingTimeMs: timeMs,
      });

      clientStorage.addHistory({
        toolType: 'split',
        fileName: outFileName,
        fileSizeBytes: splitBytes.length,
        processingTimeMs: timeMs,
      });
    } catch (err: any) {
      setError(err.message || 'PDF Split failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setPages([]);
    setResult(null);
    setProgress(0);
    setError(null);
  };

  if (result) {
    return (
      <div className="py-12">
        <DownloadView
          fileName={result.fileName}
          downloadUrl={result.downloadUrl}
          fileSizeBytes={result.fileSizeBytes}
          processingTimeMs={result.processingTimeMs}
          onDownloadDirect={
            result.directBytes
              ? () => ClientPdfEngine.triggerDownload(result.directBytes!, result.fileName)
              : undefined
          }
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 shadow-inner dark:bg-orange-950/40">
          <Scissors className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">Split PDF</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Separate one page or an entire range for easy conversion into independent PDF files.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
          {error}
        </div>
      )}

      {processing ? (
        <ProgressBar progress={progress} statusText="Splitting and preparing pages..." />
      ) : files.length === 0 ? (
        <DropZone
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={() => setFiles([])}
          multiple={false}
          title="Select PDF file to Split"
        />
      ) : (
        <div className="space-y-6">
          {/* Options Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Split Mode</h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[
                { id: 'range', label: 'By Page Ranges', desc: 'e.g. 1-3, 5, 8-10' },
                { id: 'extract', label: 'Extract Specific Pages', desc: 'Select individual pages' },
                { id: 'splitEveryN', label: 'Split Every N Pages', desc: 'Evenly distributed parts' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMode(opt.id as any)}
                  className={`rounded-xl border p-3 text-left transition ${
                    mode === opt.id
                      ? 'border-brand-500 bg-brand-50/40 text-brand-700 ring-2 ring-brand-500/20 dark:bg-brand-950/40 dark:text-brand-300'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>

            {/* Inputs based on mode */}
            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              {mode === 'range' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Page Ranges (comma-separated):
                  </label>
                  <input
                    type="text"
                    value={ranges}
                    onChange={(e) => setRanges(e.target.value)}
                    placeholder="e.g. 1-2, 3-5"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Multiple ranges will be bundled neatly into a ZIP archive.
                  </span>
                </div>
              )}

              {mode === 'splitEveryN' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Split every N pages:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={pages.length || 100}
                    value={splitEveryN}
                    onChange={(e) => setSplitEveryN(parseInt(e.target.value, 10) || 1)}
                    className="mt-1.5 w-32 rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              )}

              {mode === 'extract' && (
                <div className="text-xs text-slate-500">
                  Click on the page cards below to pick the exact pages you want to extract.
                </div>
              )}
            </div>
          </div>

          {/* Visual Page Selector Grid */}
          <PageThumbnailGrid
            pages={pages}
            onToggleSelectPage={handleToggleSelectPage}
            selectable={mode === 'extract'}
          />

          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSplit}
              className="flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 active:scale-95"
            >
              <span>Split PDF</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
