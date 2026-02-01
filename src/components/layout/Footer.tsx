/**
 * Footer component - Application footer
 * Production-ready and 1:1 compatible with Next.js migration
 */

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <p className="text-2xl mb-4 font-arabic">﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾</p>
          <p className="text-emerald-200 mb-6">اللهم اجعلنا من أهل القرآن وخاصته</p>

          <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-xl p-4 mb-4 max-w-2xl mx-auto border border-purple-400/30">
            <p className="text-amber-300 text-xl font-bold mb-2">📢 باص إسلامي صدقة جارية</p>
            <a
              href="https://zaka.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-lg hover:text-amber-300 transition-colors underline font-bold block mb-2"
            >
              🌐 zaka.ai
            </a>
            <p className="text-emerald-100 text-sm mb-2">من مصر 🇪🇬 • نطاق .egypt</p>
            <p className="text-white font-bold">👍 اشتركوا في القناة</p>
          </div>

          <div className="bg-emerald-700/30 rounded-xl p-4 mb-6 max-w-2xl mx-auto">
            <p className="text-lg font-bold text-white mb-2">🤲 صدقة جارية لوجه الله تعالى</p>
            <p className="text-emerald-100 text-sm mb-3">
              تطبيق مجاني بالكامل - من المسلمين إلى المسلمين
            </p>

            <div className="border-t border-emerald-600/50 pt-3 mt-3">
              <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-lg p-3 mb-3 border border-emerald-500/30">
                <p className="text-white text-base mb-2 font-arabic">
                  ✨ من دولة الإمارات العربية المتحدة 🇦🇪
                </p>
                <p className="text-emerald-100 text-sm italic font-arabic">
                  بلد الخير والعطاء • أرض التسامح والمحبة
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-3 mb-3 border border-purple-400/30">
                <p className="text-amber-300 text-lg font-bold mb-1">🤖 ZOOKA-AI المرزوق</p>
                <p className="text-white text-sm mb-1">مساعد التنفيذ الذكي</p>
                <p className="text-emerald-100 text-xs italic">
                  أول مشروع دعائي • تقنية الذكاء الاصطناعي في خدمة القرآن
                </p>
              </div>
              <p className="text-emerald-200 text-xs mb-1">المطورون: موسى وهارون بالإمارات 🇦🇪</p>
              <p className="text-emerald-200 text-xs mb-2">
                حفظ الملكية وتأمين كتاب الله وسنة رسوله
              </p>
              <p className="text-emerald-100 text-xs">من الفقراء لله المصريين 🇪🇬</p>

              <div className="border-t border-emerald-600/50 pt-3 mt-3">
                <p className="text-amber-300 text-xs font-bold mb-1">🔐 المشرف العام الوحيد</p>
                <a
                  href="mailto:Zookaalmrzwq@gmail.com"
                  className="text-emerald-100 text-xs hover:text-white transition-colors underline block mb-1"
                >
                  Zookaalmrzwq@gmail.com
                </a>
                <a
                  href="https://zaka.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 text-xs hover:text-amber-200 transition-colors underline font-bold block mb-2"
                >
                  🌐 zaka.ai
                </a>
                <p className="text-emerald-200 text-xs mt-1">
                  مسؤول حماية المنصة والملكية الفكرية
                </p>
                <p className="text-white text-xs font-bold mt-2">
                  ⚠️ جميع الحقوق محفوظة • ممنوع النسخ أو التعديل بدون إذن
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 text-sm text-emerald-300">
            <span>© 2024 القرآن الكريم</span>
            <span>•</span>
            <span>منصة إسلامية متكاملة</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
