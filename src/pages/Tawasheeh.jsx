import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Heart, Clock, Music2, Mic2, Star } from 'lucide-react';
import { toast } from 'sonner';

const TAWASHEEH = [
  { id: 1, title: 'مولاي إني ببابك', artist: 'النقشبندي', duration: '8:45', category: 'ابتهالات', url: '#', featured: true },
  { id: 2, title: 'يا رب العباد', artist: 'سيد النقشبندي', duration: '12:30', category: 'ابتهالات', url: '#', featured: true },
  { id: 3, title: 'حبيبي يا رسول الله', artist: 'محمد عمران', duration: '6:20', category: 'تواشيح', url: '#', featured: false },
  { id: 4, title: 'طلع البدر علينا', artist: 'المنشد المصري', duration: '4:15', category: 'أناشيد', url: '#', featured: true },
  { id: 5, title: 'يا إمام الرسل', artist: 'نصر الدين طوبار', duration: '15:00', category: 'ابتهالات', url: '#', featured: true },
  { id: 6, title: 'رباه يا من أناجي', artist: 'النقشبندي', duration: '10:30', category: 'ابتهالات', url: '#', featured: false },
  { id: 7, title: 'أشرق المعنى', artist: 'نصر الدين طوبار', duration: '9:00', category: 'تواشيح', url: '#', featured: false },
  { id: 8, title: 'لبيك اللهم لبيك', artist: 'محمد الهلباوي', duration: '5:30', category: 'أناشيد', url: '#', featured: true },
];

const CATEGORIES = [
  { id: 'all', name: 'الكل', icon: Music2 },
  { id: 'ابتهالات', name: 'ابتهالات', icon: Mic2 },
  { id: 'تواشيح', name: 'تواشيح', icon: Music2 },
  { id: 'أناشيد', name: 'أناشيد', icon: Star },
];

export default function Tawasheeh() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const audioRef = useRef(null);

  const playTrack = (track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      setIsPlaying(false);
      toast.info('تم إيقاف التشغيل');
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      toast.success(`جاري تشغيل: ${track.title}`);
    }
  };

  const toggleFavorite = (trackId) => {
    setFavorites(prev => 
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  };

  const filteredTracks = TAWASHEEH.filter(track => 
    selectedCategory === 'all' || track.category === selectedCategory
  );

  const featuredTracks = TAWASHEEH.filter(t => t.featured);

  return (
    <div className="min-h-screen py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Music2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">التواشيح والابتهالات</h1>
          <p className="text-gray-600">أجمل الابتهالات والتواشيح المصرية الأصيلة</p>
        </div>

        {/* Now Playing */}
        {currentTrack && (
          <Card className="mb-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    {isPlaying ? (
                      <div className="flex gap-1 items-end">
                        <div className="w-1 h-4 bg-white animate-bounce rounded" style={{ animationDelay: '0ms' }} />
                        <div className="w-1 h-6 bg-white animate-bounce rounded" style={{ animationDelay: '150ms' }} />
                        <div className="w-1 h-3 bg-white animate-bounce rounded" style={{ animationDelay: '300ms' }} />
                        <div className="w-1 h-5 bg-white animate-bounce rounded" style={{ animationDelay: '450ms' }} />
                      </div>
                    ) : (
                      <Music2 className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <p className="text-xl font-bold">{currentTrack.title}</p>
                    <p className="opacity-80">{currentTrack.artist}</p>
                    <div className="flex items-center gap-2 text-sm opacity-70">
                      <Clock className="w-4 h-4" />
                      {currentTrack.duration}
                    </div>
                  </div>
                </div>
                <Button
                  size="icon"
                  onClick={() => playTrack(currentTrack)}
                  className="w-14 h-14 rounded-full bg-white text-amber-600 hover:bg-white/90"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 mr-1" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Featured Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            مختارات مميزة
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {featuredTracks.map(track => (
              <Card 
                key={track.id}
                className="min-w-[200px] cursor-pointer hover:shadow-lg transition-all"
                onClick={() => playTrack(track)}
              >
                <CardContent className="p-4">
                  <div className="w-full h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-3 flex items-center justify-center">
                    <Music2 className="w-10 h-10 text-amber-600" />
                  </div>
                  <p className="font-bold text-gray-800 truncate">{track.title}</p>
                  <p className="text-sm text-gray-500">{track.artist}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className={`gap-2 ${selectedCategory === cat.id ? 'bg-amber-600 hover:bg-amber-700' : ''}`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </Button>
            );
          })}
        </div>

        {/* Tracks List */}
        <div className="space-y-3">
          {filteredTracks.map(track => (
            <Card 
              key={track.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                currentTrack?.id === track.id ? 'ring-2 ring-amber-500 bg-amber-50' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4" onClick={() => playTrack(track)}>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      currentTrack?.id === track.id && isPlaying
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100'
                    }`}>
                      {currentTrack?.id === track.id && isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 text-amber-600 mr-0.5" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{track.title}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{track.artist}</span>
                        <Badge variant="secondary">{track.category}</Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {track.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(track.id);
                    }}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(track.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
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