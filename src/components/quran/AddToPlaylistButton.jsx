import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Music, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';

export default function AddToPlaylistButton({ surah, recitation, size = "sm", variant = "outline" }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // جلب قوائم التشغيل
  const { data: playlists = [] } = useQuery({
    queryKey: ['playlists', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.Playlist.filter({ created_by: user.email });
    },
    enabled: !!user && isOpen
  });

  // إضافة إلى قائمة تشغيل
  const addToPlaylistMutation = useMutation({
    mutationFn: async (playlistId) => {
      const playlist = playlists.find(p => p.id === playlistId);
      const currentItems = playlist.items || [];
      
      // التحقق من عدم التكرار
      const exists = currentItems.some(
        item => item.surah_number === surah.number && item.reciter_id === recitation?.reciter_id
      );
      
      if (exists) {
        throw new Error('هذه التلاوة موجودة بالفعل في القائمة');
      }

      const newItem = {
        type: 'surah',
        surah_number: surah.number,
        title: surah.name_arabic,
        reciter_id: recitation?.reciter_id || null,
        reciter_name: recitation?.reciter_name || 'غير محدد',
        audio_url: recitation?.audio_url || null,
        duration: recitation?.duration || 0
      };
      
      const newItems = [...currentItems, newItem];
      const totalDuration = newItems.reduce((sum, i) => sum + (i.duration || 0), 0);
      
      return await base44.entities.Playlist.update(playlistId, {
        items: newItems,
        total_duration: totalDuration
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['playlists']);
      toast.success('تمت الإضافة إلى قائمة التشغيل');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'فشلت الإضافة');
    }
  });

  if (!user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={size} variant={variant}>
          <Plus className="w-4 h-4 ml-1" />
          إضافة لقائمة
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة إلى قائمة تشغيل</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          <div className="p-3 bg-emerald-50 rounded-lg">
            <p className="font-bold font-arabic text-emerald-900">{surah.name_arabic}</p>
            <p className="text-sm text-gray-600">{surah.name_english}</p>
          </div>

          {playlists.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Music className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>لا توجد قوائم تشغيل</p>
              <p className="text-sm">قم بإنشاء قائمة تشغيل أولاً</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {playlists.map(playlist => {
                const alreadyAdded = playlist.items?.some(
                  item => item.surah_number === surah.number && item.reciter_id === recitation?.reciter_id
                );
                
                return (
                  <button
                    key={playlist.id}
                    onClick={() => !alreadyAdded && addToPlaylistMutation.mutate(playlist.id)}
                    disabled={alreadyAdded || addToPlaylistMutation.isPending}
                    className={`w-full p-3 rounded-lg text-right transition-colors ${
                      alreadyAdded
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{playlist.title}</p>
                        <p className="text-sm text-gray-600">{playlist.items?.length || 0} عنصر</p>
                      </div>
                      {alreadyAdded && <Check className="w-5 h-5 text-emerald-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}