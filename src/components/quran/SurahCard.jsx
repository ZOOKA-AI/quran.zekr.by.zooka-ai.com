import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const SurahCard = ({ surah }) => {
  return (
    <Link to={createPageUrl(`SurahView?surah=${surah.number}`)}>
      <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-emerald-500/30 bg-gradient-to-br from-white to-emerald-50/30 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">{surah.number}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">
                  {surah.name}
                </h3>
                <p className="text-sm text-gray-600">{surah.transliteration}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-arabic text-emerald-700 mb-1">{surah.arabic_name}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                <BookOpen className="w-3 h-3 mr-1" />
                {surah.verses_count} آية
              </Badge>
              <Badge variant="outline" className="border-amber-200 text-amber-700">
                <MapPin className="w-3 h-3 mr-1" />
                {surah.revelation_place === 'Makkah' ? 'مكية' : 'مدنية'}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">الجزء {surah.juz_start}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default SurahCard;