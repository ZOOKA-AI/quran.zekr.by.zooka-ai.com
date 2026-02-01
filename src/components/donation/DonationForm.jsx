import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, CreditCard, Loader2, Gift, Baby, BookOpen, Sparkles, User, Mail, ChevronDown, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const DONATION_TYPES = [
  { 
    id: 'كفالة يتيم', 
    name: 'كفالة يتيم', 
    icon: Baby, 
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-300',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80',
    description: 'اكفل يتيماً وكن رفيقه في الجنة'
  },
  { 
    id: 'صدقة جارية', 
    name: 'صدقة جارية', 
    icon: Heart, 
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&q=80',
    description: 'صدقة تستمر بعد الموت'
  },
  { 
    id: 'زكاة', 
    name: 'زكاة', 
    icon: BookOpen, 
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80',
    description: 'طهّر مالك وزكّه'
  },
  { 
    id: 'تبرع عام', 
    name: 'تبرع عام', 
    icon: Gift, 
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&q=80',
    description: 'ساهم في أعمال الخير'
  },
];

const PRESET_AMOUNTS = [
  { value: 10, label: '10', popular: false },
  { value: 25, label: '25', popular: false },
  { value: 50, label: '50', popular: true },
  { value: 100, label: '100', popular: true },
  { value: 250, label: '250', popular: false },
  { value: 500, label: '500', popular: false },
];

const CURRENCIES = [
  { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'USD', name: 'دولار أمريكي', symbol: '$', flag: '🇺🇸' },
  { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س', flag: '🇸🇦' },
  { code: 'EGP', name: 'جنيه مصري', symbol: 'ج.م', flag: '🇪🇬' },
];

export default function DonationForm() {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [currency, setCurrency] = useState('AED');
  const [donationType, setDonationType] = useState('صدقة جارية');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDonorInfo, setShowDonorInfo] = useState(false);

  const handlePresetAmount = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setAmount('');
  };

  const finalAmount = customAmount || amount;
  const selectedType = DONATION_TYPES.find(t => t.id === donationType);

  const handleDonate = async () => {
    if (!finalAmount || parseFloat(finalAmount) < 1) {
      toast.error('يرجى إدخال مبلغ صالح');
      return;
    }

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
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden rounded-3xl">
      {/* Header with animated background */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30"
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-2">تبرع الآن</h2>
          <p className="text-emerald-100 text-lg font-arabic">
            "مَن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا"
          </p>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* نوع التبرع - بطاقات مع صور */}
        <div>
          <label className="text-gray-700 font-bold mb-4 block flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            اختر نوع التبرع
          </label>
          <div className="grid grid-cols-2 gap-3">
            {DONATION_TYPES.map(type => {
              const Icon = type.icon;
              const isSelected = donationType === type.id;
              return (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDonationType(type.id)}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? `ring-4 ring-emerald-500 ring-offset-2`
                      : 'ring-1 ring-gray-200 hover:ring-emerald-300'
                  }`}
                >
                  {/* صورة الخلفية */}
                  <div className="h-24 relative">
                    <img 
                      src={type.image} 
                      alt={type.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${type.color} opacity-80`} />
                    
                    {/* أيقونة التحديد */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-emerald-600" />
                      </motion.div>
                    )}
                    
                    {/* المحتوى */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2">
                      <Icon className="w-8 h-8 mb-1" />
                      <p className="font-bold text-sm">{type.name}</p>
                    </div>
                  </div>
                  
                  {/* وصف */}
                  <div className={`p-2 text-xs text-center ${isSelected ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                    <p className={isSelected ? 'text-emerald-700' : 'text-gray-600'}>{type.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* العملة - تصميم محسن */}
        <div>
          <label className="text-gray-700 font-bold mb-3 block">العملة</label>
          <div className="grid grid-cols-4 gap-2">
            {CURRENCIES.map(curr => (
              <button
                key={curr.code}
                onClick={() => setCurrency(curr.code)}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                  currency === curr.code
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-300 bg-white'
                }`}
              >
                <span className="text-xl">{curr.flag}</span>
                <span className={`text-xs font-bold ${currency === curr.code ? 'text-emerald-700' : 'text-gray-600'}`}>
                  {curr.code}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* المبالغ المسبقة - تصميم تفاعلي */}
        <div>
          <label className="text-gray-700 font-bold mb-3 block">اختر المبلغ</label>
          <div className="grid grid-cols-3 gap-3">
            {PRESET_AMOUNTS.map(preset => (
              <motion.button
                key={preset.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePresetAmount(preset.value)}
                className={`relative p-4 rounded-2xl border-2 font-bold transition-all ${
                  amount === preset.value
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-200'
                    : 'border-gray-200 hover:border-emerald-300 bg-white'
                }`}
              >
                {preset.popular && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    شائع
                  </span>
                )}
                <span className="text-2xl block">{preset.label}</span>
                <span className={`text-xs ${amount === preset.value ? 'text-white/80' : 'text-gray-500'}`}>
                  {selectedCurrency?.symbol}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* مبلغ مخصص */}
        <div className="relative">
          <label className="text-gray-700 font-bold mb-2 block">أو أدخل مبلغ آخر</label>
          <div className="relative">
            <Input
              type="number"
              placeholder="المبلغ"
              value={customAmount}
              onChange={(e) => handleCustomAmount(e.target.value)}
              className="h-16 text-2xl text-center rounded-2xl border-2 border-gray-200 focus:border-emerald-500 pr-20"
              min="1"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-emerald-100 px-3 py-1 rounded-lg">
              <span className="text-emerald-700 font-bold">{selectedCurrency?.symbol}</span>
            </div>
          </div>
        </div>

        {/* معلومات المتبرع - قابلة للطي */}
        <div className="border-t pt-4">
          <button
            onClick={() => setShowDonorInfo(!showDonorInfo)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-2 text-gray-600">
              <User className="w-5 h-5" />
              معلومات المتبرع (اختياري)
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showDonorInfo ? 'rotate-180' : ''}`} />
          </button>
          
          {showDonorInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 mt-3"
            >
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="الاسم"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="h-12 pr-12 rounded-xl"
                />
              </div>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="h-12 pr-12 rounded-xl"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* ملخص التبرع */}
        {finalAmount && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-5 rounded-2xl border border-emerald-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {selectedType && <selectedType.icon className="w-5 h-5 text-emerald-600" />}
                <span className="text-gray-700 font-medium">{donationType}</span>
              </div>
              <span className="text-3xl font-bold text-emerald-600">
                {finalAmount} <span className="text-lg">{selectedCurrency?.symbol}</span>
              </span>
            </div>
            <div className="h-px bg-emerald-200 my-3" />
            <p className="text-emerald-700 text-sm text-center font-arabic">
              جزاك الله خيراً وبارك في مالك
            </p>
          </motion.div>
        )}

        {/* زر التبرع */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleDonate}
            disabled={!finalAmount || isLoading}
            className="w-full h-16 text-xl rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 disabled:opacity-50 shadow-xl shadow-emerald-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 ml-2 animate-spin" />
                جاري التحويل...
              </>
            ) : (
              <>
                <CreditCard className="w-6 h-6 ml-2" />
                تبرع الآن
              </>
            )}
          </Button>
        </motion.div>

        {/* شعار الأمان */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <span>🔒</span>
            <span>دفع آمن ومشفر</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <span>💳</span>
            <span>Stripe</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}