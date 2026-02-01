import React, { useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookMarked, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function BookmarksPage() {
  const queryClient = useQueryClient();

  const { data: bookmarks = [], isLoading, refetch } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => base44.entities.Bookmark.list('-created_date'),
    initialData: [],
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });

  // Real-time subscription للتحديثات الفورية
  useEffect(() => {
    const unsubscribe = base44.entities.Bookmark.subscribe((event) => {
      queryClient.setQueryData(['bookmarks'], (old) => {
        if (!old) return old;
        if (event.type === 'create') return [event.data, ...old];
        if (event.type === 'update') return old.map((b) => (b.id === event.id ? event.data : b));
        if (event.type === 'delete') return old.filter((b) => b.id !== event.id);
        return old;
      });
    });
    return unsubscribe;
  }, [queryClient]);

  const sortedBookmarks = useMemo(() => 
    [...bookmarks].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)),
    [bookmarks]
  );

  const deleteBookmarkMutation = useMutation({
    mutationFn: (id) => base44.entities.Bookmark.delete(id),
    onSuccess: () => {
      toast.success('تم حذف العلامة');
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <BookMarked className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">الآيات المحفوظة</h1>
            <p className="text-emerald-100">مجموعتك الخاصة من الآيات المفضلة</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">جاري التحميل...</p>
          </div>
        ) : sortedBookmarks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <BookMarked className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-4">لا توجد آيات محفوظة</p>
            <p className="text-gray-500 text-sm mb-6">ابدأ بحفظ آياتك المفضلة</p>
            <Link to={createPageUrl('Quran')}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                تصفح القرآن
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 ml-2" />
                تحديث
              </Button>
            </div>
            {sortedBookmarks.map((bookmark) => (
              <Card key={bookmark.id} className="bg-white border-2 border-gray-100 hover:border-emerald-200 transition-all shadow-md">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-emerald-100 text-emerald-700">
                        سورة {bookmark.surah_number}
                      </Badge>
                      <Badge variant="outline">
                        آية {bookmark.verse_number}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Link to={createPageUrl(`SurahView?surah=${bookmark.surah_number}`)}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-50 hover:text-red-600"
                        onClick={() => deleteBookmarkMutation.mutate(bookmark.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {bookmark.note && (
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <p className="text-sm text-gray-700">{bookmark.note}</p>
                    </div>
                  )}

                  {bookmark.tags && bookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {bookmark.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-gray-100">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}