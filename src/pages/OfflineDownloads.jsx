import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import OfflineAudioManager from '@/components/audio/OfflineAudioManager';

export default function OfflineDownloads() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl('Quran')}>
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📥 التحميلات المحلية</h1>
          <p className="text-gray-600">
            حمّل التلاوات للاستماع إليها بدون إنترنت
          </p>
        </div>

        {/* Manager */}
        <OfflineAudioManager />

        {/* Info Card */}
        <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <h3 className="text-lg font-bold text-blue-900 mb-3">💡 معلومات مهمة</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• يتم حفظ الصوتيات في ذاكرة المتصفح المحلية</li>
            <li>• يمكنك الاستماع بدون إنترنت بعد التحميل</li>
            <li>• الملفات محمية ولن تُحذف تلقائياً</li>
            <li>• يمكنك حذف الصوتيات في أي وقت لتوفير المساحة</li>
          </ul>
        </div>
      </div>
    </div>
  );
}