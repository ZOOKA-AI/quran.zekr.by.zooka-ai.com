import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Eye, Heart } from 'lucide-react';
import FloatingVideoPlayer from './FloatingVideoPlayer';
import { formatUtils } from '@/utils';

export default function VideoGrid({ pageName, limit = 6 }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const { data: videos = [] } = useQuery({
    queryKey: ['videos', pageName],
    queryFn: async () => {
      const allVideos = await base44.entities.Video.list();
      return allVideos
        ?.filter(v => !pageName || v.page_name === pageName)
        ?.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
        ?.slice(0, limit) || [];
    }
  });

  return (
    <>
      {/* شبكة الفيديوهات */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">🎬 الفيديوهات المميزة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="bg-slate-900/60 border-slate-700/50 overflow-hidden group cursor-pointer hover:border-emerald-500/50 transition-all"
                onClick={() => setSelectedVideo(video)}
              >
                {/* الصورة المصغرة */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <Play className="w-12 h-12 text-slate-600" />
                    </div>
                  )}
                  
                  {/* زر التشغيل */}
                  <Button
                    size="icon"
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVideo(video);
                    }}
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </Button>

                  {/* المدة */}
                  {video.duration && (
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                      {formatUtils.formatTime(video.duration)}
                    </Badge>
                  )}

                  {/* العلامة المميزة */}
                  {video.is_featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-600">
                      ⭐ مميز
                    </Badge>
                  )}
                </div>

                {/* المعلومات */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-white font-bold text-sm line-clamp-2 mb-1">
                      {video.title}
                    </h3>
                    <p className="text-slate-400 text-xs truncate">{video.channel}</p>
                  </div>

                  {/* الوسوم */}
                  <div className="flex gap-2 flex-wrap">
                    {video.category && (
                      <Badge className="bg-emerald-600/80 text-white text-xs">
                        {video.category}
                      </Badge>
                    )}
                  </div>

                  {/* الإحصائيات */}
                  <div className="flex gap-4 pt-3 border-t border-slate-700/50">
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Eye className="w-3 h-3" />
                      {formatUtils.formatNumber(video.views_count || 0)}
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Heart className="w-3 h-3" />
                      {formatUtils.formatNumber(video.likes_count || 0)}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* مشغل الفيديو العائم */}
      <AnimatePresence>
        {selectedVideo && (
          <FloatingVideoPlayer
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}