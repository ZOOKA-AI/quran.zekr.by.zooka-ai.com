import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Share2, Send, Sparkles, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';
import IslamicBackground from '@/components/layout/IslamicBackground';
import { motion } from 'framer-motion';

export default function CommunityPage() {
  const [newShare, setNewShare] = useState({ content_type: 'verse', arabic_text: '', translation: '', source: '' });
  const [commentText, setCommentText] = useState({});
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: shares = [], refetch: refetchShares } = useQuery({
    queryKey: ['shares'],
    queryFn: () => base44.entities.DailyShare.list('-created_date', 50),
    initialData: [],
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = base44.entities.DailyShare.subscribe((event) => {
      queryClient.invalidateQueries({ queryKey: ['shares'] });
    });
    return unsubscribe;
  }, [queryClient]);

  const createShareMutation = useMutation({
    mutationFn: (data) => base44.entities.DailyShare.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shares'] });
      setNewShare({ content_type: 'verse', arabic_text: '', translation: '', source: '' });
      toast.success('تم نشر المشاركة بنجاح! 🌟');
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: (data) => base44.entities.Comment.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      setCommentText({ ...commentText, [variables.share_id]: '' });
      toast.success('تم إضافة تعليقك 💬');
    },
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: () => base44.entities.Comment.list('-created_date', 100),
    initialData: [],
  });

  const handleSubmitShare = () => {
    if (!isAuthenticated) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }
    if (!newShare.arabic_text) {
      toast.error('يرجى إدخال النص');
      return;
    }
    createShareMutation.mutate(newShare);
  };

  const handleComment = (shareId) => {
    if (!isAuthenticated) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }
    const text = commentText[shareId];
    if (!text || text.trim() === '') return;
    createCommentMutation.mutate({ share_id: shareId, content: text });
  };

  const getShareComments = (shareId) => {
    return comments.filter(c => c.share_id === shareId);
  };

  return (
    <IslamicBackground variant="purple">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* الرأس */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 pt-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">مجتمع القرآن الكريم</h1>
          <p className="text-xl text-pink-200 font-arabic">﴿ وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ﴾</p>
          <p className="text-slate-300 mt-2 text-lg">شارك آياتك المفضلة وتأملاتك 🤲</p>
        </motion.div>

        {/* إنشاء مشاركة */}
        {isAuthenticated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 mb-8 bg-slate-900/60 backdrop-blur-xl border-pink-500/30 hover:border-pink-400/50 transition-all shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-pink-200">
                <Sparkles className="w-5 h-5 text-pink-400" />
                مشاركة جديدة
              </h3>
            <div className="space-y-4">
              <select
                value={newShare.content_type}
                onChange={(e) => setNewShare({ ...newShare, content_type: e.target.value })}
                className="w-full p-3 border border-purple-500/30 rounded-lg bg-slate-800/50 text-white"
              >
                <option value="verse">آية قرآنية</option>
                <option value="hadith">حديث شريف</option>
                <option value="wisdom">حكمة</option>
              </select>
              <Textarea
                placeholder="النص العربي..."
                value={newShare.arabic_text}
                onChange={(e) => setNewShare({ ...newShare, arabic_text: e.target.value })}
                className="min-h-[120px] font-arabic text-xl bg-slate-800/50 border-purple-500/30 text-white placeholder:text-slate-400"
              />
              <Input
                placeholder="الترجمة أو الشرح..."
                value={newShare.translation}
                onChange={(e) => setNewShare({ ...newShare, translation: e.target.value })}
                className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-slate-400"
              />
              <Input
                placeholder="المصدر (اسم السورة أو كتاب الحديث)..."
                value={newShare.source}
                onChange={(e) => setNewShare({ ...newShare, source: e.target.value })}
                className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-slate-400"
              />
              <Button
                onClick={handleSubmitShare}
                size="lg"
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg hover:shadow-xl transition-all"
                disabled={createShareMutation.isPending}
              >
                <Send className="w-5 h-5 ml-2" />
                <span className="font-bold">نشر المشاركة</span>
              </Button>
            </div>
          </Card>
          </motion.div>
        )}

        {/* المشاركات */}
        <div className="space-y-6">
          {shares.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="p-12 text-center bg-slate-900/60 backdrop-blur-xl border-pink-500/30 shadow-xl">
                <Sparkles className="w-20 h-20 mx-auto text-pink-400 mb-4" />
                <h2 className="text-2xl font-bold text-pink-200 mb-3">لا توجد مشاركات بعد</h2>
                <p className="text-slate-300 text-lg">كن أول من يشارك آية أو حديث مع المجتمع!</p>
              </Card>
            </motion.div>
          ) : (
            shares.map((share, index) => {
              const shareComments = getShareComments(share.id);
              return (
                <motion.div
                  key={share.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-slate-900/60 backdrop-blur-xl border-pink-500/30 hover:border-pink-400/60 transition-all hover:shadow-2xl">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {share.created_by?.charAt(0) || '؟'}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-amber-100">{share.created_by || 'مستخدم'}</p>
                      <p className="text-sm text-slate-400">{new Date(share.created_date).toLocaleDateString('ar')}</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-bold">
                      {share.content_type === 'verse' ? 'آية' : share.content_type === 'hadith' ? 'حديث' : 'حكمة'}
                    </span>
                  </div>

                  <div className="mb-4 p-6 bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-xl border border-amber-500/20">
                    <p className="text-2xl font-arabic leading-loose text-amber-100 mb-3">{share.arabic_text}</p>
                    {share.translation && (
                      <p className="text-slate-300 border-t border-amber-500/20 pt-3">{share.translation}</p>
                    )}
                    {share.source && (
                      <p className="text-sm text-amber-400 font-bold mt-2">📖 {share.source}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-6 mb-4 pb-4 border-b border-slate-700">
                    <button className="flex items-center gap-2 text-slate-400 hover:text-pink-400 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-bold">{share.likes_count || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-bold">{shareComments.length}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm font-bold">{share.shares_count || 0}</span>
                    </button>
                  </div>

                  {/* التعليقات */}
                  {shareComments.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {shareComments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-3 bg-slate-800/50 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {comment.created_by?.charAt(0) || '؟'}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-amber-200">{comment.created_by || 'مستخدم'}</p>
                            <p className="text-slate-300">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* إضافة تعليق */}
                  {isAuthenticated && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="اكتب تعليقك..."
                        value={commentText[share.id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [share.id]: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(share.id)}
                        className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-slate-500"
                      />
                      <Button 
                        onClick={() => handleComment(share.id)} 
                        size="icon" 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </IslamicBackground>
  );
}