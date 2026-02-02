import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, BookOpen, Languages } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AdvancedSearch({ onResultClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('arabic');
  const [selectedSurah, setSelectedSurah] = useState('all');
  const [selectedJuz, setSelectedJuz] = useState('all');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      let query = {};
      
      if (searchType === 'arabic') {
        query.arabic_text = { $regex: searchQuery, $options: 'i' };
      } else if (searchType === 'translation') {
        query.translation_english = { $regex: searchQuery, $options: 'i' };
      } else if (searchType === 'tafsir') {
        query.tafsir_saadi = { $regex: searchQuery, $options: 'i' };
      }
      
      if (selectedSurah !== 'all') {
        query.surah_number = parseInt(selectedSurah);
      }
      
      if (selectedJuz !== 'all') {
        query.juz = parseInt(selectedJuz);
      }
      
      const searchResults = await base44.entities.Verse.filter(query, '-created_date', 50);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-emerald-900/60 backdrop-blur-xl border-amber-500/30 p-6">
      <h3 className="text-2xl font-bold text-amber-100 mb-6 flex items-center gap-2">
        <Search className="w-6 h-6" />
        بحث متقدم في القرآن الكريم
      </h3>

      <Tabs defaultValue="arabic" onValueChange={setSearchType}>
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="arabic">النص العربي</TabsTrigger>
          <TabsTrigger value="translation">الترجمة</TabsTrigger>
          <TabsTrigger value="tafsir">التفسير</TabsTrigger>
          <TabsTrigger value="verse">رقم الآية</TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="ابحث في القرآن الكريم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button onClick={handleSearch} disabled={isSearching} className="bg-amber-500 hover:bg-amber-600">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select value={selectedSurah} onValueChange={setSelectedSurah}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="اختر السورة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل السور</SelectItem>
                <SelectItem value="1">الفاتحة</SelectItem>
                <SelectItem value="2">البقرة</SelectItem>
                <SelectItem value="18">الكهف</SelectItem>
                <SelectItem value="36">يس</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedJuz} onValueChange={setSelectedJuz}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="اختر الجزء" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأجزاء</SelectItem>
                {Array.from({ length: 30 }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    الجزء {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {results.length > 0 && (
            <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
              <h4 className="text-emerald-200 font-bold">النتائج ({results.length})</h4>
              {results.map((verse) => (
                <div
                  key={verse.id}
                  onClick={() => onResultClick?.(verse)}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-amber-500/50 cursor-pointer transition-all"
                >
                  <p className="text-amber-100 text-sm mb-2">
                    سورة {verse.surah_number} - آية {verse.verse_number}
                  </p>
                  <p className="text-white font-arabic text-lg leading-loose">{verse.arabic_text}</p>
                  {searchType === 'translation' && verse.translation_english && (
                    <p className="text-emerald-200 text-sm mt-2">{verse.translation_english}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Tabs>
    </Card>
  );
}