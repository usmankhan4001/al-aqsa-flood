import React from 'react';
import { Book, AppState } from '../types';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

export const TOCModal: React.FC<{ book: Book, state: AppState, onClose: () => void, onSelectChapter: (id: string) => void }> = ({ book, state, onClose, onSelectChapter }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-[var(--bg-color)] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]/50">
          <h2 className="text-2xl font-bold font-nastaliq">فہرست</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--text-color)]/5 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 flex-1">
          {book.chapters.map((chapter, index) => {
            const wordCount = chapter.content.split(/\s+/).length;
            const readingTime = Math.max(1, Math.ceil(wordCount / 180)); // 180 words per minute for Urdu

            return (
              <button
                key={chapter.id}
                onClick={() => {
                  onSelectChapter(chapter.id as string);
                  onClose();
                }}
                className={`w-full text-right p-4 rounded-xl mb-2 transition-colors flex items-center justify-between group ${state.currentChapterId === chapter.id ? 'bg-[var(--accent-color)] text-white' : 'hover:bg-[var(--text-color)]/5 border border-transparent hover:border-[var(--border-color)]'}`}
              >
                <div className="flex flex-col items-start rtl:items-end">
                  <span className="font-nastaliq text-lg font-bold">{chapter.titleUrdu || chapter.title}</span>
                  <span className={`text-xs opacity-60 font-nastaliq ${state.currentChapterId === chapter.id ? 'text-white' : 'text-[var(--text-color)]'}`}>
                    تقریباً {readingTime} منٹ کا مطالعہ
                  </span>
                </div>
                <span className="text-sm opacity-60 font-mono font-bold">{index + 1}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
