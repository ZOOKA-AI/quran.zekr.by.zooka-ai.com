// هذا الملف يعيد تصدير AuthProvider وuseAuth من المصدر الموحد
// لضمان استخدام نفس السياق في كل أجزاء التطبيق
export { AuthProvider, useAuth } from '@/lib/AuthContext';