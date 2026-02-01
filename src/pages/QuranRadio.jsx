import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Radio, Play, Pause, Volume2, VolumeX, Heart, Search, Globe, Wifi, Signal } from 'lucide-react';
import { toast } from 'sonner';
import AudioManager from '@/components/audio/AudioManager';

const RADIO_STATIONS = [
  { id: 'quran-radio', name: 'إذاعة القرآن الكريم', country: '🇸🇦', url: 'https://stream.radiojar.com/0tpy1h0kxtzuv', category: 'قرآن' },
  { id: 'quran-egypt', name: 'إذاعة القرآن - مصر', country: '🇪🇬', url: 'https://stream.radiojar.com/4wqre23fytzuv', category: 'قرآن' },
  { id: 'makkah-live', name: 'إذاعة مكة المكرمة', country: '🇸🇦', url: 'https://stream.radiojar.com/bz3m8tdwwtzuv', category: 'قرآن' },
  { id: 'madinah-live', name: 'إذاعة المدينة المنورة', country: '🇸🇦', url: 'https://stream.radiojar.com/rdwrsdzfctzuv', category: 'قرآن' },
  { id: 'azhar-radio', name: 'إذاعة الأزهر الشريف', country: '🇪🇬', url: 'https://stream.radiojar.com/cqensdj0k3xuv', category: 'إسلامية' },
  { id: 'quran-kuwait', name: 'إذاعة القرآن - الكويت', country: '🇰🇼', url: 'https://stream.radiojar.com/7vhwdsgcbtzuv', category: 'قرآن' },
  { id: 'tarateel', name: 'إذاعة التراتيل', country: '🌍', url: 'https://stream.radiojar.com/38x9rbcgktzuv', category: 'تراتيل' },
  { id: 'tilawat', name: 'إذاعة التلاوات الخاشعة', country: '🌍', url: 'https://stream.radiojar.com/5wngrcj0y3xuv', category: 'قرآن' },
];

export default function QuranRadio() {
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const audioRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('radio-favorites');
    if (saved) setFavorites(JSON.parse(saved));
    
    // الاستماع لتغييرات الصوت من المصادر الأخرى
    const unsubscribe = AudioManager.addListener((source, status) => {
      if (source !== 'radio' && status === 'playing') {
        // مصدر آخر بدأ التشغيل - إيقاف الراديو
        setIsPlaying(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const playStation = (station) => {
    if (currentStation?.id === station.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      AudioManager.stop();
    } else {
      // تسجيل الصوت في المدير المركزي (سيوقف أي صوت آخر تلقائياً)
      AudioManager.register(audioRef.current, 'radio');
      
      setCurrentStation(station);
      if (audioRef.current) {
        audioRef.current.src = station.url;
        audioRef.current.play().catch(() => toast.error('تعذر تشغيل الإذاعة'));
      }
      setIsPlaying(true);
      toast.success(`جاري تشغيل ${station.name}`);
    }
  };

  const toggleFavorite = (stationId) => {
    const updated = favorites.includes(stationId)
      ? favorites.filter(id => id !== stationId)
      : [...favorites, stationId];
    setFavorites(updated);
    localStorage.setItem('radio-favorites', JSON.stringify(updated));
  };

  const categories = ['all', 'قرآن', 'إسلامية', 'تراتيل'];
  
  const filteredStations = RADIO_STATIONS.filter(station => {
    const matchesSearch = station.name.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || station.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-8 px-4" dir="rtl">
      <audio ref={audioRef} />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Radio className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">إذاعات القرآن الكريم</h1>
          <p className="text-gray-600">استمع للقرآن الكريم على مدار الساعة</p>
        </div>

        {/* Now Playing */}
        {currentStation && (
          <Card className="mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    {isPlaying ? (
                      <div className="flex gap-1">
                        <div className="w-1 h-6 bg-white animate-pulse rounded" />
                        <div className="w-1 h-4 bg-white animate-pulse rounded delay-100" />
                        <div className="w-1 h-8 bg-white animate-pulse rounded delay-200" />
                      </div>
                    ) : (
                      <Radio className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm opacity-80">يُذاع الآن</p>
                    <p className="text-xl font-bold">{currentStation.name}</p>
                    <p className="text-sm opacity-80">{currentStation.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => playStation(currentStation)}
                    className="w-14 h-14 rounded-full bg-white text-emerald-600 hover:bg-white/90"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 mr-1" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="ابحث عن إذاعة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="flex gap-2">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "bg-emerald-600" : ""}
              >
                {cat === 'all' ? 'الكل' : cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStations.map(station => (
            <Card 
              key={station.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                currentStation?.id === station.id ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3" onClick={() => playStation(station)}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStation?.id === station.id && isPlaying
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100'
                    }`}>
                      {currentStation?.id === station.id && isPlaying ? (
                        <Signal className="w-5 h-5 animate-pulse" />
                      ) : (
                        <Radio className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{station.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{station.country}</span>
                        <Badge variant="secondary" className="text-xs">{station.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(station.id);
                    }}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(station.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}