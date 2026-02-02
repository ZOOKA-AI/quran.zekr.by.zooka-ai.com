import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCard, ExternalLink, Copy, QrCode, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500, 1000];
const ZIINA_PAYMENT_URL = 'https://pay.ziina.com/helmyharoon822';

export default function ZiinaAmountSelector() {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handlePresetAmount = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setAmount('');
  };

  const finalAmount = customAmount || amount;

  const handleDonate = () => {
    window.open(ZIINA_PAYMENT_URL, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(ZIINA_PAYMENT_URL);
    setCopied(true);
    toast({
      title: "تم النسخ! ✅",
      description: "تم نسخ رابط الدفع بنجاح",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2 text-teal-800">
          <CreditCard className="w-6 h-6" />
          التبرع عبر Ziina زينة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* المبالغ المسبقة */}
        <div>
          <label className="text-gray-700 font-bold mb-3 block text-sm">اختر المبلغ (درهم)</label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_AMOUNTS.map(preset => (
              <button
                key={preset}
                onClick={() => handlePresetAmount(preset)}
                className={`p-2 rounded-lg border-2 font-bold text-sm transition-all ${
                  amount === preset
                    ? 'border-teal-500 bg-teal-100 text-teal-700'
                    : 'border-gray-200 hover:border-teal-300 bg-white'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* مبلغ مخصص */}
        <div>
          <label className="text-gray-700 font-bold mb-2 block text-sm">أو أدخل مبلغ آخر</label>
          <Input
            type="number"
            placeholder="أدخل المبلغ بالدرهم"
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            className="h-12 text-center"
            min="1"
          />
        </div>

        {/* ملخص */}
        {finalAmount && (
          <div className="bg-white/80 p-3 rounded-lg border border-teal-200 text-center">
            <span className="text-gray-600">مبلغ التبرع: </span>
            <span className="text-xl font-bold text-teal-600">{finalAmount} د.إ</span>
          </div>
        )}

        {/* زر التبرع */}
        <Button
          onClick={handleDonate}
          className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold"
        >
          <ExternalLink className="w-5 h-5 ml-2" />
          {finalAmount ? `تبرع بـ ${finalAmount} د.إ عبر Ziina` : 'تبرع عبر Ziina'}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          سيتم فتح صفحة Ziina الآمنة للدفع
        </p>
      </CardContent>
    </Card>
  );
}