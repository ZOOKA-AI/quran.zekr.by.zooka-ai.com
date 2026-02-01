/**
 * MobileMenu component - Side sheet navigation menu
 * Production-ready and 1:1 compatible with Next.js migration
 */

import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, Settings, Bell, LogOut } from 'lucide-react';
import { MAIN_NAV, QUICK_ACTIONS, QURAN_STATS } from '@/data/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  currentPageName: string;
};

export default function MobileMenu({ isOpen, onClose, currentPageName }: MobileMenuProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            القرآن الكريم
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* Main Navigation */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-2">
              الصفحات الرئيسية
            </h3>
            <div className="space-y-1">
              {MAIN_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.path;
                return (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    onClick={onClose}
                  >
                    <div
                      className={`flex items-center gap-3 p-4 rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isActive ? 'bg-white shadow-sm' : 'bg-gray-100'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-600'}`} />
                      </div>
                      <span className={`font-bold ${isActive ? 'text-emerald-700' : 'text-gray-700'}`}>
                        {item.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-2">
              إجراءات سريعة
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.surah}
                  to={createPageUrl(`SurahView?surah=${action.surah}`)}
                  onClick={onClose}
                >
                  <div
                    className={`p-4 bg-gradient-to-br ${action.gradient} rounded-xl text-white hover:opacity-90 transition-opacity cursor-pointer`}
                  >
                    <BookOpen className="w-6 h-6 mb-2" />
                    <p className="font-bold text-sm">{action.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-2">
              الإعدادات
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 cursor-pointer border-2 border-transparent hover:border-gray-200 transition-all">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-bold text-gray-700">إعدادات القراءة</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 cursor-pointer border-2 border-transparent hover:border-gray-200 transition-all">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-purple-600" />
                </div>
                <span className="font-bold text-gray-700">الإشعارات</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-2">
              إحصائيات القرآن
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {QURAN_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-xl border ${stat.borderColor}`}
                >
                  <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs ${stat.labelColor} font-medium`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 ml-2" />
              <span className="font-bold">تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
