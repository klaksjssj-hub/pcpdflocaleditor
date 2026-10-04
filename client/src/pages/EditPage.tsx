import React, { useState } from 'react';
import { Edit3, RotateCw, Trash2, ArrowRight, Stamp } from 'lucide-react';
import { DropZone } from '../components/DropZone';
import { ProgressBar } from '../components/ProgressBar';
import { DownloadView } from '../components/DownloadView';
import { PageThumbnailGrid, PageItem } from '../components/PageThumbnailGrid';
import { UploadedFileItem } from '../types';
import { ClientPdfEngine } from '../services/clientPdfEngine';
import { clientStorage } from '../services/clientStorage';
import { PDFDocument } from 'pdf-lib';

export const EditPage: React.FC = () => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [applyWatermark, setApplyWatermark] = useState(false);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [deletedPages, setDeletedPages] = useState<number[]>([]);
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
        selected: false,
      }));
      setPages(initialPages);
    } catch {
      item.pageCount = 1;
    }

    setFiles([item]);
    setDeletedPages([]);
  };

  const handleRotatePage = (pageNumber: number) => {
    setPages((prev) =>
      prev.map((p) =>
        p.pageNumber === pageNumber ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      )
    );
  };

  const handleRotateAll = () => {
    setPages((prev) =>
      prev.map((p) => ({ ...p, rotation: (p.rotation + 90) % 360 }))
    );
  };

  const handleDeletePage = (pageNumber: number) => {
    setPages((prev) => prev.filter((p) => p.pageNumber !== pageNumber));
    setDeletedPages((prev) => [...prev, pageNumber]);
  };

  const handleMovePage = (fromIndex: number, toIndex: number) => {
    const updated = [...pages];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setPages(updated);
  };

  const handleSave = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setProgress(25);
    setError(null);
    const startTime = Date.now();

    try {
      const rotations: Record<number, number> = {};
      pages.forEach((p) => {
        if (p.rotation !== 0) {
          rotations[p.pageNumber] = p.rotation;
        }
      });

      setProgress(60);
      const editedBytes = await ClientPdfEngine.editPdf(files[0].file, {
        rotations: Object.keys(rotations).length > 0 ? rotations : undefined,
        deletePages: deletedPages.length > 0 ? deletedPages : undefined,
        reorderPages: pages.map((p) => p.pageNumber),
        watermarkText: applyWatermark ? watermarkText : undefined,
        watermarkOpacity: watermarkOpacity,
      });
      setProgress(100);

      const outName = `edited_${files[0].name}`;
      const timeMs = Date.now() - startTime;

      setResult({
        fileName: outName,
        directBytes: editedBytes,
        fileSizeBytes: editedBytes.length,
        processingTimeMs: timeMs,
      });

      clientStorage.addHistory({
        toolType: 'edit',
        fileName: outName,
        fileSizeBytes: editedBytes.length,
        processingTimeMs: timeMs,
      });
    } catch (err: any) {
      setError(err.message || 'Edit failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setPages([]);
    setDeletedPages([]);
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
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-500 shadow-inner dark:bg-pink-950/40">
          <Edit3 className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">Edit & Watermark PDF</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Rotate pages, reorder sequence, remove unwanted pages, and apply custom watermarks.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
          {error}
        </div>
      )}

      {processing ? (
        <ProgressBar progress={progress} statusText="Applying page changes and stamps..." />
      ) : files.length === 0 ? (
        <DropZone
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={() => setFiles([])}
          title="Select PDF file to Edit"
        />
      ) : (
        <div className="space-y-6">
          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <button
                onClick={handleRotateAll}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-brand-500 dark:border-slate-700 dark:text-slate-200"
              >
                <RotateCw className="h-3.5 w-3.5" /> Rotate All 90°
              </button>

              <button
                onClick={() => setApplyWatermark(!applyWatermark)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                  applyWatermark
                    ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300'
                    : 'border-slate-200 text-slate-700 hover:border-brand-500 dark:border-slate-700 dark:text-slate-200'
                }`}
              >
                <Stamp className="h-3.5 w-3.5" />
                <span>{applyWatermark ? 'Watermark Enabled' : 'Add Watermark'}</span>
              </button>
            </div>

            <span className="text-xs text-slate-400">
              {pages.length} pages remaining
            </span>
          </div>

          {/* Watermark Options Panel if enabled */}
          {applyWatermark && (
            <div className="rounded-2xl border border-brand-200 bg-brand-50/20 p-5 dark:border-brand-900/60 dark:bg-brand-950/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                Watermark Settings
              </h4>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Watermark Text:</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Opacity: {Math.round(watermarkOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                    className="mt-2 w-full accent-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Page Grid */}
          <PageThumbnailGrid
            pages={pages}
            onRotatePage={handleRotatePage}
            onDeletePage={handleDeletePage}
            onMovePage={handleMovePage}
          />

          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 active:scale-95"
            >
              <span>Apply Changes & Download</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
