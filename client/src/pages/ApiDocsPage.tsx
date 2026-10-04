import React, { useState } from 'react';
import { BookOpen, ExternalLink, Copy, Check, Terminal } from 'lucide-react';

export const ApiDocsPage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const endpoints = [
    {
      method: 'POST',
      path: '/api/upload',
      title: 'Upload Files',
      desc: 'Multipart form data upload supporting up to 20 files at once.',
      curl: `curl -X POST http://localhost:5000/api/upload \\
  -F "files=@document1.pdf" \\
  -F "files=@document2.pdf"`,
    },
    {
      method: 'POST',
      path: '/api/merge',
      title: 'Merge PDFs',
      desc: 'Combines multiple uploaded PDF files into a single output document.',
      curl: `curl -X POST http://localhost:5000/api/merge \\
  -H "Content-Type: application/json" \\
  -d '{
    "files": [
      { "fileId": "YOUR_FILE_ID_1" },
      { "fileId": "YOUR_FILE_ID_2" }
    ]
  }'`,
    },
    {
      method: 'POST',
      path: '/api/split',
      title: 'Split PDF',
      desc: 'Splits PDF by page ranges, extracts specific pages, or splits every N pages.',
      curl: `curl -X POST http://localhost:5000/api/split \\
  -H "Content-Type: application/json" \\
  -d '{
    "fileId": "YOUR_FILE_ID",
    "mode": "range",
    "ranges": "1-3, 5, 8-10"
  }'`,
    },
    {
      method: 'POST',
      path: '/api/compress',
      title: 'Compress PDF',
      desc: 'Optimizes streams, font tables, and strips unreferenced PDF objects.',
      curl: `curl -X POST http://localhost:5000/api/compress \\
  -H "Content-Type: application/json" \\
  -d '{
    "fileId": "YOUR_FILE_ID",
    "level": "medium"
  }'`,
    },
    {
      method: 'POST',
      path: '/api/convert',
      title: 'Convert Between Formats',
      desc: 'Converts PDF to Word (.docx), Excel (.xlsx), HTML, or Images to PDF.',
      curl: `curl -X POST http://localhost:5000/api/convert \\
  -H "Content-Type: application/json" \\
  -d '{
    "fileId": "YOUR_FILE_ID",
    "to": "word"
  }'`,
    },
    {
      method: 'POST',
      path: '/api/edit',
      title: 'Edit & Watermark PDF',
      desc: 'Add custom watermarks, rotate pages, reorder sequence, or delete pages.',
      curl: `curl -X POST http://localhost:5000/api/edit \\
  -H "Content-Type: application/json" \\
  -d '{
    "fileId": "YOUR_FILE_ID",
    "rotations": { "1": 90 },
    "watermark": {
      "text": "CONFIDENTIAL",
      "opacity": 0.35,
      "fontSize": 45
    }
  }'`,
    },
    {
      method: 'POST',
      path: '/api/protect/protect',
      title: 'Password Protect PDF',
      desc: 'Encrypts the PDF with user password using AES-256 standard.',
      curl: `curl -X POST http://localhost:5000/api/protect/protect \\
  -H "Content-Type: application/json" \\
  -d '{
    "fileId": "YOUR_FILE_ID",
    "userPassword": "StrongPassword123"
  }'`,
    },
    {
      method: 'POST',
      path: '/api/sign',
      title: 'Apply E-Signature',
      desc: 'Stamps vector or image signatures at exact page coordinates.',
      curl: `curl -X POST http://localhost:5000/api/sign \\
  -H "Content-Type: application/json" \\
  -d '{
    "fileId": "YOUR_FILE_ID",
    "signatures": [
      {
        "page": 1,
        "signatureDataUrl": "data:image/png;base64,...",
        "x": 100,
        "y": 120,
        "width": 140,
        "height": 60
      }
    ]
  }'`,
    },
    {
      method: 'POST',
      path: '/api/ocr',
      title: 'OCR Optical Character Recognition',
      desc: 'Extracts editable text and generates searchable PDF from scanned documents.',
      curl: `curl -X POST http://localhost:5000/api/ocr \\
  -H "Content-Type: application/json" \\
  -d '{
    "fileId": "YOUR_FILE_ID",
    "language": "eng"
  }'`,
    },
    {
      method: 'GET',
      path: '/api/download/:fileId',
      title: 'Download Processed File',
      desc: 'Streams the processed or original document directly to the client.',
      curl: `curl -O http://localhost:5000/api/download/YOUR_FILE_ID`,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600 dark:bg-brand-950/60 dark:text-brand-300">
            <Terminal className="h-3.5 w-3.5" />
            <span>Developer REST API</span>
          </div>
          <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">API Reference</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Integrate powerful PDF manipulation directly into your own applications.
          </p>
        </div>

        <a
          href="http://localhost:5000/api-docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600"
        >
          <BookOpen className="h-4 w-4" />
          <span>Interactive Swagger UI</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Endpoints List */}
      <div className="space-y-6">
        {endpoints.map((ep, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-black uppercase ${
                    ep.method === 'POST'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}
                >
                  {ep.method}
                </span>
                <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                  {ep.path}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">{ep.title}</span>
            </div>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{ep.desc}</p>

            <div className="relative mt-4">
              <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-200 shadow-inner">
                <code>{ep.curl}</code>
              </pre>
              <button
                onClick={() => handleCopy(ep.curl, idx)}
                className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
