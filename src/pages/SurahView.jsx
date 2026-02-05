import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookMarked, Search as SearchIcon, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useOptimizedQuery } from '@/components/hooks/useOptimizedQuery';
import { useKeyboardShortcuts, useRegisterShortcut } from '@/components/hooks/useKeyboardShortcuts';
import { performanceUtils } from '@/components/utils/performanceUtils';
import { loggerUtils } from '@/components/utils/loggerUtils';
import AudioPlayer from '../components/quran/AudioPlayer';
import VerseSync from '../components/quran/VerseSync';
import SearchBar from '../components/quran/SearchBar';
import VerseCard from '../components/quran/VerseCard';
import NavigationControls from '../components/quran/NavigationControls';
import ReadingSettings from '../components/quran/ReadingSettings';
import ReciterSelector from '../components/quran/ReciterSelector';
import IslamicBackground from '@/components/layout/IslamicBackground';
import PerformanceOptimizer from '@/components/performance/PerformanceOptimizer';
import ShareButton from '@/components/share/ShareButton';
import { toast } from 'sonner';

export default function SurahView() {
  const urlParams = new URLSearchParams(window.location.search);
  const surahNumber = parseInt(urlParams.get('surah')) || 1;
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const [searchResults, setSearchResults] = useState(null);
  const [selectedJuz, setSelectedJuz] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [readingSettings, setReadingSettings] = useState({
    fontSize: 24,
    fontFamily: 'amiri',
    lineHeight: 2,
  });
  const [selectedReciter, setSelectedReciter] = useState('husary');
  const queryClient = useQueryClient();
  
  // استخدام اختصارات لوحة المفاتيح
  const _shortcuts = useKeyboardShortcuts();
  useRegisterShortcut('Space', () => document.querySelector('[data-player-play]')?.click(), 'تشغيل/إيقاف');
  useRegisterShortcut('ArrowRight', () => document.querySelector('[data-next-surah]')?.click(), 'التالي');
  useRegisterShortcut('ArrowLeft', () => document.querySelector('[data-prev-surah]')?.click(), 'السابق');

  // حفظ الإعدادات في localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quran-reading-settings');
    if (saved) {
      setReadingSettings(JSON.parse(saved));
    }
  }, []);

  const handleSettingsChange = (newSettings) => {
    setReadingSettings(newSettings);
    localStorage.setItem('quran-reading-settings', JSON.stringify(newSettings));
  };

  // استدعاء محسّن للآيات مع الذاكرة المؤقتة
  const { data: verses = [], isLoading } = useOptimizedQuery(
    ['verses', surahNumber],
    () => base44.entities.Verse.filter({ surah_number: surahNumber }),
    { staleTime: 15 * 60 * 1000, cacheTime: 30 * 60 * 1000 }
  );

  // تسجيل تحميل الصفحة
  useEffect(() => {
    loggerUtils.info('Surah view loaded', { surah_number: surahNumber, verses_count: verses.length });
  }, [surahNumber, verses.length]);

  const createBookmarkMutation = useMutation({
    mutationFn: (bookmarkData) => base44.entities.Bookmark.create(bookmarkData),
    onSuccess: () => {
      toast.success('تم حفظ الآية في المفضلة');
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  const handleSearch = async (query, type) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    const filtered = verses.filter(verse => {
      if (type === 'text' || type === 'all') {
        if (verse.arabic_text?.includes(query)) return true;
      }
      if (type === 'translation' || type === 'all') {
        if (verse.translation_english?.toLowerCase().includes(query.toLowerCase())) return true;
      }
      if (type === 'tafsir' || type === 'all') {
        if (verse.tafsir_saadi?.includes(query) || verse.tafsir_kathir?.includes(query)) return true;
      }
      return false;
    });

    setSearchResults(filtered);
    if (filtered.length === 0) {
      toast.info('لم يتم العثور على نتائج');
    } else {
      toast.success(`تم العثور على ${filtered.length} نتيجة`);
    }
  };

  const handleBookmark = (bookmarkData) => {
    createBookmarkMutation.mutate(bookmarkData);
  };

  const handleJuzChange = (juz) => {
    setSelectedJuz(juz);
    setSelectedPage(null);
    setSearchResults(null);
    const filtered = verses.filter(v => v.juz === juz);
    if (filtered.length > 0) {
      setSearchResults(filtered);
      toast.success(`عرض آيات الجزء ${juz}`);
    } else {
      toast.info('لا توجد بيانات للجزء المحدد');
    }
  };

  const handlePageChange = (page) => {
    setSelectedPage(page);
    setSelectedJuz(null);
    setSearchResults(null);
    const filtered = verses.filter(v => v.page === page);
    if (filtered.length > 0) {
      setSearchResults(filtered);
      toast.success(`عرض آيات الصفحة ${page}`);
    } else {
      toast.info('لا توجد بيانات للصفحة المحددة');
    }
  };

  const displayedVerses = searchResults || verses;

  // Sample data if database is empty
  const sampleVerses = verses.length === 0 ? [
    {
      id: '1',
      surah_number: surahNumber,
      verse_number: 1,
      arabic_text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      transliteration: 'Bismillah ir-Rahman ir-Raheem',
      translation_english: 'In the name of Allah, the Most Gracious, the Most Merciful',
      translation_french: 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux',
      translation_urdu: 'اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے',
      translation_indonesian: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang',
      tafsir_saadi: 'البسملة: الافتتاح باسم الله الذي له الأسماء الحسنى والصفات العلى، الرحمن الذي وسعت رحمته كل شيء، الرحيم الذي خص المؤمنين برحمته الخاصة.',
      juz: 1,
      page: 1
    }
  ] : [];

  const versesToShow = displayedVerses.length > 0 ? displayedVerses : sampleVerses;

  const runOptimization = async () => {
    setIsOptimizing(true);
    try {
      const { result } = await performanceUtils.measureAsync(
        () => base44.functions.invoke('updatePerformanceMetrics', {}),
        'Performance update'
      );
      loggerUtils.info('Optimization completed', result);
      toast.success('تم تحسين الأداء بنجاح');
    } catch (error) {
      loggerUtils.error('Optimization failed', error);
      toast.error('فشل تحسين الأداء');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <PerformanceOptimizer>
    <IslamicBackground variant="default">
      {/* الرأس */}
      <div className="relative text-white pt-8">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6 gap-3">
             <Link to={createPageUrl('Quran')}>
               <Button variant="ghost" className="text-amber-200 hover:bg-white/10 border border-amber-500/20">
                 <ArrowRight className="w-5 h-5 ml-2" />
                 العودة للقائمة
               </Button>
             </Link>
             <div className="flex gap-2">
               <ShareButton
                 entityType="Surah"
                 entityId={`surah-${surahNumber}`}
                 title={`سورة رقم ${surahNumber}`}
                 variant="outline"
                 size="icon"
                 showLabel={false}
               />
               <Button
                 size="icon"
                 className="rounded-full bg-amber-600 hover:bg-amber-700"
                 onClick={runOptimization}
                 disabled={isOptimizing}
                 title="تحسين الأداء (Ctrl+Space)"
               >
                 <Zap className={`w-5 h-5 ${isOptimizing ? 'animate-spin' : ''}`} />
               </Button>
             </div>
           </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3 text-amber-100">سورة رقم {surahNumber}</h1>
            <p className="text-xl text-indigo-200 font-arabic">﴿ اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ ﴾</p>
            <p className="text-slate-300 mt-2">اقرأ واستمع وتدبّر</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Reading Settings */}
        <ReadingSettings 
          settings={readingSettings}
          onSettingsChange={handleSettingsChange}
        />

        {/* Reciter Selector & Audio Player */}
        <div className="mb-8 space-y-4">
          <div className="flex justify-center">
            <ReciterSelector
              selectedReciter={selectedReciter}
              onReciterChange={setSelectedReciter}
            />
          </div>
          <AudioPlayer 
            surahNumber={surahNumber}
            onTimeUpdate={setAudioCurrentTime}
            onPlayingChange={setIsAudioPlaying}
          />
        </div>

        {/* Verse Sync Display */}
        <div className="mb-8">
          <VerseSync 
            surahNumber={surahNumber}
            currentTime={audioCurrentTime}
            isPlaying={isAudioPlaying}
          />
        </div>

        {/* Navigation Controls */}
        <div className="mb-8">
          <NavigationControls
            currentJuz={selectedJuz}
            currentPage={selectedPage}
            onJuzChange={handleJuzChange}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Search Results Info */}
        {searchResults && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SearchIcon className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800">
                عرض {searchResults.length} نتيجة من أصل {verses.length} آية
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchResults(null)}
            >
              إلغاء البحث
            </Button>
          </div>
        )}

        {/* Verses */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">جاري التحميل...</p>
          </div>
        ) : versesToShow.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-lg border border-amber-500/20">
            <BookMarked className="w-16 h-16 mx-auto text-amber-400 mb-4" />
            <p className="text-amber-100 text-lg mb-4">لا توجد آيات متاحة حالياً</p>
            <p className="text-slate-400 text-sm">سيتم تحميل البيانات قريباً بإذن الله</p>
          </div>
        ) : (
          <div className="space-y-6">
            {versesToShow.map((verse) => (
              <VerseCard
                key={verse.id}
                verse={verse}
                onBookmark={handleBookmark}
                readingSettings={readingSettings}
              />
            ))}
          </div>
        )}
      </div>
    </IslamicBackground>
    </PerformanceOptimizer>
  );
}