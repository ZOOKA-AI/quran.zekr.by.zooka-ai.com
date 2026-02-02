import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { user_id } = await req.json();

    if (!user_id) {
      return Response.json({ error: 'user_id required' }, { status: 400 });
    }

    // جلب سجل الاستماع للمستخدم
    const listeningHistory = await base44.asServiceRole.entities.ListeningHistory.filter(
      { created_by: user_id },
      '-created_date',
      20
    );

    if (!listeningHistory || listeningHistory.length === 0) {
      // توصيات افتراضية للمستخدمين الجدد
      const featuredSurahs = await base44.asServiceRole.entities.Surah.filter(
        { is_featured: true },
        'number',
        5
      );
      return Response.json({
        recommendations: featuredSurahs || [],
        reason: 'Featured for new users'
      });
    }

    // تحليل تفضيلات المستخدم
    const surahNumbers = listeningHistory.map(h => h.surah_number);
    const preferredReciters = listeningHistory.reduce((acc, h) => {
      acc[h.reciter_id] = (acc[h.reciter_id] || 0) + 1;
      return acc;
    }, {});

    // جلب السور المشابهة
    const allSurahs = await base44.asServiceRole.entities.Surah.list();
    const recommendations = allSurahs
      ?.filter(s => !surahNumbers.includes(s.number))
      ?.sort((a, b) => {
        // ترجيح بناءً على الكلمات الرئيسية المشابهة
        const aThemes = a.main_themes || [];
        const bThemes = b.main_themes || [];
        const listenedThemes = allSurahs
          ?.filter(s => surahNumbers.includes(s.number))
          ?.flatMap(s => s.main_themes || []);

        const aScore = aThemes.filter(t => listenedThemes.includes(t)).length;
        const bScore = bThemes.filter(t => listenedThemes.includes(t)).length;
        return bScore - aScore;
      })
      ?.slice(0, 10) || [];

    // تسجيل التوصيات
    await base44.asServiceRole.entities.SystemLog.create({
      event_type: 'user_action',
      action: 'generate_recommendations',
      status: 'success',
      user_id,
      details: {
        recommendations_count: recommendations.length,
        listening_history_count: listeningHistory.length
      }
    });

    return Response.json({
      recommendations,
      reason: 'Based on your listening history',
      user_preference: {
        favorite_reciter: Object.entries(preferredReciters).sort(([, a], [, b]) => b - a)[0]?.[0],
        listening_count: listeningHistory.length
      }
    });
  } catch (error) {
    console.error('AI recommendations error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});