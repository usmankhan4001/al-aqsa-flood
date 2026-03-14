import { useState, useEffect } from 'react';
import { AppState } from '../types';

const DEFAULT_STATE: AppState = {
  currentChapterId: null,
  scrollProgress: {},
  theme: 'paper',
  brightness: 1,
  typography: {
    fontSize: 20,
    lineHeight: 1.8,
    paragraphSpacing: 24,
    fontFamily: 'nastaliq',
    alignment: 'right',
    indent: 0,
    lineSpacing: 2,
  },
  highlights: [],
  scrolling: true,
  audioEnabled: false,
  activeView: 'library',
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('appState');
    return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : DEFAULT_STATE;
  });

  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return { state, updateState };
}
