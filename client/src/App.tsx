import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { MergePage } from './pages/MergePage';
import { SplitPage } from './pages/SplitPage';
import { CompressPage } from './pages/CompressPage';
import { ConvertPage } from './pages/ConvertPage';
import { EditPage } from './pages/EditPage';
import { ProtectPage } from './pages/ProtectPage';
import { SignPage } from './pages/SignPage';
import { OcrPage } from './pages/OcrPage';
import { DashboardPage } from './pages/DashboardPage';
import { ApiDocsPage } from './pages/ApiDocsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AboutPage } from './pages/AboutPage';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentTab]);

  const renderActivePage = () => {
    switch (currentTab) {
      case 'home':
        return <HomePage onSelectTool={(id) => setCurrentTab(id)} />;
      case 'merge':
        return <MergePage />;
      case 'split':
        return <SplitPage />;
      case 'compress':
        return <CompressPage />;
      case 'pdf-to-word':
      case 'pdf-to-excel':
      case 'pdf-to-html':
      case 'images-to-pdf':
      case 'convert':
        return <ConvertPage />;
      case 'edit':
      case 'watermark':
      case 'rotate':
        return <EditPage />;
      case 'protect':
      case 'unlock':
        return <ProtectPage />;
      case 'sign':
        return <SignPage />;
      case 'ocr':
        return <OcrPage />;
      case 'dashboard':
      case 'history':
        return <DashboardPage onSelectTool={(id) => setCurrentTab(id)} />;
      case 'apidocs':
        return <ApiDocsPage />;
      case 'privacy':
        return <PrivacyPage onSelectTool={(id) => setCurrentTab(id)} />;
      case 'about':
        return <AboutPage onSelectTool={(id) => setCurrentTab(id)} />;
      default:
        return <HomePage onSelectTool={(id) => setCurrentTab(id)} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FB] text-[#1B2533] dark:bg-slate-950 dark:text-slate-100 selection:bg-[#fed2d0] selection:text-[#E5322D] antialiased">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      <main className="flex-1 w-full">{renderActivePage()}</main>
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AppContent />
      </I18nProvider>
    </ThemeProvider>
  );
}
