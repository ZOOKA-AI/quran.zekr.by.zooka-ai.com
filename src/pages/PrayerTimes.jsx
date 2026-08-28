import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, Sunrise, Sun, Sunset, Moon, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import IslamicBackground from '@/components/layout/IslamicBackground';

export default function PrayerTimesPage() {
  const [location, setLocation] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('SA');
  const [method, setMethod] = useState('4'); // Umm Al-Qura

  const calculationMethods = [
    { value: '1', label: 'جامعة العلوم الإسلامية - كراتشي' },
    { value: '2', label: 'الجمعية الإسلامية لأمريكا الشمالية' },
    { value: '3', label: 'رابطة العالم الإسلامي' },
    { value: '4', label: 'أم القرى - مكة المكرمة' },
    { value: '5', label: 'الهيئة المصرية العامة للمساحة' },
    { value: '7', label: 'اتحاد المنظمات الإسلامية في فرنسا' },
    { value: '8', label: 'مجلس الإفتاء - سنغافورة' },
  ];

  const countries = [
    { code: 'SA', name: 'السعودية' },
    { code: 'EG', name: 'مصر' },
    { code: 'AE', name: 'الإمارات' },
    { code: 'JO', name: 'الأردن' },
    { code: 'KW', name: 'الكويت' },
    { code: 'QA', name: 'قطر' },
    { code: 'BH', name: 'البحرين' },
    { code: 'OM', name: 'عُمان' },
    { code: 'IQ', name: 'العراق' },
    { code: 'SY', name: 'سوريا' },
    { code: 'LB', name: 'لبنان' },
    { code: 'PS', name: 'فلسطين' },
    { code: 'MA', name: 'المغرب' },
    { code: 'DZ', name: 'الجزائر' },
    { code: 'TN', name: 'تونس' },
    { code: 'LY', name: 'ليبيا' },
  ];

  const prayerIcons = {
    Fajr: Sunrise,
    Dhuhr: Sun,
    Asr: Sun,
    Maghrib: Sunset,
    Isha: Moon,
  };

  const prayerNames = {
    Fajr: 'الفجر',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء',
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(loc);
          fetchPrayerTimesByCoordinates(loc.latitude, loc.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.info('يرجى إدخال موقعك يدوياً');
          setLoading(false);
        }
      );
    }
  };

  const fetchPrayerTimesByCoordinates = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=${method}`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        setPrayerTimes(data.data);
        toast.success('تم تحديث مواقيت الصلاة');
      } else {
        toast.error('حدث خطأ في جلب مواقيت الصلاة');
      }
    } catch (error) {
      toast.error('حدث خطأ في الاتصال بالخدمة');
    } finally {
      setLoading(false);
    }
  };

  const fetchPrayerTimesByCity = async () => {
    if (!city.trim()) {
      toast.error('يرجى إدخال اسم المدينة');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        setPrayerTimes(data.data);
        toast.success(`تم تحديث مواقيت الصلاة لمدينة ${city}`);
      } else {
        toast.error('لم يتم العثور على المدينة');
      }
    } catch (error) {
      toast.error('حدث خطأ في الاتصال بالخدمة');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPrayer = () => {
    if (!prayerTimes) return null;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const times = prayerTimes.timings;
    
    for (let i = 0; i < prayers.length; i++) {
      const [hours, minutes] = times[prayers[i]].split(':');
      const prayerTime = parseInt(hours) * 60 + parseInt(minutes);
      
      if (currentTime < prayerTime) {
        return i > 0 ? prayers[i - 1] : null;
      }
    }
    
    return 'Isha';
  };

  const currentPrayer = getCurrentPrayer();

  return (
    <IslamicBackground variant="default">
      {/* الرأس */}
      <div className="relative text-white pt-8">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block p-5 bg-gradient-to-br from-blue-500/20 to-indigo-600/10 rounded-3xl backdrop-blur-sm border border-blue-400/20">
                <Clock className="w-14 h-14 text-blue-300" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3 text-amber-100">مواقيت الصلاة</h1>
            <p className="text-xl text-indigo-200 font-arabic mb-2">﴿ إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا ﴾</p>
            <p className="text-slate-300">احرص على الصلاة في وقتها</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* اختيار الموقع */}
        <Card className="mb-8 shadow-lg bg-slate-900/60 backdrop-blur-xl border border-blue-500/20">
          <CardHeader className="border-b border-blue-500/20 bg-slate-800/50">
            <CardTitle className="flex items-center gap-2 text-amber-200">
              <MapPin className="w-5 h-5 text-blue-400" />
              تحديد الموقع
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="اسم المدينة (مثلاً: مكة، القاهرة)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchPrayerTimesByCity()}
                  className="h-12 border border-blue-500/30 bg-slate-800/50 text-white placeholder:text-slate-400"
                />
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="h-12 border-blue-500/30 bg-slate-800/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="h-12 border-blue-500/30 bg-slate-800/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {calculationMethods.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={fetchPrayerTimesByCity}
                  disabled={loading}
                  className="h-12 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5 ml-2" />
                      بحث
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  onClick={getUserLocation}
                  disabled={loading}
                  className="h-12"
                >
                  <MapPin className="w-4 h-4 ml-2" />
                  استخدام موقعي الحالي
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* مواقيت الصلاة */}
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-400 mb-4" />
            <p className="text-slate-300">جاري تحميل مواقيت الصلاة...</p>
          </div>
        ) : prayerTimes ? (
          <div className="space-y-6">
            {/* التاريخ والموقع */}
            <Card className="shadow-lg bg-slate-900/60 backdrop-blur-xl border border-purple-500/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-100 mb-2">
                    {prayerTimes.date.hijri.day} {prayerTimes.date.hijri.month.ar} {prayerTimes.date.hijri.year} هـ
                  </p>
                  <p className="text-lg text-slate-300">
                    {prayerTimes.date.readable} م
                  </p>
                  {prayerTimes.meta?.timezone && (
                    <p className="text-sm text-slate-400 mt-2">
                      {prayerTimes.meta.timezone}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* شبكة مواقيت الصلاة */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => {
                const Icon = prayerIcons[prayer];
                const isCurrent = currentPrayer === prayer;
                
                return (
                  <Card
                    key={prayer}
                    className={`shadow-lg transition-all duration-300 ${
                      isCurrent
                        ? 'border-2 border-amber-500 bg-gradient-to-br from-amber-500/20 to-blue-500/20 scale-105 backdrop-blur-xl'
                        : 'bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/40'
                    }`}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <Icon className={`w-12 h-12 mx-auto ${isCurrent ? 'text-amber-400' : 'text-blue-400'}`} />
                      </div>
                      <h3 className={`text-2xl font-bold mb-2 ${isCurrent ? 'text-amber-200' : 'text-amber-100'}`}>
                        {prayerNames[prayer]}
                      </h3>
                      <p className={`text-3xl font-mono font-bold ${isCurrent ? 'text-amber-300' : 'text-slate-300'}`}>
                        {prayerTimes.timings[prayer].split(' ')[0]}
                      </p>
                      {isCurrent && (
                        <Badge className="mt-3 bg-amber-600 border-0">الوقت الحالي</Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* أوقات إضافية */}
            <Card className="shadow-lg bg-slate-900/60 backdrop-blur-xl border border-amber-500/20">
              <CardHeader className="border-b border-amber-500/20 bg-slate-800/50">
                <CardTitle className="text-amber-200">أوقات إضافية</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">الشروق</p>
                    <p className="text-xl font-bold text-amber-300">{prayerTimes.timings.Sunrise}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">منتصف الليل</p>
                    <p className="text-xl font-bold text-purple-300">{prayerTimes.timings.Midnight}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">الثلث الأخير</p>
                    <p className="text-xl font-bold text-indigo-300">{prayerTimes.timings.Lastthird}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">الإمساك</p>
                    <p className="text-xl font-bold text-green-300">{prayerTimes.timings.Imsak}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="shadow-lg bg-slate-900/60 backdrop-blur-xl border border-blue-500/20">
            <CardContent className="p-16 text-center">
              <Clock className="w-20 h-20 mx-auto text-blue-400 mb-4" />
              <p className="text-xl text-amber-100 mb-4">
                اختر موقعك لعرض مواقيت الصلاة
              </p>
              <p className="text-slate-400">
                يمكنك استخدام موقعك الحالي أو البحث عن مدينة معينة
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </IslamicBackground>
  );
}