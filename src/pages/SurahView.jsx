import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookMarked, Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AudioPlayer from '../components/quran/AudioPlayer';
import SearchBar from '../components/quran/SearchBar';
import VerseCard from '../components/quran/VerseCard';
import NavigationControls from '../components/quran/NavigationControls';
import { toast } from 'sonner';

export default function SurahView() {
  const urlParams = new URLSearchParams(window.location.search);
  const surahNumber = parseInt(urlParams.get('surah')) || 1;
  
  const [searchResults, setSearchResults] = useState(null);
  const [selectedJuz, setSelectedJuz] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const queryClient = useQueryClient();

  const { data: verses = [], isLoading } = useQuery({
    queryKey: ['verses', surahNumber],
    queryFn: () => base44.entities.Verse.filter({ surah_number: surahNumber }),
    initialData: [],
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <Link to={createPageUrl('Quran')}>
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-6">
              <ArrowRight className="w-5 h-5 ml-2" />
              العودة للقائمة
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">سورة رقم {surahNumber}</h1>
            <p className="text-emerald-100">اقرأ واستمع وتدبّر</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Audio Player */}
        <div className="mb-8">
          <AudioPlayer surahNumber={surahNumber} />
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
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <BookMarked className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-4">لا توجد آيات متاحة حالياً</p>
            <p className="text-gray-500 text-sm">سيتم تحميل البيانات قريباً بإذن الله</p>
          </div>
        ) : (
          <div className="space-y-6">
            {versesToShow.map((verse) => (
              <VerseCard
                key={verse.id}
                verse={verse}
                onBookmark={handleBookmark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}