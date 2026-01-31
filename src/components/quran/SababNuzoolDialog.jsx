import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info } from 'lucide-react';

const SababNuzoolDialog = ({ isOpen, onClose, verse }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-blue-700">
            <Info className="w-6 h-6" />
            سبب نزول الآية {verse.verse_number}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 p-4">
            {/* Arabic Text */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl border border-emerald-200">
              <p className="text-2xl leading-loose font-arabic text-gray-800 text-center">
                {verse.arabic_text} ﴿{verse.verse_number}﴾
              </p>
            </div>
            
            {/* Sabab Nuzool */}
            <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                سبب النزول
              </h3>
              <p className="text-gray-800 leading-relaxed text-lg">
                {verse.sabab_nuzool || 'لا يوجد سبب نزول محدد لهذه الآية'}
              </p>
            </div>
            
            {/* Additional Context */}
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-900">
                💡 <strong>فائدة:</strong> معرفة سبب النزول يساعد على فهم الآية بشكل أعمق ومعرفة السياق التاريخي لها
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SababNuzoolDialog;