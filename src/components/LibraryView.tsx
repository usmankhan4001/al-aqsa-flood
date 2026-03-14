import React, { useState } from 'react';
import { Book, AppState } from '../types';
import { BookOpen, Star, Clock, List, Bookmark, ChevronLeft, User, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LibraryView: React.FC<{ book: Book, state: AppState, onContinue: () => void, onShowHighlights: () => void }> = ({ book, state, onContinue, onShowHighlights }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'author' | 'highlights'>('summary');

  const currentChapterIndex = state.currentChapterId 
    ? book.chapters.findIndex(c => c.id === state.currentChapterId)
    : 0;
    
  const progress = state.currentChapterId && book.chapters.length > 0
    ? Math.round((currentChapterIndex / book.chapters.length) * 100)
    : 0;

  const currentChapter = state.currentChapterId 
    ? book.chapters.find(c => c.id === state.currentChapterId) 
    : book.chapters[0];

  const recentHighlights = [...state.highlights].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen flex items-start lg:items-center justify-center py-6 sm:py-12 px-4 sm:px-6"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-20 items-center lg:items-start">
        
        {/* Left/Right Column: Book Cover & Actions (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-right w-full">
          <motion.div 
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-48 h-64 sm:w-56 sm:h-80 md:w-64 md:h-[22rem] shrink-0 rounded-l-2xl rounded-r-md shadow-2xl flex items-center justify-start overflow-hidden group cursor-pointer"
            onClick={onContinue}
          >
            {/* Book Spine & Cover Texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black" />
            <div className="absolute right-0 top-0 bottom-0 w-5 sm:w-6 md:w-8 bg-gradient-to-l from-black/80 via-white/10 to-transparent z-20" />
            <div className="absolute right-5 sm:right-6 md:right-8 top-0 bottom-0 w-px bg-black/40 z-20" />
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
            
            {/* Gold Foil Border & Text */}
            <div className="relative z-10 h-[92%] w-[85%] mr-auto ml-2 sm:ml-3 md:ml-4 border border-amber-500/30 rounded-sm flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 text-center">
              <div className="w-6 sm:w-8 md:w-12 h-px bg-amber-500/50 mb-4 sm:mb-6 md:mb-8" />
              <h2 className="text-amber-50/90 text-3xl sm:text-4xl md:text-5xl font-bold leading-normal tracking-wide font-nastaliq" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {book.title}
              </h2>
              <div className="w-6 sm:w-8 md:w-12 h-px bg-amber-500/50 mt-4 sm:mt-6 md:mt-8" />
              <p className="text-amber-500/70 font-nastaliq mt-3 sm:mt-4 md:mt-6 text-lg sm:text-xl md:text-2xl tracking-widest">{book.author}</p>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-full p-4 sm:p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl border border-white/20">
                <BookOpen size={28} className="sm:w-9 sm:h-9" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-nastaliq font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 tracking-tight leading-normal">{book.title}</h1>
            <p className="text-xl sm:text-2xl opacity-60 font-nastaliq mb-4 sm:mb-6">{book.author}</p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 mb-6 sm:mb-8 text-xs sm:text-sm opacity-70 font-bold font-nastaliq">
              <div className="flex items-center gap-1.5 sm:gap-2"><List size={14} className="sm:w-4 sm:h-4"/> <span className="pt-1">{book.chapters.length} ابواب</span></div>
              {book.rating && <div className="flex items-center gap-1.5 sm:gap-2"><Star size={14} className="sm:w-4 sm:h-4"/> <span className="pt-1">{book.rating} ریٹنگ</span></div>}
              {book.releaseDate && <div className="flex items-center gap-1.5 sm:gap-2"><Clock size={14} className="sm:w-4 sm:h-4"/> <span className="pt-1">{book.releaseDate}</span></div>}
            </div>

            <div className="w-full max-w-sm mx-auto lg:mx-0">
              {state.currentChapterId && (
                <div className="mb-2 sm:mb-3 flex justify-between items-center text-xs sm:text-sm font-bold opacity-80 font-nastaliq px-2">
                  <span className="truncate max-w-[80%] text-right">{currentChapter?.titleUrdu || currentChapter?.title}</span>
                  <span>{progress}%</span>
                </div>
              )}
              <button 
                onClick={onContinue}
                className="group relative w-full py-3 sm:py-4 rounded-2xl bg-[var(--text-color)] text-[var(--bg-color)] font-bold tracking-widest text-lg sm:text-xl font-nastaliq hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-xl"
              >
                <span className="pt-1">{state.currentChapterId ? 'پڑھنا جاری رکھیں' : 'سفر کا آغاز کریں'}</span>
                <ChevronLeft size={18} className="sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section (lg:col-span-7) */}
        <div className="lg:col-span-7 w-full flex flex-col lg:h-[36rem] mt-4 sm:mt-8 lg:mt-0">
          <div className="flex bg-[var(--text-color)]/5 p-1 sm:p-1.5 rounded-2xl sm:rounded-full mb-6 sm:mb-8 relative w-full max-w-xl mx-auto lg:mx-0 border border-[var(--border-color)]">
            {[
              { id: 'summary', label: 'کتاب کا خلاصہ', icon: Info },
              { id: 'author', label: 'مصنف کے بارے میں', icon: User },
              { id: 'highlights', label: `ہائی لائٹس (${state.highlights.length})`, icon: Bookmark }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 relative py-2 sm:py-3 px-1 sm:px-2 md:px-4 rounded-xl sm:rounded-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 font-nastaliq text-sm sm:text-lg md:text-xl font-bold transition-colors z-10 ${isActive ? 'text-[var(--bg-color)]' : 'text-[var(--text-color)]/70 hover:text-[var(--text-color)]'}`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="navSlider" 
                      className="absolute inset-0 bg-[var(--text-color)] rounded-xl sm:rounded-full -z-10 shadow-md" 
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon size={16} className={`sm:w-[18px] sm:h-[18px] ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                  <span className="pt-1 whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar bg-[var(--text-color)]/5 border border-[var(--border-color)] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-10" style={{ maxHeight: 'calc(100vh - 150px)' }}>
            <AnimatePresence mode="wait">
              {activeTab === 'summary' && (
                <motion.div 
                  key="summary"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                >
                  {book.summary ? (
                    <p className="text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-loose opacity-80 text-justify font-nastaliq">
                      {book.summary}
                    </p>
                  ) : (
                    <p className="text-lg sm:text-xl opacity-60 font-nastaliq">خلاصہ دستیاب نہیں ہے۔</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'author' && (
                <motion.div 
                  key="author"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                >
                  {book.authorBio ? (
                    <p className="text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-loose opacity-80 text-justify font-nastaliq">
                      {book.authorBio}
                    </p>
                  ) : (
                    <p className="text-lg sm:text-xl opacity-60 font-nastaliq">مصنف کے بارے میں معلومات دستیاب نہیں ہیں۔</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'highlights' && (
                <motion.div 
                  key="highlights"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {recentHighlights.length === 0 ? (
                    <p className="text-lg sm:text-xl opacity-60 font-nastaliq py-4">کوئی ہائی لائٹ موجود نہیں ہے۔</p>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        {recentHighlights.map(h => {
                          const chapter = book.chapters.find(c => c.id === h.chapterId);
                          return (
                            <div key={h.id} className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[var(--bg-color)] border border-[var(--border-color)] hover:bg-[var(--text-color)]/5 transition-colors shadow-sm">
                              <p 
                                className="text-base sm:text-lg leading-relaxed opacity-90 mb-3 font-nastaliq" 
                                style={{ borderRight: `3px solid ${h.color}`, paddingRight: '12px' }}
                              >
                                {h.text}
                              </p>
                              {h.note && (
                                <p className="text-sm opacity-70 mb-4 bg-[var(--accent-color)]/5 p-2 rounded-lg border-r-2 border-[var(--accent-color)] font-nastaliq">
                                  {h.note}
                                </p>
                              )}
                              <div className="flex justify-between items-center text-xs sm:text-sm opacity-50 font-bold">
                                <span className="font-nastaliq text-sm sm:text-base">{chapter?.titleUrdu || chapter?.title}</span>
                                <span>{new Date(h.timestamp).toLocaleDateString('ur-PK')}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <button 
                        onClick={onShowHighlights}
                        className="w-full px-6 sm:px-8 py-3 sm:py-4 mt-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] font-nastaliq text-lg sm:text-xl font-bold hover:bg-[var(--text-color)]/5 transition-colors flex items-center justify-center gap-2 sm:gap-3 shadow-sm"
                      >
                        <Bookmark size={18} className="sm:w-5 sm:h-5" />
                        <span className="pt-1">ہائی لائٹس گیلری کھولیں</span>
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
