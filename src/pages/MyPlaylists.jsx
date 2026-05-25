import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Play, Trash2, Edit2, Music, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';
import { useGlobalQuranPlayer } from '@/components/player/GlobalQuranPlayerContext';

export default function MyPlaylists() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { playPlaylist } = useGlobalQuranPlayer();
  const [isCreating, setIsCreating] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [playlistName, setPlaylistName] = useState('');

  // جلب قوائم التشغيل الخاصة بالمستخدم
  const { data: playlists = [], isLoading } = useQuery({
    queryKey: ['playlists', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.Playlist.filter({ created_by: user.email }, '-created_date');
    },
    enabled: !!user
  });

  // إنشاء قائمة تشغيل جديدة
  const createPlaylistMutation = useMutation({
    mutationFn: async (name) => {
      return await base44.entities.Playlist.create({
        title: name,
        items: [],
        total_duration: 0,
        is_public: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['playlists']);
      toast.success('تم إنشاء قائمة التشغيل بنجاح');
      setIsCreating(false);
      setPlaylistName('');
    }
  });

  // حذف قائمة تشغيل
  const deletePlaylistMutation = useMutation({
    mutationFn: async (playlistId) => {
      return await base44.entities.Playlist.delete(playlistId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['playlists']);
      toast.success('تم حذف قائمة التشغيل');
    }
  });

  // تحديث ترتيب العناصر في القائمة
  const updatePlaylistMutation = useMutation({
    mutationFn: async ({ playlistId, items }) => {
      return await base44.entities.Playlist.update(playlistId, { items });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['playlists']);
      toast.success('تم حفظ التغييرات');
    }
  });

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) {
      toast.error('الرجاء إدخال اسم قائمة التشغيل');
      return;
    }
    createPlaylistMutation.mutate(playlistName);
  };

  const handleDragEnd = (result, playlistId) => {
    if (!result.destination) return;

    const playlist = playlists.find(p => p.id === playlistId);
    const items = Array.from(playlist.items || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updatePlaylistMutation.mutate({ playlistId, items });
  };

  const handlePlayPlaylist = (playlist) => {
    if (!playlist.items || playlist.items.length === 0) {
      toast.error('قائمة التشغيل فارغة');
      return;
    }
    if (playPlaylist) playPlaylist(playlist);
    toast.success(`جاري تشغيل: ${playlist.title}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Music className="w-16 h-16 text-emerald-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-emerald-900 mb-2">قوائم التشغيل الخاصة بي</h1>
            <p className="text-gray-600">قوائم التشغيل المخصصة للقرآن الكريم</p>
          </div>
          
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                <Plus className="w-5 h-5 ml-2" />
                قائمة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إنشاء قائمة تشغيل جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="اسم قائمة التشغيل"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                />
                <Button 
                  onClick={handleCreatePlaylist}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={createPlaylistMutation.isPending}
                >
                  إنشاء
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Playlists Grid */}
        {playlists.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد قوائم تشغيل</h3>
              <p className="text-gray-500 mb-4">ابدأ بإنشاء قائمة تشغيل جديدة لحفظ تلاواتك المفضلة</p>
              <Button 
                onClick={() => setIsCreating(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-5 h-5 ml-2" />
                إنشاء قائمة تشغيل
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Music className="w-5 h-5 text-emerald-600" />
                      {playlist.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePlaylistMutation.mutate(playlist.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{playlist.items?.length || 0} عنصر</span>
                      <span>{Math.floor((playlist.total_duration || 0) / 60)} دقيقة</span>
                    </div>

                    {playlist.items && playlist.items.length > 0 && (
                      <DragDropContext onDragEnd={(result) => handleDragEnd(result, playlist.id)}>
                        <Droppable droppableId={playlist.id}>
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-2 max-h-48 overflow-y-auto"
                            >
                              {playlist.items.map((item, index) => (
                                <Draggable key={index} draggableId={`${playlist.id}-${index}`} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg text-sm"
                                    >
                                      <GripVertical className="w-4 h-4 text-gray-400" />
                                      <span className="flex-1 font-arabic">{item.title}</span>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    )}

                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        onClick={() => handlePlayPlaylist(playlist)}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                        disabled={!playlist.items || playlist.items.length === 0}
                      >
                        <Play className="w-4 h-4 ml-2" />
                        تشغيل
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingPlaylist(playlist);
                          window.location.href = `/PlaylistEditor?id=${playlist.id}`;
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}