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
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm rounded-[2rem] p-8 shadow-2xl flex flex-col gap-10 border border-[var(--border-color)]/20"
        style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
      >
        {/* Brightness Section */}
        <div className="flex items-center gap-6 px-1">
          <Sun size={20} className="opacity-40" />
          <div className="flex-1 h-2 bg-[var(--text-color)]/5 rounded-full relative">
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

        {/* Divider */}
        <div className="h-px bg-[var(--text-color)]/5" />

        {/* Theme Section */}
        <div className="flex justify-between items-center px-2">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => updateState({ theme: t.id })}
              className={`w-11 h-11 rounded-full border-2 transition-all ${state.theme === t.id ? 'border-[var(--accent-color)] scale-110 shadow-lg' : 'border-[var(--text-color)]/10 hover:border-[var(--text-color)]/30'}`}
              style={{ backgroundColor: t.color }}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--text-color)]/5" />

        {/* Bottom Section: Line Height & Size */}
        <div className="flex items-center justify-between px-2">
          <div className="flex gap-8 items-center">
            {lineSpacings.map((spacing, idx) => (
              <button
                key={spacing}
                onClick={() => handleTypography({ lineSpacing: spacing })}
                className={`transition-colors ${state.typography.lineSpacing === spacing ? 'text-[var(--accent-color)]' : 'opacity-30'}`}
              >
                <div className="flex flex-col gap-0.5 items-center">
                  <div className="w-6 h-0.5 bg-current" style={{ marginBottom: `${idx * 2}px` }} />
                  <div className="w-6 h-0.5 bg-current" style={{ marginBottom: `${idx * 2}px` }} />
                  <div className="w-6 h-0.5 bg-current" />
                </div>
              </button>
            ))}
          </div>

          <div className="w-px h-10 bg-[var(--text-color)]/10 mx-4" />

          <div className="flex gap-10 items-center">
            <button
              onClick={() => handleTypography({ fontSize: Math.max(12, state.typography.fontSize - 4) })}
              className="opacity-40 hover:opacity-100 transition-colors flex items-center justify-center"
            >
              <span className="text-[18px] font-bold">A</span>
            </button>
            <button
              onClick={() => handleTypography({ fontSize: Math.min(48, state.typography.fontSize + 4) })}
              className="opacity-40 hover:opacity-100 transition-colors flex items-center justify-center font-bold"
            >
              <span className="text-[26px] font-bold">A</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
