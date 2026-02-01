import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowRight, BookOpen, Shield, FileText, Mail, Loader2, Info, Phone, Scale, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const ICONS = {
  BookOpen,
  Shield,
  FileText,
  Mail,
  Info,
  Phone,
  Scale,
  HelpCircle
};

export default function StaticPageView() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug') || 'about';

  const { data: pages, isLoading } = useQuery({
    queryKey: ['static-pages'],
    queryFn: () => base44.entities.StaticPage.filter({ is_published: true }),
  });

  const currentPage = pages?.find(p => p.slug === slug);
  const Icon = currentPage?.icon ? ICONS[currentPage.icon] : FileText;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!currentPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">الصفحة غير موجودة</h2>
          <Link to={createPageUrl('Quran')} className="text-emerald-600 hover:underline">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={createPageUrl('Quran')} 
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </Link>
          
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Icon className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold">{currentPage.title}</h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {pages?.sort((a, b) => a.order - b.order).map(page => {
            const PageIcon = page.icon ? ICONS[page.icon] : FileText;
            return (
              <Link
                key={page.id}
                to={createPageUrl(`StaticPageView?slug=${page.slug}`)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  page.slug === slug
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 border'
                }`}
              >
                <PageIcon className="w-4 h-4" />
                {page.title}
              </Link>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div 
            className="prose prose-lg max-w-none prose-headings:text-emerald-800 prose-a:text-emerald-600 prose-p:text-gray-700 prose-li:text-gray-700"
            dangerouslySetInnerHTML={{ __html: currentPage.content }}
          />
          
          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>آخر تحديث: {new Date(currentPage.updated_date).toLocaleDateString('ar-EG')}</p>
          </div>
        </div>

        {/* Quick Links to Other Pages */}
        {pages?.length > 1 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">صفحات أخرى</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {pages?.filter(p => p.slug !== slug).map(page => {
                const PageIcon = page.icon ? ICONS[page.icon] : FileText;
                return (
                  <Link
                    key={page.id}
                    to={createPageUrl(`StaticPageView?slug=${page.slug}`)}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <PageIcon className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-700">{page.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}