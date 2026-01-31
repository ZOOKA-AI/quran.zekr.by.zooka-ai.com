import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookMarked, Share2, Copy, Check, Info, Link2, GitCompare, Pause, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import BookmarkDialog from './BookmarkDialog';
import SababNuzoolDialog from './SababNuzoolDialog';
import RelatedVersesDialog from './RelatedVersesDialog';
import CompareTafsirDialog from './CompareTafsirDialog';

const RECITERS = [
  { id: 'husary', name: 'الحصري', baseUrl: 'https://EveryAyah.com/data/Husary_128kbps/' },
  { id: 'minshawi', name: 'المنشاوي', baseUrl: 'https://EveryAyah.com/data/Minshawy_Murattal_128kbps/' },
  { id: 'abdulbasit', name: 'عبد الباسط', baseUrl: 'https://EveryAyah.com/data/Abdul_Basit_Mujawwad_128kbps/' },
  { id: 'sudais', name: 'السديس', baseUrl: 'https://EveryAyah.com/data/Abdurrahmaan_As-Sudais_192kbps/' },
  { id: 'alafasy', name: 'العفاسي', baseUrl: 'https://EveryAyah.com/data/Alafasy_128kbps/' }
];

const VerseCard = ({ verse, onBookmark }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('arabic');
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [showSababNuzool, setShowSababNuzool] = useState(false);
  const [showRelatedVerses, setShowRelatedVerses] = useState(false);
  const [showCompareTafsir, setShowCompareTafsir] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(verse.arabic_text);
    setCopied(true);
    toast.success('تم النسخ بنجاح');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `سورة - آية ${verse.verse_number}`,
        text: verse.arabic_text,
      });
    } else {
      toast.info('المشاركة غير متوفرة على هذا المتصفح');
    }
  };

  const buildAudioUrl = () => {
    const surah = String(verse.surah_number).padStart(3, '0');
    const ayah = String(verse.verse_number).padStart(3, '0');
    return RECITERS[0].baseUrl + surah + ayah + '.mp3';
  };

  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(buildAudioUrl());
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
      
      audioRef.current.onerror = () => {
        toast.error('حدث خطأ في تشغيل الصوت');
        setIsPlaying(false);
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <Card className="bg-white border-2 border-gray-100 hover:border-emerald-200 transition-all shadow-md hover:shadow-xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              آية {verse.verse_number}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAudio}
              className={`${isPlaying ? 'bg-emerald-100 border-emerald-400' : ''} hover:bg-emerald-50`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 ml-1" />
                  إيقاف
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 ml-1" />
                  استماع
                </>
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-emerald-50 hover:text-emerald-600"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-emerald-50 hover:text-emerald-600"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-amber-50 hover:text-amber-600"
              onClick={() => setShowBookmarkDialog(true)}
            >
              <BookMarked className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Interactive Features Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {verse.sabab_nuzool && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSababNuzool(true)}
              className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Info className="w-4 h-4" />
              سبب النزول
            </Button>
          )}
          {verse.related_verses && verse.related_verses.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRelatedVerses(true)}
              className="flex items-center gap-2 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
            >
              <Link2 className="w-4 h-4" />
              آيات متشابهة ({verse.related_verses.length})
            </Button>
          )}
          {(verse.tafsir_saadi || verse.tafsir_kathir || verse.tafsir_tabari) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCompareTafsir(true)}
              className="flex items-center gap-2 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
            >
              <GitCompare className="w-4 h-4" />
              مقارنة التفاسير
            </Button>
          )}
        </div>

        <BookmarkDialog
          isOpen={showBookmarkDialog}
          onClose={() => setShowBookmarkDialog(false)}
          verse={verse}
          onSave={onBookmark}
        />

        <SababNuzoolDialog
          isOpen={showSababNuzool}
          onClose={() => setShowSababNuzool(false)}
          verse={verse}
        />

        <RelatedVersesDialog
          isOpen={showRelatedVerses}
          onClose={() => setShowRelatedVerses(false)}
          verse={verse}
        />

        <CompareTafsirDialog
          isOpen={showCompareTafsir}
          onClose={() => setShowCompareTafsir(false)}
          verse={verse}
        />

        {/* Arabic Text */}
        <div className="mb-6 text-center">
          <p className="text-3xl leading-loose font-arabic text-gray-800 p-4 bg-gradient-to-br from-emerald-50/50 to-amber-50/30 rounded-xl">
            {verse.arabic_text} ﴿{verse.verse_number}﴾
          </p>
        </div>

        {/* Tabs for Translations and Tafsir */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="arabic">عربي</TabsTrigger>
            <TabsTrigger value="translations">الترجمات</TabsTrigger>
            <TabsTrigger value="tafsir">التفسير</TabsTrigger>
            <TabsTrigger value="info">معلومات</TabsTrigger>
          </TabsList>

          <TabsContent value="arabic" className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">النطق بالحروف اللاتينية:</p>
              <p className="text-gray-800 italic">{verse.transliteration || 'غير متوفر'}</p>
            </div>
          </TabsContent>

          <TabsContent value="translations" className="space-y-4">
            {verse.translation_english && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs font-semibold text-blue-700 mb-2">🇬🇧 English</p>
                <p className="text-gray-700">{verse.translation_english}</p>
              </div>
            )}
            {verse.translation_french && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-xs font-semibold text-purple-700 mb-2">🇫🇷 Français</p>
                <p className="text-gray-700">{verse.translation_french}</p>
              </div>
            )}
            {verse.translation_urdu && (
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-100">
                <p className="text-xs font-semibold text-pink-700 mb-2">🇵🇰 اردو</p>
                <p className="text-gray-700 font-urdu" dir="rtl">{verse.translation_urdu}</p>
              </div>
            )}
            {verse.translation_indonesian && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs font-semibold text-green-700 mb-2">🇮🇩 Indonesia</p>
                <p className="text-gray-700">{verse.translation_indonesian}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tafsir" className="space-y-4">
            {verse.tafsir_saadi && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-sm font-semibold text-amber-800 mb-2">تفسير السعدي</p>
                <p className="text-gray-700 leading-relaxed">{verse.tafsir_saadi}</p>
              </div>
            )}
            {verse.tafsir_kathir && (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <p className="text-sm font-semibold text-emerald-800 mb-2">تفسير ابن كثير</p>
                <p className="text-gray-700 leading-relaxed">{verse.tafsir_kathir}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="info">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">رقم الجزء</p>
                <p className="text-lg font-bold text-gray-800">{verse.juz || '-'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">رقم الصفحة</p>
                <p className="text-lg font-bold text-gray-800">{verse.page || '-'}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default VerseCard;