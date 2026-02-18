import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Share2, Send, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import CommunityHero from '@/components/community/CommunityHero';
import CommunityStats from '@/components/community/CommunityStats';
import SharedContentCard from '@/components/community/SharedContentCard';
import InspirationalVideos from '@/components/community/InspirationalVideos';
import TrendingTopics from '@/components/community/TrendingTopics';
import PullToRefresh from '@/components/mobile/PullToRefresh';
import PageTransition from '@/components/transitions/PageTransition';

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

  const handleRefresh = async () => {
    await refetchShares();
    toast.success('تم التحديث بنجاح');
  };

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
    <PageTransition>
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="min-h-screen relative pb-24 bg-white dark:bg-slate-950" dir="rtl">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-950/90 via-purple-950/95 to-slate-950/98 dark:from-pink-950/95 dark:via-purple-950/98 dark:to-black/98" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <CommunityHero />
        <CommunityStats />

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

        {/* Recent Shares Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">المشاركات الحديثة</h2>
          <p className="text-slate-400 mb-8">أحدث آيات وأحاديث مشاركة من المجتمع</p>

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
                  <SharedContentCard
                    key={share.id}
                    share={share}
                    comments={shareComments}
                    onComment={handleComment}
                    isAuthenticated={isAuthenticated}
                  />
                );
              })
            )}
          </div>
        </section>

        {/* Trending Topics */}
        <TrendingTopics />

        {/* Inspirational Videos */}
        <InspirationalVideos />
      </div>
    </div>
    </PullToRefresh>
    </PageTransition>
  );
}