import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Languages, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SimpleTafsirCard({ verse }) {
  const [expanded, setExpanded] = useState(false);
  const [language, setLanguage] = useState('ar');

  if (!verse) return null;

  const tafsir = {
    ar: verse.tafsir_saadi || 'التفسير غير متوفر حاليًا',
    en: 'Simplified interpretation explaining the verse meaning and context in easy language.'
  };

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
              التفسير المبسط
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="text-emerald-700 dark:text-emerald-300"
            >
              <Languages className="w-4 h-4" />
              {language === 'ar' ? 'EN' : 'عر'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-emerald-700 dark:text-emerald-300"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent>
              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                <p className={`leading-relaxed ${language === 'ar' ? 'font-arabic text-right text-lg' : 'text-left'} text-slate-700 dark:text-slate-300`}>
                  {tafsir[language]}
                </p>
              </div>
              {verse.sabab_nuzool && (
                <div className="mt-4 bg-amber-50 dark:bg-amber-950 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                  <p className="text-amber-800 dark:text-amber-200 font-bold mb-2">📖 سبب النزول:</p>
                  <p className="text-amber-900 dark:text-amber-100 font-arabic leading-relaxed">
                    {verse.sabab_nuzool}
                  </p>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}