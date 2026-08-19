import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';

export default function FloatingVideoPlayer({ video, onClose }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  const getVideoEmbedUrl = () => {
    if (video.video_provider === 'youtube' && video.youtube_id) {
      return `https://www.youtube.com/embed/${video.youtube_id}?autoplay=1`;
    }
    return video.video_url;
  };

  return (
    <motion.div
      drag
      dragElastic={0.2}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 100 }}
      className={`fixed z-50 bg-black rounded-lg shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing ${
        isExpanded ? 'inset-4' : 'bottom-6 right-6 w-80 h-64'
      }`}
    >
      {/* الرأس */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 bg-gradient-to-b from-black/80 to-transparent">
        <h3 className="text-white font-bold text-sm truncate">{video.title}</h3>
        <div className="flex gap-2">
          <Button
            size="icon"
            className="w-8 h-8 bg-slate-700 hover:bg-slate-600"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
          <Button
            size="icon"
            className="w-8 h-8 bg-red-600 hover:bg-red-700"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* الفيديو */}
      <iframe
        ref={videoRef}
        src={getVideoEmbedUrl()}
        title={video.title}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          borderRadius: 'inherit',
          pointerEvents: 'auto'
        }}
      />

      {/* الأزرار السفلية */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 bg-gradient-to-t from-black/80 to-transparent">
        <span className="text-white text-xs">{video.channel}</span>
        <Button
          size="icon"
          className="w-8 h-8 bg-slate-700 hover:bg-slate-600"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </motion.div>
  );
}