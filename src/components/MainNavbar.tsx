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
    <nav id="bottom-navigation" className="sticky-bottom-nav border-t border-[var(--border-color)]">
      <div className="flex items-center justify-around h-14 sm:h-16 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              id={`nav-${item.id}-button`}
              onClick={() => onViewChange(item.id as any)}
              className={`relative flex-1 flex flex-col items-center justify-center py-1 transition-all duration-300 ${isActive ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)]/60 hover:text-[var(--text-color)]/90'}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-nastaliq font-bold tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[var(--accent-color)] rounded-b-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
