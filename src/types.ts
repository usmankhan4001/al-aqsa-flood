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
}

export interface Highlight {
  id: string;
  chapterId: string | number;
  text: string;
  color: string;
  note?: string;
  timestamp: number;
}

export interface AppState {
  currentChapterId: string | number | null;
  scrollProgress: Record<string, number>;
  theme: Theme;
  brightness: number;
  typography: TypographySettings;
  highlights: Highlight[];
}
