import React from 'react';
import { BookOpen, Bookmark, StickyNote, Camera, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { AppState } from '../types';

interface MainNavbarProps {
  activeView: AppState['activeView'];
  onViewChange: (view: AppState['activeView']) => void;
}

export const MainNavbar: React.FC<MainNavbarProps> = ({ activeView, onViewChange }) => {
  const items = [
    { id: 'library', label: 'لائبریری', icon: Home },
    { id: 'highlights', label: 'ہائی لائٹس', icon: Bookmark },
    { id: 'notes', label: 'نوٹس', icon: StickyNote },
    { id: 'studio', label: 'کوٹ اسٹوڈیو', icon: Camera },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[90] pb-safe">
      <div className="mx-auto max-w-lg mb-4 px-4">
        <div className="glass px-2 py-2 rounded-full flex items-center justify-between border border-white/10 shadow-2xl">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as any)}
                className={`relative flex-1 flex flex-col items-center py-2 transition-all duration-300 ${isActive ? 'text-[var(--accent-color)]' : 'opacity-50 hover:opacity-80'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navTab"
                    className="absolute inset-0 bg-[var(--accent-color)]/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={20} className={isActive ? 'scale-110' : 'scale-100'} />
                <span className="text-[10px] sm:text-xs mt-1 font-nastaliq font-bold uppercase tracking-tighter">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeDot"
                    className="w-1 h-1 bg-[var(--accent-color)] rounded-full mt-0.5"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
