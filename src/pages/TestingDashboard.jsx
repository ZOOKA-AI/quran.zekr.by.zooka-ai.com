import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, AlertTriangle, CheckCircle, Bug, Zap, Shield, FileText, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function TestingDashboard() {
  const [testing, setTesting] = useState(false);

  const { data: reports, isLoading, refetch } = useQuery({
    queryKey: ['test-reports'],
    queryFn: () => base44.entities.TestReport.filter({}, '-created_date', 10),
    initialData: []
  });

  const runTest = async (testType) => {
    setTesting(true);
    toast.loading('جاري الفحص...', { id: 'test' });

    try {
      const { data } = await base44.functions.invoke('testAndOptimize', {
        test_type: testType,
        auto_fix: true
      });

      toast.success(`تم الفحص بنجاح! تم اكتشاف ${data.summary.total_issues} مشكلة`, { id: 'test' });
      refetch();
    } catch (error) {
      toast.error('فشل الفحص: ' + error.message, { id: 'test' });
    } finally {
      setTesting(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-blue-100 text-blue-800 border-blue-300',
      info: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[severity] || colors.info;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">🧪 لوحة الفحص والاختبار</h1>
          <p className="text-slate-600">نظام ذكي لفحص الأخطاء، الأداء، والأمان مع إصلاح تلقائي</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => runTest('bugs')}
            disabled={testing}
            className="h-24 bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
          >
            {testing ? <Loader2 className="w-6 h-6 animate-spin ml-2" /> : <Bug className="w-6 h-6 ml-2" />}
            <div>
              <div className="font-bold">فحص الأخطاء</div>
              <div className="text-xs opacity-90">Bug Detection</div>
            </div>
          </Button>

          <Button
            onClick={() => runTest('performance')}
            disabled={testing}
            className="h-24 bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
          >
            {testing ? <Loader2 className="w-6 h-6 animate-spin ml-2" /> : <Zap className="w-6 h-6 ml-2" />}
            <div>
              <div className="font-bold">فحص الأداء</div>
              <div className="text-xs opacity-90">Performance</div>
            </div>
          </Button>

          <Button
            onClick={() => runTest('security')}
            disabled={testing}
            className="h-24 bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
          >
            {testing ? <Loader2 className="w-6 h-6 animate-spin ml-2" /> : <Shield className="w-6 h-6 ml-2" />}
            <div>
              <div className="font-bold">فحص الأمان</div>
              <div className="text-xs opacity-90">Security Audit</div>
            </div>
          </Button>

          <Button
            onClick={() => runTest('full_scan')}
            disabled={testing}
            className="h-24 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
          >
            {testing ? <Loader2 className="w-6 h-6 animate-spin ml-2" /> : <FileText className="w-6 h-6 ml-2" />}
            <div>
              <div className="font-bold">فحص شامل</div>
              <div className="text-xs opacity-90">Full Scan</div>
            </div>
          </Button>
        </div>

        {/* Agent Chat Access */}
        <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">🤖 مساعد الفحص الذكي</h3>
                  <p className="text-slate-600">تحدث مع الوكيل الذكي للفحص والتطوير التلقائي</p>
                </div>
              </div>
              <Button
                onClick={() => window.open('https://base44.app/backoffice/agents', '_blank')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                فتح المحادثة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports History */}
        <Card>
          <CardHeader>
            <CardTitle>📊 سجل الفحوصات السابقة</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center p-8 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد فحوصات سابقة</p>
                <p className="text-sm">ابدأ بتشغيل أول فحص</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="border rounded-xl p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          report.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {report.status === 'completed' ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <Loader2 className="w-6 h-6 text-yellow-600 animate-spin" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {report.test_type === 'full_scan' && '🔍 فحص شامل'}
                            {report.test_type === 'bugs' && '🐛 فحص الأخطاء'}
                            {report.test_type === 'performance' && '⚡ فحص الأداء'}
                            {report.test_type === 'security' && '🛡️ فحص الأمان'}
                          </div>
                          <div className="text-sm text-slate-500">
                            {new Date(report.created_date).toLocaleString('ar')}
                          </div>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(
                        report.metrics?.critical_issues > 0 ? 'critical' : 'info'
                      )}>
                        {report.status === 'completed' ? 'مكتمل' : 'جاري التنفيذ'}
                      </Badge>
                    </div>

                    {report.metrics && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-xs text-slate-600 mb-1">المشاكل</div>
                          <div className="text-2xl font-bold text-slate-900">
                            {report.metrics.total_issues || 0}
                          </div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3">
                          <div className="text-xs text-red-600 mb-1">حرجة</div>
                          <div className="text-2xl font-bold text-red-700">
                            {report.metrics.critical_issues || 0}
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-xs text-green-600 mb-1">تم الإصلاح</div>
                          <div className="text-2xl font-bold text-green-700">
                            {report.metrics.auto_fixed_issues || 0}
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-xs text-blue-600 mb-1">الأداء</div>
                          <div className="text-2xl font-bold text-blue-700">
                            {report.metrics.performance_score || 0}%
                          </div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <div className="text-xs text-purple-600 mb-1">الأمان</div>
                          <div className="text-2xl font-bold text-purple-700">
                            {report.metrics.security_score || 0}%
                          </div>
                        </div>
                      </div>
                    )}

                    {report.findings && report.findings.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="text-sm font-bold text-slate-700">أبرز المشاكل:</div>
                        {report.findings.slice(0, 3).map((finding, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm bg-slate-50 rounded-lg p-3">
                            <Badge className={getSeverityColor(finding.severity)}>
                              {finding.severity}
                            </Badge>
                            <div className="flex-1">
                              <div className="font-medium text-slate-900">{finding.title}</div>
                              <div className="text-slate-600 text-xs">{finding.description}</div>
                              {finding.auto_fixed && (
                                <div className="text-green-600 text-xs mt-1 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  تم الإصلاح تلقائياً
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}