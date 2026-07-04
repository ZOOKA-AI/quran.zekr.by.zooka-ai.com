import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const timestamp = new Date().toISOString();
    const metrics = {
      api_response_time: 0,
      cache_hit_rate: 0,
      user_engagement: 0,
      system_health: 'healthy'
    };

    // 1. قياس أداء API
    const startTime = Date.now();
    const surahs = await base44.asServiceRole.entities.Surah.list();
    metrics.api_response_time = Date.now() - startTime;

    // 2. حساب معدل الكاش
    const cachedItems = surahs?.filter(s => s.cache_status === 'fresh').length || 0;
    metrics.cache_hit_rate = surahs?.length ? (cachedItems / surahs.length * 100).toFixed(2) : 0;

    // 3. حساب تفاعل المستخدم
    const listeningHistory = await base44.asServiceRole.entities.ListeningHistory.filter({}, 'created_date', 100);
    const bookmarks = await base44.asServiceRole.entities.Bookmark.list();
    metrics.user_engagement = ((listeningHistory?.length || 0) + (bookmarks?.length || 0)) / 2;

    // 4. فحص صحة النظام
    if (metrics.api_response_time > 5000) {
      metrics.system_health = 'warning';
    }
    if (metrics.api_response_time > 10000) {
      metrics.system_health = 'critical';
    }

    // تسجيل المقاييس
    await base44.asServiceRole.entities.SystemLog.create({
      event_type: 'performance',
      action: 'performance_metrics_update',
      status: 'success',
      details: metrics,
      metadata: {
        timestamp,
        surahs_count: surahs?.length || 0
      }
    });

    return Response.json({
      success: true,
      timestamp,
      metrics
    });
  } catch (error) {
    console.error('Performance metrics error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});