import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, BookMarked, Home, User, Clock, MessageSquare, Mic, Sparkles, Bell, Volume2, Menu, Settings, Music, Library, Palette, LogOut, Trophy, Mail, Heart, Moon, Sun, Radio, AudioLines, AlarmClock, FileText, Info, Shield, Youtube, Share2, Trash2 } from 'lucide-react';
import DailyReminders from '@/components/notifications/DailyReminders';
import { AuthProvider } from '@/components/AuthProvider';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import OfflineIndicator from '@/components/pwa/OfflineIndicator';
import PWAInstaller from '@/components/pwa/PWAInstaller';
import ClassicAudioPlayer, { PlayerProvider } from '@/components/player/ClassicAudioPlayer';
import FloatingAudioControl from '@/components/controls/FloatingAudioControl';
import { GlobalQuranPlayerProvider } from '@/components/player/GlobalQuranPlayerContext';
import GlobalQuranPlayer from '@/components/player/GlobalQuranPlayer';
import SocialLinks from '@/components/social/SocialLinks';
import AppLogo from '@/components/brand/AppLogo';
import AutoRefreshButton from '@/components/controls/AutoRefreshButton';
import BottomNav from '@/components/navigation/BottomNav';
import { Button } from '@/components/ui/button';
import { Link as RouterLink } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { base44 } from '@/api/base44Client';

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState('ar');
  
  // Safe Area support for mobile devices
  React.useEffect(() => {
    // Add viewport meta for safe area
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no');
    }
    
    // Add CSS variables for safe area insets
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --safe-area-inset-top: env(safe-area-inset-top);
        --safe-area-inset-right: env(safe-area-inset-right);
        --safe-area-inset-bottom: env(safe-area-inset-bottom);
        --safe-area-inset-left: env(safe-area-inset-left);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const navItems = [
    { name: 'الرئيسية', path: 'Quran', icon: Home, color: 'text-emerald-600' },
    { name: 'التلاوة', path: 'Tilawa', icon: Volume2, color: 'text-blue-600' },
    { name: 'المقرئين', path: 'Reciters', icon: Mic, color: 'text-purple-600' },
    { name: 'رمضان', path: 'Ramadan', icon: Moon, color: 'text-purple-600' },
    { name: 'الأذكار', path: 'Athkar', icon: Sun, color: 'text-cyan-600' },
    { name: 'القنوات', path: 'Channels', icon: Youtube, color: 'text-red-600' },
    { name: 'الإذاعة', path: 'QuranRadio', icon: Radio, color: 'text-indigo-600' },
    { name: 'التواشيح', path: 'Tawasheeh', icon: Music, color: 'text-amber-600' },
    { name: 'الابتهالات', path: 'Ibtihaalat', icon: AudioLines, color: 'text-orange-600' },
    { name: 'المؤذن', path: 'Muathin', icon: AlarmClock, color: 'text-teal-600' },
    { name: 'الأيتام', path: 'Orphans', icon: Heart, color: 'text-red-600' },
    { name: 'المجتمع', path: 'Community', icon: MessageSquare, color: 'text-pink-600' },
    { name: 'المكافآت', path: 'Rewards', icon: Trophy, color: 'text-amber-600' },
    { name: 'المساعد', path: 'Assistant', icon: Sparkles, color: 'text-indigo-600' },
    { name: 'المكتبة', path: 'Library', icon: Library, color: 'text-rose-600' },
    { name: 'المشاركات', path: 'ShareLibrary', icon: Share2, color: 'text-cyan-600' },
    ];

  const handleLogout = async () => {
    await base44.auth.logout();
    setSidebarOpen(false);
  };

  return (
    <AuthProvider>
      <GlobalQuranPlayerProvider>
      <PlayerProvider>
      <div className="min-h-screen relative overflow-hidden bg-white dark:bg-slate-950" dir="rtl">
      {/* Islamic Spiritual Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/90 to-emerald-50/95" />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, transparent 0%, rgba(16, 185, 129, 0.3) 100%),
                            radial-gradient(circle at 80% 80%, transparent 0%, rgba(6, 182, 212, 0.3) 100%)`
          }}
        />
      </div>
      <div className="relative z-10">
      <OfflineIndicator />
      <InstallPrompt />
      <PWAInstaller />
      <DailyReminders />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800&family=Scheherazade+New:wght@400;700&display=swap');
        
        * {
          font-family: 'Cairo', sans-serif;
        }
        
        .font-arabic {
          font-family: 'Scheherazade New', 'Amiri', serif;
          line-height: 2.8;
          letter-spacing: 0.02em;
        }
        
        .font-spiritual {
          font-family: 'Amiri', serif;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .islamic-pattern {
          background-image: 
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(16, 185, 129, 0.03) 35px, rgba(16, 185, 129, 0.03) 70px),
            repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(6, 182, 212, 0.03) 35px, rgba(6, 182, 212, 0.03) 70px);
        }
        
        :root {
          --emerald-50: #ecfdf5;
          --emerald-600: #059669;
          --emerald-700: #047857;
          --emerald-800: #065f46;
          --amber-300: #fcd34d;
          --gold: #fbbf24;
        }
      `}</style>

      {/* Islamic Logo Badge */}
      <div className="fixed top-24 left-6 z-50 safe-top safe-left">
        <div className="relative group">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-center overflow-hidden">
            {/* Golden Pattern Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle, rgba(251, 191, 36, 0.5) 1px, transparent 1px)`,
                backgroundSize: '8px 8px'
              }} />
            </div>
            {/* Icon Content */}
            <div className="relative z-10 text-center">
              <BookOpen className="w-10 h-10 text-amber-400 mb-1 mx-auto drop-shadow-lg" />
              <div className="text-amber-400 text-xs font-bold font-arabic">القرآن</div>
            </div>
          </div>
          {/* Hover Tooltip */}
          <div className="absolute left-24 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-gradient-to-r from-slate-900 to-black text-amber-300 px-4 py-2 rounded-lg shadow-xl border border-amber-400/50 whitespace-nowrap">
              <p className="font-bold text-sm">📖 تطبيق القرآن الكريم</p>
              <p className="text-xs text-amber-200 mt-1">القراءة • الاستماع • التدبر</p>
            </div>
          </div>
        </div>
      </div>

      {/* Language Toggle */}
      <Button
        onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        size="sm"
        className="fixed top-6 left-6 z-50 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-2xl safe-top safe-left"
      >
        {language === 'ar' ? '🌍 English' : '🌍 عربي'}
      </Button>

      {/* Floating Menu Button */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed top-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 shadow-2xl border-2 border-amber-400/50 safe-top safe-right"
          >
            <Menu className="w-7 h-7 text-white drop-shadow-lg" />
          </Button>
        </SheetTrigger>
        
        <SheetContent side="right" className="w-96 overflow-y-auto islamic-pattern">
          <SheetHeader className="border-b-2 border-amber-400/30 pb-4 mb-4">
            <SheetTitle className="flex items-center gap-3 text-2xl">
              <AppLogo size="md" showTagline={false} />
            </SheetTitle>
            <p className="text-center font-arabic text-emerald-700 text-lg">
              ﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾
            </p>
          </SheetHeader>

          <div className="mt-8 space-y-6">
            {/* Main Navigation */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-2">الصفحات الرئيسية</h3>
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.path;
                  return (
                    <Link key={item.path} to={createPageUrl(item.path)} onClick={() => setSidebarOpen(false)}>
                      <div className={`flex items-center gap-3 p-4 rounded-xl transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300' 
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isActive ? 'bg-white shadow-sm' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-600'}`} />
                        </div>
                        <span className={`font-bold ${isActive ? 'text-emerald-700' : 'text-gray-700'}`}>
                          {item.name}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-2">إجراءات سريعة</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link to={createPageUrl('SurahView?surah=1')} onClick={() => setSidebarOpen(false)}>
                  <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl text-white hover:opacity-90 transition-opacity cursor-pointer">
                    <BookOpen className="w-6 h-6 mb-2" />
                    <p className="font-bold text-sm">الفاتحة</p>
                  </div>
                </Link>
                <Link to={createPageUrl('SurahView?surah=18')} onClick={() => setSidebarOpen(false)}>
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white hover:opacity-90 transition-opacity cursor-pointer">
                    <BookOpen className="w-6 h-6 mb-2" />
                    <p className="font-bold text-sm">الكهف</p>
                  </div>
                </Link>
                <Link to={createPageUrl('SurahView?surah=36')} onClick={() => setSidebarOpen(false)}>
                  <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-white hover:opacity-90 transition-opacity cursor-pointer">
                    <BookOpen className="w-6 h-6 mb-2" />
                    <p className="font-bold text-sm">يس</p>
                  </div>
                </Link>
                <Link to={createPageUrl('SurahView?surah=67')} onClick={() => setSidebarOpen(false)}>
                  <div className="p-4 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl text-white hover:opacity-90 transition-opacity cursor-pointer">
                    <BookOpen className="w-6 h-6 mb-2" />
                    <p className="font-bold text-sm">الملك</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-2">الإعدادات</h3>
              <div className="space-y-2">
                <Link to={createPageUrl('NotificationSettings')} onClick={() => setSidebarOpen(false)}>
                  <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 cursor-pointer border-2 border-transparent hover:border-gray-200 transition-all">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-bold text-gray-700">إعدادات القراءة</span>
                  </div>
                </Link>
                <Link to={createPageUrl('NotificationSettings')} onClick={() => setSidebarOpen(false)}>
                  <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 cursor-pointer border-2 border-transparent hover:border-gray-200 transition-all">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-bold text-gray-700">الإشعارات والتذكيرات</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-2">إحصائيات القرآن</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                  <div className="text-3xl font-bold text-emerald-700 mb-1">114</div>
                  <div className="text-xs text-emerald-600 font-medium">سورة</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                  <div className="text-3xl font-bold text-amber-700 mb-1">30</div>
                  <div className="text-xs text-amber-600 font-medium">جزء</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="text-3xl font-bold text-blue-700 mb-1">6236</div>
                  <div className="text-xs text-blue-600 font-medium">آية</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="text-3xl font-bold text-purple-700 mb-1">604</div>
                  <div className="text-xs text-purple-600 font-medium">صفحة</div>
                </div>
              </div>
            </div>

            {/* Account Management */}
            <div className="pt-4 border-t space-y-2">
              <Link to={createPageUrl('DeleteAccount')} onClick={() => setSidebarOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full justify-start text-gray-700 border-gray-200 hover:bg-gray-50"
                >
                  <Trash2 className="w-5 h-5 ml-2" />
                  <span className="font-bold">حذف الحساب</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 ml-2" />
                <span className="font-bold">تسجيل الخروج</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="pb-32 safe-top safe-bottom">{children}</main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Classic Audio Player */}
      <ClassicAudioPlayer />

      {/* Floating Audio Control */}
      <FloatingAudioControl />

      {/* Auto Refresh Button */}
      <AutoRefreshButton />

      {/* Global Quran Player */}
      <GlobalQuranPlayer />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 text-white mt-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, rgba(251, 191, 36, 0.3) 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }} />
        </div>
        <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-3xl mb-4 font-arabic text-amber-300 drop-shadow-lg">﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾</p>
            <p className="text-xl text-amber-200 mb-6 font-spiritual">اللهم اجعلنا من أهل القرآن وخاصته</p>
            <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-6"></div>

            <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-xl p-6 mb-4 max-w-3xl mx-auto border border-purple-400/30">
              <p className="text-amber-300 text-2xl font-bold mb-3">🤲 صدقة جارية على روح المرحومة</p>
              <p className="text-white text-xl font-arabic mb-2">جزبية عبد الرحيم هارون علي</p>
              <p className="text-emerald-200 mb-4">وموتانا وموتى المسلمين أجمعين • اللهم ارحمهم واغفر لهم</p>
              
              <Link to={createPageUrl('Orphans')} className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity mb-4">
                <Heart className="w-5 h-5" />
                صفحة كفالة الأيتام والتبرعات
              </Link>
              
              <div className="border-t border-purple-400/30 pt-4 mt-4">
                <p className="text-amber-200 font-bold mb-3">💝 طرق التبرع والتحويل:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-right">
                  <a href="https://pay.ziina.com/RoyalHaroonZLLC/6gIekkkfy" target="_blank" rel="noopener noreferrer" 
                     className="bg-gradient-to-r from-teal-600/40 to-cyan-600/40 p-3 rounded-lg hover:opacity-80 transition-opacity block border border-teal-400/30">
                    <p className="text-white font-bold">💳 Ziina زينة</p>
                    <p className="text-emerald-200 text-sm">اضغط للتبرع مباشرة - خيارات متعددة</p>
                  </a>
                  
                  <a href="tel:00201090193337" className="bg-gradient-to-r from-red-600/40 to-pink-600/40 p-3 rounded-lg border border-red-400/30 hover:opacity-80 transition-opacity block">
                    <p className="text-white font-bold">📱 فودافون كاش</p>
                    <p className="text-emerald-200 text-sm">00201090193337</p>
                  </a>
                  
                  <a href="tel:+971566047579" className="bg-gradient-to-r from-orange-600/40 to-amber-600/40 p-3 rounded-lg border border-orange-400/30 hover:opacity-80 transition-opacity block">
                    <p className="text-white font-bold">📞 e& اتصالات</p>
                    <p className="text-emerald-200 text-sm">+971 56 604 7579</p>
                  </a>
                  
                  <div className="bg-gradient-to-r from-blue-600/40 to-indigo-600/40 p-3 rounded-lg border border-blue-400/30">
                    <p className="text-white font-bold">🏦 Stripe تحويل</p>
                    <p className="text-emerald-200 text-sm">قريباً بإذن الله</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-700/30 rounded-xl p-4 mb-6 max-w-2xl mx-auto">
              <p className="text-lg font-bold text-white mb-2">🤲 صدقة جارية لوجه الله تعالى</p>
              <p className="text-emerald-100 text-sm mb-3">تطبيق مجاني بالكامل - من المسلمين إلى المسلمين</p>
              
              <div className="border-t border-emerald-600/50 pt-3 mt-3">
                <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-lg p-3 mb-3 border border-emerald-500/30">
                  <p className="text-white text-base mb-2 font-arabic">✨ من دولة الإمارات العربية المتحدة 🇦🇪</p>
                  <p className="text-emerald-100 text-sm italic font-arabic">بلد الخير والعطاء • أرض التسامح والمحبة</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-4 mb-3 border border-purple-400/30">
                  <p className="text-amber-300 text-lg font-bold mb-2">🏢 من إنتاج شركة</p>
                  <p className="text-white text-base font-bold mb-1">Royal Haroon Cleaning and Disinfection Services FZ-LLC</p>
                  <p className="text-emerald-100 text-sm italic">تقنية الذكاء الاصطناعي في خدمة القرآن والإنسانية</p>
                  <p className="text-amber-200 text-sm mt-2">🇦🇪 من دولة الإمارات العربية المتحدة</p>
                </div>
                
                <div className="border-t border-emerald-600/50 pt-3 mt-3">
                  <p className="text-amber-300 font-bold mb-2">📧 للتواصل:</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <a href="mailto:info@zooka-ai.com" className="text-emerald-100 hover:text-white transition-colors underline">
                      info@zooka-ai.com
                    </a>
                    <a href="mailto:info@royalcleanuae.com" className="text-emerald-100 hover:text-white transition-colors underline">
                      info@royalcleanuae.com
                    </a>
                  </div>
                  <p className="text-white text-sm font-bold mt-3">⚠️ جميع الحقوق محفوظة • حفظ الملكية الفكرية</p>
                </div>
              </div>
            </div>
            {/* روابط التواصل الاجتماعي */}
            <div className="mb-6">
              <p className="text-amber-300 font-bold mb-4">تابعنا على</p>
              <SocialLinks variant="footer" />
            </div>

            {/* روابط الصفحات الثابتة */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Link to={createPageUrl('StaticPageView?slug=about')} className="flex items-center gap-1 text-emerald-200 hover:text-white transition-colors">
                <Info className="w-4 h-4" />
                عن التطبيق
              </Link>
              <Link to={createPageUrl('StaticPageView?slug=privacy')} className="flex items-center gap-1 text-emerald-200 hover:text-white transition-colors">
                <Shield className="w-4 h-4" />
                سياسة الخصوصية
              </Link>
              <Link to={createPageUrl('StaticPageView?slug=ai-disclosure')} className="flex items-center gap-1 text-purple-200 hover:text-white transition-colors">
                <Sparkles className="w-4 h-4" />
                إفصاح AI
              </Link>
              <Link to={createPageUrl('StaticPageView?slug=terms')} className="flex items-center gap-1 text-emerald-200 hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
                الشروط والأحكام
              </Link>
              <Link to={createPageUrl('StaticPageView?slug=contact')} className="flex items-center gap-1 text-emerald-200 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                اتصل بنا
              </Link>
            </div>

            <div className="flex justify-center gap-8 text-sm text-emerald-300">
              <span>© 2024 القرآن الكريم</span>
              <span>•</span>
              <span>منصة إسلامية متكاملة</span>
            </div>
          </div>
        </div>
        </div>
      </footer>

      </div>
      </div>
      </PlayerProvider>
      </GlobalQuranPlayerProvider>
    </AuthProvider>
  );
}