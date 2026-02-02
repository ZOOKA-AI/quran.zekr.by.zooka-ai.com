import { Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommunityHero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-12 overflow-hidden rounded-2xl"
    >
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
          src="https://videos.pexels.com/video-files/3195386/3195386-hd_1920_1080_25fps.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-950/95 via-purple-950/90 to-slate-950/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center p-8 md:p-16">
        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
          <Users className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">مجتمع القرآن الكريم</h1>
        <p className="text-xl text-pink-200 font-arabic mb-2">﴿ وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ﴾</p>
        <p className="text-slate-300 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          شارك آياتك وأحاديثك مع ملايين المسلمين
        </p>
      </div>
    </motion.div>
  );
}