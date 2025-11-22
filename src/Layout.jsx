import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, BookMarked, Home, User, Clock, MessageSquare, Mic, Sparkles } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const navItems = [
    { name: 'الرئيسية', path: 'Quran', icon: Home },
    { name: 'الخطوط', path: 'Calligraphy', icon: Sparkles },
    { name: 'المقرئين', path: 'Reciters', icon: Mic },
    { name: 'المساعد الذكي', path: 'Assistant', icon: MessageSquare },
    { name: 'مواقيت الصلاة', path: 'PrayerTimes', icon: Clock },
    { name: 'المحفوظات', path: 'Bookmarks', icon: BookMarked },
    { name: 'الملف الشخصي', path: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50" dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800&display=swap');
        
        * {
          font-family: 'Cairo', sans-serif;
        }
        
        .font-arabic {
          font-family: 'Amiri', serif;
          line-height: 2.5;
        }
        
        .font-urdu {
          font-family: 'Noto Nastaliq Urdu', serif;
        }
        
        :root {
          --emerald-50: #ecfdf5;
          --emerald-600: #059669;
          --emerald-700: #047857;
          --emerald-800: #065f46;
          --amber-300: #fcd34d;
        }
      `}</style>

      {/* Navigation */}
      <nav className="bg-white border-b-2 border-emerald-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl('Quran')} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-emerald-700">القرآن الكريم</span>
            </Link>
            
            <div className="flex gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.path;
                return (
                  <Link key={item.path} to={createPageUrl(item.path)}>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-emerald-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-2xl mb-4 font-arabic">﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾</p>
            <p className="text-emerald-200 mb-6">اللهم اجعلنا من أهل القرآن وخاصته</p>
            <div className="bg-emerald-700/30 rounded-xl p-4 mb-6 max-w-2xl mx-auto">
              <p className="text-lg font-bold text-white mb-2">🤲 صدقة جارية لوجه الله تعالى</p>
              <p className="text-emerald-100 text-sm">تطبيق مجاني بالكامل - من المسلمين إلى المسلمين</p>
            </div>
            <div className="flex justify-center gap-8 text-sm text-emerald-300">
              <span>© 2024 القرآن الكريم</span>
              <span>•</span>
              <span>منصة إسلامية متكاملة</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}