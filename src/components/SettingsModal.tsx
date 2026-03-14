import React from 'react';
import { AppState, Theme, Book } from '../types';
import { 
  X, Sun, Moon, Type, AlignLeft, AlignRight, AlignCenter, AlignJustify,
  Headphones, Bookmark, Settings as SettingsIcon, ChevronRight, ChevronLeft,
  Volume2, VolumeX, Minus, Plus
} from 'lucide-react';
import { motion } from 'motion/react';

export function SettingsModal({ book, state, updateState, onClose }: { book: Book, state: AppState, updateState: any, onClose: () => void }) {
  const currentChapter = book.chapters.find(c => c.id === state.currentChapterId) || book.chapters[0];

  const handleTypography = (updates: Partial<AppState['typography']>) => {
    updateState({ typography: { ...state.typography, ...updates } });
  };

  const themes: { id: Theme, color: string }[] = [
    { id: 'light', color: '#ffffff' },
    { id: 'sepia', color: '#f4ecd8' },
    { id: 'oasis', color: '#eef2eb' },
    { id: 'midnight', color: '#0f172a' },
  ];

  const fontSizes = [16, 20, 24];

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose} 
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
        className="relative w-full max-w-sm glass rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-8 border border-white/20"
        style={{ color: 'var(--text-color)' }}
      >
        {/* Top Icon Bar */}
        <div className="flex justify-between items-center px-2">
          <button 
            onClick={() => updateState({ audioEnabled: !state.audioEnabled })}
            className={`p-4 rounded-full transition-all ${state.audioEnabled ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)]' : 'bg-transparent opacity-60'}`}
          >
            <Headphones size={24} />
          </button>
          
          <button className="p-2 opacity-60"><Moon size={22} /></button>
          <button className="p-2 opacity-60"><Bookmark size={22} /></button>
          <button className="p-2 opacity-60 text-[var(--accent-color)]"><SettingsIcon size={22} /></button>
        </div>

        {/* Chapters Selector */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold opacity-60 px-1 font-nastaliq">ابواب (Chapters)</label>
          <div className="relative group">
            <select 
              value={state.currentChapterId || ""}
              onChange={(e) => updateState({ currentChapterId: e.target.value })}
              className="w-full appearance-none bg-[var(--text-color)]/5 border border-white/10 py-4 px-6 rounded-2xl font-nastaliq text-lg outline-none cursor-pointer focus:ring-2 ring-[var(--accent-color)]/20"
            >
              {book.chapters.map(c => (
                <option key={c.id} value={c.id}>{c.titleUrdu || c.title}</option>
              ))}
            </select>
            <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
              <ChevronLeft size={18} />
            </div>
          </div>
        </div>

        {/* Text Size & Scrolling */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-bold opacity-60 font-nastaliq">تحریر کا حجم</label>
            <div className="flex items-center gap-6">
              {fontSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleTypography({ fontSize: size })}
                  className={`transition-all ${state.typography.fontSize === size ? 'text-[var(--accent-color)] scale-125' : 'opacity-30 hover:opacity-100'}`}
                >
                  <span style={{ fontSize: `${size * 0.8}px` }} className="font-bold">A</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 items-end">
            <label className="text-sm font-bold opacity-60 font-nastaliq">اسکرولنگ</label>
            <button 
               onClick={() => updateState({ scrolling: !state.scrolling })}
               className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${state.scrolling ? 'bg-[var(--accent-color)]' : 'bg-slate-300'}`}
            >
               <motion.div 
                 animate={{ x: state.scrolling ? 24 : 0 }}
                 className="w-6 h-6 bg-white rounded-full shadow-sm"
               />
            </button>
          </div>
        </div>

        {/* Alignment & Spacing */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              {[
                { id: 'right', icon: AlignRight },
                { id: 'center', icon: AlignCenter },
                { id: 'left', icon: AlignLeft },
                { id: 'justify', icon: AlignJustify }
              ].map((align) => (
                <button
                  key={align.id}
                  onClick={() => handleTypography({ alignment: align.id as any })}
                  className={`p-2 rounded-lg transition-all ${state.typography.alignment === align.id ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]' : 'opacity-30'}`}
                >
                  <align.icon size={20} />
                </button>
              ))}
            </div>

            <div className="flex gap-3">
               {[1, 2, 3].map((i) => (
                  <button 
                     key={i}
                     onClick={() => handleTypography({ indent: i })}
                     className={`w-6 h-6 border-2 rounded transition-all ${state.typography.indent === i ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10' : 'border-[var(--text-color)]/20'}`}
                  />
               ))}
            </div>
          </div>
        </div>

        {/* Brightness Slider */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-6 bg-[var(--text-color)]/5 p-2 rounded-full border border-white/10">
            <Sun size={16} className="opacity-30 mr-2" />
            <input 
              type="range" 
              min="0.2" max="1" step="0.05"
              value={state.brightness}
              onChange={(e) => updateState({ brightness: parseFloat(e.target.value) })}
              className="flex-1 h-1 rounded-full appearance-none bg-[var(--text-color)]/10 accent-[var(--accent-color)] outline-none"
            />
            <Sun size={20} className="opacity-60 ml-2" />
          </div>
        </div>

        {/* Theme Dots */}
        <div className="flex justify-center gap-4">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => updateState({ theme: t.id })}
              className={`w-10 h-10 rounded-full border-2 transition-all ${state.theme === t.id ? 'border-[var(--accent-color)] scale-110 shadow-lg' : 'border-transparent shadow-sm'}`}
              style={{ backgroundColor: t.color }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
