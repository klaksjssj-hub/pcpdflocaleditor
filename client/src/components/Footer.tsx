import React from 'react';
import { Layers } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const navigateAndScroll = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#1B2533] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-700/60">
          {/* Logo & Mission Column */}
          <div className="col-span-2">
            <button
              onClick={() => navigateAndScroll('home')}
              className="flex items-center gap-2 group mb-3 cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-[#E5322D] flex items-center justify-center text-white shadow-md">
                <Layers className="h-4 w-4" />
              </div>
              <div className="flex items-baseline">
                <span className="text-xl font-black text-white">local</span>
                <span className="text-xl font-black text-[#E5322D]">pdf</span>
              </div>
            </button>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed mb-4">
              LocalPDF is the friendly, web-native document suite that gives you complete privacy and high-speed processing directly in your browser.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>100% In-Browser Engine Active</span>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Solutions</h5>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <button onClick={() => navigateAndScroll('merge')} className="hover:text-white transition-colors cursor-pointer">
                  Organize Documents
                </button>
              </li>
              <li>
                <button onClick={() => navigateAndScroll('compress')} className="hover:text-white transition-colors cursor-pointer">
                  Optimize File Size
                </button>
              </li>
              <li>
                <button onClick={() => navigateAndScroll('convert')} className="hover:text-white transition-colors cursor-pointer">
                  Office Converters
                </button>
              </li>
              <li>
                <button onClick={() => navigateAndScroll('sign')} className="hover:text-white transition-colors cursor-pointer">
                  E-Signature Suite
                </button>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Product</h5>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <button onClick={() => navigateAndScroll('history')} className="hover:text-white transition-colors cursor-pointer">
                  WebAssembly Sandbox
                </button>
              </li>
              <li>
                <button onClick={() => navigateAndScroll('history')} className="hover:text-white transition-colors cursor-pointer">
                  Security Architecture
                </button>
              </li>
              <li>
                <button onClick={() => navigateAndScroll('history')} className="hover:text-white transition-colors cursor-pointer">
                  Speed Benchmarks
                </button>
              </li>
              <li>
                <button onClick={() => navigateAndScroll('history')} className="hover:text-white transition-colors cursor-pointer">
                  Changelog
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h5>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <button onClick={() => navigateAndScroll('about')} className="hover:text-white transition-colors cursor-pointer">
                  About LocalPDF
                </button>
              </li>
              <li>
                <button onClick={() => navigateAndScroll('privacy')} className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateAndScroll('privacy')} className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <a
                  className="hover:text-white transition-colors"
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footnotes */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span>© 2025 LocalPDF. Free and open source WebAssembly utilities.</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-medium">
              Made by <span className="text-white font-semibold">Akshit Madhukar</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="text-emerald-400 font-medium">Memory Safe · 0 KB Sent To Servers</span>
            <span>•</span>
            <button
              onClick={() => navigateAndScroll('privacy')}
              className="hover:text-white transition-colors cursor-pointer hover:underline underline-offset-2"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => navigateAndScroll('about')}
              className="hover:text-white transition-colors cursor-pointer hover:underline underline-offset-2"
            >
              About
            </button>
            <span>•</span>
            <button
              onClick={() => navigateAndScroll('history')}
              className="hover:text-white transition-colors cursor-pointer hover:underline underline-offset-2"
            >
              History
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
