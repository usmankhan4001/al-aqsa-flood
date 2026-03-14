import React from 'react';
import { Book, AppState } from '../types';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface TOCModalProps {
  book: Book;
  state: AppState;
  onClose: () => void;
  onSelectChapter: (id: string) => void;
}

export const TOCModal: React.FC<TOCModalProps> = ({ book, state, onClose, onSelectChapter }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: '100%' }} 
        animate={{ y: 0 }} 
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-[var(--bg-color)] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-[var(--border-color)]/30"
        onClick={e => e.stopPropagation()}
      >
        {/* Simple Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]/20">
          <h2 className="text-2xl font-bold font-nastaliq">فہرست</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--text-color)]/5 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {/* Chapter List */}
        <div className="overflow-y-auto p-2 flex-1">
          {book.chapters.map((chapter, index) => {
            const wordCount = chapter.content.split(/\s+/).length;
            const readingTime = Math.max(1, Math.ceil(wordCount / 180));
            const isActive = state.currentChapterId === chapter.id;

            return (
              <button
                key={chapter.id}
                onClick={() => {
                  onSelectChapter(chapter.id as string);
                  onClose();
                }}
                className={`w-full group px-6 py-4 mb-1 transition-all flex flex-row-reverse items-center justify-between rounded-xl ${
                  isActive 
                    ? 'bg-[var(--accent-color)] text-white shadow-md' 
                    : 'hover:bg-[var(--text-color)]/5 text-[var(--text-color)]'
                }`}
              >
                {/* 1. Index (Right in RTL) */}
                <span className="text-lg font-mono font-bold opacity-60 w-8 text-center shrink-0">
                  {index + 1}
                </span>

                {/* 2. Reading Time (Middle in RTL) */}
                <span className={`text-sm opacity-50 font-nastaliq px-4 shrink-0 truncate max-w-[100px] border-x border-current/20 ${isActive ? 'text-white' : ''}`}>
                  {readingTime} منٹ
                </span>

                {/* 3. Title (Left in RTL) */}
                <span className="flex-1 text-right font-nastaliq text-2xl font-bold truncate pl-2">
                  {chapter.titleUrdu || chapter.title}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
