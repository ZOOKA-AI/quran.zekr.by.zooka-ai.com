import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Plus, Trash2, Search, Music } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PlaylistEditor() {
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const playlistId = urlParams.get('id');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReciter, setSelectedReciter] = useState('all');

  // جلب معلومات قائمة التشغيل
  const { data: playlist, isLoading: loadingPlaylist } = useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: async () => {
      const playlists = await base44.entities.Playlist.filter({ id: playlistId });
      return playlists[0];
    },
    enabled: !!playlistId
  });

  // جلب السور المتاحة
  const { data: surahs = [] } = useQuery({
    queryKey: ['surahs-for-playlist'],
    queryFn: async () => {
      return await base44.entities.Surah.list();
    }
  });

  // جلب المقرئين
  const { data: reciters = [] } = useQuery({
    queryKey: ['reciters-for-playlist'],
    queryFn: async () => {
      return await base44.entities.Reciter.list();
    }
  });

  // جلب التلاوات المتاحة
  const { data: recitations = [] } = useQuery({
    queryKey: ['recitations-for-playlist', selectedReciter],
    queryFn: async () => {
      if (selectedReciter === 'all') {
        return await base44.entities.Recitation.list();
      }
      return await base44.entities.Recitation.filter({ reciter_id: selectedReciter });
    }
  });

  // إضافة عنصر إلى قائمة التشغيل
  const addToPlaylistMutation = useMutation({
    mutationFn: async (item) => {
      const currentItems = playlist.items || [];
      const newItems = [...currentItems, item];
      const totalDuration = newItems.reduce((sum, i) => sum + (i.duration || 0), 0);
      
      return await base44.entities.Playlist.update(playlistId, {
        items: newItems,
        total_duration: totalDuration
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['playlist', playlistId]);
      toast.success('تمت الإضافة إلى قائمة التشغيل');
    }
  });

  // حذف عنصر من قائمة التشغيل
  const removeFromPlaylistMutation = useMutation({
    mutationFn: async (index) => {
      const currentItems = [...(playlist.items || [])];
      currentItems.splice(index, 1);
      const totalDuration = currentItems.reduce((sum, i) => sum + (i.duration || 0), 0);
      
      return await base44.entities.Playlist.update(playlistId, {
        items: currentItems,
        total_duration: totalDuration
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['playlist', playlistId]);
      toast.success('تم الحذف من قائمة التشغيل');
    }
  });

  const handleAddRecitation = (recitation) => {
    const surah = surahs.find(s => s.number === recitation.surah_number);
    const reciter = reciters.find(r => r.id === recitation.reciter_id);
    
    const item = {
      type: 'surah',
      surah_number: recitation.surah_number,
      title: surah?.name_arabic || `سورة ${recitation.surah_number}`,
      reciter_id: recitation.reciter_id,
      reciter_name: reciter?.name_arabic || 'مقرئ',
      audio_url: recitation.audio_url,
      duration: recitation.duration || 0
    };
    
    addToPlaylistMutation.mutate(item);
  };

  const filteredRecitations = recitations.filter(rec => {
    if (!searchQuery) return true;
    const surah = surahs.find(s => s.number === rec.surah_number);
    return surah?.name_arabic.includes(searchQuery) || 
           surah?.name_english?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loadingPlaylist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Music className="w-16 h-16 text-emerald-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">قائمة التشغيل غير موجودة</h2>
            <Link to={createPageUrl('MyPlaylists')}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                العودة إلى القوائم
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl('MyPlaylists')}>
            <Button variant="ghost" size="icon">
              <ArrowRight className="w-6 h-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-emerald-900 mb-2">{playlist.title}</h1>
            <p className="text-gray-600">
              {playlist.items?.length || 0} عنصر • {Math.floor((playlist.total_duration || 0) / 60)} دقيقة
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Playlist Items */}
          <Card>
            <CardHeader>
              <CardTitle>محتويات قائمة التشغيل</CardTitle>
            </CardHeader>
            <CardContent>
              {!playlist.items || playlist.items.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Music className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>قائمة التشغيل فارغة</p>
                  <p className="text-sm">أضف سورًا من القائمة المجاورة</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {playlist.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <div>
                        <p className="font-bold font-arabic text-emerald-900">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.reciter_name}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromPlaylistMutation.mutate(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Recitations */}
          <Card>
            <CardHeader>
              <CardTitle>إضافة تلاوات</CardTitle>
              <div className="space-y-3 mt-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="ابحث عن سورة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <select
                  value={selectedReciter}
                  onChange={(e) => setSelectedReciter(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="all">جميع المقرئين</option>
                  {reciters.map(reciter => (
                    <option key={reciter.id} value={reciter.id}>
                      {reciter.name_arabic}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredRecitations.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">لا توجد نتائج</p>
                ) : (
                  filteredRecitations.map(recitation => {
                    const surah = surahs.find(s => s.number === recitation.surah_number);
                    const reciter = reciters.find(r => r.id === recitation.reciter_id);
                    
                    return (
                      <div
                        key={recitation.id}
                        className="flex items-center justify-between p-3 bg-white border rounded-lg hover:border-emerald-300 transition-colors"
                      >
                        <div>
                          <p className="font-bold font-arabic">{surah?.name_arabic}</p>
                          <p className="text-sm text-gray-600">{reciter?.name_arabic}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddRecitation(recitation)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}