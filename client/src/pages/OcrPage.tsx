import React, { useState } from 'react';
import { Search, Copy, Check, Download, ArrowRight, Globe } from 'lucide-react';
import { DropZone } from '../components/DropZone';
import { ProgressBar } from '../components/ProgressBar';
import { UploadedFileItem } from '../types';
import { ClientPdfEngine } from '../services/clientPdfEngine';
import { clientStorage } from '../services/clientStorage';

export const OcrPage: React.FC = () => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [language, setLanguage] = useState('eng');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('Recognizing text with local neural engine...');
  const [copied, setCopied] = useState(false);
  const [ocrResult, setOcrResult] = useState<{
    text: string;
    confidence: number;
    fileName?: string;
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

  const handleRunOcr = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setProgress(15);
    setStatusMsg('Initializing in-browser OCR engine...');
    setError(null);
    const startTime = Date.now();

    try {
      const res = await ClientPdfEngine.runOcr(files[0].file, language, (pct, status) => {
        setProgress(pct);
        setStatusMsg(status);
      });

      setProgress(100);
      const outTextName = `${files[0].name.replace(/\.[^/.]+$/, '')}_ocr.txt`;
      setOcrResult({
        text: res.text,
        confidence: res.confidence,
        fileName: outTextName,
      });

      clientStorage.addHistory({
        toolType: 'ocr',
        fileName: outTextName,
        fileSizeBytes: new Blob([res.text]).size,
        processingTimeMs: Date.now() - startTime,
      });
    } catch (err: any) {
      setError(err.message || 'OCR processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = () => {
    if (ocrResult?.text) {
      navigator.clipboard.writeText(ocrResult.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setOcrResult(null);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-500 shadow-inner dark:bg-purple-950/40">
          <Search className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">OCR PDF & Images</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Recognize and extract text from scanned documents and images into editable text and searchable PDFs.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
          {error}
        </div>
      )}

      {processing ? (
        <ProgressBar progress={progress} statusText={statusMsg} />
      ) : ocrResult ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Extracted Text</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  {Math.round(ocrResult.confidence)}% Confidence
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={() =>
                    ClientPdfEngine.triggerDownload(
                      ocrResult.text,
                      ocrResult.fileName || 'extracted_ocr_text.txt',
                      'text/plain'
                    )
                  }
                  className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-brand-600 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Text</span>
                </button>
              </div>
            </div>

            <textarea
              readOnly
              rows={12}
              value={ocrResult.text}
              className="mt-4 w-full resize-none rounded-xl border border-slate-100 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800 outline-none dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="rounded-xl border border-slate-200 px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
            >
              Scan Another Document
            </button>
          </div>
        </div>
      ) : files.length === 0 ? (
        <DropZone
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={() => setFiles([])}
          accept=".pdf,application/pdf,image/png,image/jpeg,image/webp"
          title="Select Scanned PDF or Image"
          subtitle="PDF, PNG, JPG, or WEBP files supported"
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">OCR Settings</h3>

            <div className="mt-4 flex items-center gap-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Document Language:
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="hin">हिन्दी - Hindi (hin)</option>
                <option value="eng">English (eng)</option>
                <option value="spa">Español - Spanish (spa)</option>
                <option value="fra">Français - French (fra)</option>
                <option value="deu">Deutsch - German (deu)</option>
                <option value="ita">Italiano - Italian (ita)</option>
                <option value="por">Português - Portuguese (por)</option>
                <option value="rus">Русский - Russian (rus)</option>
                <option value="ara">العربية - Arabic (ara)</option>
                <option value="chi_sim">中文 (简体) - Chinese (chi_sim)</option>
                <option value="jpn">日本語 - Japanese (jpn)</option>
                <option value="ben">বাংলা - Bengali (ben)</option>
                <option value="tam">தமிழ் - Tamil (tam)</option>
                <option value="tel">తెలుగు - Telugu (tel)</option>
                <option value="guj">ગુજરાતી - Gujarati (guj)</option>
                <option value="mar">मराठी - Marathi (mar)</option>
                <option value="san">संस्कृतम् - Sanskrit (san)</option>
                <option value="urd">اردو - Urdu (urd)</option>
              </select>
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
              onClick={handleRunOcr}
              className="flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 active:scale-95"
            >
              <span>Recognize Text</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
