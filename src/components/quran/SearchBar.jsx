import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, History, Sparkles } from 'lucide-react';
import { debounce } from 'lodash';

const SearchBar = ({ onSearch, _onFilterChange, showSuggestions = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quran-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Save search to recent
  const saveSearch = (query) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('quran-recent-searches', JSON.stringify(updated));
  };

  // Debounced search for live results
  const debouncedSearch = useCallback(
    debounce((query, type) => {
      if (query.length >= 2) {
        onSearch(query, type);
        setIsSearching(false);
      }
    }, 500),
    [onSearch]
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      saveSearch(searchQuery);
      onSearch(searchQuery, searchType);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearching(true);
    debouncedSearch(value, searchType);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('', searchType);
  };

  const quickSearches = [
    { label: 'الرحمة', query: 'الرحمة' },
    { label: 'الصبر', query: 'الصبر' },
    { label: 'التقوى', query: 'التقوى' },
    { label: 'الجنة', query: 'الجنة' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
      <div className="flex flex-col gap-4">
        {/* Main Search Row */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="ابحث في القرآن الكريم بالعربية أو الترجمة..."
              className="pr-12 pl-10 h-12 text-lg border-2 border-gray-200 focus:border-emerald-500"
            />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {isSearching && (
              <div className="absolute left-12 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-full md:w-48 h-12 border-2">
              <Filter className="w-4 h-4 ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🔍 الكل</SelectItem>
              <SelectItem value="text">📖 النص العربي</SelectItem>
              <SelectItem value="translation">🌍 الترجمة</SelectItem>
              <SelectItem value="tafsir">📚 التفسير</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={handleSearch}
            className="h-12 px-8 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
          >
            <Search className="w-5 h-5 ml-2" />
            بحث
          </Button>
        </div>

        {/* Quick Searches & Recent */}
        {showSuggestions && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>بحث سريع:</span>
            </div>
            {quickSearches.map((item) => (
              <Badge
                key={item.query}
                variant="outline"
                className="cursor-pointer hover:bg-emerald-50 hover:border-emerald-500 transition-colors"
                onClick={() => {
                  setSearchQuery(item.query);
                  onSearch(item.query, searchType);
                  saveSearch(item.query);
                }}
              >
                {item.label}
              </Badge>
            ))}
            
            {recentSearches.length > 0 && (
              <>
                <div className="w-px h-4 bg-gray-300 mx-2" />
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <History className="w-4 h-4" />
                  <span>الأخيرة:</span>
                </div>
                {recentSearches.slice(0, 3).map((query) => (
                  <Badge
                    key={query}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setSearchQuery(query);
                      onSearch(query, searchType);
                    }}
                  >
                    {query}
                  </Badge>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;