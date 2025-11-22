import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare } from 'lucide-react';
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

  const filteredSurahs = SURAHS.filter(surah => 
    surah.name.includes(searchQuery) || 
    surah.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.number.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <svg className="w-16 h-16 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">القرآن الكريم</h1>
            <p className="text-xl text-emerald-100 mb-2">﴿ إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ ﴾</p>
            <p className="text-emerald-200">المصحف الإلكتروني الشامل</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Sadaqah Jariyah Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-2xl border-none">
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🤲</div>
              <h2 className="text-3xl font-bold mb-3">صدقة جارية لوجه الله تعالى</h2>
              <p className="text-xl mb-4 text-green-50">
                هذا التطبيق مجاني بالكامل ولا نطلب أي تبرعات
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-3xl mx-auto">
                <p className="text-lg leading-relaxed mb-4">
                  ﴿ إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ وَأَقَامُوا الصَّلَاةَ وَأَنفَقُوا مِمَّا رَزَقْنَاهُمْ سِرًّا وَعَلَانِيَةً يَرْجُونَ تِجَارَةً لَّن تَبُورَ ﴾
                </p>
                <p className="text-green-50 mb-4">
                  <strong>شارك في الأجر:</strong> انشر التطبيق مع أهلك وأصدقائك وكل من ينتفع به تشارك في الأجر
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-3xl mb-2">📖</div>
                    <div className="font-bold">قراءة القرآن</div>
                    <div className="text-sm text-green-100">كل حرف بحسنة</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-3xl mb-2">🎤</div>
                    <div className="font-bold">استماع للمقرئين</div>
                    <div className="text-sm text-green-100">تدبر وخشوع</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-3xl mb-2">🤝</div>
                    <div className="font-bold">انشر الخير</div>
                    <div className="text-sm text-green-100">صدقة جارية لك</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Smart Assistant Banner */}
        <div className="mb-8">
          <Link to={createPageUrl('Assistant')}>
            <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-[1.02] cursor-pointer border-2 border-purple-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                    <MessageSquare className="w-8 h-8 text-white" />
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
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100 text-center">
            <p className="text-4xl font-bold text-emerald-600 mb-2">114</p>
            <p className="text-gray-600">سورة</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-100 text-center">
            <p className="text-4xl font-bold text-amber-600 mb-2">30</p>
            <p className="text-gray-600">جزء</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100 text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">6236</p>
            <p className="text-gray-600">آية</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100 text-center">
            <p className="text-4xl font-bold text-purple-600 mb-2">5</p>
            <p className="text-gray-600">قراء</p>
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