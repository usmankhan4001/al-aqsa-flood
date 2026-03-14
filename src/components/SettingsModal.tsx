import React from 'react';
import { AppState, Theme, Book } from '../types';
import { 
  Sun, List, AlignJustify, X
} from 'lucide-react';
import { motion } from 'motion/react';

export function SettingsModal({ state, updateState, onClose }: { state: AppState, updateState: any, onClose: () => void }) {
  const handleTypography = (updates: Partial<AppState['typography']>) => {
    updateState({ typography: { ...state.typography, ...updates } });
  };

  const themes: { id: Theme, color: string }[] = [
    { id: 'midnight', color: '#0f172a' },
    { id: 'dark', color: '#121212' },
    { id: 'sepia', color: '#f4ecd8' },
    { id: 'paper', color: '#fdfbf7' },
    { id: 'light', color: '#ffffff' },
  ];

  const lineSpacings = [1.2, 1.6, 2.0];

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center">
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
        className="relative w-full max-w-2xl rounded-t-[2.5rem] p-8 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col gap-10 bg-[var(--bg-color)] border-t border-[var(--border-color)]"
      >
        <div className="flex justify-between items-center px-1">
          <div className="flex flex-col">
            <h2 className="text-2xl font-nastaliq font-bold">مطالعہ کی ترتیبات</h2>
            <p className="text-xs opacity-40 font-nastaliq mt-1">اپنے مطالعے کے تجربے کو بہتر بنائیں</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-[var(--text-color)]/10 transition-colors active:scale-95">
            <X size={24} />
          </button>
        </div>

        {/* Brightness Section */}
        <div className="flex items-center gap-6 px-4 py-6 bg-[var(--text-color)]/5 rounded-3xl">
          <Sun size={20} className="opacity-40" />
          <div className="flex-1 h-1.5 bg-[var(--text-color)]/10 rounded-full relative">
            <input 
              type="range" 
              min="0.2" max="1" step="0.05"
              value={state.brightness}
              onChange={(e) => updateState({ brightness: parseFloat(e.target.value) })}
              className="absolute inset-0 w-full h-full appearance-none bg-transparent accent-[var(--accent-color)] cursor-pointer"
            />
          </div>
          <Sun size={24} className="opacity-80" />
        </div>

        {/* Theme Section */}
        <div className="grid grid-cols-5 gap-4 px-2">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => updateState({ theme: t.id })}
              className={`w-full aspect-square rounded-2xl border-2 transition-all flex items-center justify-center ${state.theme === t.id ? 'border-[var(--accent-color)] scale-105 shadow-md' : 'border-[var(--border-color)] hover:border-[var(--text-color)]/30'}`}
              style={{ backgroundColor: t.color }}
            >
              {state.theme === t.id && (
                <div className="w-2 h-2 rounded-full bg-[var(--accent-color)]" />
              )}
            </button>
          ))}
        </div>

        {/* Typography Controls */}
        <div className="flex items-center justify-between px-2 py-4 border-t border-[var(--border-color)]/20">
          <div className="flex gap-10 items-center">
            {lineSpacings.map((spacing, idx) => (
              <button
                key={spacing}
                onClick={() => handleTypography({ lineSpacing: spacing })}
                className={`transition-all ${state.typography.lineSpacing === spacing ? 'text-[var(--accent-color)] scale-110' : 'opacity-20'}`}
              >
                <div className="flex flex-col gap-1 items-center">
                  <div className="w-7 h-0.5 bg-current" />
                  <div className="w-7 h-0.5 bg-current" style={{ margin: `2px 0` }} />
                  <div className="w-7 h-0.5 bg-current" />
                </div>
              </button>
            ))}
          </div>

          <div className="w-px h-8 bg-[var(--border-color)] mx-4" />

          <div className="flex gap-12 items-center">
            <button
              onClick={() => handleTypography({ fontSize: Math.max(12, state.typography.fontSize - 4) })}
              className="opacity-40 hover:opacity-100 transition-all active:scale-90"
            >
              <span className="text-xl font-bold">A</span>
            </button>
            <button
              onClick={() => handleTypography({ fontSize: Math.min(48, state.typography.fontSize + 4) })}
              className="opacity-40 hover:opacity-100 transition-all active:scale-90"
            >
              <span className="text-3xl font-bold">A</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
