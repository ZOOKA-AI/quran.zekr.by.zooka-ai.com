import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

export default function WordByWord({ verse }) {
  const [playingIndex, setPlayingIndex] = useState(null);

  if (!verse?.words || verse.words.length === 0) {
    return null;
  }

  const playWord = (wordIndex) => {
    setPlayingIndex(wordIndex);
    // يمكن إضافة تشغيل الصوت هنا لاحقاً
    setTimeout(() => setPlayingIndex(null), 1000);
  };

  return (
    <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-500/20 p-6">
      <h3 className="text-xl font-bold text-amber-100 mb-4">كلمة بكلمة</h3>
      <div className="flex flex-wrap gap-3">
        {verse.words.map((word, index) => (
          <div
            key={index}
            className={`relative group p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all ${
              playingIndex === index ? 'ring-2 ring-amber-500' : ''
            }`}
          >
            <p className="text-white font-arabic text-2xl mb-2">{word.text}</p>
            <p className="text-emerald-300 text-sm mb-1">{word.transliteration}</p>
            <p className="text-amber-200 text-xs">{word.translation}</p>
            {word.audio_url && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => playWord(index)}
                className="mt-2 text-white hover:text-amber-300"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}