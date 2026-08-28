import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { GitCompare, BookOpen, Loader2, Globe } from 'lucide-react';

const CompareTafsirDialog = ({ isOpen, onClose, verse }) => {
  const [compareMode, setCompareMode] = useState(false);
  const [loadingOnline, setLoadingOnline] = useState(false);
  const [onlineTafsir, setOnlineTafsir] = useState({});
  
  const tafasir = [
    { id: 'saadi', name: 'تفسير السعدي', content: verse.tafsir_saadi, color: 'amber', icon: '📖' },
    { id: 'kathir', name: 'تفسير ابن كثير', content: verse.tafsir_kathir, color: 'blue', icon: '📚' },
    { id: 'tabari', name: 'تفسير الطبري', content: verse.tafsir_tabari, color: 'purple', icon: '📜' }
  ];

  const availableTafasir = tafasir.filter(t => t.content);
  
  // جلب التفاسير من الإنترنت
  const fetchOnlineTafsir = async () => {
    setLoadingOnline(true);
    try {
      const editions = ['ar.muyassar', 'ar.jalalayn'];
      const promises = editions.map(edition =>
        fetch(`https://api.alquran.cloud/v1/ayah/${verse.surah_number}:${verse.verse_number}/${edition}`)
          .then(res => res.json())
      );
      
      const results = await Promise.all(promises);
      const newData = {};
      
      results.forEach((data, index) => {
        if (data.code === 200) {
          newData[editions[index]] = data.data.text;
        }
      });
      
      setOnlineTafsir(newData);
    } catch (err) {
      console.error('Error fetching online tafsir:', err);
    } finally {
      setLoadingOnline(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOnlineTafsir();
    }
  }, [isOpen, verse.surah_number, verse.verse_number]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-amber-700">
            <GitCompare className="w-6 h-6" />
            مقارنة التفاسير
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 p-4">
            {/* Arabic Text */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl border-2 border-emerald-300">
              <p className="text-2xl leading-loose font-arabic text-gray-800 text-center">
                {verse.arabic_text} ﴿{verse.verse_number}﴾
              </p>
            </div>
            
            {/* Toggle Compare Mode */}
            <div className="flex justify-center">
              <button
                onClick={() => setCompareMode(!compareMode)}
                className="px-6 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-medium transition-all"
              >
                {compareMode ? '📖 عرض منفصل' : '⚖️ عرض مقارن'}
              </button>
            </div>
            
            {compareMode ? (
              /* Compare Mode - Side by Side */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tafasir.map(tafsir => (
                  <div
                    key={tafsir.id}
                    className={`p-5 rounded-xl border-2 ${
                      tafsir.color === 'amber' ? 'bg-amber-50 border-amber-200' :
                      tafsir.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                      'bg-purple-50 border-purple-200'
                    }`}
                  >
                    <div className={`flex items-center gap-2 mb-4 pb-3 border-b-2 ${
                      tafsir.color === 'amber' ? 'border-amber-300' :
                      tafsir.color === 'blue' ? 'border-blue-300' :
                      'border-purple-300'
                    }`}>
                      <span className="text-xl">{tafsir.icon}</span>
                      <h3 className={`font-bold text-lg ${
                        tafsir.color === 'amber' ? 'text-amber-800' :
                        tafsir.color === 'blue' ? 'text-blue-800' :
                        'text-purple-800'
                      }`}>
                        {tafsir.name}
                      </h3>
                    </div>
                    {tafsir.content ? (
                      <p className="text-gray-800 leading-loose font-arabic">{tafsir.content}</p>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-400 text-sm">غير متوفر في قاعدة البيانات</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Tab Mode */
              <Tabs defaultValue={availableTafasir[0]?.id || 'saadi'} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-100">
                  {tafasir.map(tafsir => (
                    <TabsTrigger 
                      key={tafsir.id} 
                      value={tafsir.id}
                      className="data-[state=active]:bg-white"
                    >
                      <span className="ml-1">{tafsir.icon}</span>
                      {tafsir.name.replace('تفسير ', '')}
                      {tafsir.content && <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {tafasir.map(tafsir => (
                  <TabsContent key={tafsir.id} value={tafsir.id}>
                    <div className={`p-6 rounded-xl border-2 ${
                      tafsir.color === 'amber' ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200' :
                      tafsir.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' :
                      'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200'
                    }`}>
                      <div className={`flex items-center gap-2 mb-4 pb-4 border-b-2 ${
                        tafsir.color === 'amber' ? 'border-amber-300' :
                        tafsir.color === 'blue' ? 'border-blue-300' :
                        'border-purple-300'
                      }`}>
                        <span className="text-2xl">{tafsir.icon}</span>
                        <h3 className={`font-bold text-xl ${
                          tafsir.color === 'amber' ? 'text-amber-800' :
                          tafsir.color === 'blue' ? 'text-blue-800' :
                          'text-purple-800'
                        }`}>
                          {tafsir.name}
                        </h3>
                      </div>
                      {tafsir.content ? (
                        <p className="text-gray-800 leading-loose text-lg font-arabic">{tafsir.content}</p>
                      ) : (
                        <div className="text-center py-8">
                          <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                          <p className="text-gray-500 mb-2">التفسير غير متوفر حالياً في قاعدة البيانات</p>
                          <p className="text-gray-400 text-sm">يمكنك استخدام زر "تفسير من الإنترنت" لجلب التفسير</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
            
            {/* تفاسير من الإنترنت */}
            {(onlineTafsir['ar.muyassar'] || onlineTafsir['ar.jalalayn']) && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-indigo-800">تفاسير إضافية من الإنترنت</h3>
                  <Badge variant="outline" className="text-xs">مباشر</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {onlineTafsir['ar.muyassar'] && (
                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-bold text-indigo-800">التفسير الميسر</h4>
                      </div>
                      <p className="text-gray-700 leading-loose font-arabic">{onlineTafsir['ar.muyassar']}</p>
                    </div>
                  )}
                  {onlineTafsir['ar.jalalayn'] && (
                    <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-200">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-5 h-5 text-teal-600" />
                        <h4 className="font-bold text-teal-800">تفسير الجلالين</h4>
                      </div>
                      <p className="text-gray-700 leading-loose font-arabic">{onlineTafsir['ar.jalalayn']}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {loadingOnline && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500 ml-2" />
                <span className="text-indigo-600">جاري تحميل التفاسير الإضافية...</span>
              </div>
            )}

            {/* Info Box */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <p className="text-sm text-amber-900 leading-relaxed">
                📚 <strong>فائدة:</strong> مقارنة التفاسير المختلفة تساعد على فهم الآية من زوايا متعددة والاستفادة من علم المفسرين المختلفين
              </p>
            </div>
            
            {/* Tafsir Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 text-center">
                <p className="text-sm text-amber-700 font-bold">📖 تفسير السعدي</p>
                <p className="text-xs text-gray-600 mt-1">تفسير مختصر وميسر للفهم</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 text-center">
                <p className="text-sm text-blue-700 font-bold">📚 تفسير ابن كثير</p>
                <p className="text-xs text-gray-600 mt-1">تفسير مفصل بالأحاديث والآثار</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 text-center">
                <p className="text-sm text-purple-700 font-bold">📜 تفسير الطبري</p>
                <p className="text-xs text-gray-600 mt-1">جامع البيان - أم التفاسير</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CompareTafsirDialog;