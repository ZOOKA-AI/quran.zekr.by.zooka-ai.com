import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Lock, Globe, BookOpen, TrendingUp, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ReadingGroups() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    group_type: 'public'
  });
  
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: groups, isLoading } = useQuery({
    queryKey: ['readingGroups'],
    queryFn: () => base44.entities.ReadingGroup.list('-created_date', 50),
    initialData: []
  });

  const createGroupMutation = useMutation({
    mutationFn: (groupData) => base44.entities.ReadingGroup.create({
      ...groupData,
      admin_id: user?.id,
      members: [{
        user_id: user?.id,
        user_email: user?.email,
        joined_date: new Date().toISOString(),
        role: 'admin'
      }],
      members_count: 1
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['readingGroups']);
      setShowCreateDialog(false);
      setNewGroup({ name: '', description: '', group_type: 'public' });
    }
  });

  const joinGroupMutation = useMutation({
    mutationFn: async (group) => {
      const updatedMembers = [
        ...(group.members || []),
        {
          user_id: user?.id,
          user_email: user?.email,
          joined_date: new Date().toISOString(),
          role: 'member'
        }
      ];
      return base44.entities.ReadingGroup.update(group.id, {
        members: updatedMembers,
        members_count: updatedMembers.length
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['readingGroups']);
    }
  });

  const handleCreateGroup = () => {
    if (newGroup.name && newGroup.description) {
      createGroupMutation.mutate(newGroup);
    }
  };

  const isUserMember = (group) => {
    return group.members?.some(m => m.user_id === user?.id);
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
          <h2 className="text-2xl font-bold text-emerald-800">مجموعات القراءة</h2>
          <p className="text-gray-600">انضم لمجموعات القراءة وشارك مع المسلمين</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 ml-2" />
              إنشاء مجموعة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إنشاء مجموعة قراءة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">اسم المجموعة</Label>
                <Input
                  id="name"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  placeholder="مجموعة ختم القرآن"
                />
              </div>
              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                  placeholder="وصف المجموعة وأهدافها"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="type">نوع المجموعة</Label>
                <Select value={newGroup.group_type} onValueChange={(value) => setNewGroup({...newGroup, group_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">عامة</SelectItem>
                    <SelectItem value="private">خاصة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleCreateGroup}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={createGroupMutation.isPending}
              >
                {createGroupMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء المجموعة'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{group.name}</CardTitle>
                  <CardDescription className="text-sm">{group.description}</CardDescription>
                </div>
                {group.group_type === 'private' ? (
                  <Lock className="w-4 h-4 text-gray-400" />
                ) : (
                  <Globe className="w-4 h-4 text-emerald-600" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{group.members_count || 0} عضو</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{group.discussions_count || 0} نقاش</span>
                </div>
              </div>

              {group.completion_rate > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">نسبة الإنجاز</span>
                    <span className="font-bold text-emerald-600">{group.completion_rate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${group.completion_rate}%` }}
                    />
                  </div>
                </div>
              )}

              {group.tags && group.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {group.tags.slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {isUserMember(group) ? (
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="sm">
                  <BookOpen className="w-4 h-4 ml-2" />
                  فتح المجموعة
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  size="sm"
                  onClick={() => joinGroupMutation.mutate(group)}
                  disabled={joinGroupMutation.isPending}
                >
                  {joinGroupMutation.isPending ? 'جاري الانضمام...' : 'انضم للمجموعة'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد مجموعات قراءة بعد</h3>
            <p className="text-gray-500 mb-4">كن أول من ينشئ مجموعة قراءة</p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 ml-2" />
              إنشاء أول مجموعة
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}