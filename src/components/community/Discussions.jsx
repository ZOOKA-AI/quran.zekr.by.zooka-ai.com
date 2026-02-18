import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Heart, Send, Pin, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import moment from 'moment';

export default function Discussions({ groupId = null }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    discussion_type: 'general'
  });
  const [newComment, setNewComment] = useState('');

  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: discussions, isLoading } = useQuery({
    queryKey: ['discussions', groupId],
    queryFn: () => groupId 
      ? base44.entities.Discussion.filter({ group_id: groupId }, '-created_date', 50)
      : base44.entities.Discussion.list('-created_date', 50),
    initialData: []
  });

  const { data: comments } = useQuery({
    queryKey: ['discussionComments', selectedDiscussion?.id],
    queryFn: () => base44.entities.DiscussionComment.filter(
      { discussion_id: selectedDiscussion.id }, 
      'created_date', 
      100
    ),
    enabled: !!selectedDiscussion,
    initialData: []
  });

  const createDiscussionMutation = useMutation({
    mutationFn: (data) => base44.entities.Discussion.create({
      ...data,
      author_id: user?.id,
      author_name: user?.full_name || user?.email,
      group_id: groupId
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['discussions']);
      setShowCreateDialog(false);
      setNewDiscussion({ title: '', content: '', discussion_type: 'general' });
    }
  });

  const createCommentMutation = useMutation({
    mutationFn: (data) => base44.entities.DiscussionComment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['discussionComments']);
      setNewComment('');
    }
  });

  const likeMutation = useMutation({
    mutationFn: async (discussion) => {
      return base44.entities.Discussion.update(discussion.id, {
        likes_count: (discussion.likes_count || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['discussions']);
    }
  });

  const handleCreateDiscussion = () => {
    if (newDiscussion.title && newDiscussion.content) {
      createDiscussionMutation.mutate(newDiscussion);
    }
  };

  const handleAddComment = () => {
    if (newComment && selectedDiscussion) {
      createCommentMutation.mutate({
        discussion_id: selectedDiscussion.id,
        content: newComment,
        author_id: user?.id,
        author_name: user?.full_name || user?.email
      });
    }
  };

  const discussionTypes = {
    verse: { label: 'آية قرآنية', color: 'bg-emerald-100 text-emerald-800' },
    hadith: { label: 'حديث نبوي', color: 'bg-blue-100 text-blue-800' },
    dua: { label: 'دعاء', color: 'bg-purple-100 text-purple-800' },
    general: { label: 'عام', color: 'bg-gray-100 text-gray-800' }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-emerald-800">النقاشات والتعليقات</h2>
          <p className="text-gray-600">شارك أفكارك وتأملاتك مع المجتمع</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 ml-2" />
              نقاش جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>إنشاء نقاش جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان النقاش</Label>
                <Input
                  id="title"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                  placeholder="أدخل عنوان النقاش"
                />
              </div>
              <div>
                <Label htmlFor="type">نوع النقاش</Label>
                <Select 
                  value={newDiscussion.discussion_type} 
                  onValueChange={(value) => setNewDiscussion({...newDiscussion, discussion_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">عام</SelectItem>
                    <SelectItem value="verse">آية قرآنية</SelectItem>
                    <SelectItem value="hadith">حديث نبوي</SelectItem>
                    <SelectItem value="dua">دعاء</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content">المحتوى</Label>
                <Textarea
                  id="content"
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
                  placeholder="اكتب محتوى النقاش..."
                  rows={5}
                />
              </div>
              <Button
                onClick={handleCreateDiscussion}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={createDiscussionMutation.isPending}
              >
                {createDiscussionMutation.isPending ? 'جاري النشر...' : 'نشر النقاش'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <Card key={discussion.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{discussion.title}</CardTitle>
                    {discussion.is_pinned && <Pin className="w-4 h-4 text-amber-600" />}
                    {discussion.is_locked && <Lock className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={discussionTypes[discussion.discussion_type].color}>
                      {discussionTypes[discussion.discussion_type].label}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {discussion.author_name} • {moment(discussion.created_date).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
              <CardDescription className="mt-2">
                {discussion.content}
              </CardDescription>
              
              {discussion.reference?.verse_text && (
                <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="font-arabic text-lg text-emerald-900">{discussion.reference.verse_text}</p>
                  <p className="text-sm text-emerald-600 mt-1">
                    {discussion.reference.surah_number}:{discussion.reference.verse_number}
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => likeMutation.mutate(discussion)}
                  className="text-gray-600 hover:text-red-600"
                >
                  <Heart className="w-4 h-4 ml-1" />
                  {discussion.likes_count || 0}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDiscussion(discussion)}
                  className="text-gray-600 hover:text-emerald-600"
                >
                  <MessageSquare className="w-4 h-4 ml-1" />
                  {discussion.comments_count || 0} تعليق
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {discussions.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد نقاشات بعد</h3>
            <p className="text-gray-500 mb-4">كن أول من يبدأ نقاشاً</p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 ml-2" />
              بدء نقاش
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Comments Dialog */}
      <Dialog open={!!selectedDiscussion} onOpenChange={() => setSelectedDiscussion(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDiscussion?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{selectedDiscussion?.content}</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold text-gray-700">التعليقات ({comments.length})</h4>
              {comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{comment.author_name}</span>
                    <span className="text-xs text-gray-500">{moment(comment.created_date).fromNow()}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                </div>
              ))}
            </div>

            {!selectedDiscussion?.is_locked && (
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="اكتب تعليقك..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={createCommentMutation.isPending || !newComment}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}