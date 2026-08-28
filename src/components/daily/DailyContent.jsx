import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, BookOpen, Sparkles, HandHeart } from 'lucide-react';
import { toast } from 'sonner';

const DAILY_VERSE = {
  arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
  surah: 'البقرة',
  ayah: 186,
  tafsir: 'يخبر تعالى أنه قريب من عباده، يجيب دعاء الداعي إذا دعاه، فليستجيبوا له بالطاعة وليؤمنوا به لعلهم يرشدون.'
};

const DAILY_HADITH = {
  arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
  source: 'صحيح مسلم',
  narrator: 'أبو هريرة رضي الله عنه'
};

const DAILY_DUA = {
  arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي',
  occasion: 'دعاء الصباح والمساء',
  benefit: 'من أعظم الأدعية للحفظ والسلامة'
};

export default function DailyContent() {
  const [likes, setLikes] = useState({ verse: 0, hadith: 0, dua: 0 });
  const [liked, setLiked] = useState({ verse: false, hadith: false, dua: false });

  const handleLike = (type) => {
    setLiked(prev => ({ ...prev, [type]: !prev[type] }));
    setLikes(prev => ({ ...prev, [type]: prev[type] + (liked[type] ? -1 : 1) }));
  };

  const handleShare = (content, title) => {
    const text = `${title}\n\n${content}\n\n📱 من تطبيق القرآن الكريم`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('تم نسخ المحتوى للمشاركة! 📋');
    }
  };

  return (
    <div className="space-y-6">
      {/* آية اليوم */}
      <Card className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 text-white overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">آية اليوم</h3>
              <p className="text-emerald-200 text-sm">سورة {DAILY_VERSE.surah} - آية {DAILY_VERSE.ayah}</p>
            </div>
          </div>
          
          <p className="text-2xl md:text-3xl font-arabic leading-loose mb-4 text-center py-4">
            ﴿ {DAILY_VERSE.arabic} ﴾
          </p>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm mb-4">
            <p className="text-sm text-emerald-100 leading-relaxed">
              <span className="font-bold text-white">التفسير: </span>
              {DAILY_VERSE.tafsir}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike('verse')}
                className={`text-white hover:bg-white/20 ${liked.verse ? 'bg-white/20' : ''}`}
              >
                <Heart className={`w-4 h-4 ml-1 ${liked.verse ? 'fill-red-400 text-red-400' : ''}`} />
                {likes.verse || ''}
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <MessageCircle className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare(DAILY_VERSE.arabic, 'آية اليوم')}
              className="text-white hover:bg-white/20"
            >
              <Share2 className="w-4 h-4 ml-1" />
              مشاركة
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* حديث اليوم */}
        <Card className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">حديث اليوم</h3>
                <p className="text-amber-200 text-sm">{DAILY_HADITH.source}</p>
              </div>
            </div>
            
            <p className="text-xl font-arabic leading-loose mb-3 text-center py-3">
              « {DAILY_HADITH.arabic} »
            </p>
            
            <p className="text-sm text-amber-200 text-center mb-4">
              الراوي: {DAILY_HADITH.narrator}
            </p>
            
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike('hadith')}
                className={`text-white hover:bg-white/20 ${liked.hadith ? 'bg-white/20' : ''}`}
              >
                <Heart className={`w-4 h-4 ml-1 ${liked.hadith ? 'fill-red-400 text-red-400' : ''}`} />
                {likes.hadith || ''}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(DAILY_HADITH.arabic, 'حديث اليوم')}
                className="text-white hover:bg-white/20"
              >
                <Share2 className="w-4 h-4 ml-1" />
                مشاركة
              </Button>
            </div>
          </div>
        </Card>

        {/* دعاء اليوم */}
        <Card className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <HandHeart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">دعاء اليوم</h3>
                <p className="text-purple-200 text-sm">{DAILY_DUA.occasion}</p>
              </div>
            </div>
            
            <p className="text-lg font-arabic leading-loose mb-3 text-center py-3">
              {DAILY_DUA.arabic}
            </p>
            
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm mb-4">
              <p className="text-sm text-purple-200">💡 {DAILY_DUA.benefit}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike('dua')}
                className={`text-white hover:bg-white/20 ${liked.dua ? 'bg-white/20' : ''}`}
              >
                <Heart className={`w-4 h-4 ml-1 ${liked.dua ? 'fill-red-400 text-red-400' : ''}`} />
                {likes.dua || ''}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(DAILY_DUA.arabic, 'دعاء اليوم')}
                className="text-white hover:bg-white/20"
              >
                <Share2 className="w-4 h-4 ml-1" />
                مشاركة
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}