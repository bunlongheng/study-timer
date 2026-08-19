import type { ComponentType } from 'react';
import { BookOpen, Pencil, Hash, Puzzle, Palette, Music, Gamepad2 } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export interface Mode {
  id: string;
  name: string;
  icon: ComponentType<LucideProps>;
  color: string;
  bgColor: string;
}

// Radius of the SVG progress ring (see TimerCircle) - drives CIRCUMFERENCE below.
export const RADIUS = 85;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const MODES: Mode[] = [
  { id: 'reading', name: 'Reading', icon: BookOpen, color: '#4A9FF5', bgColor: '#5AB2FF' },
  { id: 'writing', name: 'Writing', icon: Pencil, color: '#F89057', bgColor: '#FF9A6C' },
  { id: 'math', name: 'Math', icon: Hash, color: '#D946EF', bgColor: '#E879F9' },
  { id: 'puzzle', name: 'Puzzle', icon: Puzzle, color: '#9B7EDE', bgColor: '#B494FF' },
  { id: 'art', name: 'Art', icon: Palette, color: '#EAB308', bgColor: '#FDE047' },
  { id: 'music', name: 'Music', icon: Music, color: '#5FD68A', bgColor: '#75E89D' },
  { id: 'game', name: 'Game', icon: Gamepad2, color: '#FF6B9D', bgColor: '#FF8FB3' },
];

export const DEFAULT_ENABLED_MODE_IDS = ['reading', 'writing', 'math', 'puzzle', 'art'];

export const DEFAULT_SESSION_DURATION = 900;
export const DEFAULT_USER_NAME = import.meta.env.VITE_USER_NAME ?? 'Norden Heng';

export const SESSION_DURATION_OPTIONS = [
  { value: 5, label: '5 seconds (test)' },
  { value: 60, label: '1 minute' },
  { value: 300, label: '5 minutes' },
  { value: 900, label: '15 minutes' },
];

export const STORAGE_KEYS = {
  completedModes: 'study-timer:completedModes',
  userName: 'study-timer:userName',
  sessionDuration: 'study-timer:sessionDuration',
  isDarkMode: 'study-timer:isDarkMode',
  enabledModeIds: 'study-timer:enabledModeIds',
} as const;
