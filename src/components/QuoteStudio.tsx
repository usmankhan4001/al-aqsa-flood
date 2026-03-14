import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Download, Share2, Trash2, Clock, Check } from 'lucide-react';
import { Book, AppState } from '../types';
import * as htmlToImage from 'html-to-image';

export const QuoteStudio: React.FC<{ book: Book, state: AppState, updateState: any }> = ({ book, state, updateState }) => {
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(state.highlights[0]?.id || null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(40);
  
  const highlights = state.highlights;
  const currentHighlight = highlights.find(h => h.id === selectedHighlightId) || highlights[0];

  useEffect(() => {
    if (currentHighlight && textRef.current && containerRef.current) {
      let size = 60;
      const minSize = 16;
      const maxHeight = containerRef.current.offsetHeight * 0.8;
      const maxWidth = containerRef.current.offsetWidth * 0.9;
      
      const checkFit = (s: number) => {
        if (!textRef.current) return false;
        textRef.current.style.fontSize = `${s}px`;
        return textRef.current.scrollHeight <= maxHeight && textRef.current.scrollWidth <= maxWidth;
      };

      while (size > minSize && !checkFit(size)) {
        size -= 2;
      }
      setFontSize(size);
    }
  }, [currentHighlight, state.highlights]);

  const handleExport = async () => {
    if (containerRef.current) {
        const dataUrl = await htmlToImage.toPng(containerRef.current, {
          quality: 1,
          pixelRatio: 3,
        });
        const link = document.createElement('a');
        link.download = `quote-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    }
  };

  const handleDeleteHighlight = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newHighlights = highlights.filter(h => h.id !== id);
    updateState({ highlights: newHighlights });
    if (selectedHighlightId === id) {
      setSelectedHighlightId(newHighlights[0]?.id || null);
    }
  };

  if (highlights.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-50">
        <Camera size={64} className="mb-4" />
        <p className="text-2xl font-nastaliq text-center">اقتباسات بنانے کے لیے پہلے کچھ ہائی لائٹ کریں۔</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* 1. Top Section: Designer Preview */}
      <div className="p-4 sm:p-6 flex flex-col items-center shrink-0 bg-[var(--bg-color)] border-b border-[var(--border-color)]/20 shadow-sm">
        <div className="w-full max-w-lg mb-4 flex justify-between items-center px-1">
          <h2 className="text-2xl font-nastaliq font-bold flex items-center gap-2">
            <Camera size={20} className="text-[var(--accent-color)]" />
            کوٹ اسٹوڈیو
          </h2>
          <div className="flex gap-2">
             <button onClick={handleExport} className="p-2 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 rounded-full transition-colors">
                <Download size={20} />
             </button>
             <button className="p-2 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 rounded-full transition-colors">
                <Share2 size={20} />
             </button>
          </div>
        </div>

        <motion.div 
          layoutId="preview"
          ref={containerRef}
          className="aspect-square w-full max-w-sm flex items-center justify-center p-8 relative overflow-hidden shadow-xl bg-cover bg-center border border-[var(--border-color)]/30"
          style={{ backgroundImage: 'url(/quotebg.png)' }}
        >
          <div className="flex flex-col items-center text-center">
             <p 
                ref={textRef}
                className="font-nastaliq leading-[1.6] select-none"
                style={{ fontSize: `${fontSize}px`, color: '#433422' }}
             >
                {currentHighlight?.text}
             </p>
          </div>
        </motion.div>
      </div>

      {/* 2. Bottom Section: Highlights Selection List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-[var(--bg-color)]/50">
        <div className="max-w-xl mx-auto space-y-3">
          <p className="text-xs font-nastaliq opacity-40 mb-2 px-1">اپنے اقتباسات میں سے انتخاب کریں:</p>
          {highlights.map((highlight, idx) => {
            const isActive = selectedHighlightId === highlight.id;
            const chapter = book.chapters.find(c => c.id === highlight.chapterId);

            return (
              <motion.div
                layout
                key={highlight.id}
                onClick={() => setSelectedHighlightId(highlight.id)}
                className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                  isActive 
                    ? 'bg-[var(--bg-color)] border-[var(--accent-color)] shadow-md ring-1 ring-[var(--accent-color)]/20' 
                    : 'bg-[var(--bg-color)] border-[var(--border-color)] hover:border-[var(--accent-color)]/40 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[var(--accent-color)]' : 'bg-[var(--border-color)]'}`} />
                    <span className="text-[10px] font-nastaliq opacity-50 uppercase tracking-widest truncate max-w-[150px]">
                      {chapter?.titleUrdu || chapter?.title}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteHighlight(e, highlight.id)}
                    className="p-1.5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all active:scale-90"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <p className={`font-nastaliq text-lg line-clamp-3 leading-relaxed transition-colors ${isActive ? 'text-[var(--text-color)]' : 'text-[var(--text-color)]/70'}`}>
                  {highlight.text}
                </p>

                {isActive && (
                  <div className="absolute top-2 right-2 text-[var(--accent-color)] opacity-20">
                    <Check size={48} strokeWidth={1} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
