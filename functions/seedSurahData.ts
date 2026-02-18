import { createClient } from 'npm:@base44/sdk@0.8.6';

const SURAHS_DATA = [
  { number: 1, name_arabic: "الفاتحة", name_english: "Al-Fatiha", name_transliteration: "Al-Fatiha", revelation_type: "مكية", verses_count: 7, juz_start: 1, juz_end: 1, page_start: 1, page_end: 1, order_in_revelation: 5, description: "سورة الفاتحة وهي أم القرآن وأساس الصلاة", main_themes: ["التوحيد", "الدعاء", "الهداية"] },
  { number: 2, name_arabic: "البقرة", name_english: "Al-Baqarah", name_transliteration: "Al-Baqarah", revelation_type: "مدنية", verses_count: 286, juz_start: 1, juz_end: 3, page_start: 2, page_end: 49, order_in_revelation: 87, description: "أطول سورة في القرآن الكريم", main_themes: ["الإيمان", "الأحكام", "قصص الأنبياء"] },
  { number: 3, name_arabic: "آل عمران", name_english: "Aal-i-Imran", name_transliteration: "Aal-i-Imran", revelation_type: "مدنية", verses_count: 200, juz_start: 3, juz_end: 4, page_start: 50, page_end: 76, order_in_revelation: 89, description: "تتحدث عن قصة مريم وعيسى عليهما السلام", main_themes: ["التوحيد", "الرسالات", "القتال"] },
  { number: 4, name_arabic: "النساء", name_english: "An-Nisa", name_transliteration: "An-Nisa", revelation_type: "مدنية", verses_count: 176, juz_start: 4, juz_end: 6, page_start: 77, page_end: 106, order_in_revelation: 92, description: "سورة الحقوق والعدل بين الناس", main_themes: ["الحقوق", "الأحكام", "الأخلاق"] },
  { number: 5, name_arabic: "المائدة", name_english: "Al-Ma'idah", name_transliteration: "Al-Maidah", revelation_type: "مدنية", verses_count: 120, juz_start: 6, juz_end: 7, page_start: 106, page_end: 127, order_in_revelation: 112, description: "الحكم والعدل والشريعة", main_themes: ["الحلال والحرام", "العقود", "القضاء"] },
  { number: 6, name_arabic: "الأنعام", name_english: "Al-An'am", name_transliteration: "Al-Anam", revelation_type: "مكية", verses_count: 165, juz_start: 7, juz_end: 8, page_start: 127, page_end: 154, order_in_revelation: 55, description: "قصص الأنبياء والتوحيد", main_themes: ["التوحيد", "الأنبياء", "العقيدة"] },
  { number: 7, name_arabic: "الأعراف", name_english: "Al-A'raf", name_transliteration: "Al-Araf", revelation_type: "مكية", verses_count: 206, juz_start: 8, juz_end: 9, page_start: 154, page_end: 176, order_in_revelation: 39, description: "قصص الأنبياء والشريعة", main_themes: ["قصص الأنبياء", "الأحكام", "الحلال والحرام"] },
  { number: 18, name_arabic: "الكهف", name_english: "Al-Kahf", name_transliteration: "Al-Kahf", revelation_type: "مكية", verses_count: 110, juz_start: 15, juz_end: 16, page_start: 262, page_end: 280, order_in_revelation: 69, description: "من أعظم السور المكية", main_themes: ["قصة أصحاب الكهف", "الحكمة", "الغنى والفقر"] },
  { number: 36, name_arabic: "يس", name_english: "Ya-Sin", name_transliteration: "Ya-Sin", revelation_type: "مكية", verses_count: 83, juz_start: 22, juz_end: 23, page_start: 440, page_end: 455, order_in_revelation: 41, description: "قلب القرآن", main_themes: ["البعث والنشور", "الرسالة", "التوحيد"] },
  { number: 67, name_arabic: "الملك", name_english: "Al-Mulk", name_transliteration: "Al-Mulk", revelation_type: "مكية", verses_count: 30, juz_start: 29, juz_end: 29, page_start: 562, page_end: 564, order_in_revelation: 77, description: "سورة التدبر والحفظ من العذاب", main_themes: ["الملك", "الخلق", "البعث"] }
];

Deno.serve(async (req) => {
    try {
        const base44 = createClient({
            serviceRoleKey: Deno.env.get('BASE44_SERVICE_ROLE_KEY'),
            appId: Deno.env.get('BASE44_APP_ID')
        });

        // Check if data already seeded
        const existingSurahs = await base44.entities.Surah.list();
        
        if (existingSurahs.length === 0) {
            // Seed the data
            await base44.entities.Surah.bulkCreate(SURAHS_DATA);
            
            return Response.json({
                success: true,
                message: `تم إضافة ${SURAHS_DATA.length} سورة بنجاح`,
                count: SURAHS_DATA.length
            });
        } else {
            return Response.json({
                success: true,
                message: `البيانات موجودة بالفعل (${existingSurahs.length} سورة)`
            });
        }

    } catch (error) {
        console.error('Seed error:', error);
        return Response.json({
            error: error.message,
            details: 'فشل زرع البيانات'
        }, { status: 500 });
    }
});