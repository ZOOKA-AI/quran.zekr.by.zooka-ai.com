import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Share2, Send, Sparkles, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';

export default function CommunityPage() {
  const [newShare, setNewShare] = useState({ content_type: 'verse', arabic_text: '', translation: '', source: '' });
  const [commentText, setCommentText] = useState({});
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: shares = [], refetch: refetchShares } = useQuery({
    queryKey: ['shares'],
    queryFn: () => base44.entities.DailyShare.list('-created_date', 50),
    initialData: [],
  });

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
    <div className="min-h-screen relative pb-24" dir="rtl">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-950/90 via-purple-950/95 to-slate-950/98" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">مجتمع القرآن</h1>
          <p className="text-xl text-pink-200 font-arabic">﴿ وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ﴾</p>
          <p className="text-slate-300 mt-2">شارك آية أو حديث وانشر الفائدة 🤲</p>
        </motion.div>

        {isAuthenticated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 mb-8 bg-slate-900/60 backdrop-blur-xl border-pink-500/30 shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-pink-200">
                <TrendingUp className="w-6 h-6" />
                مشاركة جديدة
              </h3>
              <div className="space-y-4">
                <select
                  value={newShare.content_type}
                  onChange={(e) => setNewShare({ ...newShare, content_type: e.target.value })}
                  className="w-full p-3 border border-pink-500/30 rounded-lg bg-slate-800/60 text-white"
                >
                  <option value="verse">آية قرآنية</option>
                  <option value="hadith">حديث شريف</option>
                  <option value="wisdom">حكمة</option>
                </select>
                <Textarea
                  placeholder="النص العربي..."
                  value={newShare.arabic_text}
                  onChange={(e) => setNewShare({ ...newShare, arabic_text: e.target.value })}
                  className="min-h-[120px] font-arabic text-xl bg-slate-800/60 border-pink-500/30 text-white placeholder:text-slate-400"
                />
                <Input
                  placeholder="الترجمة أو الشرح..."
                  value={newShare.translation}
                  onChange={(e) => setNewShare({ ...newShare, translation: e.target.value })}
                  className="bg-slate-800/60 border-pink-500/30 text-white placeholder:text-slate-400"
                />
                <Input
                  placeholder="المصدر..."
                  value={newShare.source}
                  onChange={(e) => setNewShare({ ...newShare, source: e.target.value })}
                  className="bg-slate-800/60 border-pink-500/30 text-white placeholder:text-slate-400"
                />
                <Button
                  onClick={handleSubmitShare}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-lg"
                  disabled={createShareMutation.isPending}
                >
                  <Send className="w-5 h-5 ml-2" />
                  نشر المشاركة
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="space-y-6">
          {shares.length === 0 ? (
            <Card className="p-12 text-center bg-slate-900/60 backdrop-blur-xl border-pink-500/30">
              <Sparkles className="w-20 h-20 mx-auto text-pink-400 mb-4" />
              <p className="text-pink-200 text-xl mb-4">لا توجد مشاركات بعد</p>
              <p className="text-slate-400">كن أول من يشارك آية أو حديث مع المجتمع!</p>
            </Card>
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
                  <Card className="p-6 bg-slate-900/60 backdrop-blur-xl border-pink-500/30 hover:border-pink-400/50 transition-all hover:shadow-2xl">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-rose-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {share.created_by?.charAt(0) || '؟'}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-pink-200">{share.created_by || 'مستخدم'}</p>
                        <p className="text-sm text-slate-400">{new Date(share.created_date).toLocaleDateString('ar')}</p>
                      </div>
                      <Badge className="bg-pink-600/80 text-white">
                        {share.content_type === 'verse' ? 'آية' : share.content_type === 'hadith' ? 'حديث' : 'حكمة'}
                      </Badge>
                    </div>

                    <div className="mb-4 p-6 bg-gradient-to-br from-amber-500/10 to-pink-500/10 rounded-xl border border-amber-500/20">
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

                    {shareComments.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {shareComments.map((comment) => (
                          <div key={comment.id} className="flex gap-3 p-3 bg-slate-800/60 rounded-lg">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {comment.created_by?.charAt(0) || '؟'}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-sm text-pink-200">{comment.created_by || 'مستخدم'}</p>
                              <p className="text-slate-300">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {isAuthenticated && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="اكتب تعليقك..."
                          value={commentText[share.id] || ''}
                          onChange={(e) => setCommentText({ ...commentText, [share.id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(share.id)}
                          className="bg-slate-800/60 border-pink-500/30 text-white placeholder:text-slate-400"
                        />
                        <Button onClick={() => handleComment(share.id)} size="icon" className="bg-gradient-to-br from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-lg">
                          <Send className="w-5 h-5" />
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
    </div>
  );
}