import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText } from 'lucide-react';

const NavigationControls = ({ currentJuz, currentPage, onJuzChange, onPageChange }) => {
  return (
    <Card className="bg-gradient-to-r from-white to-emerald-50/30 border-2 border-emerald-100">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Juz Navigation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-gray-800">التنقل بالأجزاء</h3>
            </div>
            <Select value={currentJuz?.toString()} onValueChange={(val) => onJuzChange(parseInt(val))}>
              <SelectTrigger className="w-full h-12 border-2">
                <SelectValue placeholder="اختر الجزء" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                  <SelectItem key={juz} value={juz.toString()}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-emerald-50">
                        {juz}
                      </Badge>
                      <span>الجزء {juz}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Navigation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-gray-800">التنقل بالصفحات</h3>
            </div>
            <Select value={currentPage?.toString()} onValueChange={(val) => onPageChange(parseInt(val))}>
              <SelectTrigger className="w-full h-12 border-2">
                <SelectValue placeholder="اختر الصفحة" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {Array.from({ length: 604 }, (_, i) => i + 1).map((page) => (
                  <SelectItem key={page} value={page.toString()}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-amber-50">
                        {page}
                      </Badge>
                      <span>صفحة {page}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Navigation Buttons */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">تصفح سريع:</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={!currentPage || currentPage <= 1}
              >
                الصفحة السابقة
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => currentPage < 604 && onPageChange(currentPage + 1)}
                disabled={!currentPage || currentPage >= 604}
              >
                الصفحة التالية
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NavigationControls;