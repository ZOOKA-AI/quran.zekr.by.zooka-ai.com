import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, BookOpen, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const TAFSIR_EDITIONS = [
  { id: 'ar.muyassar', name: 'التفسير الميسر', language: 'ar', color: 'emerald' },
  { id: 'ar.jalalayn', name: 'تفسير الجلالين', language: 'ar', color: 'amber' },
  { id: 'ar.kathir', name: 'تفسير ابن كثير', language: 'ar', color: 'blue' },
  { id: 'ar.tabari', name: 'تفسير الطبري', language: 'ar', color: 'purple' },
  { id: 'ar.saadi', name: 'تفسير السعدي', language: 'ar', color: 'rose' },
  { id: 'ar.qurtubi', name: 'تفسير القرطبي', language: 'ar', color: 'orange' },
  { id: 'ar.baghawi', name: 'تفسير البغوي', language: 'ar', color: 'teal' },
  { id: 'en.sahih', name: 'Sahih International', language: 'en', color: 'indigo' },
];

export default function TafsirViewer({ surahNumber, verseNumber, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tafsirData, setTafsirData] = useState({});
  const [selectedEdition, setSelectedEdition] = useState('ar.muyassar');
  const [verseText, setVerseText] = useState('');

  useEffect(() => {
    if (isOpen && surahNumber && verseNumber) {
      fetchTafsir();
      fetchVerseText();
    }
  }, [isOpen, surahNumber, verseNumber, selectedEdition]);

  const fetchVerseText = async () => {
    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/ayah/${surahNumber}:${verseNumber}/ar.alafasy`
      );
      const data = await response.json();
      if (data.code === 200) {
        setVerseText(data.data.text);
      }
    } catch (err) {
      console.error('Error fetching verse:', err);
    }
  };

  const fetchTafsir = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/ayah/${surahNumber}:${verseNumber}/${selectedEdition}`
      );
      const data = await response.json();

      if (data.code === 200) {
        setTafsirData(prev => ({
          ...prev,
          [selectedEdition]: data.data
        }));
      } else {
        setError('فشل في جلب التفسير');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخدمة');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTafsirs = async () => {
    setLoading(true);
    try {
      const promises = TAFSIR_EDITIONS.map(edition =>
        fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${verseNumber}/${edition.id}`)
          .then(res => res.json())
      );
      
      const results = await Promise.all(promises);
      const newTafsirData = {};
      
      results.forEach((data, index) => {
        if (data.code === 200) {
          newTafsirData[TAFSIR_EDITIONS[index].id] = data.data;
        }
      });
      
      setTafsirData(newTafsirData);
    } catch (err) {
      setError('خطأ في جلب التفاسير');
    } finally {
      setLoading(false);
    }
  };

  const currentTafsir = tafsirData[selectedEdition];
  const currentEdition = TAFSIR_EDITIONS.find(e => e.id === selectedEdition);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-amber-500/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-amber-100">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span>تفسير الآية {verseNumber} من سورة رقم {surahNumber}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Verse Display */}
          <Card className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 border-amber-500/30">
            <CardContent className="p-6">
              <p className="text-2xl font-arabic text-amber-100 text-center leading-loose" dir="rtl">
                {verseText || 'جاري التحميل...'}
              </p>
              <div className="flex justify-center mt-4">
                <Badge className="bg-amber-600/50 text-amber-100">
                  الآية {verseNumber}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tafsir Selection */}
          <Tabs value={selectedEdition} onValueChange={setSelectedEdition} dir="rtl">
            <div className="mb-4">
              <p className="text-amber-200 text-sm mb-3">اختر التفسير:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TAFSIR_EDITIONS.map(edition => (
                  <Button
                    key={edition.id}
                    variant={selectedEdition === edition.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedEdition(edition.id)}
                    className={`text-xs ${
                      selectedEdition === edition.id 
                        ? `bg-${edition.color}-600 hover:bg-${edition.color}-700 text-white` 
                        : `border-${edition.color}-500/50 text-${edition.color}-300 hover:bg-${edition.color}-900/30`
                    }`}
                  >
                    {edition.name}
                  </Button>
                ))}
              </div>
            </div>
            <TabsList className="hidden">

            {TAFSIR_EDITIONS.map(edition => (
              <TabsContent key={edition.id} value={edition.id} className="mt-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-amber-200 flex items-center gap-2">
                      <span>{edition.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {edition.language === 'ar' ? 'عربي' : 'English'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                        </div>
                      ) : error ? (
                        <div className="text-center py-8">
                          <p className="text-red-400 mb-4">{error}</p>
                          <Button onClick={fetchTafsir} variant="outline" size="sm">
                            إعادة المحاولة
                          </Button>
                        </div>
                      ) : tafsirData[edition.id] ? (
                        <p 
                          className={`text-slate-200 leading-loose ${edition.language === 'ar' ? 'text-right font-arabic text-lg' : 'text-left'}`}
                          dir={edition.language === 'ar' ? 'rtl' : 'ltr'}
                        >
                          {tafsirData[edition.id].text}
                        </p>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-400">اضغط لتحميل التفسير</p>
                          <Button onClick={fetchTafsir} className="mt-4 bg-amber-600 hover:bg-amber-700">
                            تحميل التفسير
                          </Button>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Additional Info */}
          {currentTafsir && (
            <div className="flex items-center justify-between text-sm text-slate-400 px-2">
              <span>المصدر: Al Quran Cloud API</span>
              <a 
                href={`https://quran.com/${surahNumber}/${verseNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
              >
                <span>عرض على Quran.com</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}