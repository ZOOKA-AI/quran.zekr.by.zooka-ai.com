/**
 * Navigation configuration for the application
 * This file contains all navigation items and is 1:1 compatible with Next.js migration
 */

import {
  Home,
  Volume2,
  Mic,
  MessageSquare,
  Trophy,
  Mail,
  Palette,
  Sparkles,
  Library,
  BookOpen,
} from 'lucide-react';

export type NavItem = {
  name: string;
  path: string;
  icon: React.ElementType;
  color: string;
};

export type QuickAction = {
  name: string;
  surah: number;
  gradient: string;
};

/**
 * Main navigation items shown in the side menu
 */
export const MAIN_NAV: NavItem[] = [
  { name: 'الرئيسية', path: 'Quran', icon: Home, color: 'text-emerald-600' },
  { name: 'التلاوة', path: 'Tilawa', icon: Volume2, color: 'text-blue-600' },
  { name: 'المقرئين', path: 'Reciters', icon: Mic, color: 'text-purple-600' },
  { name: 'المجتمع', path: 'Community', icon: MessageSquare, color: 'text-pink-600' },
  { name: 'المكافآت', path: 'Rewards', icon: Trophy, color: 'text-amber-600' },
  { name: 'الرسائل', path: 'Messages', icon: Mail, color: 'text-blue-600' },
  { name: 'الخطوط', path: 'Calligraphy', icon: Palette, color: 'text-teal-600' },
  { name: 'المساعد', path: 'Assistant', icon: Sparkles, color: 'text-indigo-600' },
  { name: 'المكتبة', path: 'Library', icon: Library, color: 'text-rose-600' },
];

/**
 * Quick action shortcuts to popular surahs
 */
export const QUICK_ACTIONS: QuickAction[] = [
  { name: 'الفاتحة', surah: 1, gradient: 'from-emerald-500 to-green-600' },
  { name: 'الكهف', surah: 18, gradient: 'from-purple-500 to-pink-600' },
  { name: 'يس', surah: 36, gradient: 'from-amber-500 to-orange-600' },
  { name: 'الملك', surah: 67, gradient: 'from-teal-500 to-cyan-600' },
];

/**
 * Quran statistics for display
 */
export const QURAN_STATS = [
  { value: 114, label: 'سورة', gradient: 'from-emerald-50 to-emerald-100', color: 'emerald' },
  { value: 30, label: 'جزء', gradient: 'from-amber-50 to-amber-100', color: 'amber' },
  { value: 6236, label: 'آية', gradient: 'from-blue-50 to-blue-100', color: 'blue' },
  { value: 604, label: 'صفحة', gradient: 'from-purple-50 to-purple-100', color: 'purple' },
];
