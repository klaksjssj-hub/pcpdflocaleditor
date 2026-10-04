import React, { useRef, useState } from 'react';
import { Upload, File, Trash2, Plus, AlertCircle, ShieldCheck } from 'lucide-react';
import { UploadedFileItem } from '../types';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  files: UploadedFileItem[];
  onRemoveFile: (index: number) => void;
  onClearFiles?: () => void;
  accept?: string;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  disabled?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  files,
  onRemoveFile,
  accept = '.pdf,application/pdf',
  multiple = false,
  title = 'Select PDF files',
  subtitle = 'or drop PDF files here',
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selected = Array.from(e.dataTransfer.files);
      onFilesSelected(multiple ? selected : [selected[0]]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      onFilesSelected(multiple ? selected : [selected[0]]);
      e.target.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // If no files yet, show big upload box
  if (files.length === 0) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 scale-[1.01]'
            : 'border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-500 dark:hover:bg-slate-800/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />

        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-500 text-white shadow-xl shadow-brand-500/25 transition-transform duration-300 group-hover:scale-110">
          <Upload className="h-10 w-10" />
        </div>

        <button
          type="button"
          className="mt-6 rounded-xl bg-brand-500 px-8 py-3.5 text-base font-bold text-white shadow-md shadow-brand-500/30 transition hover:bg-brand-600 active:scale-95"
        >
          {title}
        </button>

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <span>Max file size: 100 MB</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" /> 100% In-Browser & Private
          </span>
        </div>
      </div>
    );
  }

  // If files selected, show compact list + Add more button
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Selected Files ({files.length})
        </h4>
        {multiple && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-300"
          >
            <Plus className="h-3.5 w-3.5" /> Add more files
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((item, index) => (
          <div
            key={item.id || index}
            className="group relative flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-950/60">
                <File className="h-5 w-5" />
              </div>
              <div className="truncate">
                <div className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                  {item.name}
                </div>
                <div className="text-[11px] text-slate-400">
                  {formatSize(item.size)}
                  {item.pageCount ? ` • ${item.pageCount} pages` : ''}
                </div>
              </div>
            </div>

            <button
              onClick={() => onRemoveFile(index)}
              className="ml-2 rounded-lg p-1.5 text-slate-400 opacity-60 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100 dark:hover:bg-rose-950/40"
              title="Remove file"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
