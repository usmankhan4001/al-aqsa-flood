import { AppState, Book } from '../types';
import { X, Trash2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function HighlightsGallery({ book, state, updateState, onClose, onJump }: { book: Book, state: AppState, updateState: any, onClose: () => void, onJump: (chapterId: string | number) => void }) {
  const handleDelete = (id: string) => {
    updateState({ highlights: state.highlights.filter(h => h.id !== id) });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" dir="rtl">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ y: '100%' }} 
        animate={{ y: 0 }} 
        exit={{ y: '100%' }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-2xl rounded-t-[2rem] p-6 sm:p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[85vh] bg-[var(--bg-color)] border-t border-[var(--border-color)]"
      >
        <div className="flex justify-between items-center mb-8 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-2xl font-nastaliq font-bold">ہائی لائٹس اور نوٹس</h2>
            <p className="text-xs opacity-40 font-nastaliq mt-1">آپ کے تمام محفوظ کردہ اقتباسات</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-[var(--text-color)]/10 transition-colors active:scale-95">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
          {state.highlights.length === 0 ? (
            <div className="flex flex-col items-center justify-center opacity-40 py-20 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-[var(--text-color)]/5 flex items-center justify-center">
                <span className="text-2xl">📖</span>
              </div>
              <p className="font-nastaliq text-2xl">ابھی تک کوئی ہائی لائٹ نہیں۔</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.highlights.map((highlight, idx) => {
                const chapter = book.chapters.find(c => c.id === highlight.chapterId);
                return (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: idx * 0.03 }}
                    key={highlight.id} 
                    className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-color)] hover:border-[var(--accent-color)]/30 transition-all shadow-sm group" 
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-[10px] font-bold tracking-widest opacity-40 font-nastaliq bg-[var(--text-color)]/5 px-2 py-1 rounded">
                        {chapter?.titleUrdu || chapter?.title}
                      </div>
                      <button 
                        onClick={() => handleDelete(highlight.id)}
                        className="p-2 rounded-lg text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                        title="حذف کریں"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p 
                      className="text-xl mb-4 pr-4 border-r-4 leading-relaxed font-nastaliq"
                      style={{ borderColor: highlight.color, borderWidth: '0 4px 0 0' }}
                    >
                      {highlight.text}
                    </p>
                    
                    {highlight.note && (
                      <div className="mb-4 p-4 rounded-xl bg-[var(--accent-color)]/5 border border-[var(--accent-color)]/10">
                        <p className="text-lg opacity-80 font-nastaliq leading-relaxed">
                          {highlight.note}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-start">
                      <button 
                        onClick={() => {
                          onJump(highlight.chapterId);
                          onClose();
                        }}
                        className="text-xs font-bold flex items-center gap-2 hover:gap-3 transition-all font-nastaliq px-3 py-2 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-full"
                      >
                        باب پر جائیں <ArrowLeft size={14} className="rtl:-scale-x-100" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
