import { AppState, Theme } from '../types';
import { X, Sun, Moon, Type, AlignLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function SettingsModal({ state, updateState, onClose }: { state: AppState, updateState: any, onClose: () => void }) {
  const themes: { id: Theme, name: string, bg: string, text: string, border: string }[] = [
    { id: 'light', name: 'روشن', bg: '#ffffff', text: '#1a1a1a', border: '#e5e7eb' },
    { id: 'dark', name: 'تاریک', bg: '#121212', text: '#e5e5e5', border: '#2d2d2d' },
    { id: 'sepia', name: 'سیپیا', bg: '#f4ecd8', text: '#433422', border: '#e2d5b8' },
    { id: 'midnight', name: 'آدھی رات', bg: '#0f172a', text: '#cbd5e1', border: '#1e293b' },
    { id: 'oasis', name: 'نخلستان', bg: '#eef2eb', text: '#2c3e2d', border: '#d1d9ce' },
    { id: 'paper', name: 'کاغذ', bg: '#fdfbf7', text: '#333333', border: '#e2e8f0' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6" dir="rtl">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
        style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-nastaliq font-bold tracking-wide">پڑھنے کی ترتیبات</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--text-color)]/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Theme */}
        <div className="mb-8">
          <label className="text-sm font-bold tracking-widest opacity-50 mb-4 block font-nastaliq">تھیم</label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => updateState({ theme: t.id })}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 ${state.theme === t.id ? 'ring-2 ring-[var(--accent-color)] ring-offset-2 ring-offset-[var(--bg-color)] scale-105' : 'hover:scale-105'}`}
                style={{ backgroundColor: t.bg, color: t.text, border: `1px solid ${t.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              >
                <div className="text-sm font-medium tracking-wide font-nastaliq">{t.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Brightness */}
        <div className="mb-8">
          <label className="text-sm font-bold tracking-widest opacity-50 mb-4 flex justify-between font-nastaliq">
            <span>روشنی</span>
            <span className="font-sans">{Math.round(state.brightness * 100)}%</span>
          </label>
          <div className="flex items-center gap-4 bg-[var(--text-color)]/5 p-4 rounded-2xl">
            <Moon size={18} className="opacity-50" />
            <input 
              type="range" 
              min="0.2" max="1" step="0.05"
              value={state.brightness}
              onChange={(e) => updateState({ brightness: parseFloat(e.target.value) })}
              className="w-full h-2 rounded-full appearance-none bg-[var(--text-color)]/20 accent-[var(--accent-color)] outline-none"
            />
            <Sun size={18} className="opacity-50" />
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-6">
          {[
            { label: 'حجم', icon: Type, value: state.typography.fontSize, unit: 'px', min: 12, max: 48, step: 1, key: 'fontSize' },
            { label: 'سطر کی اونچائی', icon: AlignLeft, value: state.typography.lineHeight, unit: '', min: 1.2, max: 3, step: 0.1, key: 'lineHeight' }
          ].map((slider) => (
            <div key={slider.key}>
              <label className="text-sm font-bold tracking-widest opacity-50 mb-3 flex justify-between font-nastaliq">
                <span className="flex items-center gap-2"><slider.icon size={14}/> {slider.label}</span>
                <span className="font-sans">{slider.value}{slider.unit}</span>
              </label>
              <input 
                type="range" min={slider.min} max={slider.max} step={slider.step}
                value={slider.value}
                onChange={(e) => updateState({ typography: { ...state.typography, [slider.key]: parseFloat(e.target.value) } })}
                className="w-full h-2 rounded-full appearance-none bg-[var(--text-color)]/10 accent-[var(--accent-color)] outline-none"
              />
            </div>
          ))}
        </div>

      </motion.div>
    </div>
  );
}
