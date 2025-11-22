import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, MessageSquare, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import SurahCard from '../components/quran/SurahCard';

const SURAHS = [
  { number: 1, name: 'الفاتحة', arabic_name: 'ٱلْفَاتِحَة', transliteration: 'Al-Fatihah', verses_count: 7, revelation_place: 'Makkah', juz_start: 1 },
  { number: 2, name: 'البقرة', arabic_name: 'ٱلْبَقَرَة', transliteration: 'Al-Baqarah', verses_count: 286, revelation_place: 'Madinah', juz_start: 1 },
  { number: 3, name: 'آل عمران', arabic_name: 'آل عِمْرَان', transliteration: 'Ali \'Imran', verses_count: 200, revelation_place: 'Madinah', juz_start: 3 },
  { number: 4, name: 'النساء', arabic_name: 'ٱلنِّسَاء', transliteration: 'An-Nisa', verses_count: 176, revelation_place: 'Madinah', juz_start: 4 },
  { number: 5, name: 'المائدة', arabic_name: 'ٱلْمَائِدَة', transliteration: 'Al-Ma\'idah', verses_count: 120, revelation_place: 'Madinah', juz_start: 6 },
  { number: 6, name: 'الأنعام', arabic_name: 'ٱلْأَنْعَام', transliteration: 'Al-An\'am', verses_count: 165, revelation_place: 'Makkah', juz_start: 7 },
  { number: 7, name: 'الأعراف', arabic_name: 'ٱلْأَعْرَاف', transliteration: 'Al-A\'raf', verses_count: 206, revelation_place: 'Makkah', juz_start: 8 },
  { number: 8, name: 'الأنفال', arabic_name: 'ٱلْأَنْفَال', transliteration: 'Al-Anfal', verses_count: 75, revelation_place: 'Madinah', juz_start: 9 },
  { number: 9, name: 'التوبة', arabic_name: 'ٱلتَّوْبَة', transliteration: 'At-Tawbah', verses_count: 129, revelation_place: 'Madinah', juz_start: 10 },
  { number: 10, name: 'يونس', arabic_name: 'يُونُس', transliteration: 'Yunus', verses_count: 109, revelation_place: 'Makkah', juz_start: 11 },
  { number: 11, name: 'هود', arabic_name: 'هُود', transliteration: 'Hud', verses_count: 123, revelation_place: 'Makkah', juz_start: 11 },
  { number: 12, name: 'يوسف', arabic_name: 'يُوسُف', transliteration: 'Yusuf', verses_count: 111, revelation_place: 'Makkah', juz_start: 12 },
  { number: 18, name: 'الكهف', arabic_name: 'ٱلْكَهْف', transliteration: 'Al-Kahf', verses_count: 110, revelation_place: 'Makkah', juz_start: 15 },
  { number: 36, name: 'يس', arabic_name: 'يٓس', transliteration: 'Ya-Sin', verses_count: 83, revelation_place: 'Makkah', juz_start: 22 },
  { number: 67, name: 'الملك', arabic_name: 'ٱلْمُلْك', transliteration: 'Al-Mulk', verses_count: 30, revelation_place: 'Makkah', juz_start: 29 },
  { number: 112, name: 'الإخلاص', arabic_name: 'ٱلْإِخْلَاص', transliteration: 'Al-Ikhlas', verses_count: 4, revelation_place: 'Makkah', juz_start: 30 },
  { number: 113, name: 'الفلق', arabic_name: 'ٱلْفَلَق', transliteration: 'Al-Falaq', verses_count: 5, revelation_place: 'Makkah', juz_start: 30 },
  { number: 114, name: 'الناس', arabic_name: 'ٱلنَّاس', transliteration: 'An-Nas', verses_count: 6, revelation_place: 'Makkah', juz_start: 30 }
];

