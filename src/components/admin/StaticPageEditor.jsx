import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FileText, Plus, Save, Trash2, Edit, Eye, Loader2, BookOpen, Shield, Mail } from 'lucide-react';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';

const ICON_OPTIONS = [
  { value: 'BookOpen', label: 'كتاب', icon: BookOpen },
  { value: 'Shield', label: 'درع', icon: Shield },
  { value: 'FileText', label: 'ملف', icon: FileText },
  { value: 'Mail', label: 'بريد', icon: Mail },
];

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link'],
    ['clean']
  ],
};

export default function StaticPageEditor() {
  const queryClient = useQueryClient();
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    icon: 'FileText',
    is_published: true,
    order: 0
  });

  const { data: pages, isLoading } = useQuery({
    queryKey: ['admin-static-pages'],
    queryFn: () => base44.entities.StaticPage.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.StaticPage.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-static-pages']);
      toast.success('تم إنشاء الصفحة بنجاح');
      resetForm();
    },
    onError: () => toast.error('حدث خطأ')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.StaticPage.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-static-pages']);
      toast.success('تم تحديث الصفحة بنجاح');
      resetForm();
    },
    onError: () => toast.error('حدث خطأ')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.StaticPage.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-static-pages']);
      toast.success('تم حذف الصفحة');
    },
    onError: () => toast.error('حدث خطأ')
  });

  const resetForm = () => {
    setEditingPage(null);
    setFormData({
      slug: '',
      title: '',
      content: '',
      icon: 'FileText',
      is_published: true,
      order: 0
    });
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content,
      icon: page.icon || 'FileText',
      is_published: page.is_published,
      order: page.order || 0
    });
  };

  const handleSubmit = () => {
    if (!formData.slug || !formData.title) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (editingPage) {
      updateMutation.mutate({ id: editingPage.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {editingPage ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {editingPage ? 'تعديل الصفحة' : 'إنشاء صفحة جديدة'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">المعرف (slug)</label>
              <Input
                placeholder="مثال: about"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                disabled={!!editingPage}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">العنوان</label>
              <Input
                placeholder="عنوان الصفحة"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">الأيقونة</label>
              <Select value={formData.icon} onValueChange={(v) => setFormData({ ...formData, icon: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.icon className="w-4 h-4" />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">الترتيب</label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(v) => setFormData({ ...formData, is_published: v })}
                />
                <span className="text-sm">منشورة</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">المحتوى</label>
            <div className="bg-white rounded-lg border">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(v) => setFormData({ ...formData, content: v })}
                modules={quillModules}
                placeholder="اكتب محتوى الصفحة هنا..."
                className="min-h-[300px]"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
              {editingPage ? 'تحديث' : 'إنشاء'}
            </Button>
            {editingPage && (
              <Button variant="outline" onClick={resetForm}>
                إلغاء
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            الصفحات الثابتة ({pages?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          ) : pages?.length === 0 ? (
            <p className="text-center text-gray-500 py-8">لا توجد صفحات</p>
          ) : (
            <div className="space-y-3">
              {pages?.sort((a, b) => a.order - b.order).map(page => {
                const IconComponent = ICON_OPTIONS.find(i => i.value === page.icon)?.icon || FileText;
                return (
                  <div 
                    key={page.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{page.title}</h3>
                        <p className="text-sm text-gray-500">/{page.slug}</p>
                      </div>
                      {!page.is_published && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          مسودة
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/StaticPageView?slug=${page.slug}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(page)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => deleteMutation.mutate(page.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}