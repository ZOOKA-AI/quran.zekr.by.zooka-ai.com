import React from 'react';
import { BookOpen } from 'lucide-react';

export default function AppLogo({ size = 'md', showTagline = true }) {
  const sizes = {
    sm: { icon: 'w-8 h-8', iconInner: 'w-4 h-4', title: 'text-lg', tagline: 'text-xs' },
    md: { icon: 'w-12 h-12', iconInner: 'w-6 h-6', title: 'text-2xl', tagline: 'text-sm' },
    lg: { icon: 'w-16 h-16', iconInner: 'w-8 h-8', title: 'text-3xl', tagline: 'text-base' },
    xl: { icon: 'w-20 h-20', iconInner: 'w-10 h-10', title: 'text-4xl', tagline: 'text-lg' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-3">
      {/* أيقونة الشعار */}
      <div className={`${s.icon} relative`}>
        {/* الخلفية المتدرجة */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl shadow-lg transform rotate-3" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl shadow-xl" />
        
        {/* الأيقونة */}
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className={`${s.iconInner} text-white drop-shadow-md`} />
        </div>
        
        {/* التأثير اللامع */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl" />
        
        {/* النجمة الذهبية */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
          <span className="text-[8px]">✦</span>
        </div>
      </div>

      {/* النص */}
      <div className="flex flex-col">
        <h1 className={`${s.title} font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-700 bg-clip-text text-transparent`}>
          القرآن الكريم
        </h1>
        {showTagline && (
          <p className={`${s.tagline} text-emerald-600/80 font-medium -mt-1`}>
            كتاب الله المبين
          </p>
        )}
      </div>
    </div>
  );
}