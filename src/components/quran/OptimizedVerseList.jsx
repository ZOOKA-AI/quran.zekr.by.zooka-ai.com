import React, { useEffect, useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import VerseCard from './VerseCard';
import { Loader2 } from 'lucide-react';

export default function OptimizedVerseList({ surahNumber, searchResults, verses }) {
  const [realtimeVerses, setRealtimeVerses] = useState(verses);
  const queryClient = useQueryClient();

  // Real-time subscription للآيات
  useEffect(() => {
    if (!surahNumber) return;

    const unsubscribe = base44.entities.Verse.subscribe((event) => {
      if (event.data?.surah_number !== surahNumber) return;

      setRealtimeVerses((prev) => {
        if (event.type === 'create') {
          return [...prev, event.data].sort((a, b) => a.verse_number - b.verse_number);
        } else if (event.type === 'update') {
          return prev.map((v) => (v.id === event.id ? event.data : v));
        } else if (event.type === 'delete') {
          return prev.filter((v) => v.id !== event.id);
        }
        return prev;
      });

      // تحديث الكاش
      queryClient.invalidateQueries({ queryKey: ['verses', surahNumber] });
    });

    return unsubscribe;
  }, [surahNumber, queryClient]);

  // تحديث الـ verses عند التغيير
  useEffect(() => {
    setRealtimeVerses(verses);
  }, [verses]);

  // استخدام searchResults أو realtimeVerses
  const displayVerses = useMemo(() => {
    return searchResults?.length > 0 ? searchResults : realtimeVerses;
  }, [searchResults, realtimeVerses]);

  if (!displayVerses || displayVerses.length === 0) {
    return (
      <div className="text-center py-16">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-xl">جاري تحميل الآيات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {displayVerses.map((verse) => (
        <VerseCard key={verse.id} verse={verse} />
      ))}
    </div>
  );
}