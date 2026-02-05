import { Heart, MessageCircle, Share2, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function SharedContentCard({ share, comments }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(share.likes_count || 0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const contentTypeLabel = {
    verse: { text: 'آية قرآنية', color: 'bg-amber-600' },
    hadith: { text: 'حديث شريف', color: 'bg-green-600' },
    wisdom: { text: 'حكمة', color: 'bg-blue-600' },
  };

  const typeInfo = contentTypeLabel[share.content_type] || contentTypeLabel.verse;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6 hover:border-pink-400/50 transition-all hover:shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-rose-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-pink-200 truncate">{share.created_by || 'مستخدم'}</p>
              <p className="text-xs text-slate-400">{new Date(share.created_date).toLocaleDateString('ar')}</p>
            </div>
          </div>
          <Badge className={`${typeInfo.color} text-white flex-shrink-0`}>
            {typeInfo.text}
          </Badge>
        </div>

        {/* Content */}
        <div className="mb-4 p-6 bg-gradient-to-br from-amber-500/15 to-pink-500/15 rounded-xl border border-amber-500/30 backdrop-blur-sm">
          <p className="text-xl md:text-2xl font-arabic leading-relaxed text-amber-100 mb-3">
            {share.arabic_text}
          </p>
          {share.translation && (
            <div className="border-t border-amber-500/20 pt-3 mt-3">
              <p className="text-slate-300 text-sm md:text-base">{share.translation}</p>
            </div>
          )}
          {share.source && (
            <p className="text-sm text-amber-400 font-bold mt-3">📖 {share.source}</p>
          )}
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">{likeCount} إعجاب</span>
            <span className="text-slate-400">{comments?.length || 0} تعليقات</span>
            <span className="text-slate-400">{share.shares_count || 0} مشاركات</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex-1 gap-2 ${isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'} transition-colors`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
            إعجاب
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 gap-2 text-slate-400 hover:text-purple-400">
            <MessageCircle className="w-5 h-5" />
            تعليق
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 gap-2 text-slate-400 hover:text-amber-400">
            <Share2 className="w-5 h-5" />
            مشاركة
          </Button>
        </div>
      </div>
    </motion.div>
  );
}