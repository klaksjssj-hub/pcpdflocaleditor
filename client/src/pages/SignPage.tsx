import React, { useState } from 'react';
import { PenTool, Check, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { DropZone } from '../components/DropZone';
import { ProgressBar } from '../components/ProgressBar';
import { DownloadView } from '../components/DownloadView';
import { SignaturePad } from '../components/SignaturePad';
import { UploadedFileItem } from '../types';
import { ClientPdfEngine } from '../services/clientPdfEngine';
import { clientStorage } from '../services/clientStorage';
import { PDFDocument } from 'pdf-lib';

interface PlacedSignature {
  id: string;
  dataUrl: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SignPage: React.FC = () => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSigModal, setShowSigModal] = useState(false);
  const [activeSignature, setActiveSignature] = useState<string | null>(null);
  const [placedSignatures, setPlacedSignatures] = useState<PlacedSignature[]>([]);
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
      setTotalPages(count);
    } catch {
      setTotalPages(1);
    }

    setFiles([item]);
    setShowSigModal(true); // Prompt signature pad immediately
  };

  const handleSignatureCreated = (dataUrl: string) => {
    setActiveSignature(dataUrl);
    setShowSigModal(false);
    // Add default signature placement on current page
    const newPlaced: PlacedSignature = {
      id: `${Date.now()}`,
      dataUrl,
      page: currentPage,
      x: 100,
      y: 100,
      width: 140,
      height: 60,
    };
    setPlacedSignatures((prev) => [...prev, newPlaced]);
  };

  const handleRemovePlaced = (id: string) => {
    setPlacedSignatures((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSign = async () => {
    if (files.length === 0) return;
    if (placedSignatures.length === 0) {
      setError('Please add and place at least one signature on the document.');
      return;
    }

    setProcessing(true);
    setProgress(25);
    setError(null);
    const startTime = Date.now();

    try {
      setProgress(60);
      const signedBytes = await ClientPdfEngine.signPdf(files[0].file, placedSignatures);
      setProgress(100);

      const outName = `signed_${files[0].name}`;
      const timeMs = Date.now() - startTime;

      setResult({
        fileName: outName,
        directBytes: signedBytes,
        fileSizeBytes: signedBytes.length,
        processingTimeMs: timeMs,
      });

      clientStorage.addHistory({
        toolType: 'sign',
        fileName: outName,
        fileSizeBytes: signedBytes.length,
        processingTimeMs: timeMs,
      });
    } catch (err: any) {
      setError(err.message || 'Signature application failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setPlacedSignatures([]);
    setActiveSignature(null);
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
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 shadow-inner dark:bg-sky-950/40">
          <PenTool className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">Sign PDF Document</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Draw, type, or upload your electronic signature and place it anywhere on your PDF.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* Signature Creation Modal */}
      {showSigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <SignaturePad
            onSignatureReady={handleSignatureCreated}
            onCancel={() => setShowSigModal(false)}
          />
        </div>
      )}

      {processing ? (
        <ProgressBar progress={progress} statusText="Applying cryptographic and visual signatures..." />
      ) : files.length === 0 ? (
        <DropZone
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={() => setFiles([])}
          title="Select PDF file to Sign"
        />
      ) : (
        <div className="space-y-6">
          {/* Signature Management Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSigModal(true)}
                className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600"
              >
                <Plus className="h-4 w-4" /> Create New Signature
              </button>

              {totalPages > 1 && (
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <span>Page:</span>
                  <select
                    value={currentPage}
                    onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 outline-none dark:border-slate-700 dark:bg-slate-800"
                  >
                    {Array.from({ length: totalPages }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Page {i + 1} of {totalPages}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <span className="text-xs text-slate-400">
              {placedSignatures.length} signature(s) placed
            </span>
          </div>

          {/* Interactive Document Page Canvas Representation */}
          <div className="flex justify-center">
            <div className="relative h-[540px] w-[400px] rounded-xl border border-slate-300 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
              {/* Document Mockup lines */}
              <div className="space-y-3 opacity-30 select-none">
                <div className="h-3 w-1/3 rounded bg-slate-400" />
                <div className="h-2 w-full rounded bg-slate-300" />
                <div className="h-2 w-full rounded bg-slate-300" />
                <div className="h-2 w-4/5 rounded bg-slate-300" />
                <div className="h-2 w-full rounded bg-slate-300" />
                <div className="h-2 w-3/4 rounded bg-slate-300" />
                <div className="my-6 border-b border-slate-200 dark:border-slate-700" />
                <div className="h-2 w-full rounded bg-slate-300" />
                <div className="h-2 w-5/6 rounded bg-slate-300" />
                <div className="h-2 w-full rounded bg-slate-300" />
              </div>

              {/* Placed Signatures on this page */}
              {placedSignatures
                .filter((s) => s.page === currentPage)
                .map((sig) => (
                  <div
                    key={sig.id}
                    className="absolute cursor-move rounded-lg border-2 border-dashed border-sky-400 bg-sky-50/40 p-2 shadow-sm transition hover:border-sky-600 dark:bg-sky-950/40"
                    style={{
                      left: `${sig.x}px`,
                      top: `${sig.y}px`,
                      width: `${sig.width}px`,
                      height: `${sig.height}px`,
                    }}
                  >
                    <img
                      src={sig.dataUrl}
                      alt="Signature"
                      className="h-full w-full object-contain pointer-events-none"
                    />
                    <button
                      onClick={() => handleRemovePlaced(sig.id)}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}

              <div className="absolute bottom-3 right-4 text-[10px] text-slate-400">
                Page {currentPage} of {totalPages}
              </div>
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
              onClick={handleSign}
              className="flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 active:scale-95"
            >
              <span>Apply Signatures & Download</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
