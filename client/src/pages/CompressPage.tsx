import React, { useState } from 'react';
import { Minimize2, Check, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
import { DropZone } from '../components/DropZone';
import { ProgressBar } from '../components/ProgressBar';
import { DownloadView } from '../components/DownloadView';
import { UploadedFileItem } from '../types';
import { ClientPdfEngine } from '../services/clientPdfEngine';
import { clientStorage } from '../services/clientStorage';

export const CompressPage: React.FC = () => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [level, setLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    fileName: string;
    directBytes?: Uint8Array;
    originalSize?: number;
    compressedSize?: number;
    savingsPercentage?: number;
    processingTimeMs?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    setError(null);
    const selected = newFiles[0];
    setFiles([
      {
        id: `${Date.now()}`,
        file: selected,
        name: selected.name,
        size: selected.size,
        type: selected.type,
      },
    ]);
  };

  const handleCompress = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setProgress(30);
    setError(null);
    const startTime = Date.now();

    try {
      setProgress(60);
      const res = await ClientPdfEngine.compressPdf(files[0].file, level);
      setProgress(100);

      const outName = `compressed_${files[0].name}`;
      const timeMs = Date.now() - startTime;

      setResult({
        fileName: outName,
        directBytes: res.bytes,
        originalSize: res.originalSize,
        compressedSize: res.compressedSize,
        savingsPercentage: res.savingsPercentage,
        processingTimeMs: timeMs,
      });

      clientStorage.addHistory({
        toolType: 'compress',
        fileName: outName,
        fileSizeBytes: res.compressedSize,
        processingTimeMs: timeMs,
      });
    } catch (err: any) {
      setError(err.message || 'Compression failed');
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
          onDownloadDirect={() =>
            result.directBytes && ClientPdfEngine.triggerDownload(result.directBytes, result.fileName)
          }
          originalSizeBytes={result.originalSize}
          fileSizeBytes={result.compressedSize}
          savingsPercentage={result.savingsPercentage}
          processingTimeMs={result.processingTimeMs}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 shadow-inner dark:bg-emerald-950/40">
          <Minimize2 className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">Compress PDF</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Reduce file size while preserving document visual fidelity and text sharpness.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
          {error}
        </div>
      )}

      {processing ? (
        <ProgressBar progress={progress} statusText="Optimizing objects, streams, and fonts..." />
      ) : files.length === 0 ? (
        <DropZone
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={() => setFiles([])}
          multiple={false}
          title="Select PDF file to Compress"
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Compression Level</h3>
            <p className="mt-1 text-xs text-slate-400">Choose the optimal balance between size and quality:</p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  id: 'high',
                  title: 'Extreme Compression',
                  desc: 'Maximum size reduction, high compression ratio. Perfect for email attachments.',
                  badge: 'Highest savings',
                  icon: Zap,
                },
                {
                  id: 'medium',
                  title: 'Recommended Compression',
                  desc: 'Optimized compression with superb quality. Ideal for general sharing.',
                  badge: 'Recommended',
                  icon: Sparkles,
                },
                {
                  id: 'low',
                  title: 'Less Compression',
                  desc: 'Light optimization, original print quality preserved intact.',
                  badge: 'High quality',
                  icon: Shield,
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setLevel(opt.id as any)}
                  className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition ${
                    level === opt.id
                      ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/20 dark:bg-brand-950/40'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <opt.icon className="h-5 w-5 text-brand-500" />
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {opt.badge}
                      </span>
                    </div>
                    <div className="mt-3 text-xs font-bold text-slate-900 dark:text-white">
                      {opt.title}
                    </div>
                    <div className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      {opt.desc}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Select</span>
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        level === opt.id ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300'
                      }`}
                    >
                      {level === opt.id && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCompress}
              className="flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 active:scale-95"
            >
              <span>Compress PDF</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
