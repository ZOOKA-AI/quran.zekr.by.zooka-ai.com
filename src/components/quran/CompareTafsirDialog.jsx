import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitCompare, BookOpen } from 'lucide-react';

const CompareTafsirDialog = ({ isOpen, onClose, verse }) => {
  const [compareMode, setCompareMode] = useState(false);
  
  const tafasir = [
    { id: 'saadi', name: 'تفسير السعدي', content: verse.tafsir_saadi, color: 'emerald' },
    { id: 'kathir', name: 'تفسير ابن كثير', content: verse.tafsir_kathir, color: 'blue' },
    { id: 'tabari', name: 'تفسير الطبري', content: verse.tafsir_tabari, color: 'amber' }
  ].filter(t => t.content);

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
                    className={`p-5 bg-${tafsir.color}-50 rounded-xl border-2 border-${tafsir.color}-200`}
                  >
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-${tafsir.color}-300">
                      <BookOpen className={`w-5 h-5 text-${tafsir.color}-700`} />
                      <h3 className={`font-bold text-lg text-${tafsir.color}-800`}>
                        {tafsir.name}
                      </h3>
                    </div>
                    <p className="text-gray-800 leading-relaxed text-sm">
                      {tafsir.content || 'غير متوفر'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              /* Tab Mode */
              <Tabs defaultValue={tafasir[0]?.id} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  {tafasir.map(tafsir => (
                    <TabsTrigger key={tafsir.id} value={tafsir.id}>
                      {tafsir.name.replace('تفسير ', '')}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {tafasir.map(tafsir => (
                  <TabsContent key={tafsir.id} value={tafsir.id}>
                    <div className={`p-6 bg-${tafsir.color}-50 rounded-xl border-2 border-${tafsir.color}-200`}>
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b-2 border-${tafsir.color}-300">
                        <BookOpen className={`w-6 h-6 text-${tafsir.color}-700`} />
                        <h3 className={`font-bold text-xl text-${tafsir.color}-800`}>
                          {tafsir.name}
                        </h3>
                      </div>
                      <p className="text-gray-800 leading-relaxed text-lg">
                        {tafsir.content || 'غير متوفر'}
                      </p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
            
            {/* Info Box */}
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-900 leading-relaxed">
                📚 <strong>فائدة:</strong> مقارنة التفاسير المختلفة تساعد على فهم الآية من زوايا متعددة والاستفادة من علم المفسرين المختلفين
              </p>
            </div>
            
            {/* Tafsir Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                <p className="text-xs text-emerald-700 font-medium">تفسير السعدي</p>
                <p className="text-xs text-gray-600 mt-1">تفسير مختصر وواضح</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                <p className="text-xs text-blue-700 font-medium">تفسير ابن كثير</p>
                <p className="text-xs text-gray-600 mt-1">تفسير مفصل بالأحاديث</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
                <p className="text-xs text-amber-700 font-medium">تفسير الطبري</p>
                <p className="text-xs text-gray-600 mt-1">تفسير تاريخي شامل</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CompareTafsirDialog;