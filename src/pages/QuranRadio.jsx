import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Radio, Play, Pause, Volume2, VolumeX, Heart, Search, Signal, Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';
import AudioManager from '@/components/audio/AudioManager';
import { useGlobalQuranPlayer } from '@/components/player/GlobalQuranPlayerContext';

// الأعلام حسب البلد
const COUNTRY_FLAGS = {
  'مصر': '🇪🇬',
  'السعودية': '🇸🇦',
  'الكويت': '🇰🇼',
  'الإمارات': '🇦🇪',
  'قطر': '🇶🇦',
  'البحرين': '🇧🇭',
  'الأردن': '🇯🇴',
  'فلسطين': '🇵🇸',
};

export default function QuranRadio() {
  const queryClient = useQueryClient();
  const { stop: stopQuranPlayer } = useGlobalQuranPlayer();
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const audioRef = useRef(null);

  // جلب المحطات من قاعدة البيانات
  const { data: dbStations = [], isLoading } = useQuery({
    queryKey: ['radio-stations'],
    queryFn: () => base44.entities.RadioStation.filter({ is_active: true }),
  });

  // جلب المحطات المفضلة
  const { data: favoriteStations = [] } = useQuery({
    queryKey: ['favorite-stations'],
    queryFn: async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) return [];
      return base44.entities.FavoriteStation.list();
    }
  });

  // إضافة/إزالة محطة من المفضلة
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (station) => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        toast.error('يرجى تسجيل الدخول لحفظ المفضلة');
        return;
      }

      const existing = favoriteStations.find(f => f.station_id === station.id);
      if (existing) {
        await base44.entities.FavoriteStation.delete(existing.id);
        toast.success('تمت إزالة المحطة من المفضلة');
      } else {
        await base44.entities.FavoriteStation.create({
          station_id: station.id,
          station_name: station.name,
          station_url: station.url
        });
        toast.success('تمت إضافة المحطة للمفضلة');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-stations'] });
    }
  });

  // تحويل البيانات للصيغة المطلوبة
  const RADIO_STATIONS = dbStations.map(s => ({
    id: s.id,
    name: s.name,
    country: COUNTRY_FLAGS[s.country] || '🌍',
    url: s.stream_url,
    category: s.category,
    listeners: s.listeners_count
  }));

  useEffect(() => {
    // الاستماع لتغييرات الصوت من المصادر الأخرى
    const unsubscribe = AudioManager.addListener((source, status) => {
      if (source !== 'radio' && status === 'playing') {
        setIsPlaying(false);
      }
    });
    
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
    }
    
    return () => unsubscribe();
  }, [volume, isMuted]);

  const playStation = (station) => {
    // إيقاف المشغل العام أولاً
    stopQuranPlayer();
    // إيقاف أي صوت آخر
    AudioManager.stopAll();
    
    if (currentStation?.id === station.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
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

  const isFavorite = (stationId) => {
    return favoriteStations.some(f => f.station_id === stationId);
  };

  const uniqueCategories = [...new Set(RADIO_STATIONS.map(s => s.category))];
  const categories = ['all', ...uniqueCategories];
  
  const filteredStations = RADIO_STATIONS.filter(station => {
    const matchesSearch = station.name.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || station.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const favStations = RADIO_STATIONS.filter(s => isFavorite(s.id));

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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">كل المحطات</TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              المفضلة ({favStations.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search & Filter */}
        {activeTab === 'all' && (
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
            <div className="flex gap-2 flex-wrap">
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
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        )}

        {/* Stations Grid */}
        {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(activeTab === 'all' ? filteredStations : favStations).map(station => (
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
                      toggleFavoriteMutation.mutate(station);
                    }}
                    disabled={toggleFavoriteMutation.isPending}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(station.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {!isLoading && (activeTab === 'all' ? filteredStations : favStations).length === 0 && (
          <Card className="p-8 text-center">
            <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {activeTab === 'favorites' ? 'لا توجد محطات مفضلة' : 'لا توجد محطات متاحة'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}