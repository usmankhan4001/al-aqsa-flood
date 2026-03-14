/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useAppState } from './hooks/useAppState';
import { LibraryView } from './components/LibraryView';
import { ReaderView } from './components/ReaderView';
import { HighlightsGallery } from './components/HighlightsGallery';
import bookData from './data/content.json';
import { Book } from './types';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const { state, updateState } = useAppState();
  const [view, setView] = useState<'library' | 'reader'>('library');
  const [showHighlights, setShowHighlights] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const book = bookData as Book;

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt only if they haven't seen it recently or on first visit
      const hasSeenPrompt = localStorage.getItem('hasSeenInstallPrompt');
      if (!hasSeenPrompt) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
    setShowInstallPrompt(false);
    localStorage.setItem('hasSeenInstallPrompt', 'true');
  };

  const handleContinueReading = () => {
    if (!state.currentChapterId && book.chapters.length > 0) {
      updateState({ currentChapterId: book.chapters[0].id });
    }
    setView('reader');
  };

  const handleGoBack = () => {
    setView('library');
  };

  const handleJumpToChapter = (chapterId: string | number) => {
    updateState({ currentChapterId: chapterId });
    setShowHighlights(false);
    setView('reader');
  };

  return (
    <div 
      className="min-h-screen w-full relative selection:bg-[var(--accent-color)] selection:text-white transition-colors duration-500 font-nastaliq"
      data-theme={state.theme}
      dir="rtl"
      style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
      }}
    >
      {/* Premium Mesh Gradient Background */}
      <div className="mesh-container">
        <div className="mesh-gradient" />
      </div>

      {/* Software Brightness Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300"
        style={{ 
          backgroundColor: 'black',
          opacity: 1 - state.brightness 
        }}
      />

      <AnimatePresence mode="wait">
        {view === 'library' ? (
          <LibraryView 
            key="library"
            book={book} 
            state={state} 
            onContinue={handleContinueReading} 
            onShowHighlights={() => setShowHighlights(true)} 
          />
        ) : (
          <ReaderView 
            key="reader"
            book={book} 
            state={state} 
            updateState={updateState} 
            onBack={handleGoBack} 
            onShowHighlights={() => setShowHighlights(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHighlights && (
          <HighlightsGallery 
            book={book} 
            state={state} 
            updateState={updateState} 
            onClose={() => setShowHighlights(false)} 
            onJump={handleJumpToChapter} 
          />
        )}
      </AnimatePresence>

      {/* PWA Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 right-6 z-[110] glass p-6 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center gap-4 border border-white/20 max-w-2xl mx-auto"
          >
            <div className="bg-amber-100 p-3 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">📱</span>
            </div>
            <div className="flex-1 text-center sm:text-right">
              <h4 className="text-lg font-bold font-nastaliq">ایپ انسٹال کریں</h4>
              <p className="text-sm opacity-70 font-nastaliq leading-relaxed">بہتر تجربے اور آف لائن پڑھنے کے لیے ایپ کو اپنی ہوم اسکرین پر شامل کریں۔</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={handleInstall}
                className="flex-1 sm:flex-none px-6 py-2 rounded-xl bg-slate-900 text-white font-bold font-nastaliq transition-transform active:scale-95"
              >
                انسٹال کریں
              </button>
              <button 
                onClick={() => {
                  setShowInstallPrompt(false);
                  localStorage.setItem('hasSeenInstallPrompt', 'true');
                }}
                className="flex-1 sm:flex-none px-6 py-2 rounded-xl bg-[var(--text-color)]/5 hover:bg-[var(--text-color)]/10 font-bold font-nastaliq transition-all"
              >
                بعد میں
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
