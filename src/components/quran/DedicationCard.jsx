import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function DedicationCard() {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'تطبيق القرآن الكريم',
          text: 'شارك التطبيق واربح الأجر',
          url: window.location.origin
        });
      } else {
        toast.info('المشاركة غير مدعومة في هذا المتصفح');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    toast.success('تم نسخ الرابط');
  };

  return (
    <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg border-2 border-emerald-400">
      <div className="p-6 text-center">
        <div className="text-4xl mb-3">🤲</div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">صدقة جارية لوجه الله تعالى</h2>
        <p className="text-lg mb-1 font-bold text-white">على روح المرحومة</p>
        <p className="text-xl mb-3 font-bold text-amber-200 font-arabic">جزبية عبد الرحيم هارون علي</p>
        
        <div className="bg-white/10 rounded-lg p-3 mb-3">
          <p className="text-sm font-bold text-white mb-2 font-arabic">
            اللهم اغفر لها وارحمها وعافها واعف عنها
          </p>
          <p className="text-amber-200 font-bold text-sm">اللهم آمين 🤲</p>
        </div>

        <p className="text-lg mb-4 font-bold text-white">
          هذا التطبيق مجاني بالكامل ولا نطلب أي تبرعات
        </p>

        <div className="bg-white rounded-xl p-4 max-w-2xl mx-auto shadow-lg">
          <p className="text-base font-bold text-gray-900 mb-3 font-arabic">
            ﴿ إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ ﴾
          </p>
          <p className="text-gray-900 mb-4 text-base font-bold">
            شارك التطبيق واربح الأجر
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button
              onClick={handleShare}
              className="bg-white hover:bg-gray-50 text-emerald-700 border-2 border-emerald-300 font-bold"
            >
              <Share2 className="w-4 h-4 ml-1" />
              مشاركة
            </Button>
            <Button
              onClick={handleCopyLink}
              className="bg-white hover:bg-gray-50 text-amber-700 border-2 border-amber-300 font-bold"
            >
              <Copy className="w-4 h-4 ml-1" />
              نسخ الرابط
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}