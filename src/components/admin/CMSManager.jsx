import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Save, X, FileText, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function CMSManager() {
  const [editingPage, setEditingPage] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ slug: '', title: '', content: '', is_published: true, order: 0 });
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['static-pages'],
    queryFn: () => base44.entities.StaticPage.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.StaticPage.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['static-pages']);
      setIsCreating(false);
      setFormData({ slug: '', title: '', content: '', is_published: true, order: 0 });
      toast.success('تم إنشاء الصفحة بنجاح');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.StaticPage.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['static-pages']);
      setEditingPage(null);
      toast.success('تم تحديث الصفحة بنجاح');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.StaticPage.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['static-pages']);
      toast.success('تم حذف الصفحة');
    },
  });

  const handleSubmit = () => {
    if (!formData.slug || !formData.title || !formData.content) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    if (editingPage) {
      updateMutation.mutate({ id: editingPage.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const startEdit = (page) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content,
      is_published: page.is_published,
      order: page.order || 0
    });
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      {/* إضافة صفحة جديدة */}
      {!isCreating ? (
        <Button onClick={() => setIsCreating(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 ml-2" />
          إضافة صفحة جديدة
        </Button>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              {editingPage ? 'تعديل الصفحة' : 'إنشاء صفحة جديدة'}
              <Button variant="ghost" size="icon" onClick={() => { setIsCreating(false); setEditingPage(null); }}>
                <X className="w-5 h-5 text-slate-400" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-sm mb-1 block">المعرف (slug)</label>
                <Input
                  placeholder="about"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm mb-1 block">العنوان</label>
                <Input
                  placeholder="عن التطبيق"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="text-slate-300 text-sm mb-1 block">المحتوى</label>
              <Textarea
                placeholder="محتوى الصفحة..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white min-h-[200px]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <span className="text-slate-300">منشورة</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setIsCreating(false); setEditingPage(null); }}>
                  إلغاء
                </Button>
                <Button onClick={handleSubmit} className="bg-emerald-600">
                  <Save className="w-4 h-4 ml-2" />
                  {editingPage ? 'تحديث' : 'حفظ'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* قائمة الصفحات */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            الصفحات الثابتة ({pages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-slate-400 text-center py-8">جاري التحميل...</p>
          ) : pages.length === 0 ? (
            <p className="text-slate-400 text-center py-8">لا توجد صفحات</p>
          ) : (
            <div className="space-y-3">
              {pages.map(page => (
                <div key={page.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">{page.title}</p>
                      <p className="text-slate-400 text-sm">/{page.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={page.is_published ? 'bg-green-500' : 'bg-slate-600'}>
                      {page.is_published ? 'منشورة' : 'مسودة'}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => startEdit(page)}>
                      <Edit className="w-4 h-4 text-blue-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteMutation.mutate(page.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}