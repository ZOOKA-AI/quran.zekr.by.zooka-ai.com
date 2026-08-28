import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Star, Headphones, MapPin } from 'lucide-react';

export default function ReciterCard({ reciter, isSelected, onSelect }) {
  return (
    <Card 
      onClick={() => onSelect(reciter)}
      className={`cursor-pointer transition-all duration-300 overflow-hidden ${
        isSelected 
          ? 'bg-gradient-to-br from-amber-600/30 to-amber-700/20 border-amber-500 ring-2 ring-amber-400/50' 
          : 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-700/60 hover:border-amber-600/50'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* صورة القارئ */}
          <div className="relative flex-shrink-0">
            <img 
              src={reciter.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'} 
              alt={reciter.name_arabic}
              className="w-16 h-16 rounded-xl object-cover"
            />
            {reciter.is_featured && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            )}
          </div>

          {/* معلومات القارئ */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate text-lg">{reciter.name_arabic}</h3>
            <p className="text-slate-400 text-sm truncate">{reciter.name_english}</p>
            
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                <MapPin className="w-3 h-3 ml-1" />
                {reciter.country}
              </Badge>
              <Badge variant="outline" className="text-xs border-emerald-600/50 text-emerald-400">
                {reciter.recitation_style}
              </Badge>
            </div>

            {reciter.total_listeners > 0 && (
              <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                <Headphones className="w-3 h-3" />
                <span>{(reciter.total_listeners / 1000000).toFixed(0)}M مستمع</span>
              </div>
            )}
          </div>

          {/* زر التشغيل */}
          <Button 
            size="icon" 
            className={`flex-shrink-0 rounded-full ${
              isSelected 
                ? 'bg-amber-500 hover:bg-amber-600' 
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <Play className="w-4 h-4" />
          </Button>
        </div>

        {/* التخصصات */}
        {reciter.specialties?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {reciter.specialties.slice(0, 3).map((spec, i) => (
              <span key={i} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded-full">
                {spec}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}