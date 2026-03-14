/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useAppState } from './hooks/useAppState';
import { LibraryView } from './components/LibraryView';
import { ReaderView } from './components/ReaderView';
import { HighlightsGallery } from './components/HighlightsGallery';
import { NotesGallery } from './components/NotesGallery';
import { QuoteStudio } from './components/QuoteStudio';
import { MainNavbar } from './components/MainNavbar';
import bookData from './data/content.json';
import { Book } from './types';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const { state, updateState } = useAppState();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const book = bookData as Book;

  useEffect(() => {
    const handler = (e: any) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Check if already installed to prevent showing UI
    if (window.matchMedia('(display-mode: standalone)').matches) {
       setShowInstallPrompt(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('No deferredPrompt available');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleContinueReading = () => {
    if (!state.currentChapterId && book.chapters.length > 0) {
      updateState({ currentChapterId: book.chapters[0].id });
    }
    updateState({ activeView: 'reader' });
  };

  const handleGoBack = () => {
    updateState({ activeView: 'library' });
  };

  const handleJumpToChapter = (chapterId: string | number) => {
    updateState({ currentChapterId: chapterId, activeView: 'reader' });
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
        {state.activeView === 'library' && (
          <LibraryView 
            key="library"
            book={book} 
            state={state} 
            updateState={updateState}
            onContinue={handleContinueReading} 
          />
        )}
        
        {state.activeView === 'reader' && (
          <ReaderView 
            key="reader"
            book={book} 
            state={state} 
            updateState={updateState} 
            onBack={handleGoBack} 
            onShowHighlights={() => updateState({ activeView: 'highlights' })}
          />
        )}

        {state.activeView === 'highlights' && (
           <div key="highlights-wrap" className="flex flex-col min-h-screen">
             <HighlightsGallery 
                book={book} 
                state={state} 
                updateState={updateState} 
                onClose={() => updateState({ activeView: 'library' })} 
                onJump={handleJumpToChapter} 
              />
           </div>
        )}

        {state.activeView === 'notes' && (
          <NotesGallery 
            book={book}
            state={state}
            updateState={updateState}
            onJump={handleJumpToChapter}
          />
        )}

        {state.activeView === 'studio' && (
          <QuoteStudio 
            book={book}
            state={state}
          />
        )}
      </AnimatePresence>

      {state.activeView !== 'reader' && (
        <MainNavbar 
          activeView={state.activeView}
          onViewChange={(v) => updateState({ activeView: v })}
        />
      )}

      {/* PWA Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 right-6 z-[110] bg-[var(--bg-color)] border border-[var(--border-color)] p-6 rounded-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto"
          >
            <div className="bg-[var(--accent-color)]/10 p-4 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">📱</span>
            </div>
            <div className="flex-1 text-center sm:text-right">
              <h4 className="text-xl font-bold font-nastaliq">ایپ انسٹال کریں</h4>
              <p className="text-sm opacity-50 font-nastaliq mt-1">آف لائن پڑھنے کے لیے ہوم اسکرین پر شامل کریں۔</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={handleInstall}
                className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-[var(--text-color)] text-[var(--bg-color)] font-bold font-nastaliq transition-transform active:scale-95"
              >
                انسٹال کریں
              </button>
              <button 
                onClick={() => {
                  setShowInstallPrompt(false);
                  localStorage.setItem('hasSeenInstallPrompt', 'true');
                }}
                className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-[var(--text-color)]/5 hover:bg-[var(--text-color)]/10 font-bold font-nastaliq transition-all"
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
