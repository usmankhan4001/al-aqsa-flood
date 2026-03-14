import React from 'react';
import { Book, AppState } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, BookOpen, ChevronLeft } from 'lucide-react';

interface TOCModalProps {
  book: Book;
  state: AppState;
  onClose: () => void;
  onSelectChapter: (id: string) => void;
}

export const TOCModal: React.FC<TOCModalProps> = ({ book, state, onClose, onSelectChapter }) => {
  const currentChapterIndex = book.chapters.findIndex(c => c.id === state.currentChapterId);
  const totalChapters = book.chapters.length;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-6"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: '100%', opacity: 0.5 }} 
        animate={{ y: 0, opacity: 1 }} 
        exit={{ y: '100%', opacity: 0.5 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-xl bg-[var(--bg-color)] rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-[0_-20px_50px_-10px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh] border border-[var(--border-color)]/30"
        onClick={e => e.stopPropagation()}
      >
        {/* Premium Header */}
        <div className="relative p-8 pb-6 border-b border-[var(--border-color)]/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold font-nastaliq tracking-tight">کتاب کی فہرست</h2>
            <button 
              onClick={onClose} 
              className="p-3 rounded-full hover:bg-[var(--text-color)]/10 transition-all active:scale-90"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-sm font-nastaliq">
              <BookOpen size={14} />
              {totalChapters} ابواب
            </div>
            <div className="text-sm font-nastaliq opacity-50">
              آپ ابھی {currentChapterIndex + 1} ویں باب پر ہیں
            </div>
          </div>
          
          {/* Decorative Mesh Gradient Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-color)]/10 rounded-full blur-3xl pointer-events-none" />
        </div>
        
        {/* Chapter List */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-3 custom-scrollbar">
          {book.chapters.map((chapter, index) => {
            const wordCount = chapter.content.split(/\s+/).length;
            const readingTime = Math.max(1, Math.ceil(wordCount / 180));
            const isActive = state.currentChapterId === chapter.id;

            return (
              <motion.button
                key={chapter.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  onSelectChapter(chapter.id as string);
                  onClose();
                }}
                className={`w-full group relative p-5 rounded-2xl transition-all duration-300 flex items-center justify-between border ${
                  isActive 
                    ? 'bg-[var(--accent-color)] border-[var(--accent-color)] shadow-lg shadow-[var(--accent-color)]/20 text-white' 
                    : 'bg-[var(--text-color)]/5 border-transparent hover:border-[var(--border-color)] hover:bg-[var(--text-color)]/10'
                }`}
              >
                <div className="flex items-center gap-5 rtl:flex-row-reverse">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-110 ${
                    isActive ? 'bg-white/20' : 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex flex-col items-start rtl:items-end gap-1">
                    <span className="font-nastaliq text-xl font-bold leading-normal">
                      {chapter.titleUrdu || chapter.title}
                    </span>
                    <div className={`flex items-center gap-2 text-xs font-nastaliq opacity-70 ${isActive ? 'text-white' : ''}`}>
                      <Clock size={12} />
                      {readingTime} منٹ کا مطالعہ
                    </div>
                  </div>
                </div>

                <div className={`transition-all duration-300 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                  <ChevronLeft size={20} className="rtl:rotate-180" />
                </div>

                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute inset-0 rounded-2xl ring-2 ring-[var(--accent-color)] ring-offset-4 ring-offset-[var(--bg-color)] pointer-events-none"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
        
        {/* Bottom Fade gradient */}
        <div className="h-8 bg-gradient-to-t from-[var(--bg-color)] to-transparent pointer-events-none -mt-8 sticky bottom-0" />
      </motion.div>
    </motion.div>
  );
};
