import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, HardDrive, CheckCircle, ArrowLeft } from 'lucide-react';

interface PrivacyPageProps {
  onSelectTool: (toolId: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onSelectTool }) => {
  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => onSelectTool('home')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#E5322D] mb-8 transition-colors cursor-pointer uppercase tracking-wider"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Tools
      </button>

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Zero Server Uploads • 100% In-Browser Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1B2533] dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 text-base text-[#5E6D82] dark:text-slate-400 max-w-3xl leading-relaxed">
          At LocalPDF, we believe your personal documents, tax filings, legal contracts, and financial records belong solely to you. Learn how our client-side architecture mathematically prevents data collection.
        </p>
      </div>

      {/* 4 Pillars of Airgap Privacy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <Server className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-[#1B2533] dark:text-white">0 KB Sent To External Servers</h3>
          <p className="mt-2 text-xs sm:text-sm text-[#5E6D82] dark:text-slate-400 leading-relaxed">
            All PDF operations (merging, splitting, compressing, editing, OCR) run strictly inside your web browser’s memory using WebAssembly and Web Workers. Your files are never uploaded to any remote server or cloud bucket.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-[#E5322D] flex items-center justify-center mb-4">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-[#1B2533] dark:text-white">Browser Sandbox Isolation</h3>
          <p className="mt-2 text-xs sm:text-sm text-[#5E6D82] dark:text-slate-400 leading-relaxed">
            Modern web browsers enforce strict security sandboxes. Once processing finishes or you close the browser tab, the temporary in-memory buffers are instantly purged and destroyed from RAM.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-4">
            <EyeOff className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-[#1B2533] dark:text-white">No Tracking & No Profiling</h3>
          <p className="mt-2 text-xs sm:text-sm text-[#5E6D82] dark:text-slate-400 leading-relaxed">
            We do not sell personal data, maintain user accounts, or deploy invasive cross-site tracking pixels. The tools operate freely without requiring sign-up or corporate email addresses.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-4">
            <HardDrive className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-[#1B2533] dark:text-white">Offline & Air-Gapped Ready</h3>
          <p className="mt-2 text-xs sm:text-sm text-[#5E6D82] dark:text-slate-400 leading-relaxed">
            Because everything executes locally on your device, you can disconnect your internet connection or turn on Airplane mode after loading the application and all PDF tools will continue working flawlessly.
          </p>
        </div>
      </div>

      {/* Detailed Legal and Technical Sections */}
      <div className="space-y-8 text-sm text-[#5E6D82] dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <section>
          <h2 className="text-lg font-bold text-[#1B2533] dark:text-white mb-3">1. Information We Do Not Collect</h2>
          <p>
            Unlike traditional cloud PDF editors, we do not store, copy, inspect, or retain your uploaded files or metadata.
          </p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>We do not record the contents, text, images, or forms in your documents.</li>
            <li>We do not log personal identifiable information (PII) such as Social Security numbers, addresses, or signatures.</li>
            <li>We do not store passwords or encryption keys applied via the Protect PDF tool.</li>
          </ul>
        </section>

        <section className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-lg font-bold text-[#1B2533] dark:text-white mb-3">2. Local Storage and Client Diagnostics</h2>
          <p>
            Your local dashboard history and saved automation templates are saved strictly inside your browser’s local storage (`localStorage`). This data never leaves your device and can be cleared at any time with a single click or by wiping your browser history.
          </p>
        </section>

        <section className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-lg font-bold text-[#1B2533] dark:text-white mb-3">3. GDPR, CCPA, and HIPAA Compliance by Design</h2>
          <p>
            Because LocalPDF does not transmit, process, or store document payloads on remote servers, it satisfies data sovereignty regulations by default. Organizations subject to strict privacy frameworks can utilize LocalPDF without creating third-party vendor data-leak risks.
          </p>
        </section>

        <section className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-lg font-bold text-[#1B2533] dark:text-white mb-3">4. Security Verification</h2>
          <p>
            You can verify our privacy claims at any time by inspecting the browser’s Network tab in Developer Tools (`F12`). When you merge, compress, or edit large files, you will observe 0 bytes of file payloads being sent across the network.
          </p>
        </section>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <button
          onClick={() => onSelectTool('home')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E5322D] hover:bg-[#cb2622] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-red-500/25 transition-all cursor-pointer"
        >
          <span>Return to All Tools</span>
        </button>
      </div>
    </div>
  );
};
