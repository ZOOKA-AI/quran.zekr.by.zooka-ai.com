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
    onSuccess: () => {
      setIsBookmarked(true);
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('تمت إضافة الإشارة المرجعية ✅');
    },
  });

  const deleteBookmarkMutation = useMutation({
    mutationFn: (id) => base44.entities.Bookmark.delete(id),
    onSuccess: () => {
      setIsBookmarked(false);
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