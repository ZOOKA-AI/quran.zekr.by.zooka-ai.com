import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { BookOpen, Mic, Radio, Music, Heart, Trophy, Sparkles, Library } from 'lucide-react';
import { motion } from 'framer-motion';

const QUICK_NAV = [
  { name: 'التلاوة', icon: BookOpen, page: 'Tilawa', color: 'from-blue-500 to-cyan-500' },
  { name: 'المقرئين', icon: Mic, page: 'Reciters', color: 'from-purple-500 to-pink-500' },
  { name: 'الإذاعة', icon: Radio, page: 'QuranRadio', color: 'from-indigo-500 to-purple-500' },
  { name: 'التواشيح', icon: Music, page: 'Tawasheeh', color: 'from-amber-500 to-orange-500' },
  { name: 'الأيتام', icon: Heart, page: 'Orphans', color: 'from-red-500 to-pink-500' },
  { name: 'المكافآت', icon: Trophy, page: 'Rewards', color: 'from-yellow-500 to-amber-500' },
  { name: 'المساعد', icon: Sparkles, page: 'Assistant', color: 'from-teal-500 to-emerald-500' },
  { name: 'المكتبة', icon: Library, page: 'Library', color: 'from-rose-500 to-red-500' }
];

export default function QuickNavigation() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {QUICK_NAV.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={createPageUrl(item.page)}>
              <Card className={`bg-gradient-to-br ${item.color} p-6 text-white hover:scale-105 transition-transform cursor-pointer shadow-lg`}>
                <Icon className="w-8 h-8 mb-3" />
                <p className="font-bold text-lg">{item.name}</p>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}