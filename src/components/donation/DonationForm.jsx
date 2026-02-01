import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, CreditCard, Loader2, Gift, Baby, BookOpen, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const DONATION_TYPES = [
  { id: 'كفالة يتيم', name: 'كفالة يتيم', icon: Baby, color: 'from-pink-500 to-rose-600' },
  { id: 'صدقة جارية', name: 'صدقة جارية', icon: Heart, color: 'from-emerald-500 to-green-600' },
  { id: 'زكاة', name: 'زكاة', icon: BookOpen, color: 'from-amber-500 to-orange-600' },
  { id: 'تبرع عام', name: 'تبرع عام', icon: Gift, color: 'from-blue-500 to-indigo-600' },
];

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

const CURRENCIES = [
  { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ' },
  { code: 'USD', name: 'دولار أمريكي', symbol: '$' },
  { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س' },
  { code: 'EGP', name: 'جنيه مصري', symbol: 'ج.م' },
];

export default function DonationForm() {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [currency, setCurrency] = useState('AED');
  const [donationType, setDonationType] = useState('صدقة جارية');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePresetAmount = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setAmount('');
  };

  const finalAmount = customAmount || amount;

  const handleDonate = async () => {
    if (!finalAmount || parseFloat(finalAmount) < 1) {
      toast.error('يرجى إدخال مبلغ صالح');
      return;
    }

    // التحقق من أننا لسنا في iframe
    if (window.self !== window.top) {
      toast.error('للتبرع، يرجى فتح التطبيق في نافذة جديدة');
      window.open(window.location.href, '_blank');
      return;
    }

    setIsLoading(true);

    try {
      const response = await base44.functions.invoke('createDonationCheckout', {
        amount: parseFloat(finalAmount),
        currency,
        donationType,
        donorName: donorName || 'متبرع مجهول',
        donorEmail,
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('لم يتم إنشاء رابط الدفع');
      }
    } catch (error) {
      console.error('Donation error:', error);
      toast.error('حدث خطأ، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCurrency = CURRENCIES.find(c => c.code === currency);

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white pb-8">
        <CardTitle className="text-2xl flex items-center gap-3 justify-center">
          <Heart className="w-8 h-8" />
          تبرع الآن - صدقة جارية
        </CardTitle>
        <p className="text-emerald-100 text-center mt-2">
          "مَن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا فَيُضَاعِفَهُ لَهُ"
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* نوع التبرع */}
        <div>
          <label className="text-gray-700 font-bold mb-3 block">نوع التبرع</label>
          <div className="grid grid-cols-2 gap-3">
            {DONATION_TYPES.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setDonationType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    donationType === type.id
                      ? `border-emerald-500 bg-gradient-to-br ${type.color} text-white`
                      : 'border-gray-200 hover:border-emerald-300 bg-white'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${donationType === type.id ? 'text-white' : 'text-gray-500'}`} />
                  <p className={`text-sm font-bold ${donationType === type.id ? 'text-white' : 'text-gray-700'}`}>
                    {type.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* العملة */}
        <div>
          <label className="text-gray-700 font-bold mb-2 block">العملة</label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map(curr => (
                <SelectItem key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* المبالغ المسبقة */}
        <div>
          <label className="text-gray-700 font-bold mb-3 block">اختر المبلغ</label>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map(preset => (
              <button
                key={preset}
                onClick={() => handlePresetAmount(preset)}
                className={`p-3 rounded-xl border-2 font-bold transition-all ${
                  amount === preset
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                {preset} {selectedCurrency?.symbol}
              </button>
            ))}
          </div>
        </div>

        {/* مبلغ مخصص */}
        <div>
          <label className="text-gray-700 font-bold mb-2 block">أو أدخل مبلغ آخر</label>
          <div className="relative">
            <Input
              type="number"
              placeholder="أدخل المبلغ"
              value={customAmount}
              onChange={(e) => handleCustomAmount(e.target.value)}
              className="h-14 text-xl text-center pr-16"
              min="1"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
              {selectedCurrency?.symbol}
            </span>
          </div>
        </div>

        {/* معلومات المتبرع (اختياري) */}
        <div className="space-y-3 pt-4 border-t">
          <p className="text-gray-500 text-sm">معلومات المتبرع (اختياري)</p>
          <Input
            placeholder="الاسم"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="h-12"
          />
          <Input
            type="email"
            placeholder="البريد الإلكتروني"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            className="h-12"
          />
        </div>

        {/* ملخص */}
        {finalAmount && (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">المبلغ:</span>
              <span className="text-2xl font-bold text-emerald-600">
                {finalAmount} {selectedCurrency?.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-600">نوع التبرع:</span>
              <span className="font-bold text-gray-800">{donationType}</span>
            </div>
          </div>
        )}

        {/* زر التبرع */}
        <Button
          onClick={handleDonate}
          disabled={!finalAmount || isLoading}
          className="w-full h-14 text-lg bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 ml-2 animate-spin" />
              جاري التحويل...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 ml-2" />
              تبرع الآن
            </>
          )}
        </Button>

        {/* شعار Stripe */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-400">
            🔒 الدفع آمن عبر Stripe
          </p>
        </div>
      </CardContent>
    </Card>
  );
}