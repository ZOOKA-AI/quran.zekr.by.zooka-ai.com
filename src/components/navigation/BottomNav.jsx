import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, BookOpen, Radio, Users, User } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'الرئيسية', path: 'Quran', icon: Home },
  { id: 'tilawa', label: 'التلاوة', path: 'Tilawa', icon: BookOpen },
  { id: 'radio', label: 'الإذاعة', path: 'QuranRadio', icon: Radio },
  { id: 'community', label: 'المجتمع', path: 'Community', icon: Users },
  { id: 'profile', label: 'حسابي', path: 'Profile', icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 safe-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.id}
              to={createPageUrl(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-emerald-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 h-1 w-12 bg-emerald-600 rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}