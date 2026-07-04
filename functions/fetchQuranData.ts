import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// دالة لجلب بيانات القرآن من API
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { surahNumber, verseNumber } = await req.json();

    // جلب البيانات من Quran.com API
    const response = await fetch(
      `https://api.quran.com/api/v4/verses/by_key/${surahNumber}:${verseNumber}?translations=131&fields=text_uthmani`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch verse data');
    }

    const data = await response.json();
    const verse = data.verse;

    // تحويل البيانات لتتناسب مع الكيان
    const verseData = {
      surah_number: surahNumber,
      verse_number: verseNumber,
      verse_key: `${surahNumber}:${verseNumber}`,
      arabic_text: verse.text_uthmani,
      translation_english: verse.translations?.[0]?.text || '',
      juz: verse.juz_number,
      hizb: verse.hizb_number,
      page: verse.page_number,
      sajdah: verse.sajdah !== null
    };

    // حفظ في قاعدة البيانات
    const existing = await base44.asServiceRole.entities.Verse.filter({
      surah_number: surahNumber,
      verse_number: verseNumber
    });

    if (existing.length === 0) {
      await base44.asServiceRole.entities.Verse.create(verseData);
    }

    return Response.json({ success: true, verse: verseData });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});