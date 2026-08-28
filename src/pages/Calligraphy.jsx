import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Share2, RefreshCw, Search, Palette } from 'lucide-react';
import { toast } from 'sonner';
import IslamicBackground from '@/components/layout/IslamicBackground';

const FEATURED_VERSES = [
  { surah: 1, verse: 1, name: 'البسملة' },
  { surah: 2, verse: 255, name: 'آية الكرسي' },
  { surah: 36, verse: 1, name: 'يس' },
  { surah: 67, verse: 1, name: 'تبارك' },
  { surah: 112, verse: 1, name: 'الإخلاص' },
  { surah: 113, verse: 1, name: 'الفلق' },
  { surah: 114, verse: 1, name: 'الناس' }
];

const CALLIGRAPHY_STYLES = [
  { id: 'ruqah', name: 'خط الرقعة', className: 'font-arabic' },
  { id: 'naskh', name: 'خط النسخ', className: 'font-arabic' },
  { id: 'thuluth', name: 'خط الثلث', className: 'font-arabic' }
];

export default function CalligraphyPage() {
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState('ruqah');
  const [fontSize, setFontSize] = useState(72);
  const [bgColor, setBgColor] = useState('#0f766e');
  const [textColor, setTextColor] = useState('#fef3c7');

  const { data: verses = [] } = useQuery({
    queryKey: ['verses', selectedSurah],
    queryFn: () => base44.entities.Verse.filter({ surah_number: selectedSurah }),
    initialData: [],
  });

  const currentVerse = verses.find(v => v.verse_number === selectedVerse) || verses[0];

  const handleDownload = async () => {
    if (!currentVerse) return;

    try {
      const response = await base44.integrations.Core.GenerateImage({
        prompt: `Create a beautiful Islamic calligraphy artwork with the following Arabic text in Ruqah style: "${currentVerse.arabic_text}". The design should be elegant, traditional Islamic art style, with ornate decorative borders and patterns. High quality, professional calligraphy. Background color: ${bgColor}, text color: ${textColor}`
      });
      
      if (response.url) {
        window.open(response.url, '_blank');
        toast.success('تم إنشاء الخط بنجاح!');
      }
    } catch (error) {
      toast.error('حدث خطأ في إنشاء الخط');
    }
  };

  const handleShare = () => {
    if (navigator.share && currentVerse) {
      navigator.share({
        title: 'خط رقعة - آية قرآنية',
        text: currentVerse.arabic_text,
      });
    } else {
      navigator.clipboard.writeText(currentVerse?.arabic_text || '');
      toast.success('تم النسخ للحافظة');
    }
  };

  const randomVerse = () => {
    const random = FEATURED_VERSES[Math.floor(Math.random() * FEATURED_VERSES.length)];
    setSelectedSurah(random.surah);
    setSelectedVerse(random.verse);
  };

  return (
    <IslamicBackground variant="amber">
      {/* الرأس */}
      <div className="relative text-white pt-8">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block p-5 bg-gradient-to-br from-teal-500/20 to-teal-600/10 rounded-3xl backdrop-blur-sm border border-teal-400/20">
                <Palette className="w-14 h-14 text-teal-300" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-100">خطوط القرآن الكريم</h1>
            <p className="text-xl text-indigo-200 font-arabic">﴿ وَإِنَّهُ لَكِتَابٌ عَزِيزٌ ﴾</p>
            <p className="text-slate-300 mt-2">اكتشف جمال الخط العربي مع كلام الله</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* لوحة التحكم */}
          <div className="space-y-6">
            <Card className="p-6 bg-slate-900/60 backdrop-blur-xl border border-teal-500/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-200">
                <Search className="w-5 h-5 text-teal-400" />
                اختر الآية
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">السورة</label>
                  <Input
                    type="number"
                    min="1"
                    max="114"
                    value={selectedSurah}
                    onChange={(e) => setSelectedSurah(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-800/50 border-teal-500/30 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">رقم الآية</label>
                  <Input
                    type="number"
                    min="1"
                    value={selectedVerse}
                    onChange={(e) => setSelectedVerse(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-800/50 border-teal-500/30 text-white"
                  />
                </div>

                <Button
                  onClick={randomVerse}
                  variant="outline"
                  className="w-full border-teal-500/30 text-teal-300 hover:bg-teal-500/20"
                >
                  <RefreshCw className="w-4 h-4 ml-2" />
                  آية عشوائية
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-slate-900/60 backdrop-blur-xl border border-teal-500/20">
              <h3 className="text-xl font-bold mb-4 text-amber-200">آيات مميزة</h3>
              <div className="space-y-2">
                {FEATURED_VERSES.map((verse) => (
                  <Button
                    key={`${verse.surah}-${verse.verse}`}
                    variant="outline"
                    className="w-full justify-start border-teal-500/30 text-teal-200 hover:bg-teal-500/20"
                    onClick={() => {
                      setSelectedSurah(verse.surah);
                      setSelectedVerse(verse.verse);
                    }}
                  >
                    {verse.name}
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-slate-900/60 backdrop-blur-xl border border-teal-500/20">
              <h3 className="text-xl font-bold mb-4 text-amber-200">التخصيص</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">نوع الخط</label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger className="bg-slate-800/50 border-teal-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CALLIGRAPHY_STYLES.map(style => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">حجم الخط: {fontSize}px</label>
                  <input
                    type="range"
                    min="32"
                    max="120"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">لون الخلفية</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer"
                    />
                    <Input
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 bg-slate-800/50 border-teal-500/30 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">لون النص</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 bg-slate-800/50 border-teal-500/30 text-white"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* منطقة العرض */}
          <div className="lg:col-span-2">
            <Card className="p-8 min-h-[600px] flex flex-col bg-slate-900/60 backdrop-blur-xl border border-teal-500/20">
              <div className="flex-1 flex items-center justify-center">
                <div
                  className="w-full h-full rounded-2xl flex items-center justify-center p-12 shadow-2xl"
                  style={{ backgroundColor: bgColor }}
                >
                  {currentVerse ? (
                    <p
                      className={`text-center leading-loose ${CALLIGRAPHY_STYLES.find(s => s.id === selectedStyle)?.className}`}
                      style={{
                        fontSize: `${fontSize}px`,
                        color: textColor,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      {currentVerse.arabic_text} ﴿{currentVerse.verse_number}﴾
                    </p>
                  ) : (
                    <div className="text-center text-white/60">
                      <p className="text-2xl mb-4">اختر آية من القائمة</p>
                      <p>أو استخدم الأرقام للبحث</p>
                    </div>
                  )}
                </div>
              </div>

              {currentVerse && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-teal-500/20">
                    <p className="text-sm text-slate-400 mb-1">الترجمة:</p>
                    <p className="text-slate-200">{currentVerse.translation_english || 'غير متوفر'}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleDownload}
                      className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
                    >
                      <Download className="w-4 h-4 ml-2" />
                      توليد صورة احترافية
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="flex-1 border-teal-500/30 text-teal-300 hover:bg-teal-500/20"
                    >
                      <Share2 className="w-4 h-4 ml-2" />
                      مشاركة
                    </Button>
                  </div>

                  <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                    <p className="text-sm text-teal-200">
                      💡 <strong>نصيحة:</strong> اضغط على "توليد صورة احترافية" لإنشاء تصميم خطوط إسلامية مزخرفة بالذكاء الاصطناعي
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* بطاقات المعلومات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="p-6 text-center bg-slate-900/60 backdrop-blur-xl border border-teal-500/20">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-bold text-lg mb-2 text-amber-200">خطوط متنوعة</h3>
            <p className="text-sm text-slate-400">استكشف أنواع الخطوط العربية الجميلة</p>
          </Card>

          <Card className="p-6 text-center bg-slate-900/60 backdrop-blur-xl border border-amber-500/20">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="font-bold text-lg mb-2 text-amber-200">كل القرآن</h3>
            <p className="text-sm text-slate-400">اختر من بين 6236 آية قرآنية</p>
          </Card>

          <Card className="p-6 text-center bg-slate-900/60 backdrop-blur-xl border border-indigo-500/20">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-bold text-lg mb-2 text-amber-200">ذكاء اصطناعي</h3>
            <p className="text-sm text-slate-400">توليد خطوط احترافية بالـ AI</p>
          </Card>
        </div>
      </div>
    </IslamicBackground>
  );
}