import { Play, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const inspirationalVideos = [
  {
    id: 1,
    title: 'قصص من السيرة النبوية',
    thumbnail: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop',
    views: '150K',
    duration: '12:45',
    category: 'تاريخ إسلامي'
  },
  {
    id: 2,
    title: 'تلاوة خاشعة للقرآن الكريم',
    thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=300&fit=crop',
    views: '320K',
    duration: '08:20',
    category: 'تلاوات'
  },
  {
    id: 3,
    title: 'دروس في الإيمان والتقوى',
    thumbnail: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop',
    views: '89K',
    duration: '15:30',
    category: 'دروس'
  },
  {
    id: 4,
    title: 'عظائم خلق الله في الكون',
    thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop',
    views: '245K',
    duration: '20:00',
    category: 'تعليم'
  },
  {
    id: 5,
    title: 'أدعية وأذكار يومية',
    thumbnail: 'https://images.unsplash.com/photo-1514541961580-72cbc7fcd166?w=400&h=300&fit=crop',
    views: '178K',
    duration: '06:15',
    category: 'أدعية'
  },
  {
    id: 6,
    title: 'نصائح لحفظ القرآن',
    thumbnail: 'https://images.unsplash.com/photo-1493749671281-784c6b8d8a9f?w=400&h=300&fit=crop',
    views: '234K',
    duration: '18:45',
    category: 'تعليم'
  },
];

export default function InspirationalVideos() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
        📺 فيديوهات ملهمة
      </h2>
      <p className="text-slate-400 mb-8">اختر من أجمل الفيديوهات الإسلامية والتعليمية</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inspirationalVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group cursor-pointer"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="relative overflow-hidden rounded-xl mb-3 aspect-video bg-slate-800">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                <Button size="icon" className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-lg">
                  <Play className="w-8 h-8 fill-white text-white ml-1" />
                </Button>
              </div>
              <div className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded text-white text-xs font-bold">
                {video.duration}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-2">
                {video.title}
              </h3>
              <div className="flex items-center justify-between text-sm">
                <span className="bg-slate-800 px-2 py-1 rounded text-pink-300">
                  {video.category}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {video.views}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}