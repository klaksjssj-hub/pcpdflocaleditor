import React, { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { DropZone } from '../components/DropZone';
import { ProgressBar } from '../components/ProgressBar';
import { DownloadView } from '../components/DownloadView';
import { UploadedFileItem } from '../types';
import { ClientPdfEngine } from '../services/clientPdfEngine';
import { clientStorage } from '../services/clientStorage';

export const ProtectPage: React.FC = () => {
  const [mode, setMode] = useState<'protect' | 'unlock'>('protect');
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    fileName: string;
    directBytes?: Uint8Array;
    fileSizeBytes?: number;
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

  const handleAction = async () => {
    if (files.length === 0) return;
    if (mode === 'protect' && !password) {
      setError('Please provide a password to protect your PDF.');
      return;
    }

    setProcessing(true);
    setProgress(30);
    setError(null);
    const startTime = Date.now();

    try {
      setProgress(60);
      let resBytes: Uint8Array;
      if (mode === 'protect') {
        resBytes = await ClientPdfEngine.protectPdf(files[0].file, password);
      } else {
        resBytes = await ClientPdfEngine.unlockPdf(files[0].file, password || undefined);
      }
      setProgress(100);

      const outName = mode === 'protect' ? `protected_${files[0].name}` : `unlocked_${files[0].name}`;
      const timeMs = Date.now() - startTime;

      setResult({
        fileName: outName,
        directBytes: resBytes,
        fileSizeBytes: resBytes.length,
        processingTimeMs: timeMs,
      });

      clientStorage.addHistory({
        toolType: mode,
        fileName: outName,
        fileSizeBytes: resBytes.length,
        processingTimeMs: timeMs,
      });
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setPassword('');
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
          fileSizeBytes={result.fileSizeBytes}
          processingTimeMs={result.processingTimeMs}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 shadow-inner dark:bg-indigo-950/40">
          {mode === 'protect' ? <Lock className="h-6 w-6" /> : <Unlock className="h-6 w-6" />}
        </div>
        <h1 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">
          {mode === 'protect' ? 'Protect PDF File' : 'Unlock PDF File'}
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {mode === 'protect'
            ? 'Encrypt your PDF with a strong password to prevent unauthorized reading or copying.'
            : 'Remove passwords and permissions security from your PDF documents.'}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="mb-6 flex justify-center">
        <div className="flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => {
              setMode('protect');
              setFiles([]);
            }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition ${
              mode === 'protect'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <Lock className="h-3.5 w-3.5" /> Protect PDF
          </button>
          <button
            onClick={() => {
              setMode('unlock');
              setFiles([]);
            }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition ${
              mode === 'unlock'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <Unlock className="h-3.5 w-3.5" /> Unlock PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
          {error}
        </div>
      )}

      {processing ? (
        <ProgressBar
          progress={progress}
          statusText={mode === 'protect' ? 'Encrypting document...' : 'Removing security permissions...'}
        />
      ) : files.length === 0 ? (
        <DropZone
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={() => setFiles([])}
          title={mode === 'protect' ? 'Select PDF to Protect' : 'Select Protected PDF to Unlock'}
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {mode === 'protect' ? 'Set Document Password' : 'Enter Password (if known)'}
            </h3>

            <div className="mt-4 relative max-w-md">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'protect' ? 'Enter a strong password...' : 'Enter document password...'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {mode === 'protect' && (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Protected with 256-bit AES cryptographic standards.</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAction}
              className="flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 active:scale-95"
            >
              <span>{mode === 'protect' ? 'Protect PDF' : 'Unlock PDF'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
