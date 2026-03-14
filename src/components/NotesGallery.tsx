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
    <div className="flex-1 flex flex-col p-6 sm:p-12 overflow-y-auto max-h-[90vh] pb-32" dir="rtl">
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <h2 className="text-3xl font-nastaliq font-bold text-[var(--text-color)]">آپ کے نوٹس</h2>
          <p className="text-sm opacity-40 font-nastaliq mt-1">مطالعہ کے دوران محفوظ کردہ آپ کے خیالات</p>
        </div>
        
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-30 text-center">
            <div className="w-20 h-20 mb-6 rounded-full bg-[var(--text-color)]/5 flex items-center justify-center">
              <StickyNote size={40} />
            </div>
            <p className="font-nastaliq text-2xl">کوئی نوٹ موجود نہیں ہے۔</p>
          </div>
        ) : (
          <div id="notes-list" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {notes.map((h, idx) => {
              const chapter = book.chapters.find(c => c.id === h.chapterId);
              return (
                <motion.div 
                  key={h.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-8 rounded-[2.5rem] flex flex-col border border-[var(--border-color)] bg-[var(--bg-color)] shadow-sm hover:border-[var(--accent-color)]/30 transition-all group"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="px-3 py-1 bg-[var(--accent-color)]/5 text-[var(--accent-color)] rounded-lg text-xs font-bold font-nastaliq border border-[var(--accent-color)]/10">
                      {chapter?.titleUrdu || chapter?.title}
                    </div>
                    <button 
                      onClick={() => handleDeleteNote(h.id)}
                      className="p-2.5 rounded-xl text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-95"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <p className="text-sm opacity-40 mb-6 line-clamp-2 font-nastaliq border-r-2 border-[var(--accent-color)]/20 pr-4 italic">
                    "{h.text}"
                  </p>

                  <div className="flex-1 mb-6">
                    <p className="text-xl sm:text-2xl font-nastaliq opacity-90 leading-relaxed font-medium">
                      {h.note}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[var(--border-color)] flex justify-between items-center text-xs opacity-40">
                    <span className="font-nastaliq">{new Date(h.timestamp).toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <button 
                        onClick={() => onJump(h.chapterId)}
                        className="flex items-center gap-2 text-[var(--accent-color)] hover:gap-3 transition-all font-bold font-nastaliq"
                    >
                        باب پر جائیں <ChevronLeft size={16} />
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
