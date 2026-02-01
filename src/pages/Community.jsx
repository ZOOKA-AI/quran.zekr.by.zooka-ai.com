import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Share2, Send, Sparkles, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';

export default function CommunityPage() {
  const [newShare, setNewShare] = useState({ content_type: 'verse', arabic_text: '', translation: '', source: '' });
  const [commentText, setCommentText] = useState({});
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: shares = [] } = useQuery({
    queryKey: ['shares'],
    queryFn: () => base44.entities.DailyShare.list('-created_date', 50),
    initialData: [],
  });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-amber-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold">مجتمع القرآن الكريم</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">شارك آية أو حديث</h1>
          <p className="text-gray-600">انشر الفائدة وشارك الأجر مع المسلمين 🤲</p>
        </div>

        {/* Create Share */}
        {isAuthenticated && (
          <Card className="p-6 mb-8 bg-white shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              مشاركة جديدة
            </h3>
            <div className="space-y-4">
              <select
                value={newShare.content_type}
                onChange={(e) => setNewShare({ ...newShare, content_type: e.target.value })}
                className="w-full p-3 border rounded-lg"
              >
                <option value="verse">آية قرآنية</option>
                <option value="hadith">حديث شريف</option>
                <option value="wisdom">حكمة</option>
              </select>
              <Textarea
                placeholder="النص العربي..."
                value={newShare.arabic_text}
                onChange={(e) => setNewShare({ ...newShare, arabic_text: e.target.value })}
                className="min-h-[120px] font-arabic text-xl"
              />
              <Input
                placeholder="الترجمة أو الشرح..."
                value={newShare.translation}
                onChange={(e) => setNewShare({ ...newShare, translation: e.target.value })}
              />
              <Input
                placeholder="المصدر (اسم السورة أو كتاب الحديث)..."
                value={newShare.source}
                onChange={(e) => setNewShare({ ...newShare, source: e.target.value })}
              />
              <Button
                onClick={handleSubmitShare}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                disabled={createShareMutation.isPending}
              >
                <Send className="w-4 h-4 ml-2" />
                نشر المشاركة
              </Button>
            </div>
          </Card>
        )}

        {/* Shares Feed */}
        <div className="space-y-6">
          {shares.length === 0 ? (
            <Card className="p-12 text-center bg-white">
              <Sparkles className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg mb-4">لا توجد مشاركات بعد</p>
              <p className="text-gray-500">كن أول من يشارك آية أو حديث مع المجتمع!</p>
            </Card>
          ) : (
            shares.map((share) => {
              const shareComments = getShareComments(share.id);
              return (
                <Card key={share.id} className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {share.created_by?.charAt(0) || '؟'}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{share.created_by || 'مستخدم'}</p>
                      <p className="text-sm text-gray-500">{new Date(share.created_date).toLocaleDateString('ar')}</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                      {share.content_type === 'verse' ? 'آية' : share.content_type === 'hadith' ? 'حديث' : 'حكمة'}
                    </span>
                  </div>

                  <div className="mb-4 p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200">
                    <p className="text-2xl font-arabic leading-loose text-gray-900 mb-3">{share.arabic_text}</p>
                    {share.translation && (
                      <p className="text-gray-700 border-t border-emerald-200 pt-3">{share.translation}</p>
                    )}
                    {share.source && (
                      <p className="text-sm text-emerald-600 font-bold mt-2">📖 {share.source}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-6 mb-4 pb-4 border-b">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-bold">{share.likes_count || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-bold">{shareComments.length}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm font-bold">{share.shares_count || 0}</span>
                    </button>
                  </div>

                  {/* Comments */}
                  {shareComments.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {shareComments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {comment.created_by?.charAt(0) || '؟'}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-gray-900">{comment.created_by || 'مستخدم'}</p>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  {isAuthenticated && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="اكتب تعليقك..."
                        value={commentText[share.id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [share.id]: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(share.id)}
                      />
                      <Button onClick={() => handleComment(share.id)} size="icon">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}