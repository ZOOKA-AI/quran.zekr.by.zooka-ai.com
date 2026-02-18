import React, { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const currentPath = location.pathname.split('/').pop();
  const lastTapTime = useRef({});

  const handleNavClick = (e, item) => {
    const isActive = currentPath === item.path;
    
    if (isActive) {
      e.preventDefault();
      
      // Double-tap detection
      const now = Date.now();
      const lastTap = lastTapTime.current[item.id] || 0;
      
      if (now - lastTap < 300) {
        // Reset to root of current tab
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(createPageUrl(item.path), { replace: true });
      }
      
      lastTapTime.current[item.id] = now;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 shadow-lg z-40 safe-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.id}
              to={createPageUrl(item.path)}
              onClick={(e) => handleNavClick(e, item)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 h-1 w-12 bg-emerald-600 dark:bg-emerald-400 rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}