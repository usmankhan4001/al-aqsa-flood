import { AppState, Book } from '../types';
import { X, Trash2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function HighlightsGallery({ book, state, updateState, onClose, onJump }: { book: Book, state: AppState, updateState: any, onClose: () => void, onJump: (chapterId: string | number) => void }) {
  const handleDelete = (id: string) => {
    updateState({ highlights: state.highlights.filter(h => h.id !== id) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6" dir="rtl">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col"
        style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-nastaliq font-bold tracking-wide">ہائی لائٹس اور نوٹس</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--text-color)]/5 transition-colors">
            <X size={24} />
          </button>
        </div>

        {state.highlights.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-50 py-20 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-[var(--text-color)]/5 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <p className="font-nastaliq text-2xl">ابھی تک کوئی ہائی لائٹ نہیں۔</p>
            <p className="text-sm mt-4 font-nastaliq">پڑھتے وقت اپنے پسندیدہ اقتباسات کو محفوظ کرنے کے لیے متن کو منتخب کریں۔</p>
          </div>
        ) : (
          <div className="space-y-6">
            {state.highlights.map((highlight, idx) => {
              const chapter = book.chapters.find(c => c.id === highlight.chapterId);
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={highlight.id} 
                  className="p-6 rounded-2xl border bg-[var(--text-color)]/5 hover:bg-[var(--text-color)]/10 transition-colors group" 
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-sm font-bold tracking-widest opacity-50 font-nastaliq">
                      {chapter?.titleUrdu || chapter?.title || 'نامعلوم باب'}
                    </div>
                    <button 
                      onClick={() => handleDelete(highlight.id)}
                      className="p-2 rounded-full hover:bg-red-500/10 text-red-500/50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p 
                    className="text-xl mb-4 pr-6 border-r-4 leading-relaxed font-nastaliq"
                    style={{ borderColor: highlight.color, borderWidth: '0 4px 0 0' }}
                  >
                    {highlight.text}
                  </p>
                  
                  {highlight.note && (
                    <div className="mb-6 p-4 rounded-xl bg-[var(--accent-color)]/5 border border-[var(--accent-color)]/20 relative">
                      <div className="absolute top-0 right-4 -translate-y-1/2 px-2 bg-[var(--bg-color)] text-[var(--accent-color)] text-xs font-bold font-nastaliq">
                        نوٹ
                      </div>
                      <p className="text-lg opacity-80 font-nastaliq leading-relaxed whitespace-pre-wrap">
                        {highlight.note}
                      </p>
                    </div>
                  )}

                  <button 
                    onClick={() => onJump(highlight.chapterId)}
                    className="text-sm font-bold tracking-widest flex items-center gap-2 hover:gap-3 transition-all font-nastaliq"
                    style={{ color: 'var(--accent-color)' }}
                  >
                    باب پر جائیں <ArrowLeft size={14} className="rtl:-scale-x-100" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
