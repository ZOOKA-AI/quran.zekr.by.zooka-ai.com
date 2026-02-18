import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function QuickBookmark({ surahNumber, verseNumber, isBookmarked: initialBookmarked, bookmarkId }) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const queryClient = useQueryClient();

  const createBookmarkMutation = useMutation({
    mutationFn: (data) => base44.entities.Bookmark.create(data),
    onMutate: async (newBookmark) => {
      // Optimistic update
      setIsBookmarked(true);
      await queryClient.cancelQueries({ queryKey: ['bookmarks'] });
      
      const previousBookmarks = queryClient.getQueryData(['bookmarks']);
      queryClient.setQueryData(['bookmarks'], (old = []) => [...old, newBookmark]);
      
      return { previousBookmarks };
    },
    onError: (err, newBookmark, context) => {
      // Rollback on error
      setIsBookmarked(false);
      queryClient.setQueryData(['bookmarks'], context.previousBookmarks);
      toast.error('حدث خطأ في الإضافة');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('تمت إضافة الإشارة المرجعية ✅');
    },
  });

  const deleteBookmarkMutation = useMutation({
    mutationFn: (id) => base44.entities.Bookmark.delete(id),
    onMutate: async (deletedId) => {
      // Optimistic update
      setIsBookmarked(false);
      await queryClient.cancelQueries({ queryKey: ['bookmarks'] });
      
      const previousBookmarks = queryClient.getQueryData(['bookmarks']);
      queryClient.setQueryData(['bookmarks'], (old = []) => 
        old.filter(b => b.id !== deletedId)
      );
      
      return { previousBookmarks };
    },
    onError: (err, deletedId, context) => {
      // Rollback on error
      setIsBookmarked(true);
      queryClient.setQueryData(['bookmarks'], context.previousBookmarks);
      toast.error('حدث خطأ في الحذف');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('تم حذف الإشارة المرجعية');
    },
  });

  const handleToggle = () => {
    if (isBookmarked && bookmarkId) {
      deleteBookmarkMutation.mutate(bookmarkId);
    } else {
      createBookmarkMutation.mutate({
        surah_number: surahNumber,
        verse_number: verseNumber,
      });
    }
  };

  return (
    <Button
      variant={isBookmarked ? "default" : "outline"}
      size="icon"
      onClick={handleToggle}
      className={isBookmarked ? "bg-amber-500 hover:bg-amber-600" : ""}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
    </Button>
  );
}