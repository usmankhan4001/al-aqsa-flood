export interface Chapter {
  id: string | number;
  title?: string;
  titleUrdu?: string;
  titleEnglish?: string;
  content: string;
}

export interface Book {
  title: string;
  author: string;
  summary?: string;
  authorBio?: string;
  releaseDate?: string;
  rating?: number;
  chapters: Chapter[];
}

export type Theme = 'light' | 'dark' | 'sepia' | 'midnight' | 'oasis' | 'paper';

export interface TypographySettings {
  fontSize: number;
  lineHeight: number;
  paragraphSpacing: number;
  fontFamily: 'sans' | 'serif' | 'nastaliq' | 'arabic';
  alignment: 'right' | 'left' | 'center' | 'justify';
  indent: number;
  lineSpacing: number; // 1-4 scale
}

export interface Highlight {
  id: string;
  chapterId: string | number;
  text: string;
  color: string;
  note?: string;
  timestamp: number;
  startOffset?: number;
  endOffset?: number;
}

export interface AppState {
  currentChapterId: string | number | null;
  scrollProgress: Record<string, number>;
  theme: Theme;
  brightness: number;
  typography: TypographySettings;
  highlights: Highlight[];
  scrolling: boolean; // toggle for scrolling vs paging
  audioEnabled: boolean;
  activeView: 'library' | 'reader' | 'highlights' | 'notes' | 'studio';
  returnToView?: 'library' | 'reader';
  seenWalkthroughs: {
    library: boolean;
    reader: boolean;
    highlights: boolean;
    notes: boolean;
    studio: boolean;
  };
}
