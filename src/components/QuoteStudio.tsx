import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Download, Share2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Book, AppState } from '../types';
import * as htmlToImage from 'html-to-image';

export const QuoteStudio: React.FC<{ book: Book, state: AppState }> = ({ book, state }) => {
  const [selectedHighlightIndex, setSelectedHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(40);
  const highlights = state.highlights;

  const currentHighlight = highlights[selectedHighlightIndex];

  useEffect(() => {
    if (currentHighlight && textRef.current && containerRef.current) {
      // Auto-scaling logic: Adjust font size to fit container
      let size = 60; // Max size
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
  }, [currentHighlight]);

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

  if (highlights.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-50">
        <Camera size={64} className="mb-4" />
        <p className="text-2xl font-nastaliq">اقتباسات بنانے کے لیے پہلے کچھ ہائی لائٹ کریں۔</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center py-8 px-4 max-h-[85vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl flex flex-col gap-8"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-nastaliq font-bold">کوٹ اسٹوڈیو</h2>
          <div className="flex gap-2">
             <button onClick={() => setSelectedHighlightIndex(prev => Math.max(0, prev - 1))} disabled={selectedHighlightIndex === 0} className="p-2 glass rounded-full disabled:opacity-30">
                <ChevronRight size={20} />
             </button>
             <button onClick={() => setSelectedHighlightIndex(prev => Math.min(highlights.length - 1, prev + 1))} disabled={selectedHighlightIndex === highlights.length - 1} className="p-2 glass rounded-full disabled:opacity-30">
                <ChevronLeft size={20} />
             </button>
          </div>
        </div>

        {/* The Studio Container */}
        <div 
          ref={containerRef}
          className="aspect-square w-full flex items-center justify-center p-12 relative overflow-hidden shadow-2xl bg-cover bg-center"
          style={{ backgroundImage: 'url(/quotebg.png)' }}
        >
          {/* Focused Content: Only the quote text */}
          <div className="flex flex-col items-center text-center">
             <p 
                ref={textRef}
                className="font-nastaliq leading-[1.6] leading-relaxed"
                style={{ fontSize: `${fontSize}px`, color: '#433422' }}
             >
                {currentHighlight.text}
             </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleExport}
            className="flex-1 py-4 bg-[var(--text-color)] text-[var(--bg-color)] rounded-2xl font-bold font-nastaliq text-xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
          >
            <Download size={20} />
            <span>تصویر محفوظ کریں</span>
          </button>
          
          <button 
            className="px-6 py-4 glass rounded-2xl font-bold flex items-center justify-center shadow-xl active:scale-95 transition-all"
          >
            <Share2 size={20} />
          </button>
        </div>

        <div className="text-center opacity-40 text-sm font-nastaliq">
          {selectedHighlightIndex + 1} / {highlights.length} اقتباسات
        </div>
      </motion.div>
    </div>
  );
};
