import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, BookMarked, Home, User, Clock, MessageSquare, Mic, Sparkles, Bell, Volume2 } from 'lucide-react';
import DailyReminders from '@/components/notifications/DailyReminders';

export default function Layout({ children, currentPageName }) {
  const navItems = [
    { name: 'الرئيسية', path: 'Quran', icon: Home },
    { name: 'التلاوة', path: 'Tilawa', icon: Volume2 },
    { name: 'الخطوط', path: 'Calligraphy', icon: Sparkles },
    { name: 'المقرئين', path: 'Reciters', icon: Mic },
    { name: 'المساعد الذكي', path: 'Assistant', icon: MessageSquare },
    { name: 'مواقيت الصلاة', path: 'PrayerTimes', icon: Clock },
    { name: 'التذكيرات', path: 'Notifications', icon: Bell },
    { name: 'المحفوظات', path: 'Bookmarks', icon: BookMarked },
    { name: 'الملف الشخصي', path: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Spiritual Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/70 via-white/80 to-emerald-100/70" />
      </div>
      <div className="relative z-10">
      <DailyReminders />
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
      <nav className="bg-white/90 backdrop-blur-xl border-b-2 border-emerald-200/50 shadow-lg sticky top-0 z-50">
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

            <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-xl p-4 mb-4 max-w-2xl mx-auto border border-purple-400/30">
              <p className="text-amber-300 text-xl font-bold mb-2">📢 باص إسلامي صدقة جارية</p>
              <a href="https://zaka.ai/" target="_blank" rel="noopener noreferrer" className="text-white text-lg hover:text-amber-300 transition-colors underline font-bold block mb-2">
                🌐 zaka.ai
              </a>
              <p className="text-emerald-100 text-sm mb-2">من مصر 🇪🇬 • نطاق .egypt</p>
              <p className="text-white font-bold">👍 اشتركوا في القناة</p>
            </div>

            <div className="bg-emerald-700/30 rounded-xl p-4 mb-6 max-w-2xl mx-auto">
              <p className="text-lg font-bold text-white mb-2">🤲 صدقة جارية لوجه الله تعالى</p>
              <p className="text-emerald-100 text-sm mb-3">تطبيق مجاني بالكامل - من المسلمين إلى المسلمين</p>
              
              <div className="border-t border-emerald-600/50 pt-3 mt-3">
                <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-lg p-3 mb-3 border border-emerald-500/30">
                  <p className="text-white text-base mb-2 font-arabic">✨ من دولة الإمارات العربية المتحدة 🇦🇪</p>
                  <p className="text-emerald-100 text-sm italic font-arabic">بلد الخير والعطاء • أرض التسامح والمحبة</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-3 mb-3 border border-purple-400/30">
                  <p className="text-amber-300 text-lg font-bold mb-1">🤖 ZOOKA-AI المرزوق</p>
                  <p className="text-white text-sm mb-1">مساعد التنفيذ الذكي</p>
                  <p className="text-emerald-100 text-xs italic">أول مشروع دعائي • تقنية الذكاء الاصطناعي في خدمة القرآن</p>
                </div>
                <p className="text-emerald-200 text-xs mb-1">المطورون: موسى وهارون بالإمارات 🇦🇪</p>
                <p className="text-emerald-200 text-xs mb-2">حفظ الملكية وتأمين كتاب الله وسنة رسوله</p>
                <p className="text-emerald-100 text-xs">من الفقراء لله المصريين 🇪🇬</p>
                
                <div className="border-t border-emerald-600/50 pt-3 mt-3">
                  <p className="text-amber-300 text-xs font-bold mb-1">🔐 المشرف العام الوحيد</p>
                  <a href="mailto:Zookaalmrzwq@gmail.com" className="text-emerald-100 text-xs hover:text-white transition-colors underline block mb-1">
                    Zookaalmrzwq@gmail.com
                  </a>
                  <a href="https://zaka.ai/" target="_blank" rel="noopener noreferrer" className="text-amber-300 text-xs hover:text-amber-200 transition-colors underline font-bold block mb-2">
                    🌐 zaka.ai
                  </a>
                  <p className="text-emerald-200 text-xs mt-1">مسؤول حماية المنصة والملكية الفكرية</p>
                  <p className="text-white text-xs font-bold mt-2">⚠️ جميع الحقوق محفوظة • ممنوع النسخ أو التعديل بدون إذن</p>
                </div>
              </div>
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
    </div>
  );
}