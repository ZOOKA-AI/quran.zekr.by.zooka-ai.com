import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle, Heart, Home, Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import confetti from 'canvas-confetti';

export default function DonationSuccess() {
  const [copied, setCopied] = useState(false);
  
  // Get amount from URL if available
  const urlParams = new URLSearchParams(window.location.search);
  const amount = urlParams.get('amount');

  useEffect(() => {
    // Trigger confetti on load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#059669', '#047857', '#fcd34d', '#fbbf24']
    });
  }, []);

  const shareMessage = `الحمد لله، تبرعت لكفالة الأيتام عبر تطبيق القرآن الكريم 🤲\nانضم للخير: ${window.location.origin}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'تبرعت لكفالة الأيتام',
          text: shareMessage,
          url: window.location.origin
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" dir="rtl">
      <div className="max-w-lg w-full">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-2xl">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>

            {/* Thank You Message */}
            <h1 className="text-3xl font-bold text-emerald-800 mb-4">
              جزاك الله خيراً! 🤲
            </h1>
            
            <p className="text-xl text-gray-700 mb-2">
              تم استلام تبرعك بنجاح
            </p>

            {amount && (
              <div className="bg-white/80 rounded-xl p-4 mb-6 border border-emerald-200">
                <p className="text-gray-600">مبلغ التبرع</p>
                <p className="text-3xl font-bold text-emerald-600">{amount} د.إ</p>
              </div>
            )}

            {/* Hadith */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 mb-6 border border-amber-200">
              <p className="text-amber-800 font-arabic text-lg leading-relaxed">
                « أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا »
              </p>
              <p className="text-amber-600 text-sm mt-2">وأشار بالسبابة والوسطى - رواه البخاري</p>
            </div>

            {/* Dua */}
            <div className="bg-white/60 rounded-xl p-4 mb-6">
              <p className="text-emerald-700 font-arabic text-lg">
                اللهم اجعله في ميزان حسناتك يوم القيامة
              </p>
              <p className="text-emerald-600 text-sm mt-2">
                🤲 صدقة جارية على روح المرحومة جزبية عبد الرحيم هارون علي
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleShare}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Share2 className="w-5 h-5 ml-2" />
                شارك الخير مع الآخرين
              </Button>

              <Button
                onClick={handleCopy}
                variant="outline"
                className="w-full h-12 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <Copy className="w-5 h-5 ml-2" />
                {copied ? 'تم النسخ! ✅' : 'نسخ رسالة المشاركة'}
              </Button>

              <Link to={createPageUrl('Orphans')} className="block">
                <Button
                  variant="outline"
                  className="w-full h-12 border-pink-300 text-pink-700 hover:bg-pink-50"
                >
                  <Heart className="w-5 h-5 ml-2" />
                  تبرع مرة أخرى
                </Button>
              </Link>

              <Link to={createPageUrl('Quran')} className="block">
                <Button
                  variant="ghost"
                  className="w-full h-12 text-gray-600 hover:text-emerald-700"
                >
                  <Home className="w-5 h-5 ml-2" />
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          🏢 Royal Haroon Cleaning FZ-LLC
        </p>
      </div>
    </div>
  );
}