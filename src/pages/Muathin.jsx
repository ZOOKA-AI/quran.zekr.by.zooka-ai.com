import React, { useState, useEffect, useRef } from 'react';
import { Bell, MapPin, Clock, Play, Pause, Volume2, VolumeX, Sun, Sunrise, Sunset, Moon, Cloud, Settings, ChevronDown, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

// قائمة المؤذنين
const MUATHINS = [
  { id: 1, name: 'عبد المجيد السريحي', country: 'السعودية', mosque: 'المسجد النبوي', audio: 'https://www.islamcan.com/audio/adhan/azan1.mp3', featured: true },
  { id: 2, name: 'علي أحمد ملا', country: 'السعودية', mosque: 'المسجد الحرام', audio: 'https://www.islamcan.com/audio/adhan/azan2.mp3', featured: true },
  { id: 3, name: 'فاروق حضراوي', country: 'السعودية', mosque: 'المسجد الحرام', audio: 'https://www.islamcan.com/audio/adhan/azan3.mp3', featured: true },
  { id: 4, name: 'ماهر المعيقلي', country: 'السعودية', mosque: 'المسجد الحرام', audio: 'https://www.islamcan.com/audio/adhan/azan4.mp3', featured: true },
  { id: 5, name: 'عبد الرحمن السديس', country: 'السعودية', mosque: 'المسجد الحرام', audio: 'https://www.islamcan.com/audio/adhan/azan5.mp3', featured: false },
  { id: 6, name: 'مشاري العفاسي', country: 'الكويت', mosque: 'مسجد الدولة الكبير', audio: 'https://www.islamcan.com/audio/adhan/azan6.mp3', featured: true },
  { id: 7, name: 'ناصر القطامي', country: 'السعودية', mosque: 'جامع الراجحي', audio: 'https://www.islamcan.com/audio/adhan/azan7.mp3', featured: false },
  { id: 8, name: 'عبد الباسط عبد الصمد', country: 'مصر', mosque: 'الأزهر الشريف', audio: 'https://www.islamcan.com/audio/adhan/azan8.mp3', featured: true },
  { id: 9, name: 'محمد رفعت', country: 'مصر', mosque: 'القاهرة', audio: 'https://www.islamcan.com/audio/adhan/azan1.mp3', featured: false },
  { id: 10, name: 'نصر الدين طوبار', country: 'مصر', mosque: 'الإذاعة المصرية', audio: 'https://www.islamcan.com/audio/adhan/azan2.mp3', featured: false },
];

// قائمة الدول والمدن
const COUNTRIES = [
  { code: 'SA', name: 'السعودية', cities: ['مكة المكرمة', 'المدينة المنورة', 'الرياض', 'جدة'] },
  { code: 'AE', name: 'الإمارات', cities: ['دبي', 'أبوظبي', 'الشارقة', 'عجمان'] },
  { code: 'EG', name: 'مصر', cities: ['القاهرة', 'الإسكندرية', 'الأقصر', 'أسوان'] },
  { code: 'KW', name: 'الكويت', cities: ['الكويت'] },
  { code: 'QA', name: 'قطر', cities: ['الدوحة'] },
  { code: 'BH', name: 'البحرين', cities: ['المنامة'] },
  { code: 'OM', name: 'عمان', cities: ['مسقط'] },
  { code: 'JO', name: 'الأردن', cities: ['عمان', 'إربد'] },
  { code: 'LB', name: 'لبنان', cities: ['بيروت'] },
  { code: 'MA', name: 'المغرب', cities: ['الرباط', 'الدار البيضاء', 'فاس'] },
  { code: 'DZ', name: 'الجزائر', cities: ['الجزائر', 'وهران'] },
  { code: 'TN', name: 'تونس', cities: ['تونس'] },
  { code: 'TR', name: 'تركيا', cities: ['إسطنبول', 'أنقرة'] },
  { code: 'MY', name: 'ماليزيا', cities: ['كوالالمبور'] },
  { code: 'ID', name: 'إندونيسيا', cities: ['جاكرتا'] },
  { code: 'PK', name: 'باكستان', cities: ['إسلام آباد', 'كراتشي'] },
  { code: 'GB', name: 'بريطانيا', cities: ['لندن', 'برمنغهام'] },
  { code: 'US', name: 'أمريكا', cities: ['نيويورك', 'لوس أنجلوس', 'شيكاغو'] },
  { code: 'CA', name: 'كندا', cities: ['تورنتو', 'مونتريال'] },
  { code: 'DE', name: 'ألمانيا', cities: ['برلين', 'ميونخ'] },
  { code: 'FR', name: 'فرنسا', cities: ['باريس', 'مرسيليا'] },
];

const PRAYERS = [
  { id: 'fajr', name: 'الفجر', icon: Sunrise, color: 'from-indigo-500 to-purple-600' },
  { id: 'sunrise', name: 'الشروق', icon: Sun, color: 'from-yellow-400 to-orange-500' },
  { id: 'dhuhr', name: 'الظهر', icon: Sun, color: 'from-amber-400 to-yellow-500' },
  { id: 'asr', name: 'العصر', icon: Cloud, color: 'from-orange-400 to-amber-500' },
  { id: 'maghrib', name: 'المغرب', icon: Sunset, color: 'from-orange-500 to-red-600' },
  { id: 'isha', name: 'العشاء', icon: Moon, color: 'from-indigo-600 to-purple-700' },
];

export default function Muathin() {
  const [selectedCountry, setSelectedCountry] = useState('AE');
  const [selectedCity, setSelectedCity] = useState('دبي');
  const [selectedMuathin, setSelectedMuathin] = useState(MUATHINS[0]);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoAdhan, setAutoAdhan] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('');
  
  const audioRef = useRef(null);

  // تحديث الوقت كل ثانية
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // جلب مواقيت الصلاة
  useEffect(() => {
    fetchPrayerTimes();
  }, [selectedCity, selectedCountry]);

  // حساب الصلاة القادمة
  useEffect(() => {
    if (prayerTimes) {
      calculateNextPrayer();
    }
  }, [prayerTimes, currentTime]);

  // تشغيل الأذان تلقائياً
  useEffect(() => {
    if (autoAdhan && nextPrayer && countdown === '00:00:00') {
      playAdhan();
      toast.success(`حان الآن موعد صلاة ${nextPrayer.name}`);
    }
  }, [countdown, autoAdhan]);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      const country = COUNTRIES.find(c => c.code === selectedCountry);
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(selectedCity)}&country=${encodeURIComponent(country?.name || 'UAE')}&method=4`
      );
      const data = await response.json();
      if (data.data) {
        setPrayerTimes(data.data.timings);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      // استخدام بيانات افتراضية
      setPrayerTimes({
        Fajr: '05:15',
        Sunrise: '06:35',
        Dhuhr: '12:25',
        Asr: '15:45',
        Maghrib: '18:10',
        Isha: '19:30'
      });
    }
    setLoading(false);
  };

  const calculateNextPrayer = () => {
    if (!prayerTimes) return;
    
    const now = currentTime;
    const prayers = [
      { id: 'fajr', name: 'الفجر', time: prayerTimes.Fajr },
      { id: 'sunrise', name: 'الشروق', time: prayerTimes.Sunrise },
      { id: 'dhuhr', name: 'الظهر', time: prayerTimes.Dhuhr },
      { id: 'asr', name: 'العصر', time: prayerTimes.Asr },
      { id: 'maghrib', name: 'المغرب', time: prayerTimes.Maghrib },
      { id: 'isha', name: 'العشاء', time: prayerTimes.Isha },
    ];

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerDate = new Date(now);
      prayerDate.setHours(hours, minutes, 0, 0);
      
      if (prayerDate > now) {
        setNextPrayer(prayer);
        const diff = prayerDate - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCountdown(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        return;
      }
    }
    
    // إذا انتهت كل الصلوات، الصلاة القادمة هي فجر الغد
    setNextPrayer({ id: 'fajr', name: 'الفجر', time: prayerTimes.Fajr });
    setCountdown('غداً');
  };

  const playAdhan = () => {
    if (audioRef.current) {
      audioRef.current.src = selectedMuathin.audio;
      audioRef.current.volume = volume / 100;
      audioRef.current.play();
      setIsPlaying(true);
      
      // تسجيل التحليلات
      base44.entities.ContentAnalytics.create({
        content_type: 'adhan',
        content_id: String(selectedMuathin.id),
        content_name: selectedMuathin.name,
        action: 'play'
      }).catch(() => {});
    }
  };

  const stopAdhan = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const country = COUNTRIES.find(c => c.code === selectedCountry);

  return (
    <div className="min-h-screen py-8 px-4" dir="rtl">
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Bell className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">المؤذن التلقائي</h1>
          <p className="text-gray-600">مواقيت الصلاة والأذان حسب موقعك</p>
        </div>

        {/* اختيار الموقع */}
        <Card className="mb-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-emerald-800">موقعك</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">الدولة</label>
                <Select value={selectedCountry} onValueChange={(val) => {
                  setSelectedCountry(val);
                  const newCountry = COUNTRIES.find(c => c.code === val);
                  if (newCountry) setSelectedCity(newCountry.cities[0]);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(c => (
                      <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-2 block">المدينة</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {country?.cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* الصلاة القادمة */}
        {nextPrayer && (
          <Card className="mb-6 bg-gradient-to-br from-purple-600 to-indigo-700 text-white overflow-hidden">
            <CardContent className="p-8 text-center">
              <p className="text-purple-200 mb-2">الصلاة القادمة</p>
              <h2 className="text-4xl font-bold mb-4">{nextPrayer.name}</h2>
              <div className="text-6xl font-bold font-mono mb-4">{countdown}</div>
              <p className="text-purple-200">
                {currentTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
              </p>
              
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button
                  size="lg"
                  className={`rounded-full ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-white text-purple-700 hover:bg-purple-100'}`}
                  onClick={isPlaying ? stopAdhan : playAdhan}
                >
                  {isPlaying ? <Pause className="w-6 h-6 ml-2" /> : <Play className="w-6 h-6 ml-2" />}
                  {isPlaying ? 'إيقاف' : 'استمع للأذان'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* مواقيت الصلاة */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                مواقيت الصلاة
              </h2>
              <Button variant="ghost" size="sm" onClick={fetchPrayerTimes} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
                <p className="text-gray-500 mt-2">جاري تحميل المواقيت...</p>
              </div>
            ) : prayerTimes ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PRAYERS.map((prayer) => {
                  const Icon = prayer.icon;
                  const time = prayerTimes[prayer.id.charAt(0).toUpperCase() + prayer.id.slice(1)] || prayerTimes[prayer.id];
                  const isNext = nextPrayer?.id === prayer.id;
                  
                  return (
                    <div
                      key={prayer.id}
                      className={`p-4 rounded-xl text-center transition-all ${
                        isNext 
                          ? `bg-gradient-to-br ${prayer.color} text-white shadow-lg scale-105` 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${isNext ? 'text-white' : 'text-gray-400'}`} />
                      <p className={`font-bold mb-1 ${isNext ? 'text-white' : 'text-gray-700'}`}>{prayer.name}</p>
                      <p className={`text-2xl font-bold ${isNext ? 'text-white' : 'text-gray-900'}`}>{time}</p>
                      {isNext && <Badge className="mt-2 bg-white/20">القادمة</Badge>}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* إعدادات الأذان */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-800">إعدادات الأذان</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">الأذان التلقائي</p>
                  <p className="text-sm text-gray-500">تشغيل الأذان تلقائياً عند دخول وقت الصلاة</p>
                </div>
                <Switch checked={autoAdhan} onCheckedChange={setAutoAdhan} />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-gray-800">مستوى الصوت</p>
                  <span className="text-sm text-gray-500">{volume}%</span>
                </div>
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={(val) => setVolume(val[0])}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* اختيار المؤذن */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">اختر المؤذن</h2>
            
            <div className="grid gap-3">
              {MUATHINS.map((muathin) => (
                <button
                  key={muathin.id}
                  onClick={() => setSelectedMuathin(muathin)}
                  className={`w-full p-4 rounded-xl text-right transition-all flex items-center gap-4 ${
                    selectedMuathin.id === muathin.id 
                      ? 'bg-emerald-100 ring-2 ring-emerald-500' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedMuathin.id === muathin.id ? 'bg-emerald-500 text-white' : 'bg-gray-200'
                  }`}>
                    {selectedMuathin.id === muathin.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Volume2 className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900">{muathin.name}</p>
                      {muathin.featured && (
                        <Badge className="bg-amber-100 text-amber-700">مميز</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{muathin.mosque} • {muathin.country}</p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMuathin(muathin);
                      setTimeout(playAdhan, 100);
                    }}
                  >
                    <Play className="w-5 h-5" />
                  </Button>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}