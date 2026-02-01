import React, { useState, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { debounce } from 'lodash';

export default function OptimizedSearch({ 
  data, 
  searchFields = ['name', 'title'], 
  onResults,
  placeholder = "ابحث..."
}) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search للأداء
  const debouncedSearch = useCallback(
    debounce((searchQuery, items) => {
      setIsSearching(true);
      
      if (!searchQuery.trim()) {
        onResults(items);
        setIsSearching(false);
        return;
      }

      const normalizedQuery = searchQuery.toLowerCase().trim();
      const results = items.filter(item => 
        searchFields.some(field => {
          const value = item[field];
          return value && 
                 String(value).toLowerCase().includes(normalizedQuery);
        })
      );

      onResults(results);
      setIsSearching(false);
    }, 300),
    [searchFields, onResults]
  );

  const handleSearch = (value) => {
    setQuery(value);
    debouncedSearch(value, data);
  };

  const clearSearch = () => {
    setQuery('');
    onResults(data);
  };

  return (
    <div className="relative">
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <Input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="pr-12 pl-12 h-12 text-lg"
      />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          onClick={clearSearch}
          className="absolute left-2 top-1/2 -translate-y-1/2"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
      {isSearching && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent" />
        </div>
      )}
    </div>
  );
}