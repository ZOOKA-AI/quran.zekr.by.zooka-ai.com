import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Link2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const RelatedVersesDialog = ({ isOpen, onClose, verse }) => {
  const relatedVerses = verse.related_verses || [];
  
  const { data: versesData = [], isLoading } = useQuery({
    queryKey: ['related-verses', verse.id],
    queryFn: async () => {
      if (relatedVerses.length === 0) return [];
      
      const promises = relatedVerses.map(async (related) => {
        const verses = await base44.entities.Verse.filter({
          surah_number: related.surah_number,
          verse_number: related.verse_number
        });
        return {
          ...verses[0],
          relation_type: related.relation_type
        };
      });
      
      return Promise.all(promises);
    },
    enabled: isOpen && relatedVerses.length > 0,
    initialData: [],
  });

  const getRelationTypeBadge = (type) => {
    const types = {
      'similar': { label: 'متشابهة', color: 'bg-purple-100 text-purple-700' },
      'context': { label: 'سياق مشترك', color: 'bg-blue-100 text-blue-700' },
      'theme': { label: 'موضوع مشترك', color: 'bg-green-100 text-green-700' },
      'explanation': { label: 'توضيح', color: 'bg-amber-100 text-amber-700' }
    };
    return types[type] || { label: type, color: 'bg-gray-100 text-gray-700' };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-purple-700">
            <Link2 className="w-6 h-6" />
            الآيات المتشابهة والمرتبطة
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 p-4">
            {/* Current Verse */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl border-2 border-emerald-300">
              <p className="text-sm text-gray-600 mb-2">الآية الحالية:</p>
              <p className="text-xl leading-loose font-arabic text-gray-800 text-center">
                {verse.arabic_text} ﴿{verse.verse_number}﴾
              </p>
            </div>
            
            {/* Related Verses */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            ) : versesData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد آيات متشابهة مسجلة
              </div>
            ) : (
              versesData.map((relatedVerse, idx) => {
                const relationInfo = getRelationTypeBadge(relatedVerse.relation_type);
                return (
                  <div
                    key={idx}
                    className="p-5 bg-white rounded-xl border-2 border-purple-100 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-purple-100 text-purple-700">
                        سورة {relatedVerse.surah_number} - آية {relatedVerse.verse_number}
                      </Badge>
                      <Badge className={relationInfo.color}>
                        {relationInfo.label}
                      </Badge>
                    </div>
                    
                    <p className="text-xl leading-loose font-arabic text-gray-800 mb-4 text-center p-3 bg-purple-50 rounded-lg">
                      {relatedVerse.arabic_text}
                    </p>
                    
                    {relatedVerse.translation_english && (
                      <p className="text-sm text-gray-600 italic border-r-4 border-purple-300 pr-3">
                        {relatedVerse.translation_english}
                      </p>
                    )}
                    
                    <Link to={createPageUrl(`SurahView?surah=${relatedVerse.surah_number}`)}>
                      <button className="mt-3 text-purple-600 hover:text-purple-800 text-sm font-medium">
                        اذهب إلى السورة ←
                      </button>
                    </Link>
                  </div>
                );
              })
            )}
            
            {/* Info Box */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-900">
                🔗 <strong>فائدة:</strong> الربط بين الآيات المتشابهة يساعد على فهم القرآن بشكل متكامل ومعرفة العلاقات بين المواضيع
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RelatedVersesDialog;