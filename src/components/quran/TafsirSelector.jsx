import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const TAFSIR_SOURCES = [
  { id: 'saadi', name: 'تفسير السعدي', color: 'amber', description: 'تفسير ميسر وواضح' },
  { id: 'kathir', name: 'تفسير ابن كثير', color: 'blue', description: 'تفسير شامل بالأحاديث' },
  { id: 'tabari', name: 'تفسير الطبري', color: 'purple', description: 'أم التفاسير' },
  { id: 'qurtubi', name: 'تفسير القرطبي', color: 'emerald', description: 'تفسير فقهي' },
  { id: 'baghawi', name: 'تفسير البغوي', color: 'rose', description: 'معالم التنزيل' },
];

export default function TafsirSelector({ verse, onSelectTafsir }) {
  const [selectedTafsir, setSelectedTafsir] = useState('saadi');
  const [expandedTafsirs, setExpandedTafsirs] = useState(['saadi']);

  const toggleTafsir = (tafsirId) => {
    setExpandedTafsirs(prev => 
      prev.includes(tafsirId) 
        ? prev.filter(id => id !== tafsirId)
        : [...prev, tafsirId]
    );
  };

  const getTafsirContent = (tafsirId) => {
    const tafsirMap = {
      saadi: verse?.tafsir_saadi,
      kathir: verse?.tafsir_kathir,
      tabari: verse?.tafsir_tabari,
    };
    return tafsirMap[tafsirId] || null;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-amber-600" />
        <h3 className="font-bold text-gray-800">التفاسير المتاحة</h3>
      </div>

      {TAFSIR_SOURCES.slice(0, 3).map((tafsir) => {
        const content = getTafsirContent(tafsir.id);
        const isExpanded = expandedTafsirs.includes(tafsir.id);
        
        return (
          <Collapsible key={tafsir.id} open={isExpanded} onOpenChange={() => toggleTafsir(tafsir.id)}>
            <Card className={`border-${tafsir.color}-200 overflow-hidden transition-all ${isExpanded ? 'shadow-lg' : 'shadow-sm'}`}>
              <CollapsibleTrigger asChild>
                <CardHeader className={`cursor-pointer hover:bg-${tafsir.color}-50 transition-colors py-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-${tafsir.color}-100 flex items-center justify-center`}>
                        <BookOpen className={`w-5 h-5 text-${tafsir.color}-600`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{tafsir.name}</CardTitle>
                        <p className="text-xs text-gray-500">{tafsir.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {content ? (
                        <Badge className={`bg-${tafsir.color}-100 text-${tafsir.color}-700`}>متوفر</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-400">غير متوفر</Badge>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className={`bg-gradient-to-br from-${tafsir.color}-50/50 to-white border-t border-${tafsir.color}-100`}>
                  {content ? (
                    <ScrollArea className="max-h-[300px]">
                      <p className="text-gray-700 leading-loose text-right font-arabic text-lg p-2">
                        {content}
                      </p>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-400 mb-3">التفسير غير متوفر حالياً في قاعدة البيانات</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectTafsir && onSelectTafsir(tafsir.id)}
                        className={`border-${tafsir.color}-300 text-${tafsir.color}-600 hover:bg-${tafsir.color}-50`}
                      >
                        <ExternalLink className="w-4 h-4 ml-2" />
                        جلب من الإنترنت
                      </Button>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
}