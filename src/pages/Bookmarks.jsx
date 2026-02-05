import React, { useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookMarked, Trash2, ExternalLink, RefreshCw, CloudUpload, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import IslamicBackground from '@/components/layout/IslamicBackground';

export default function BookmarksPage() {
  const queryClient = useQueryClient();
  const [isSavingToDrive, setIsSavingToDrive] = React.useState(false);

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

  // حفظ الملاحظات في Google Drive
  const saveNotesToDrive = async () => {
    if (sortedBookmarks.length === 0) {
      toast.error('لا توجد ملاحظات للحفظ');
      return;
    }

    setIsSavingToDrive(true);
    try {
      const notesContent = sortedBookmarks.map(b => 
        `📖 سورة ${b.surah_number} - آية ${b.verse_number}\n${b.note || 'بدون ملاحظة'}\n${b.tags?.length ? `الوسوم: ${b.tags.join(', ')}` : ''}\n`
      ).join('\n---\n\n');

      const response = await base44.functions.invoke('saveNotesToDrive', {
        notes: notesContent,
        fileName: `ملاحظاتي_القرآنية_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}`
      });

      if (response.data?.success) {
        toast.success('تم حفظ الملاحظات في Google Drive ✓');
      } else {
        toast.error(response.data?.error || 'فشل الحفظ');
      }
    } catch {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setIsSavingToDrive(false);
    }
  };

  return (
    <IslamicBackground variant="default">
      {/* الرأس */}
      <div className="relative text-white pt-8">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block p-5 bg-gradient-to-br from-emerald-500/20 to-green-600/10 rounded-3xl backdrop-blur-sm border border-emerald-400/20">
                <BookMarked className="w-14 h-14 text-emerald-300" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3 text-amber-100">الآيات المحفوظة</h1>
            <p className="text-xl text-indigo-200 font-arabic">﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾</p>
            <p className="text-slate-300 mt-2">مجموعتك الخاصة من الآيات المفضلة</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            <p className="mt-4 text-amber-200">جاري التحميل...</p>
          </div>
        ) : sortedBookmarks.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-lg border border-emerald-500/20">
            <BookMarked className="w-16 h-16 mx-auto text-emerald-400 mb-4" />
            <p className="text-amber-100 text-lg mb-4">لا توجد آيات محفوظة</p>
            <p className="text-slate-400 text-sm mb-6">ابدأ بحفظ آياتك المفضلة</p>
            <Link to={createPageUrl('Quran')}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                تصفح القرآن
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end gap-3 mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={saveNotesToDrive}
                disabled={isSavingToDrive}
                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
              >
                {isSavingToDrive ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <CloudUpload className="w-4 h-4 ml-2" />
                )}
                حفظ في Google Drive
              </Button>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20">
                <RefreshCw className="w-4 h-4 ml-2" />
                تحديث
              </Button>
            </div>
            {sortedBookmarks.map((bookmark) => (
              <Card key={bookmark.id} className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all shadow-md">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                        سورة {bookmark.surah_number}
                      </Badge>
                      <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                        آية {bookmark.verse_number}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Link to={createPageUrl(`SurahView?surah=${bookmark.surah_number}`)}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-blue-500/20 text-blue-400"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-500/20 text-red-400"
                        onClick={() => deleteBookmarkMutation.mutate(bookmark.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {bookmark.note && (
                    <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                      <p className="text-sm text-amber-100">{bookmark.note}</p>
                    </div>
                  )}

                  {bookmark.tags && bookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {bookmark.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-slate-800/50 text-slate-300 border-slate-700">
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
    </IslamicBackground>
  );
}