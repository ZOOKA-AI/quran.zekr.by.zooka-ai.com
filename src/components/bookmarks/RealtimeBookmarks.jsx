import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function RealtimeBookmarks() {
  const queryClient = useQueryClient();
  
  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => base44.entities.Bookmark.list('-created_date'),
    staleTime: 30000, // 30 seconds cache
  });

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = base44.entities.Bookmark.subscribe((event) => {
      queryClient.setQueryData(['bookmarks'], (old) => {
        if (!old) return old;
        
        if (event.type === 'create') {
          return [event.data, ...old];
        } else if (event.type === 'update') {
          return old.map((b) => (b.id === event.id ? event.data : b));
        } else if (event.type === 'delete') {
          return old.filter((b) => b.id !== event.id);
        }
        return old;
      });
    });

    return unsubscribe;
  }, [queryClient]);

  const handleDelete = async (id) => {
    try {
      await base44.entities.Bookmark.delete(id);
      toast.success('تم حذف الإشارة المرجعية');
    } catch {
      toast.error('فشل حذف الإشارة المرجعية');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16">
        <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 text-xl mb-4">لا توجد إشارات مرجعية بعد</p>
        <Link to={createPageUrl('Quran')}>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            ابدأ القراءة
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Link to={createPageUrl(`SurahView?surah=${bookmark.surah_number}`)}>
                <h3 className="text-xl font-bold text-emerald-700 mb-2 hover:text-emerald-800">
                  سورة رقم {bookmark.surah_number} - آية {bookmark.verse_number}
                </h3>
              </Link>
              {bookmark.note && (
                <p className="text-gray-600 mb-3">{bookmark.note}</p>
              )}
              {bookmark.tags && bookmark.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {bookmark.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Link to={createPageUrl(`SurahView?surah=${bookmark.surah_number}`)}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(bookmark.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}