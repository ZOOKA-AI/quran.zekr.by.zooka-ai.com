import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Sunrise, Sun, Sunset, Moon, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

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

export default function PrayerTimesWidget() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  useEffect(() => {
    if (prayerTimes) {
      const interval = setInterval(() => {
        calculateNextPrayer();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [prayerTimes]);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    setError(null);

    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchByCoordinates(latitude, longitude);
        },
        async () => {
          // Fallback to Dubai if location denied
          await fetchByCity('Dubai', 'AE');
        }
      );
    } else {
      await fetchByCity('Dubai', 'AE');
    }
  };

  const fetchByCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=4`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        setPrayerTimes(data.data);
        // Get location name from reverse geocoding
        try {
          const geoResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`
          );
          const geoData = await geoResponse.json();
          setLocationName(geoData.city || geoData.locality || 'موقعك الحالي');
        } catch {
          setLocationName('موقعك الحالي');
        }
      } else {
        setError('فشل في جلب مواقيت الصلاة');
      }
    } catch {
      setError('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const fetchByCity = async (city, country) => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=4`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        setPrayerTimes(data.data);
        setLocationName(city === 'Dubai' ? 'دبي' : city);
      } else {
        setError('فشل في جلب مواقيت الصلاة');
      }
    } catch {
      setError('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const calculateNextPrayer = () => {
    if (!prayerTimes) return;
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getSeconds();
    
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const times = prayerTimes.timings;
    
    for (const prayer of prayers) {
      const [hours, minutes] = times[prayer].split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      
      if (currentMinutes < prayerMinutes || (currentMinutes === prayerMinutes && currentSeconds < 60)) {
        setNextPrayer(prayer);
        const diffMinutes = prayerMinutes - currentMinutes - (currentSeconds > 0 ? 1 : 0);
        const diffSeconds = currentSeconds > 0 ? 60 - currentSeconds : 0;
        const hours = Math.floor(diffMinutes / 60);
        const mins = diffMinutes % 60;
        setCountdown(`${hours > 0 ? hours + ':' : ''}${mins.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`);
        return;
      }
    }
    
    // After Isha, next is Fajr tomorrow
    setNextPrayer('Fajr');
    const [fajrHours, fajrMinutes] = times['Fajr'].split(':').map(Number);
    const fajrMinutesFromMidnight = fajrHours * 60 + fajrMinutes;
    const minutesUntilMidnight = (24 * 60) - currentMinutes;
    const totalMinutes = minutesUntilMidnight + fajrMinutesFromMidnight - 1;
    const diffSeconds = 60 - currentSeconds;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    setCountdown(`${hours}:${mins.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`);
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 backdrop-blur-xl border border-indigo-500/30">
        <CardContent className="p-6 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-400" />
          <p className="text-indigo-200 mt-2">جاري تحميل مواقيت الصلاة...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-red-900/60 to-rose-900/60 backdrop-blur-xl border border-red-500/30">
        <CardContent className="p-6 text-center">
          <p className="text-red-200 mb-4">{error}</p>
          <Button onClick={fetchPrayerTimes} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 ml-2" />
            إعادة المحاولة
          </Button>
        </CardContent>
      </Card>
    );
  }

  const NextIcon = nextPrayer ? prayerIcons[nextPrayer] : Clock;

  return (
    <Card className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 backdrop-blur-xl border border-indigo-500/30 overflow-hidden">
      <CardContent className="p-0">
        {/* Header with next prayer */}
        <div className="bg-gradient-to-r from-amber-600/30 to-orange-600/30 p-4 border-b border-amber-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <NextIcon className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <p className="text-amber-100 text-sm">الصلاة القادمة</p>
                <p className="text-2xl font-bold text-amber-300">{prayerNames[nextPrayer]}</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-amber-100/70 text-xs">الوقت المتبقي</p>
              <p className="text-2xl font-mono font-bold text-amber-200">{countdown}</p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="px-4 py-2 bg-slate-800/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{locationName}</span>
          </div>
          <div className="text-slate-400 text-xs">
            {prayerTimes?.date?.hijri?.day} {prayerTimes?.date?.hijri?.month?.ar}
          </div>
        </div>

        {/* Prayer times grid */}
        <div className="p-4">
          <div className="grid grid-cols-5 gap-2">
            {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => {
              const Icon = prayerIcons[prayer];
              const isNext = nextPrayer === prayer;
              
              return (
                <div
                  key={prayer}
                  className={`text-center p-2 rounded-lg transition-all ${
                    isNext 
                      ? 'bg-amber-500/20 border border-amber-500/40' 
                      : 'bg-slate-800/30'
                  }`}
                >
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${isNext ? 'text-amber-400' : 'text-slate-400'}`} />
                  <p className={`text-xs mb-1 ${isNext ? 'text-amber-200' : 'text-slate-400'}`}>
                    {prayerNames[prayer]}
                  </p>
                  <p className={`text-sm font-mono font-bold ${isNext ? 'text-amber-300' : 'text-slate-300'}`}>
                    {prayerTimes?.timings[prayer]?.split(' ')[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer link */}
        <Link to={createPageUrl('PrayerTimes')}>
          <div className="px-4 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 transition-colors text-center border-t border-indigo-500/20">
            <p className="text-indigo-200 text-sm font-medium">عرض التفاصيل الكاملة ←</p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}