export default function QuranPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleShare = () => {
    const appUrl = window.location.origin;
    const shareText = '🕌 تطبيق القرآن الكريم - مجاني بالكامل لوجه الله تعالى\n\nصدقة جارية - شارك الأجر معنا 🤲\n\n' + appUrl;
    
    if (navigator.share) {
      navigator.share({
        title: 'تطبيق القرآن الكريم',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('تم نسخ الرابط! شاركه مع من تحب لتنال الأجر 🌟');
    }
  };

  const handleCopyLink = () => {
    const appUrl = window.location.origin;
    navigator.clipboard.writeText(appUrl);
    toast.success('تم نسخ رابط التطبيق! 📋');
  };

  const filteredSurahs = SURAHS.filter(surah => 
    surah.name.includes(searchQuery) || 
    surah.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.number.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Spiritual Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Nature Background with Beach & Palm Trees */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-pulse-slow"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80)',
            animationDuration: '8s'
          }}
        />
        {/* Overlay with spiritual colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 via-teal-400/30 to-emerald-500/40 animate-pulse-slow" 
             style={{ animationDuration: '10s' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-sky-300/30" />
        
        {/* Animated particles effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-amber-300/40 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-40 h-40 bg-emerald-400/30 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-cyan-400/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 right-1/3 w-36 h-36 bg-teal-300/30 rounded-full blur-3xl animate-float-delayed" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-15px) translateX(10px); }
          66% { transform: translateY(-5px) translateX(-10px); }
        }
        .animate-pulse-slow { animation: pulse-slow infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
      `}</style>
      
      <div className="relative z-10">
      {/* Header with Islamic Calligraphy Style */}
      <div className="bg-gradient-to-r from-teal-600/80 via-cyan-600/80 to-emerald-600/80 backdrop-blur-xl text-white shadow-2xl border-b-4 border-amber-400/50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="mb-8 animate-pulse">
              <div className="inline-block p-6 bg-gradient-to-br from-amber-300/30 to-yellow-400/20 rounded-3xl backdrop-blur-xl border-2 border-amber-300/40 shadow-2xl">
                <svg className="w-20 h-20 text-amber-200 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-6 text-white drop-shadow-2xl font-arabic" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 40px rgba(251,191,36,0.4)' }}>
              القرآن الكريم
            </h1>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 max-w-3xl mx-auto border border-white/30 shadow-2xl mb-4">
              <p className="text-2xl text-amber-100 mb-3 font-arabic leading-loose" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                ﴿ إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ ﴾
              </p>
              <p className="text-cyan-100 text-lg font-semibold">المصحف الإلكتروني الشامل • بروح الإيمان والسكينة 🕌</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Sadaqah Jariyah Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-600/95 via-emerald-600/95 to-teal-600/95 text-white shadow-2xl border-none backdrop-blur-xl border-4 border-white/20">
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🤲</div>
              <h2 className="text-3xl font-bold mb-3">صدقة جارية لوجه الله تعالى</h2>
              <p className="text-xl mb-4 text-green-50">
                هذا التطبيق مجاني بالكامل ولا نطلب أي تبرعات
              </p>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 max-w-3xl mx-auto border border-white/30 shadow-inner">
                <p className="text-lg leading-relaxed mb-4">
                  ﴿ إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ وَأَقَامُوا الصَّلَاةَ وَأَنفَقُوا مِمَّا رَزَقْنَاهُمْ سِرًّا وَعَلَانِيَةً يَرْجُونَ تِجَارَةً لَّن تَبُورَ ﴾
                </p>
                <p className="text-green-50 mb-4">
                  <strong>شارك في الأجر:</strong> انشر التطبيق مع أهلك وأصدقائك وكل من ينتفع به تشارك في الأجر
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gradient-to-br from-white/20 to-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/30 shadow-lg hover:scale-105 transition-transform">
                    <div className="text-4xl mb-3">📖</div>
                    <div className="font-bold text-lg">قراءة القرآن</div>
                    <div className="text-sm text-green-100">كل حرف بحسنة</div>
                  </div>
                  <div className="bg-gradient-to-br from-white/20 to-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/30 shadow-lg hover:scale-105 transition-transform">
                    <div className="text-4xl mb-3">🎤</div>
                    <div className="font-bold text-lg">استماع للمقرئين</div>
                    <div className="text-sm text-green-100">تدبر وخشوع</div>
                  </div>
                  <div className="bg-gradient-to-br from-white/20 to-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/30 shadow-lg hover:scale-105 transition-transform">
                    <div className="text-4xl mb-3">🤝</div>
                    <div className="font-bold text-lg">انشر الخير</div>
                    <div className="text-sm text-green-100">صدقة جارية لك</div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3 justify-center flex-wrap">
                  <Button
                    onClick={handleShare}
                    className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-6 py-3 text-lg flex items-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    شارك التطبيق واربح الأجر
                  </Button>
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="bg-white/20 border-white text-white hover:bg-white/30 font-bold px-6 py-3 text-lg flex items-center gap-2"
                  >
                    <Copy className="w-5 h-5" />
                    نسخ الرابط
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Smart Assistant Banner */}
        <div className="mb-8">
          <Link to={createPageUrl('Assistant')}>
            <div className="bg-gradient-to-r from-purple-500/90 via-purple-600/90 to-indigo-600/90 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-[1.02] cursor-pointer border-4 border-purple-300/40 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 border-2 border-white/40 shadow-lg">
                    <MessageSquare className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">🎤 المساعد الصوتي الذكي</h3>
                    <p className="text-purple-100">اسأل أي سؤال عن القرآن بالصوت أو الكتابة</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Button className="bg-white text-purple-600 hover:bg-purple-50 font-bold px-6 py-3 text-lg">
                    جرب الآن
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن سورة بالاسم أو الرقم..."
              className="pr-12 h-14 text-lg border-2 border-emerald-200 focus:border-emerald-500 rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-white/90 to-emerald-50/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border-2 border-emerald-200/50 text-center hover:scale-105 transition-transform">
            <p className="text-5xl font-bold text-emerald-600 mb-2 drop-shadow-md">114</p>
            <p className="text-gray-700 font-semibold">سورة</p>
          </div>
          <div className="bg-gradient-to-br from-white/90 to-amber-50/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border-2 border-amber-200/50 text-center hover:scale-105 transition-transform">
            <p className="text-5xl font-bold text-amber-600 mb-2 drop-shadow-md">30</p>
            <p className="text-gray-700 font-semibold">جزء</p>
          </div>
          <div className="bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border-2 border-blue-200/50 text-center hover:scale-105 transition-transform">
            <p className="text-5xl font-bold text-blue-600 mb-2 drop-shadow-md">6236</p>
            <p className="text-gray-700 font-semibold">آية</p>
          </div>
          <div className="bg-gradient-to-br from-white/90 to-purple-50/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border-2 border-purple-200/50 text-center hover:scale-105 transition-transform">
            <p className="text-5xl font-bold text-purple-600 mb-2 drop-shadow-md">5</p>
            <p className="text-gray-700 font-semibold">قراء</p>
          </div>
        </div>

        {/* Surahs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurahs.map(surah => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">لم يتم العثور على نتائج</p>
          </div>
        )}
      </div>
    </div>
  );
}