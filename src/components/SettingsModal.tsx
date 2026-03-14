import React from 'react';
import { AppState, Theme, Book } from '../types';
import { 
  Sun, AlignLeft, AlignCenter, AlignRight, AlignJustify, X
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

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-4" dir="ltr">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} 
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
        className="relative w-full max-w-sm bg-[#0a0f1e] rounded-[2rem] p-8 shadow-2xl flex flex-col gap-10 border border-white/5"
      >
        {/* Brightness Section */}
        <div className="flex items-center gap-6 px-1">
          <Sun size={20} className="text-[#8e9aaf]" />
          <div className="flex-1 h-2 bg-[#1e293b] rounded-full relative">
            <input 
              type="range" 
              min="0.2" max="1" step="0.05"
              value={state.brightness}
              onChange={(e) => updateState({ brightness: parseFloat(e.target.value) })}
              className="absolute inset-0 w-full h-full appearance-none bg-transparent accent-[#cbd5e1] cursor-pointer"
            />
          </div>
          <Sun size={24} className="text-[#cbd5e1]" />
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5" />

        {/* Theme Section */}
        <div className="flex justify-between items-center px-2">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => updateState({ theme: t.id })}
              className={`w-12 h-12 rounded-full border-2 transition-all ${state.theme === t.id ? 'border-[#38bdf8] scale-110' : 'border-white/10 hover:border-white/30'}`}
              style={{ backgroundColor: t.color }}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5" />

        {/* Bottom Section: Alignment & Size */}
        <div className="flex items-center justify-between px-2">
          <div className="flex gap-8 items-center">
            <button
              onClick={() => handleTypography({ alignment: 'left' })}
              className={`transition-colors ${state.typography.alignment === 'left' ? 'text-[#38bdf8]' : 'text-white/40'}`}
            >
              <AlignLeft size={28} />
            </button>
            <button
              onClick={() => handleTypography({ alignment: 'center' })}
              className={`transition-colors ${state.typography.alignment === 'center' ? 'text-[#38bdf8]' : 'text-white/40'}`}
            >
              <AlignCenter size={28} />
            </button>
            <button
              onClick={() => handleTypography({ alignment: 'right' })}
              className={`transition-colors ${state.typography.alignment === 'right' ? 'text-[#38bdf8]' : 'text-white/40'}`}
            >
              <AlignRight size={28} />
            </button>
          </div>

          <div className="w-px h-10 bg-white/10 mx-4" />

          <div className="flex gap-10 items-center">
            <button
              onClick={() => handleTypography({ fontSize: Math.max(12, state.typography.fontSize - 4) })}
              className="text-white/40 hover:text-white transition-colors flex items-center justify-center"
            >
              <span className="text-[20px] font-bold">A</span>
            </button>
            <button
              onClick={() => handleTypography({ fontSize: Math.min(48, state.typography.fontSize + 4) })}
              className="text-white/40 hover:text-white transition-colors flex items-center justify-center font-bold"
            >
              <span className="text-[28px] font-bold">A</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
