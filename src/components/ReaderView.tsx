import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Book, AppState, Highlight } from '../types';
import { ArrowLeft, Settings, Share2, ChevronLeft, ChevronRight, X, List, Bookmark, Type, StickyNote, Edit3 } from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { ShareModal } from './ShareModal';
import { TOCModal } from './TOCModal';
import { HighlightedContent } from './HighlightedContent';
import { motion, AnimatePresence } from 'motion/react';

export const ReaderView: React.FC<{ book: Book, state: AppState, updateState: any, onBack: () => void, onShowHighlights: () => void }> = ({ book, state, updateState, onBack, onShowHighlights }) => {
  const [showNav, setShowNav] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const [shareText, setShareText] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const currentChapterIndex = book.chapters.findIndex(c => c.id === state.currentChapterId);
  const chapter = book.chapters[currentChapterIndex] || book.chapters[0];

  // Scroll handling for Focus Mode and Progress
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (currentScrollY / scrollHeight) * 100 : 0;

      updateState({
        scrollProgress: {
          ...state.scrollProgress,
          [chapter.id]: progress
        }
      });

      if (currentScrollY > lastScrollY.current + 50) {
        setShowNav(false);
      } else if (currentScrollY < lastScrollY.current - 20) {
        setShowNav(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapter.id, state.scrollProgress, updateState]);

  useEffect(() => {
    const savedProgress = state.scrollProgress[chapter.id] || 0;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: (savedProgress / 100) * scrollHeight, behavior: 'instant' });
  }, [chapter.id]);

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      updateState({ currentChapterId: book.chapters[currentChapterIndex - 1].id });
      window.scrollTo(0, 0);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < book.chapters.length - 1) {
      updateState({ currentChapterId: book.chapters[currentChapterIndex + 1].id });
      window.scrollTo(0, 0);
    }
  };

  const cleanContent = (text: string) => {
    return text.replace(/\[Page Translation:.*?\]/g, '');
  };

  const { typography } = state;

  const [selection, setSelection] = useState<{ text: string, rect: DOMRect } | null>(null);

  // Calculate absolute character offset within the content container
  const getOffsets = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !contentRef.current) return null;
    const range = sel.getRangeAt(0);
    
    // Ensure selection is within content
    if (!contentRef.current.contains(range.commonAncestorContainer)) return null;

    const preRange = range.cloneRange();
    preRange.selectNodeContents(contentRef.current);
    preRange.setEnd(range.startContainer, range.startOffset);
    const start = preRange.toString().length;
    
    return {
      start,
      end: start + range.toString().length
    };
  };

  useEffect(() => {
    let stabilityTimeout: number;

    const handleSelectionChange = () => {
      clearTimeout(stabilityTimeout);
      stabilityTimeout = window.setTimeout(() => {
        const sel = window.getSelection();
        if (sel && sel.toString().trim().length > 0 && sel.rangeCount > 0) {
          const offsets = getOffsets();
          if (offsets) {
            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              setSelection({ text: sel.toString(), rect, ...offsets });
            }
          }
        }
      }, 300);
    };

    const handleInputStart = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.selection-toolbar') && !contentRef.current?.contains(target)) {
        setSelection(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mousedown', handleInputStart);
    document.addEventListener('touchstart', handleInputStart);
    
    return () => {
      clearTimeout(stabilityTimeout);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mousedown', handleInputStart);
      document.removeEventListener('touchstart', handleInputStart);
    };
  }, []);

  const handleHighlight = (color: string) => {
    if (selection && (selection as any).start !== undefined) {
      const selWithOffsets = selection as typeof selection & { start: number, end: number };
      const newHighlight: Highlight = {
        id: Date.now().toString(),
        chapterId: chapter.id,
        text: selWithOffsets.text,
        color,
        timestamp: Date.now(),
        startOffset: selWithOffsets.start,
        endOffset: selWithOffsets.end
      };
      updateState({ highlights: [...state.highlights, newHighlight] });
      window.getSelection()?.removeAllRanges();
      setSelection(null);
    }
  };

  const handleAddNote = () => {
    if (selection && (selection as any).start !== undefined) {
      const selWithOffsets = selection as typeof selection & { start: number, end: number };
      const id = Date.now().toString();
      const newHighlight: Highlight = {
        id,
        chapterId: chapter.id,
        text: selWithOffsets.text,
        color: '#fef08a',
        timestamp: Date.now(),
        note: "",
        startOffset: selWithOffsets.start,
        endOffset: selWithOffsets.end
      };
      updateState({ highlights: [...state.highlights, newHighlight] });
      setEditingNoteId(id);
      setNoteText("");
      window.getSelection()?.removeAllRanges();
      setSelection(null);
    }
  };

  const handleSaveNote = () => {
    updateState({
      highlights: state.highlights.map(h => 
        h.id === editingNoteId ? { ...h, note: noteText } : h
      )
    });
    setEditingNoteId(null);
    setNoteText("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen pb-32" ref={scrollRef}>
      {/* Top Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-[var(--accent-color)] z-50 transition-all duration-150 ease-out"
        style={{ width: `${state.scrollProgress[chapter.id] || 0}%` }}
      />

      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 p-4 flex flex-col items-center justify-center z-40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-xl bg-[var(--bg-color)]/80 border-b border-[var(--border-color)]/50 ${showNav ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="text-xl md:text-2xl font-bold font-nastaliq">{chapter.titleUrdu || chapter.title}</div>
        {(chapter.titleEnglish || (chapter.title !== chapter.titleUrdu)) && (
          <div className="text-xs md:text-sm opacity-60 font-sans tracking-widest uppercase mt-1">{chapter.titleEnglish || chapter.title}</div>
        )}
      </header>

      {/* Content */}
      <main 
        className="max-w-3xl mx-auto pt-32 px-6"
        style={{
          fontSize: `${typography.fontSize}px`,
          lineHeight: typography.lineHeight,
        }}
      >
        <div className="max-w-prose mx-auto" style={{ 
          textAlign: typography.alignment,
          lineHeight: typography.lineSpacing,
          paddingRight: `${typography.indent * 1}rem`
        }}>
          <HighlightedContent 
            content={chapter.content} 
            highlights={state.highlights.filter(h => h.chapterId === chapter.id)}
            contentRef={contentRef}
          />
        </div>
      </main>

      {/* Unified Navbar */}
      <footer 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 rounded-2xl flex items-center gap-2 sm:gap-4 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-xl bg-[var(--bg-color)]/90 border border-[var(--border-color)] shadow-2xl ${showNav ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}
      >
        <button onClick={onBack} className="p-3 rounded-xl hover:bg-[var(--text-color)]/5 transition-colors" title="Home">
          <X size={20} />
        </button>
        
        <div className="w-px h-8 bg-[var(--border-color)] mx-1" />

        <button 
          onClick={handlePrevChapter}
          disabled={currentChapterIndex === 0}
          className="p-3 rounded-xl hover:bg-[var(--text-color)]/5 disabled:opacity-30 transition-colors"
          title="Previous Chapter"
        >
          <ChevronRight size={20} className="rtl:-scale-x-100" />
        </button>

        <button onClick={() => setShowTOC(true)} className="p-3 rounded-xl hover:bg-[var(--text-color)]/5 transition-colors" title="Table of Contents">
          <List size={20} />
        </button>

        <button onClick={() => setShowSettings(true)} className="p-3 rounded-xl hover:bg-[var(--text-color)]/5 transition-colors" title="Settings">
          <Type size={20} />
        </button>

        <button onClick={onShowHighlights} className="p-3 rounded-xl hover:bg-[var(--text-color)]/5 transition-colors relative" title="Highlights">
          <Bookmark size={20} />
          {state.highlights.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--accent-color)] rounded-full" />
          )}
        </button>

        <button 
          onClick={handleNextChapter}
          disabled={currentChapterIndex === book.chapters.length - 1}
          className="p-3 rounded-xl hover:bg-[var(--text-color)]/5 disabled:opacity-30 transition-colors"
          title="Next Chapter"
        >
          <ChevronLeft size={20} className="rtl:-scale-x-100" />
        </button>
      </footer>

      {/* Selection Toolbar */}
      <AnimatePresence>
        {selection && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 bg-slate-900 text-white rounded-xl shadow-2xl p-2 flex items-center gap-2 transform -translate-x-1/2 -translate-y-full border border-white/10 selection-toolbar"
            style={{ 
              top: Math.max(80, selection.rect.top - 60), // Move higher up to avoid finger/selection
              left: Math.min(window.innerWidth - 140, Math.max(140, selection.rect.left + selection.rect.width / 2))
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#e5e7eb'].map(color => (
              <button 
                key={color}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleHighlight(color);
                }}
                className="w-7 h-7 rounded-full border border-white/10 hover:scale-110 transition-transform shadow-inner"
                style={{ backgroundColor: color }}
              />
            ))}
            <div className="w-px h-6 bg-white/20 mx-1" />
            <button 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-amber-200" 
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddNote();
              }}
              title="Add Note"
            >
              <StickyNote size={18} />
            </button>
            <button 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShareText(selection.text);
                window.getSelection()?.removeAllRanges();
                setSelection(null);
              }}
            >
              <Share2 size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note Editor Modal */}
      <AnimatePresence>
        {editingNoteId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[var(--bg-color)] border border-[var(--border-color)] rounded-3xl shadow-2xl p-6 overflow-hidden relative"
              data-theme={state.theme}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold font-nastaliq flex items-center gap-2">
                  <StickyNote size={20} className="text-[var(--accent-color)]" />
                  نوٹ شامل کریں
                </h3>
                <button onClick={() => setEditingNoteId(null)} className="p-2 hover:bg-[var(--text-color)]/5 rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4 p-3 bg-[var(--text-color)]/5 rounded-xl border-r-4 border-[var(--accent-color)] opacity-70 italic text-sm font-nastaliq max-h-24 overflow-y-auto">
                {state.highlights.find(h => h.id === editingNoteId)?.text}
              </div>

              <textarea 
                autoFocus
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="اپنا نوٹ یہاں لکھیں..."
                className="w-full h-40 bg-[var(--text-color)]/5 border border-[var(--border-color)] rounded-2xl p-4 font-nastaliq text-lg outline-none focus:border-[var(--accent-color)] transition-colors resize-none"
                dir="rtl"
              />

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={handleSaveNote}
                  className="flex-1 py-3 rounded-xl bg-[var(--text-color)] text-[var(--bg-color)] font-bold font-nastaliq text-lg hover:opacity-90 transition-opacity"
                >
                  محفوظ کریں
                </button>
                <button 
                  onClick={() => setEditingNoteId(null)}
                  className="flex-1 py-3 rounded-xl border border-[var(--border-color)] font-bold font-nastaliq text-lg hover:bg-[var(--text-color)]/5 transition-colors"
                >
                  منسوخ کریں
                </button>
              </div>

              {/* Decorative Mesh Gradient Background for Premium feel */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--accent-color)]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[var(--accent-color)]/10 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTOC && (
          <TOCModal 
            book={book} 
            state={state} 
            onClose={() => setShowTOC(false)} 
            onSelectChapter={(id) => {
              updateState({ currentChapterId: id });
              window.scrollTo(0, 0);
            }} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <SettingsModal 
            book={book}
            state={state} 
            updateState={updateState} 
            onClose={() => setShowSettings(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shareText && (
          <ShareModal text={shareText} theme={state.theme} onClose={() => setShareText(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
