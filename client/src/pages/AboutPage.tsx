import React from 'react';
import { Layers, ShieldCheck, Zap, Heart, CheckCircle2, ArrowLeft, ArrowRight, Cpu, Sparkles } from 'lucide-react';

interface AboutPageProps {
  onSelectTool: (toolId: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onSelectTool }) => {
  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => onSelectTool('home')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#E5322D] mb-8 transition-colors cursor-pointer uppercase tracking-wider"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Tools
      </button>

      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#E5322D] text-xs font-bold mb-4 uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>The Open Privacy Initiative</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1B2533] dark:text-white tracking-tight leading-tight">
          About <span className="text-[#E5322D]">LocalPDF</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#5E6D82] dark:text-slate-300 leading-relaxed font-normal">
          We believe document utilities should be fast, private, and accessible to everyone without paywalls or security risks.
        </p>
      </div>

      {/* Mission Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#E5322D] flex items-center justify-center text-white shadow-md shadow-red-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-[#1B2533] dark:text-white">Our Mission</h2>
        </div>
        <p className="text-sm sm:text-base text-[#5E6D82] dark:text-slate-300 leading-relaxed">
          For years, common online PDF converters forced users into a dangerous compromise: to merge two pages or compress a resume, you had to upload private bank statements, medical records, or legal agreements onto an unknown server in another country.
        </p>
        <p className="mt-4 text-sm sm:text-base text-[#5E6D82] dark:text-slate-300 leading-relaxed">
          <strong>LocalPDF changes that equation completely.</strong> By moving modern document manipulation logic directly into the web browser via WebAssembly and client-side JavaScript, we eliminated the server entirely. No uploads. No leaks. No compromises.
        </p>
      </div>

      {/* The 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-[#F8F9FB] dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mb-4">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-[#1B2533] dark:text-white">True Privacy</h3>
          <p className="mt-2 text-xs sm:text-sm text-[#5E6D82] dark:text-slate-400 leading-relaxed">
            Your documents never leave your physical device. Everything is processed directly in memory within your browser sandbox.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#F8F9FB] dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div className="w-10 h-10 rounded-xl bg-red-100/70 text-[#E5322D] dark:bg-red-950/60 dark:text-red-400 flex items-center justify-center mb-4">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-[#1B2533] dark:text-white">Instant WASM Speed</h3>
          <p className="mt-2 text-xs sm:text-sm text-[#5E6D82] dark:text-slate-400 leading-relaxed">
            No waiting in slow upload queues. Tasks complete in milliseconds with multi-threaded local CPU acceleration.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#F8F9FB] dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center mb-4">
            <Heart className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-[#1B2533] dark:text-white">Free Forever</h3>
          <p className="mt-2 text-xs sm:text-sm text-[#5E6D82] dark:text-slate-400 leading-relaxed">
            No sneaky subscriptions, no 15MB file caps, and no paywalls. Free and unrestricted for students, professionals, and businesses.
          </p>
        </div>
      </div>

      {/* How It Works Technical Architecture */}
      <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm mb-12">
        <h2 className="text-xl font-bold text-[#1B2533] dark:text-white mb-4">How It Works Under the Hood</h2>
        <div className="space-y-4 text-sm text-[#5E6D82] dark:text-slate-300 leading-relaxed">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-[#1B2533] dark:text-white">Client-Side PDF Compilation:</strong> Document restructuring and stream compression run via lightweight, highly optimized WebAssembly binary pipelines and native byte buffers.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-[#1B2533] dark:text-white">Web Workers Isolation:</strong> Heavy operations like OCR (Optical Character Recognition) run inside background Web Workers, keeping your browser UI silky smooth and responsive.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-[#1B2533] dark:text-white">Cryptographic Standards:</strong> Password protection, digital signatures, and metadata sanitization conform to ISO 32000 PDF specifications.
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center p-8 rounded-3xl bg-red-50/70 border border-red-200 dark:bg-slate-900 dark:border-slate-800">
        <h3 className="text-lg font-bold text-[#1B2533] dark:text-white">Ready to work with your documents securely?</h3>
        <p className="text-xs sm:text-sm text-[#5E6D82] dark:text-slate-400 mt-1 max-w-md mx-auto">
          Explore all our PDF utilities with 100% in-browser privacy guaranteed.
        </p>
        <button
          onClick={() => onSelectTool('home')}
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E5322D] hover:bg-[#cb2622] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-red-500/25 transition-all cursor-pointer"
        >
          <span>Explore All PDF Tools</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Creator Attribution */}
      <div className="mt-8 text-center text-xs text-slate-400">
        Created by <span className="font-semibold text-slate-700 dark:text-slate-200">Akshit Madhukar</span> • Dedicated to 100% In-Browser Privacy
      </div>
    </div>
  );
};
