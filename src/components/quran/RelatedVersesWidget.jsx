import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function RelatedVersesWidget({ relatedVerses, currentVerse }) {
  if (!relatedVerses || relatedVerses.length === 0) return null;

  const relationTypes = {
    similar_topic: { label: 'موضوع مشابه', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    same_story: { label: 'نفس القصة', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    complementary: { label: 'آية مكملة', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    contrast: { label: 'آية مقابلة', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Link2 className="w-5 h-5" />
          <span>آيات ذات صلة للتدبر الأعمق</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {relatedVerses.map((related, idx) => {
          const relationType = relationTypes[related.relation_type] || relationTypes.similar_topic;
          return (
            <Link
              key={idx}
              to={createPageUrl(`SurahView?surah=${related.surah_number}&verse=${related.verse_number}`)}
            >
              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${relationType.color}`}>
                    {relationType.label}
                  </span>
                  <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 font-bold">
                  <span>سورة {related.surah_number}</span>
                  <span>•</span>
                  <span>آية {related.verse_number}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  اضغط لقراءة الآية والتدبر في العلاقة بينهما
                </p>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}