import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookMarked, Share2, Copy, Check, Info, Link2, GitCompare, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import BookmarkDialog from './BookmarkDialog';
import SababNuzoolDialog from './SababNuzoolDialog';
import RelatedVersesDialog from './RelatedVersesDialog';
import CompareTafsirDialog from './CompareTafsirDialog';
import VerseAudioPlayer from './VerseAudioPlayer';
import TafsirViewer from './TafsirViewer';
import TafsirSelector from './TafsirSelector';

const VerseCard = ({ verse, onBookmark, readingSettings = {} }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('arabic');
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [showSababNuzool, setShowSababNuzool] = useState(false);
  const [showRelatedVerses, setShowRelatedVerses] = useState(false);
  const [showCompareTafsir, setShowCompareTafsir] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showTafsirViewer, setShowTafsirViewer] = useState(false);

  const { fontSize = 24, fontFamily = 'amiri', lineHeight = 2 } = readingSettings;
  
  const fontFamilyClass = {
    'amiri': 'font-[Amiri]',
    'uthmanic': 'font-[KFGQPC_Uthmanic_Script_HAFS]',
    'hafs': 'font-[Hafs]',
    'naskh': 'font-[Noto_Naskh_Arabic]',
  }[fontFamily] || 'font-[Amiri]';

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
              variant={showAudioPlayer ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAudioPlayer(!showAudioPlayer)}
              className="gap-2"
            >
              <Volume2 className="w-4 h-4" />
              {showAudioPlayer ? 'إخفاء المشغل' : 'استماع'}
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

        {/* Audio Player */}
        {showAudioPlayer && (
          <div className="mb-6">
            <VerseAudioPlayer
              surahNumber={verse.surah_number}
              verseNumber={verse.verse_number}
              showNavigation={false}
            />
          </div>
        )}

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTafsirViewer(true)}
            className="flex items-center gap-2 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <BookMarked className="w-4 h-4" />
            تفسير من الإنترنت
          </Button>
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

        <TafsirViewer
          surahNumber={verse.surah_number}
          verseNumber={verse.verse_number}
          isOpen={showTafsirViewer}
          onClose={() => setShowTafsirViewer(false)}
        />

        {/* Arabic Text */}
        <div className="mb-6 text-center">
          <p 
            className={`text-gray-800 p-4 bg-gradient-to-br from-emerald-50/50 to-amber-50/30 rounded-xl ${fontFamilyClass}`}
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
            }}
          >
            {verse.arabic_text} ﴿{verse.verse_number}﴾
          </p>
        </div>

        {/* Tabs for Translations and Tafsir */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="arabic">عربي</TabsTrigger>
            <TabsTrigger value="translations">الترجمات</TabsTrigger>
            <TabsTrigger value="tafsir" className="relative">
              التفسير
              {(verse.tafsir_saadi || verse.tafsir_kathir || verse.tafsir_tabari) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
              )}
            </TabsTrigger>
            <TabsTrigger value="all-tafsir">كل التفاسير</TabsTrigger>
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
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
                    <BookMarked className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-bold text-amber-800">تفسير السعدي</p>
                </div>
                <p className="text-gray-700 leading-loose text-right font-arabic">{verse.tafsir_saadi}</p>
              </div>
            )}
            {verse.tafsir_kathir && (
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <BookMarked className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-bold text-blue-800">تفسير ابن كثير</p>
                </div>
                <p className="text-gray-700 leading-loose text-right font-arabic">{verse.tafsir_kathir}</p>
              </div>
            )}
            {verse.tafsir_tabari && (
              <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <BookMarked className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-bold text-purple-800">تفسير الطبري</p>
                </div>
                <p className="text-gray-700 leading-loose text-right font-arabic">{verse.tafsir_tabari}</p>
              </div>
            )}
            {!verse.tafsir_saadi && !verse.tafsir_kathir && !verse.tafsir_tabari && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <BookMarked className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">لا يوجد تفسير محفوظ لهذه الآية</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTafsirViewer(true)}
                  className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                >
                  جلب التفسير من الإنترنت
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="all-tafsir">
            <TafsirSelector 
              verse={verse} 
              onSelectTafsir={() => setShowTafsirViewer(true)} 
            />
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