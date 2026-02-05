import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Loader2, MapPin } from 'lucide-react';

const weatherIcons = {
  'Clear': Sun,
  'Clouds': Cloud,
  'Rain': CloudRain,
  'Drizzle': CloudRain,
  'Snow': CloudSnow,
  'Thunderstorm': CloudRain,
  'Mist': Cloud,
  'Fog': Cloud,
  'Haze': Cloud,
};

const weatherTranslations = {
  'Clear': 'صافي',
  'Clouds': 'غائم',
  'Rain': 'ممطر',
  'Drizzle': 'رذاذ',
  'Snow': 'ثلوج',
  'Thunderstorm': 'عاصفة رعدية',
  'Mist': 'ضباب خفيف',
  'Fog': 'ضباب',
  'Haze': 'غبار',
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchWeatherByCoords(latitude, longitude);
        },
        async () => {
          // Fallback to Dubai
          await fetchWeatherByCoords(25.2048, 55.2708);
          setLocationName('دبي');
        }
      );
    } else {
      await fetchWeatherByCoords(25.2048, 55.2708);
      setLocationName('دبي');
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      // Using Open-Meteo API (free, no API key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      );
      const data = await response.json();

      if (data.current) {
        // Map weather code to condition
        const weatherCode = data.current.weather_code;
        let condition = 'Clear';
        if (weatherCode >= 0 && weatherCode <= 3) condition = 'Clear';
        else if (weatherCode >= 45 && weatherCode <= 48) condition = 'Fog';
        else if (weatherCode >= 51 && weatherCode <= 67) condition = 'Rain';
        else if (weatherCode >= 71 && weatherCode <= 77) condition = 'Snow';
        else if (weatherCode >= 80 && weatherCode <= 99) condition = 'Thunderstorm';
        else if (weatherCode >= 4 && weatherCode <= 44) condition = 'Clouds';

        setWeather({
          temp: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          condition: condition,
        });

        // Get location name
        try {
          const geoResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ar`
          );
          const geoData = await geoResponse.json();
          setLocationName(geoData.city || geoData.locality || 'موقعك');
        } catch {
          setLocationName('موقعك');
        }
      } else {
        setError('فشل في جلب بيانات الطقس');
      }
    } catch {
      setError('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-xl border border-blue-500/30">
        <CardContent className="p-4 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return null; // Hide widget on error
  }

  const WeatherIcon = weatherIcons[weather.condition] || Cloud;

  return (
    <Card className="bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-xl border border-blue-500/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <WeatherIcon className="w-7 h-7 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-blue-200/70 text-sm">
                <MapPin className="w-3 h-3" />
                <span>{locationName}</span>
              </div>
              <p className="text-3xl font-bold text-white">{weather.temp}°</p>
            </div>
          </div>
          
          <div className="text-left space-y-1">
            <p className="text-blue-200 text-sm font-medium">
              {weatherTranslations[weather.condition] || weather.condition}
            </p>
            <div className="flex items-center gap-3 text-xs text-blue-300/70">
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                {weather.humidity}%
              </span>
              <span className="flex items-center gap-1">
                <Wind className="w-3 h-3" />
                {weather.windSpeed} كم/س
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}