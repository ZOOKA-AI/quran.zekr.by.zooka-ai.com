import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings, Plus, Minus, Moon, Sun, Download, Check, Palette } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TajweedText, { TAJWEED_COLORS } from './TajweedText';
import { toast } from 'sonner';

const FONT_FAMILIES = [
  { value: 'amiri', label: 'خط أميري', className: 'font-[Amiri]', preview: 'بِسْمِ اللَّهِ' },
  { value: 'naskh', label: 'خط النسخ', className: 'font-[Noto_Naskh_Arabic]', preview: 'بِسْمِ اللَّهِ' },
  { value: 'uthmanic', label: 'الخط العثماني', className: 'font-[KFGQPC]', preview: 'بِسْمِ ٱللَّهِ' },
  { value: 'scheherazade', label: 'خط شهرزاد', className: 'font-serif', preview: 'بِسْمِ اللَّهِ' },
  { value: 'lateef', label: 'خط لطيف', className: 'font-sans', preview: 'بِسْمِ اللَّهِ' },
];

const DOWNLOADABLE_SURAHS = [
  { number: 1, name: 'الفاتحة' },
  { number: 18, name: 'الكهف' },
  { number: 36, name: 'يس' },
  { number: 67, name: 'الملك' },
  { number: 55, name: 'الرحمن' },
];

export default function ReadingSettings({ settings, onSettingsChange }) {
  const [fontSize, setFontSize] = useState(settings?.fontSize || 24);
  const [fontFamily, setFontFamily] = useState(settings?.fontFamily || 'amiri');
  const [lineHeight, setLineHeight] = useState(settings?.lineHeight || 2);
  const [darkMode, setDarkMode] = useState(settings?.darkMode || false);
  const [tajweedEnabled, setTajweedEnabled] = useState(settings?.tajweedEnabled ?? true);
  const [downloadedSurahs, setDownloadedSurahs] = useState([]);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    // Load downloaded surahs from localStorage
    const saved = localStorage.getItem('downloaded-surahs');
    if (saved) setDownloadedSurahs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    onSettingsChange({ fontSize, fontFamily, lineHeight, darkMode, tajweedEnabled });
  }, [fontSize, fontFamily, lineHeight, darkMode, tajweedEnabled]);

  const handleDownloadSurah = async (surahNum, surahName) => {
    setDownloading(surahNum);
    try {
      const url = `https://server8.mp3quran.net/afs/${surahNum.toString().padStart(3, '0')}.mp3`;
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Save to IndexedDB for offline use
      const dbRequest = indexedDB.open('QuranOfflineDB', 1);
      dbRequest.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('surahs')) {
          db.createObjectStore('surahs', { keyPath: 'number' });
        }
      };
      dbRequest.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction('surahs', 'readwrite');
        const store = tx.objectStore('surahs');
        store.put({ number: surahNum, name: surahName, audio: blob });
        
        const newDownloaded = [...downloadedSurahs, surahNum];
        setDownloadedSurahs(newDownloaded);
        localStorage.setItem('downloaded-surahs', JSON.stringify(newDownloaded));
        toast.success(`تم تحميل سورة ${surahName} للاستماع بدون إنترنت`);
      };
    } catch (error) {
      toast.error('فشل التحميل، تحقق من الاتصال بالإنترنت');
    } finally {
      setDownloading(null);
    }
  };

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 48));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 16));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="fixed left-6 top-24 z-40 shadow-lg">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">إعدادات القراءة</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* حجم الخط */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-3 block">
              حجم الخط ({fontSize}px)
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseFontSize}
                className="flex-shrink-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Slider
                value={[fontSize]}
                onValueChange={([value]) => setFontSize(value)}
                min={16}
                max={48}
                step={2}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={increaseFontSize}
                className="flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div 
              className="mt-4 p-4 bg-emerald-50 rounded-lg text-center font-[Amiri]"
              style={{ fontSize: `${fontSize}px` }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          </div>

          {/* نوع الخط */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-3 block">
              نوع الخط
            </label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    <span className={font.className}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div 
              className={`mt-4 p-4 bg-emerald-50 rounded-lg text-center ${
                FONT_FAMILIES.find(f => f.value === fontFamily)?.className
              }`}
              style={{ fontSize: '24px' }}
            >
              الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
            </div>
          </div>

          {/* المسافة بين الأسطر */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-3 block">
              المسافة بين الأسطر ({lineHeight})
            </label>
            <Slider
              value={[lineHeight]}
              onValueChange={([value]) => setLineHeight(value)}
              min={1.5}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* الوضع الليلي */}
          <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-indigo-600" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <span className="font-bold text-gray-700">الوضع الليلي</span>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          {/* التجويد */}
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-amber-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-gray-700">تلوين التجويد</span>
              </div>
              <Switch
                checked={tajweedEnabled}
                onCheckedChange={setTajweedEnabled}
              />
            </div>
            <p className="text-xs text-gray-500 mb-3">
              تلوين النص القرآني حسب أحكام التجويد لتسهيل القراءة الصحيحة
            </p>
            {tajweedEnabled && (
              <div className="p-3 bg-white rounded-lg">
                <TajweedText 
                  text="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                  enabled={true}
                  className="block text-xl text-center font-[Amiri] mb-3"
                />
                <div className="flex flex-wrap gap-2 text-xs justify-center">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TAJWEED_COLORS.ghunnah }} />
                    <span className="text-gray-600">غنة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TAJWEED_COLORS.ikhfa }} />
                    <span className="text-gray-600">إخفاء</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TAJWEED_COLORS.idgham }} />
                    <span className="text-gray-600">إدغام</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TAJWEED_COLORS.iqlab }} />
                    <span className="text-gray-600">إقلاب</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TAJWEED_COLORS.qalqalah }} />
                    <span className="text-gray-600">قلقلة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TAJWEED_COLORS.madd }} />
                    <span className="text-gray-600">مد</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* تحميل السور للاستماع بدون إنترنت */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-3 block flex items-center gap-2">
              <Download className="w-4 h-4" />
              تحميل للاستماع بدون إنترنت
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {DOWNLOADABLE_SURAHS.map(surah => (
                <div key={surah.number} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{surah.name}</span>
                  {downloadedSurahs.includes(surah.number) ? (
                    <span className="flex items-center gap-1 text-emerald-600 text-sm">
                      <Check className="w-4 h-4" /> محمّل
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadSurah(surah.number, surah.name)}
                      disabled={downloading === surah.number}
                      className="text-xs"
                    >
                      {downloading === surah.number ? (
                        <span className="animate-pulse">جاري...</span>
                      ) : (
                        <>
                          <Download className="w-3 h-3 ml-1" /> تحميل
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* إعادة تعيين */}
          <Button
            variant="outline"
            onClick={() => {
              setFontSize(24);
              setFontFamily('amiri');
              setLineHeight(2);
              setDarkMode(false);
              setTajweedEnabled(true);
            }}
            className="w-full"
          >
            إعادة تعيين الإعدادات
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}