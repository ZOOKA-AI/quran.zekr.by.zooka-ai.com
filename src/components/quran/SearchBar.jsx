import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

const SearchBar = ({ onSearch, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('text');

  const handleSearch = () => {
    onSearch(searchQuery, searchType);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="ابحث في القرآن الكريم..."
            className="pr-12 h-12 text-lg border-2 border-gray-200 focus:border-emerald-500"
          />
        </div>
        
        <Select value={searchType} onValueChange={setSearchType}>
          <SelectTrigger className="w-full md:w-48 h-12 border-2">
            <Filter className="w-4 h-4 ml-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">النص العربي</SelectItem>
            <SelectItem value="translation">الترجمة</SelectItem>
            <SelectItem value="tafsir">التفسير</SelectItem>
            <SelectItem value="all">الكل</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          onClick={handleSearch}
          className="h-12 px-8 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
        >
          بحث
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;