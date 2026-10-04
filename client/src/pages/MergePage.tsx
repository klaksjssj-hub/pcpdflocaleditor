import React, { useState } from 'react';
import { Layers, ArrowUp, ArrowDown, Trash2, ArrowRight } from 'lucide-react';
import { DropZone } from '../components/DropZone';
import { ProgressBar } from '../components/ProgressBar';
import { DownloadView } from '../components/DownloadView';
import { UploadedFileItem } from '../types';
import { ClientPdfEngine } from '../services/clientPdfEngine';
import { clientStorage } from '../services/clientStorage';

export const MergePage: React.FC = () => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
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

  const handleFilesSelected = (newFiles: File[]) => {
    setError(null);
    const added: UploadedFileItem[] = newFiles.map((f, idx) => ({
      id: `${Date.now()}_${idx}`,
      file: f,
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setFiles((prev) => [...prev, ...added]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= files.length) return;
    const reordered = [...files];
    const temp = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = temp;
    setFiles(reordered);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }

    setProcessing(true);
    setProgress(25);
    setError(null);
    const startTime = Date.now();

    try {
      setProgress(50);
      const mergedBytes = await ClientPdfEngine.mergePdfs(files.map((f) => f.file));
      setProgress(100);

      const fileName = `merged_${Date.now()}.pdf`;
      const timeMs = Date.now() - startTime;

      setResult({
        fileName,
        directBytes: mergedBytes,
        fileSizeBytes: mergedBytes.length,
        processingTimeMs: timeMs,
      });

      // Persist in local storage
      clientStorage.addHistory({
        toolType: 'merge',
        fileName,
        fileSizeBytes: mergedBytes.length,
        processingTimeMs: timeMs,
      });
    } catch (err: any) {
      setError(err.message || 'PDF Merge failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
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
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 shadow-inner dark:bg-brand-950/40">
          <Layers className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">Merge PDF Files</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Combine multiple PDFs in the exact sequence you want. Drag or use arrows to reorder.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
          {error}
        </div>
      )}

      {processing ? (
        <ProgressBar progress={progress} statusText="Merging documents into one single PDF..." />
      ) : (
        <div className="space-y-6">
          <DropZone
            onFilesSelected={handleFilesSelected}
            files={files}
            onRemoveFile={handleRemoveFile}
            multiple={true}
            title="Select PDF files to Merge"
            subtitle="or drop multiple PDF files here"
          />

          {/* Reordering list if files > 0 */}
          {files.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Merge Order ({files.length} files)
                </span>
                <span className="text-xs text-slate-400">First in list becomes first pages</span>
              </div>

              <div className="mt-3 space-y-2">
                {files.map((file, idx) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md">
                        {file.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="rounded p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"
                        title="Move Up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === files.length - 1}
                        className="rounded p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"
                        title="Move Down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveFile(idx)}
                        className="rounded p-1 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleMerge}
                  className="flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 active:scale-95"
                >
                  <span>Merge {files.length} PDFs</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
