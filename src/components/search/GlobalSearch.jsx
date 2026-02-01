import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, X, BookOpen, Mic, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ALL_SURAHS = [
  { number: 1, name: 'الفاتحة', transliteration: 'Al-Fatihah' },
  { number: 2, name: 'البقرة', transliteration: 'Al-Baqarah' },
  { number: 3, name: 'آل عمران', transliteration: 'Ali Imran' },
  { number: 4, name: 'النساء', transliteration: 'An-Nisa' },
  { number: 5, name: 'المائدة', transliteration: 'Al-Maidah' },
  { number: 18, name: 'الكهف', transliteration: 'Al-Kahf' },
  { number: 36, name: 'يس', transliteration: 'Ya-Sin' },
  { number: 55, name: 'الرحمن', transliteration: 'Ar-Rahman' },
  { number: 67, name: 'الملك', transliteration: 'Al-Mulk' },
  { number: 112, name: 'الإخلاص', transliteration: 'Al-Ikhlas' },
  { number: 113, name: 'الفلق', transliteration: 'Al-Falaq' },
  { number: 114, name: 'الناس', transliteration: 'An-Nas' },
];

const PAGES = [
  { name: 'التلاوة', path: 'Tilawa', icon: Mic },
  { name: 'المقرئين', path: 'Reciters', icon: Mic },
  { name: 'المجتمع', path: 'Community', icon: MessageSquare },
  { name: 'المساعد الذكي', path: 'Assistant', icon: MessageSquare },
];

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ surahs: [], pages: [] });

  useEffect(() => {
    if (!query.trim()) {
      setResults({ surahs: [], pages: [] });
      return;
    }

    const q = query.toLowerCase();
    
    const surahs = ALL_SURAHS.filter(s => 
      s.name.includes(query) || 
      s.transliteration.toLowerCase().includes(q) ||
      s.number.toString() === query
    ).slice(0, 5);

    const pages = PAGES.filter(p => 
      p.name.includes(query) || 
      p.path.toLowerCase().includes(q)
    );

    setResults({ surahs, pages });
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-64 justify-start text-gray-500">
          <Search className="w-4 h-4 ml-2" />
          بحث في التطبيق...
          <kbd className="mr-auto text-xs bg-gray-100 px-2 py-0.5 rounded hidden md:inline">⌘K</kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-600" />
            البحث الشامل
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن سورة، صفحة، أو آية..."
              className="pr-10"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setQuery('')}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {results.surahs.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-gray-500 mb-2">السور</h4>
              <div className="space-y-1">
                {results.surahs.map((surah) => (
                  <Link
                    key={surah.number}
                    to={createPageUrl(`SurahView?surah=${surah.number}`)}
                    onClick={() => setOpen(false)}
                  >
                    <Card className="p-3 hover:bg-emerald-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {surah.number}
                        </div>
                        <div>
                          <p className="font-bold">{surah.name}</p>
                          <p className="text-sm text-gray-500">{surah.transliteration}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.pages.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-gray-500 mb-2">الصفحات</h4>
              <div className="space-y-1">
                {results.pages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <Link
                      key={page.path}
                      to={createPageUrl(page.path)}
                      onClick={() => setOpen(false)}
                    >
                      <Card className="p-3 hover:bg-blue-50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                            <Icon className="w-5 h-5" />
                          </div>
                          <p className="font-bold">{page.name}</p>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {query && results.surahs.length === 0 && results.pages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>لم يتم العثور على نتائج</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}