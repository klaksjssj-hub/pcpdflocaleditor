import React, { useState, useEffect, useRef } from 'react';
import {
  // Navigation & UI icons
  ChevronDown,
  Menu,
  X,
  Search,
  Moon,
  Sun,
  Globe,
  Shield,
  // Organize icons (Red)
  Layers,
  Scissors,
  FileMinus,
  FileSearch,
  LayoutGrid,
  Scan,
  // Optimize icons (Green)
  Minimize2,
  Wrench,
  // Convert icons
  Image as ImageIcon,
  FileText,
  Presentation,
  FileSpreadsheet,
  FileCode,
  FileCheck,
  // Edit icons (Purple)
  RotateCw,
  Hash,
  Stamp,
  Crop,
  Edit3,
  CheckSquare,
  // Security icons (Blue)
  Unlock,
  Lock,
  PenTool,
  EyeOff,
  GitCompare,
  // Intelligence icons (Purple/Blue)
  Sparkles,
  Languages,
  BookOpen,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useI18n, Language } from '../context/I18nContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  iconColor: string; // Tailwind text & bg color classes
  badge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();

  // Active Dropdowns state
  const [activeMenu, setActiveMenu] = useState<'convert' | 'allTools' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>('organize');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navRef = useRef<HTMLDivElement>(null);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMenu(null);
        setSearchModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectTool = (id: string) => {
    setCurrentTab(id);
    setActiveMenu(null);
    setMobileMenuOpen(false);
    setSearchModalOpen(false);
  };

  // ================= DATA DEFINITIONS =================

  // 1. "CONVERT PDF" Dropdown Data
  const convertMenuData = {
    convertToPdf: [
      { id: 'images-to-pdf', label: 'JPG to PDF', icon: ImageIcon, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
      { id: 'convert', label: 'WORD to PDF', icon: FileText, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
      { id: 'convert', label: 'POWERPOINT to PDF', icon: Presentation, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40' },
      { id: 'convert', label: 'EXCEL to PDF', icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
      { id: 'convert', label: 'HTML to PDF', icon: FileCode, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
    ],
    convertFromPdf: [
      { id: 'convert', label: 'PDF to JPG', icon: ImageIcon, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
      { id: 'pdf-to-word', label: 'PDF to WORD', icon: FileText, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
      { id: 'convert', label: 'PDF to POWERPOINT', icon: Presentation, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40' },
      { id: 'pdf-to-excel', label: 'PDF to EXCEL', icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
      { id: 'convert', label: 'PDF to PDF/A', icon: FileCheck, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
    ],
  };

  // 2. "ALL PDF TOOLS" Mega Menu Data (7 Categories)
  const megaMenuCategories: { id: string; title: string; tools: MenuItem[] }[] = [
    {
      id: 'organize',
      title: 'ORGANIZE PDF',
      tools: [
        { id: 'merge', label: 'Merge PDF', icon: Layers, iconColor: 'text-[#e5322d]' },
        { id: 'split', label: 'Split PDF', icon: Scissors, iconColor: 'text-[#e5322d]' },
        { id: 'edit', label: 'Remove pages', icon: FileMinus, iconColor: 'text-[#e5322d]' },
        { id: 'split', label: 'Extract pages', icon: FileSearch, iconColor: 'text-[#e5322d]' },
        { id: 'edit', label: 'Organize PDF', icon: LayoutGrid, iconColor: 'text-[#e5322d]' },
        { id: 'ocr', label: 'Scan to PDF', icon: Scan, iconColor: 'text-[#e5322d]' },
      ],
    },
    {
      id: 'optimize',
      title: 'OPTIMIZE PDF',
      tools: [
        { id: 'compress', label: 'Compress PDF', icon: Minimize2, iconColor: 'text-emerald-600' },
        { id: 'compress', label: 'Repair PDF', icon: Wrench, iconColor: 'text-emerald-600' },
        { id: 'ocr', label: 'OCR PDF', icon: Search, iconColor: 'text-emerald-600' },
      ],
    },
    {
      id: 'convertToPdf',
      title: 'CONVERT TO PDF',
      tools: [
        { id: 'images-to-pdf', label: 'JPG to PDF', icon: ImageIcon, iconColor: 'text-amber-500' },
        { id: 'convert', label: 'WORD to PDF', icon: FileText, iconColor: 'text-blue-600' },
        { id: 'convert', label: 'POWERPOINT to PDF', icon: Presentation, iconColor: 'text-orange-500' },
        { id: 'convert', label: 'EXCEL to PDF', icon: FileSpreadsheet, iconColor: 'text-emerald-600' },
        { id: 'convert', label: 'HTML to PDF', icon: FileCode, iconColor: 'text-amber-500' },
      ],
    },
    {
      id: 'convertFromPdf',
      title: 'CONVERT FROM PDF',
      tools: [
        { id: 'convert', label: 'PDF to JPG', icon: ImageIcon, iconColor: 'text-amber-500' },
        { id: 'pdf-to-word', label: 'PDF to WORD', icon: FileText, iconColor: 'text-blue-600' },
        { id: 'convert', label: 'PDF to POWERPOINT', icon: Presentation, iconColor: 'text-orange-500' },
        { id: 'pdf-to-excel', label: 'PDF to EXCEL', icon: FileSpreadsheet, iconColor: 'text-emerald-600' },
        { id: 'convert', label: 'PDF to PDF/A', icon: FileCheck, iconColor: 'text-blue-600' },
      ],
    },
    {
      id: 'edit',
      title: 'EDIT PDF',
      tools: [
        { id: 'edit', label: 'Rotate PDF', icon: RotateCw, iconColor: 'text-purple-600' },
        { id: 'edit', label: 'Add page numbers', icon: Hash, iconColor: 'text-purple-600' },
        { id: 'edit', label: 'Add watermark', icon: Stamp, iconColor: 'text-purple-600' },
        { id: 'edit', label: 'Crop PDF', icon: Crop, iconColor: 'text-purple-600' },
        { id: 'edit', label: 'Edit PDF', icon: Edit3, iconColor: 'text-purple-600' },
        { id: 'edit', label: 'PDF Forms', icon: CheckSquare, iconColor: 'text-purple-600' },
      ],
    },
    {
      id: 'security',
      title: 'PDF SECURITY',
      tools: [
        { id: 'unlock', label: 'Unlock PDF', icon: Unlock, iconColor: 'text-blue-600' },
        { id: 'protect', label: 'Protect PDF', icon: Lock, iconColor: 'text-blue-600' },
        { id: 'sign', label: 'Sign PDF', icon: PenTool, iconColor: 'text-blue-600' },
        { id: 'protect', label: 'Redact PDF', icon: EyeOff, iconColor: 'text-blue-600' },
        { id: 'merge', label: 'Compare PDF', icon: GitCompare, iconColor: 'text-blue-600' },
      ],
    },
    {
      id: 'intelligence',
      title: 'PDF INTELLIGENCE',
      tools: [
        { id: 'ocr', label: 'AI Summarizer', icon: Sparkles, iconColor: 'text-violet-600', badge: 'AI' },
        { id: 'ocr', label: 'Translate PDF', icon: Languages, iconColor: 'text-blue-600', badge: 'New' },
        { id: 'convert', label: 'PDF to Markdown', icon: BookOpen, iconColor: 'text-purple-600' },
      ],
    },
  ];

  // Flat list for search
  const allTools = megaMenuCategories.flatMap((c) => c.tools);
  const filteredTools = searchQuery.trim()
    ? allTools.filter((t) => t.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : allTools;

  return (
    <>
      <header
        ref={navRef}
        className="sticky top-0 left-0 right-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:border-slate-800 dark:bg-slate-900/95"
      >
        <div className="h-[68px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand & Primary Nav Links */}
          <div className="flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => handleSelectTool('home')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-[#E5322D] flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-baseline tracking-tight">
                <span className="text-2xl font-black text-[#1B2533] dark:text-white">local</span>
                <span className="text-2xl font-black text-[#E5322D]">pdf</span>
              </div>
            </button>

            {/* Desktop Links */}
            <nav className="hidden lg:flex items-center gap-1 font-bold text-[13px] tracking-wide text-[#334155] dark:text-slate-200">
              <button
                onClick={() => handleSelectTool('merge')}
                className={`px-3 py-2 rounded-md hover:text-[#E5322D] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase cursor-pointer ${
                  currentTab === 'merge' ? 'text-[#E5322D]' : ''
                }`}
              >
                Merge PDF
              </button>
              <button
                onClick={() => handleSelectTool('split')}
                className={`px-3 py-2 rounded-md hover:text-[#E5322D] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase cursor-pointer ${
                  currentTab === 'split' ? 'text-[#E5322D]' : ''
                }`}
              >
                Split PDF
              </button>
              <button
                onClick={() => handleSelectTool('compress')}
                className={`px-3 py-2 rounded-md hover:text-[#E5322D] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase cursor-pointer ${
                  currentTab === 'compress' ? 'text-[#E5322D]' : ''
                }`}
              >
                Compress PDF
              </button>

              {/* Convert PDF Dropdown Trigger */}
              <div className="relative group">
                <button
                  type="button"
                  aria-expanded={activeMenu === 'convert'}
                  onClick={() => setActiveMenu(activeMenu === 'convert' ? null : 'convert')}
                  className={`px-3 py-2 rounded-md hover:text-[#E5322D] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 uppercase cursor-pointer ${
                    activeMenu === 'convert' || currentTab.includes('convert') || currentTab.includes('pdf-to-')
                      ? 'text-[#E5322D]'
                      : ''
                  }`}
                >
                  <span>Convert PDF</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 group-hover:text-[#E5322D] transition-transform ${
                      activeMenu === 'convert' ? 'rotate-180 text-[#E5322D]' : ''
                    }`}
                  />
                </button>

                {/* CONVERT PDF DROPDOWN MENU */}
                {activeMenu === 'convert' && (
                  <div className="absolute left-0 top-full mt-2 w-[540px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="grid grid-cols-2 gap-8">
                      {/* Column 1: CONVERT TO PDF */}
                      <div>
                        <div className="mb-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                          CONVERT TO PDF
                        </div>
                        <div className="space-y-1">
                          {convertMenuData.convertToPdf.map((item, i) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={i}
                                onClick={() => handleSelectTool(item.id)}
                                className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-800"
                              >
                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.color}`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <span className="text-xs font-bold text-slate-800 group-hover:text-brand-500 dark:text-slate-200 dark:group-hover:text-brand-400">
                                  {item.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Column 2: CONVERT FROM PDF */}
                      <div>
                        <div className="mb-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                          CONVERT FROM PDF
                        </div>
                        <div className="space-y-1">
                          {convertMenuData.convertFromPdf.map((item, i) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={i}
                                onClick={() => handleSelectTool(item.id)}
                                className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-800"
                              >
                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.color}`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <span className="text-xs font-bold text-slate-800 group-hover:text-brand-500 dark:text-slate-200 dark:group-hover:text-brand-400">
                                  {item.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* All PDF Tools Menu Trigger */}
              <div className="relative group">
                <button
                  type="button"
                  aria-expanded={activeMenu === 'allTools'}
                  onClick={() => setActiveMenu(activeMenu === 'allTools' ? null : 'allTools')}
                  className={`px-3 py-2 rounded-md flex items-center gap-1 uppercase transition-colors cursor-pointer ${
                    activeMenu === 'allTools'
                      ? 'text-[#E5322D] bg-red-50/70 hover:bg-red-50 dark:bg-red-950/40'
                      : 'hover:text-[#E5322D] hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>All PDF Tools</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeMenu === 'allTools' ? 'rotate-180 text-[#E5322D]' : 'text-slate-400'
                    }`}
                  />
                </button>
              </div>
            </nav>
          </div>

          {/* Header Actions & Engine Badge */}
          <div className="flex items-center gap-3 font-sans">
            {/* Quick Search Bar */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 text-slate-400 h-4 w-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search all tools..."
                onClick={() => setSearchModalOpen(true)}
                readOnly
                className="w-52 lg:w-64 pl-9 pr-3 py-1.5 rounded-full bg-slate-100/90 text-sm text-[#1B2533] placeholder:text-slate-400 border border-transparent focus:border-red-400 focus:bg-white focus:outline-none transition-all cursor-pointer dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Language Pill */}
            <div className="relative group hidden sm:block">
              <button
                type="button"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Globe className="h-4 w-4 text-slate-500" />
                <span>{language.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 top-full hidden w-36 rounded-xl border border-slate-200 bg-white py-1 shadow-lg group-hover:block dark:border-slate-700 dark:bg-slate-800 z-50">
                {(['en', 'es', 'fr', 'de', 'hi'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`block w-full px-3 py-1.5 text-left text-xs font-medium transition hover:bg-slate-100 dark:hover:bg-slate-700 ${
                      language === lang ? 'text-[#E5322D] font-bold' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {lang === 'en' && 'English'}
                    {lang === 'es' && 'Español'}
                    {lang === 'fr' && 'Français'}
                    {lang === 'de' && 'Deutsch'}
                    {lang === 'hi' && 'हिन्दी'}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Primary Action CTA */}
            <button
              onClick={() => {
                if (currentTab !== 'home') {
                  handleSelectTool('home');
                }
                const el = document.getElementById('toolsGrid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setActiveMenu(activeMenu === 'allTools' ? null : 'allTools');
              }}
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E5322D] hover:bg-[#cb2622] text-white text-xs font-bold uppercase tracking-wider shadow-sm shadow-red-500/20 transition-all hover:shadow-md cursor-pointer active:scale-95"
            >
              <span>Explore All</span>
              <LayoutGrid className="h-4 w-4" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* ================= 3. ALL PDF TOOLS FULL-WIDTH MEGA MENU ================= */}
        {activeMenu === 'allTools' && (
          <div className="absolute left-0 top-[68px] w-full border-b border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2 duration-150 z-40 max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="mx-auto max-w-[1400px] px-6 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
                {megaMenuCategories.map((cat) => (
                  <div key={cat.id} className="space-y-3">
                    {/* Category Header */}
                    <h3 className="border-b border-slate-100 pb-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:text-slate-500">
                      {cat.title}
                    </h3>

                    {/* Tools in Category */}
                    <div className="space-y-1">
                      {cat.tools.map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={i}
                            onClick={() => handleSelectTool(item.id)}
                            className="group flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-left transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <Icon className={`h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110 ${item.iconColor}`} />
                              <span className="truncate text-xs font-semibold text-slate-700 group-hover:text-brand-500 dark:text-slate-200 dark:group-hover:text-brand-400">
                                {item.label}
                              </span>
                            </div>
                            {item.badge && (
                              <span className="ml-1 rounded-full bg-brand-50 px-1.5 py-0.2 text-[9px] font-bold text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= MOBILE MENU (Accordion-Style) ================= */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 max-h-[85vh] overflow-y-auto">
            {/* Direct Quick Links */}
            <div className="grid grid-cols-3 gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleSelectTool('merge')}
                className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-center text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                MERGE
              </button>
              <button
                onClick={() => handleSelectTool('split')}
                className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-center text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                SPLIT
              </button>
              <button
                onClick={() => handleSelectTool('compress')}
                className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-center text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                COMPRESS
              </button>
            </div>

            {/* Accordion List for all 7 categories */}
            <div className="mt-4 space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 px-2 mb-2">
                ALL PDF TOOLS
              </div>

              {megaMenuCategories.map((cat) => (
                <div key={cat.id} className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() =>
                      setMobileExpandedCat(mobileExpandedCat === cat.id ? null : cat.id)
                    }
                    className="flex w-full items-center justify-between bg-slate-50/50 px-4 py-3 text-left text-xs font-bold text-slate-800 dark:bg-slate-800/40 dark:text-slate-200"
                  >
                    <span>{cat.title}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        mobileExpandedCat === cat.id ? 'rotate-180 text-brand-500' : ''
                      }`}
                    />
                  </button>

                  {mobileExpandedCat === cat.id && (
                    <div className="bg-white p-3 space-y-1.5 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                      {cat.tools.map((tool, i) => {
                        const Icon = tool.icon;
                        return (
                          <button
                            key={i}
                            onClick={() => handleSelectTool(tool.id)}
                            className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Icon className={`h-4 w-4 ${tool.iconColor}`} />
                            <span className="font-semibold">{tool.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ================= SEARCH MODAL ================= */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-20 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search tools (e.g. merge, split, compress, watermark, ocr)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium outline-none text-slate-800 placeholder-slate-400 dark:text-slate-100"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto py-2">
              {filteredTools.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">
                  No tools found matching "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredTools.map((tool, idx) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectTool(tool.id)}
                        className="flex w-full items-center justify-between rounded-xl p-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${tool.iconColor}`} />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {tool.label}
                          </span>
                        </div>
                        {tool.badge && (
                          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                            {tool.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
