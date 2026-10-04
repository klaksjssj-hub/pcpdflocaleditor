import React, { useState } from 'react';
import {
  Layers,
  Split,
  Minimize2,
  FileText,
  Presentation,
  FileSpreadsheet,
  FileCode,
  Edit3,
  Image as ImageIcon,
  PenTool,
  Lock,
  LayoutGrid,
  CheckCircle,
  Zap,
  Infinity as InfinityIcon,
  ShieldCheck,
  Search,
  ArrowRight,
} from 'lucide-react';

interface HomePageProps {
  onSelectTool: (toolId: string) => void;
}

interface ToolItem {
  id: string;
  title: string;
  description: string;
  category: 'organize' | 'optimize' | 'convert' | 'edit' | 'security';
  keywords: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeClass: string;
  hoverBorder: string;
  hoverBg: string;
  footerTag: string;
  actionColor: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectTool }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const tools: ToolItem[] = [
    {
      id: 'merge',
      title: 'Merge PDF',
      description: 'Combine multiple PDF files into one single document in the exact order you want.',
      category: 'organize',
      keywords: 'merge pdf combine join concatenate append bind',
      icon: Layers,
      iconBg: 'bg-red-50 text-[#E5322D]',
      iconColor: '#E5322D',
      badge: 'Popular',
      badgeClass: 'bg-red-50 text-[#E5322D] border-red-200/80',
      hoverBorder: 'hover:border-red-300',
      hoverBg: 'group-hover:bg-[#E5322D] group-hover:text-white',
      footerTag: 'Drag & drop ordering',
      actionColor: 'text-[#E5322D]',
    },
    {
      id: 'split',
      title: 'Split PDF',
      description: 'Separate one page or an entire range for easy conversion into independent PDF files.',
      category: 'organize',
      keywords: 'split pdf extract separate cut range pages partition',
      icon: Split,
      iconBg: 'bg-orange-50 text-orange-600',
      iconColor: '#EA580C',
      badge: 'Lossless',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
      hoverBorder: 'hover:border-orange-300',
      hoverBg: 'group-hover:bg-orange-500 group-hover:text-white',
      footerTag: 'Custom ranges',
      actionColor: 'text-orange-600',
    },
    {
      id: 'compress',
      title: 'Compress PDF',
      description: 'Reduce file size while optimizing for maximal PDF quality and sharp typography.',
      category: 'optimize',
      keywords: 'compress reduce shrink size downsize smaller email optimize',
      icon: Minimize2,
      iconBg: 'bg-emerald-50 text-emerald-600',
      iconColor: '#10B981',
      badge: 'Up to 90%',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      hoverBorder: 'hover:border-emerald-300',
      hoverBg: 'group-hover:bg-emerald-600 group-hover:text-white',
      footerTag: 'Extreme compression',
      actionColor: 'text-emerald-600',
    },
    {
      id: 'pdf-to-word',
      title: 'PDF to Word',
      description: 'Easily convert your PDF files into editable DOC and DOCX documents with stellar accuracy.',
      category: 'convert',
      keywords: 'pdf to word doc docx convert office export editable',
      icon: FileText,
      iconBg: 'bg-blue-50 text-blue-600',
      iconColor: '#2563EB',
      badge: 'DOCX',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      hoverBorder: 'hover:border-blue-300',
      hoverBg: 'group-hover:bg-blue-600 group-hover:text-white',
      footerTag: 'Retains formatting',
      actionColor: 'text-blue-600',
    },
    {
      id: 'convert',
      title: 'PDF to PowerPoint',
      description: 'Turn your PDF presentations into editable PPT and PPTX slide decks seamlessly.',
      category: 'convert',
      keywords: 'pdf to powerpoint ppt pptx slides presentation convert',
      icon: Presentation,
      iconBg: 'bg-red-50 text-[#EA580C]',
      iconColor: '#EA580C',
      badge: 'PPTX',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
      hoverBorder: 'hover:border-orange-300',
      hoverBg: 'group-hover:bg-[#EA580C] group-hover:text-white',
      footerTag: 'Editable slide shapes',
      actionColor: 'text-orange-600',
    },
    {
      id: 'pdf-to-excel',
      title: 'PDF to Excel',
      description: 'Pull tabular data straight from PDF into XLSX worksheets in seconds.',
      category: 'convert',
      keywords: 'pdf to excel xls xlsx tables spreadsheet data financial',
      icon: FileSpreadsheet,
      iconBg: 'bg-emerald-50 text-emerald-700',
      iconColor: '#059669',
      badge: 'Tables',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      hoverBorder: 'hover:border-emerald-300',
      hoverBg: 'group-hover:bg-emerald-700 group-hover:text-white',
      footerTag: 'Smart table detection',
      actionColor: 'text-emerald-700',
    },
    {
      id: 'convert',
      title: 'Word to PDF',
      description: 'Make DOC & DOCX files easy to read by converting them to clean, standardized PDF format.',
      category: 'convert',
      keywords: 'word to pdf doc docx export create make document',
      icon: FileCode,
      iconBg: 'bg-sky-50 text-sky-600',
      iconColor: '#0284C7',
      badge: 'Fast',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      hoverBorder: 'hover:border-sky-300',
      hoverBg: 'group-hover:bg-sky-600 group-hover:text-white',
      footerTag: 'Pixel-faithful rendering',
      actionColor: 'text-sky-600',
    },
    {
      id: 'edit',
      title: 'Edit PDF',
      description: 'Add text, shapes, highlights, and custom freehand annotations to your PDF pages easily.',
      category: 'edit',
      keywords: 'edit pdf annotate text images shapes highlight markup draw',
      icon: Edit3,
      iconBg: 'bg-purple-50 text-purple-600',
      iconColor: '#9333EA',
      badge: 'Editor',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      hoverBorder: 'hover:border-purple-300',
      hoverBg: 'group-hover:bg-purple-600 group-hover:text-white',
      footerTag: 'Interactive canvas',
      actionColor: 'text-purple-600',
    },
    {
      id: 'convert',
      title: 'PDF to JPG',
      description: 'Extract all images from your PDF or turn each separate page into high-definition JPG.',
      category: 'convert',
      keywords: 'pdf to jpg png image picture extract photo render',
      icon: ImageIcon,
      iconBg: 'bg-amber-50 text-amber-600',
      iconColor: '#D97706',
      badge: 'High Res',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      hoverBorder: 'hover:border-amber-300',
      hoverBg: 'group-hover:bg-amber-600 group-hover:text-white',
      footerTag: 'Up to 600 DPI',
      actionColor: 'text-amber-600',
    },
    {
      id: 'sign',
      title: 'Sign PDF',
      description: 'Sign documents yourself or place digital handwritten signatures with zero server footprint.',
      category: 'edit',
      keywords: 'sign pdf signature initials fill sign agreement contract legal',
      icon: PenTool,
      iconBg: 'bg-rose-50 text-rose-600',
      iconColor: '#E11D48',
      badge: 'E-Sign',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      hoverBorder: 'hover:border-rose-300',
      hoverBg: 'group-hover:bg-rose-600 group-hover:text-white',
      footerTag: 'Client cryptographic seal',
      actionColor: 'text-rose-600',
    },
    {
      id: 'protect',
      title: 'Protect PDF',
      description: 'Encrypt your PDF files with military-grade passwords to prevent unauthorized viewing.',
      category: 'security',
      keywords: 'protect pdf encrypt password lock aes security secure restrict',
      icon: Lock,
      iconBg: 'bg-cyan-50 text-cyan-700',
      iconColor: '#0891B2',
      badge: 'AES-256',
      badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      hoverBorder: 'hover:border-cyan-300',
      hoverBg: 'group-hover:bg-cyan-700 group-hover:text-white',
      footerTag: 'Browser WebCrypto API',
      actionColor: 'text-cyan-700',
    },
    {
      id: 'edit',
      title: 'Organize PDF',
      description: 'Sort, add, and delete PDF pages. Drag and drop thumbnails to reorder your document easily.',
      category: 'organize',
      keywords: 'organize pdf reorder rotate delete rearrange remove order sort',
      icon: LayoutGrid,
      iconBg: 'bg-indigo-50 text-indigo-600',
      iconColor: '#4F46E5',
      badge: 'Grid UI',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      hoverBorder: 'hover:border-indigo-300',
      hoverBg: 'group-hover:bg-indigo-600 group-hover:text-white',
      footerTag: 'Visual page light-box',
      actionColor: 'text-indigo-600',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'organize', label: 'Organize' },
    { id: 'optimize', label: 'Optimize' },
    { id: 'convert', label: 'Convert' },
    { id: 'edit', label: 'Edit & Sign' },
    { id: 'security', label: 'Security' },
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesCategory =
      filterCategory === 'all' ||
      tool.category === filterCategory ||
      (filterCategory === 'edit' && (tool.category === 'edit' || tool.id === 'sign'));
    const matchesSearch =
      !searchFilter ||
      tool.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tool.keywords.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Friendly SaaS Hero Section */}
      <section className="relative pt-10 pb-8 md:pt-14 md:pb-12 bg-gradient-to-b from-white via-white to-[#F8F9FB] border-b border-slate-200/60 overflow-hidden dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Trust Shield Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs md:text-sm font-medium mb-5 shadow-xs dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>100% In-Browser Engine</strong> • Files never leave your device • Zero Cloud Uploads
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1B2533] dark:text-white leading-tight md:leading-[1.18]">
            Every tool you need to work with PDFs <span className="text-[#E5322D]">in one place</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-[#5E6D82] dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            100% Free, Secure and Easy to Use! Merge, split, compress, convert, edit, sign, and secure PDF files in just a few clicks with local WebAssembly processing.
          </p>

          {/* Key Assurance Metrics Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Zero server transmission
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
              <Zap className="h-4 w-4 text-[#E5322D]" />
              Near-instant WASM speed
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
              <InfinityIcon className="h-4 w-4 text-blue-600" />
              No file limits or paywalls
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Filter Toolbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Filter Category Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = filterCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#E5322D] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Live Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter operations (e.g. compress, docx)..."
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 text-sm font-medium pl-10 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-red-400 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* iLovePDF Signature Tool Card Grid (4-Columns) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12" id="toolsGrid">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredTools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div
                  key={idx}
                  onClick={() => onSelectTool(tool.id)}
                  className={`group relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xl ${tool.hoverBorder} transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 cursor-pointer`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${tool.iconBg} flex items-center justify-center group-hover:scale-110 ${tool.hoverBg} transition-all shadow-xs`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded-full border ${tool.badgeClass}`}>
                        {tool.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1B2533] dark:text-white group-hover:text-[#E5322D] transition-colors leading-snug">
                      {tool.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-[13px] text-[#5E6D82] dark:text-slate-400 leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>{tool.footerTag}</span>
                    <ArrowRight className={`h-4 w-4 ${tool.actionColor} group-hover:translate-x-1 transition-transform`} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 mt-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-[#E5322D] flex items-center justify-center mb-3">
              <Search className="h-7 w-7" />
            </div>
            <h4 className="text-lg font-bold text-[#1B2533] dark:text-white">No matching tools found</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">
              Try searching for terms like "merge", "compress", "word", or click reset to view all tools.
            </p>
            <button
              onClick={() => {
                setSearchFilter('');
                setFilterCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1B2533] font-semibold text-xs transition-colors cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </section>

      {/* Why Security-Conscious Users Choose Us (Feature Highlights) */}
      <section className="w-full bg-white dark:bg-slate-900 py-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#E5322D]">
              Trust & Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2533] dark:text-white mt-2">
              The PDF software built for complete privacy
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#5E6D82] dark:text-slate-400">
              Unlike conventional cloud PDF converters that store copies of your tax records, agreements, and resumes on foreign servers, LocalPDF runs 100% locally in your web browser.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-[#F8F9FB] dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between hover:border-red-200 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mb-5">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1B2533] dark:text-white">100% Local Processing</h3>
                <p className="mt-2 text-sm text-[#5E6D82] dark:text-slate-300 leading-relaxed">
                  Your files never leave your computer or travel over the internet. You can even disconnect your Wi-Fi and the tools keep working seamlessly.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span>Zero server data transfer</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-[#F8F9FB] dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between hover:border-red-200 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-100/70 text-[#E5322D] dark:bg-red-950/60 dark:text-red-400 flex items-center justify-center mb-5">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1B2533] dark:text-white">Blazing WASM Engine</h3>
                <p className="mt-2 text-sm text-[#5E6D82] dark:text-slate-300 leading-relaxed">
                  Powered by high-performance C++ WebAssembly binaries. No waiting in slow server queues or enduring 20-minute upload times for large files.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#E5322D] dark:text-red-400">
                <Zap className="h-4 w-4" />
                <span>Hardware accelerated</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-[#F8F9FB] dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between hover:border-red-200 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center mb-5">
                  <InfinityIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1B2533] dark:text-white">Unlimited & Free</h3>
                <p className="mt-2 text-sm text-[#5E6D82] dark:text-slate-300 leading-relaxed">
                  No daily conversion caps, no 15MB file-size limits, and no registration forms required. Process documents whenever you need, free forever.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400">
                <ShieldCheck className="h-4 w-4" />
                <span>No paywalls or sign-up</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
