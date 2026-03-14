import React from 'react';
import { AppState, Book } from '../types';
import { StickyNote, Trash2, Edit3, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function NotesGallery({ book, state, updateState, onJump }: { book: Book, state: AppState, updateState: any, onJump: (chapterId: string | number) => void }) {
  const notes = state.highlights.filter(h => h.note && h.note.trim() !== "");

  const handleDeleteNote = (id: string) => {
    updateState({
      highlights: state.highlights.map(h => h.id === id ? { ...h, note: "" } : h)
    });
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-8 overflow-y-auto max-h-[85vh]" dir="rtl">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-nastaliq font-bold mb-8">آپ کے نوٹس</h2>
        
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <StickyNote size={64} className="mb-4" />
            <p className="font-nastaliq text-2xl">کوئی نوٹ موجود نہیں ہے۔</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.map((h) => {
              const chapter = book.chapters.find(c => c.id === h.chapterId);
              return (
                <motion.div 
                  key={h.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-6 rounded-3xl flex flex-col border border-white/10"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-3 py-1 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-full text-xs font-bold font-nastaliq">
                      {chapter?.titleUrdu || chapter?.title}
                    </div>
                    <button 
                      onClick={() => handleDeleteNote(h.id)}
                      className="p-2 hover:bg-red-500/10 text-red-500/50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-sm opacity-50 mb-4 line-clamp-2 font-nastaliq border-r-2 border-[var(--accent-color)] pr-3 mb-4">
                    "{h.text}"
                  </p>

                  <div className="flex-1">
                    <p className="text-xl font-nastaliq opacity-90 leading-relaxed whitespace-pre-wrap">
                      {h.note}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-xs opacity-50">
                    <span>{new Date(h.timestamp).toLocaleDateString('ur-PK')}</span>
                    <button 
                        onClick={() => onJump(h.chapterId)}
                        className="flex items-center gap-2 hover:text-[var(--accent-color)] transition-colors font-bold font-nastaliq"
                    >
                        باب پر جائیں <ChevronLeft size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
