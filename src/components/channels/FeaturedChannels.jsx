import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Youtube, Radio, Globe, CheckCircle2, Loader2, ExternalLink, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const platformIcons = {
  'YouTube': Youtube,
  'Radio': Radio,
  'Website': Globe,
  'Facebook': Globe,
  'Instagram': Globe,
  'TikTok': Globe
};

export default function FeaturedChannels({ limit = 6, variant = 'grid' }) {
  const { data: channels = [], isLoading } = useQuery({
    queryKey: ['featured-channels'],
    queryFn: async () => {
      const all = await base44.entities.Channel.filter({ is_featured: true });
      return all.slice(0, limit);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (channels.length === 0) return null;

  if (variant === 'horizontal') {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {channels.map((channel, index) => {
          const PlatformIcon = platformIcons[channel.platform] || Globe;
          return (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-72"
            >
              <a href={channel.url} target="_blank" rel="noopener noreferrer">
                <Card className="bg-slate-900/60 backdrop-blur-xl border-emerald-500/30 hover:border-emerald-400/60 transition-all hover:shadow-2xl group overflow-hidden">
                  <div className="relative h-32 overflow-hidden">
                    {channel.cover_image_url ? (
                      <img 
                        src={channel.cover_image_url} 
                        alt={channel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-600" />
                    )}
                    {channel.is_live && (
                      <Badge className="absolute top-2 right-2 bg-red-600 text-white animate-pulse">
                        <Play className="w-3 h-3 ml-1" />
                        مباشر
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-2">
                      {channel.logo_url ? (
                        <img 
                          src={channel.logo_url} 
                          alt={channel.name}
                          className="w-12 h-12 rounded-full object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                          <PlatformIcon className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          <h3 className="text-white font-bold truncate">{channel.name}</h3>
                          {channel.is_verified && (
                            <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          )}
                        </div>
                        <Badge className="bg-emerald-600/80 text-white text-xs">
                          {channel.channel_type}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-3">{channel.description}</p>
                    {channel.subscribers_count > 0 && (
                      <p className="text-emerald-400 text-xs">
                        {(channel.subscribers_count / 1000000).toFixed(1)}M مشترك
                      </p>
                    )}
                  </div>
                </Card>
              </a>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {channels.map((channel, index) => {
        const PlatformIcon = platformIcons[channel.platform] || Globe;
        return (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <a href={channel.url} target="_blank" rel="noopener noreferrer">
              <Card className="bg-slate-900/60 backdrop-blur-xl border-emerald-500/30 hover:border-emerald-400/60 transition-all hover:shadow-2xl hover:-translate-y-2 group overflow-hidden h-full">
                <div className="relative h-40 overflow-hidden">
                  {channel.cover_image_url ? (
                    <img 
                      src={channel.cover_image_url} 
                      alt={channel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                      <PlatformIcon className="w-16 h-16 text-white/60" />
                    </div>
                  )}
                  {channel.is_live && (
                    <Badge className="absolute top-3 right-3 bg-red-600 text-white animate-pulse">
                      <Play className="w-3 h-3 ml-1" />
                      بث مباشر
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    {channel.logo_url ? (
                      <img 
                        src={channel.logo_url} 
                        alt={channel.name}
                        className="w-14 h-14 rounded-full object-cover shadow-xl ring-2 ring-emerald-500/50"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-xl">
                        <PlatformIcon className="w-7 h-7 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <h3 className="text-white font-bold text-lg leading-tight">{channel.name}</h3>
                        {channel.is_verified && (
                          <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge className="bg-emerald-600/80 text-white">
                          {channel.channel_type}
                        </Badge>
                        <Badge className="bg-blue-600/80 text-white flex items-center gap-1">
                          <PlatformIcon className="w-3 h-3" />
                          {channel.platform}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-400 text-sm line-clamp-2 mb-3">{channel.description}</p>
                  
                  <div className="flex items-center justify-between">
                    {channel.subscribers_count > 0 ? (
                      <p className="text-emerald-400 text-sm font-bold">
                        {channel.subscribers_count >= 1000000 
                          ? `${(channel.subscribers_count / 1000000).toFixed(1)}M` 
                          : `${(channel.subscribers_count / 1000).toFixed(0)}K`} مشترك
                      </p>
                    ) : (
                      <span className="text-slate-500 text-sm">{channel.country}</span>
                    )}
                    <ExternalLink className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Card>
            </a>
          </motion.div>
        );
      })}
    </div>
  );
}