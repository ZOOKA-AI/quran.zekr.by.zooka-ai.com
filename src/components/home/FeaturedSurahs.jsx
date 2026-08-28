import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURED_SURAHS = [
  { number: 1, name: 'الفاتحة', verses: 7, gradient: 'from-emerald-600 to-teal-600' },
  { number: 18, name: 'الكهف', verses: 110, gradient: 'from-purple-600 to-pink-600' },
  { number: 36, name: 'يس', verses: 83, gradient: 'from-amber-600 to-orange-600' },
  { number: 67, name: 'الملك', verses: 30, gradient: 'from-blue-600 to-cyan-600' }
];

export default function FeaturedSurahs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {FEATURED_SURAHS.map((surah, index) => (
        <motion.div
          key={surah.number}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`bg-gradient-to-br ${surah.gradient} text-white p-6 hover:shadow-xl transition-all`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">{surah.number}</span>
              </div>
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2 font-arabic">{surah.name}</h3>
            <p className="text-sm opacity-90 mb-4">{surah.verses} آية</p>
            <Link to={createPageUrl(`SurahView?surah=${surah.number}`)}>
              <Button variant="secondary" className="w-full">
                <Play className="w-4 h-4 ml-2" />
                قراءة
              </Button>
            </Link>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}