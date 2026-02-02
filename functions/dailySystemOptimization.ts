import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // التحقق من أنه مستخدم admin
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const timestamp = new Date().toISOString();
    const logs = [];

    // 1. تنظيف السجلات القديمة
    const oldLogs = await base44.asServiceRole.entities.SystemLog.filter({
      created_date: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
    }, 'created_date', 1000);

    for (const log of oldLogs || []) {
      await base44.asServiceRole.entities.SystemLog.delete(log.id);
    }
    logs.push({ action: 'cleanup_old_logs', count: oldLogs?.length || 0, status: 'success' });

    // 2. تحديث حالة الذاكرة المؤقتة
    const surahs = await base44.asServiceRole.entities.Surah.list();
    for (const surah of surahs || []) {
      const shouldRefresh = !surah.last_updated || 
        new Date(surah.last_updated) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      if (shouldRefresh) {
        await base44.asServiceRole.entities.Surah.update(surah.id, {
          cache_status: 'updating',
          last_updated: timestamp
        });
        logs.push({ action: 'refresh_surah_cache', surah_id: surah.id, status: 'success' });
      }
    }

    // 3. تحديث إحصائيات الاستخدام
    const recitations = await base44.asServiceRole.entities.Recitation.list();
    for (const recitation of recitations || []) {
      // حساب الإحصائيات بناءً على السجلات
      const recentPlays = await base44.asServiceRole.entities.ListeningHistory.filter({
        recitation_id: recitation.id,
        created_date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
      }, '-created_date', 100);

      if (recentPlays && recentPlays.length > 0) {
        const completedCount = recentPlays.filter(p => p.completed).length;
        await base44.asServiceRole.entities.Recitation.update(recitation.id, {
          total_plays: (recitation.total_plays || 0) + recentPlays.length
        });
      }
    }
    logs.push({ action: 'update_statistics', status: 'success' });

    // 4. تحسين الأداء - حذف البيانات غير المستخدمة
    const oldBookmarks = await base44.asServiceRole.entities.Bookmark.filter({
      created_date: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() }
    }, 'created_date', 1000);

    let deletedCount = 0;
    for (const bookmark of oldBookmarks || []) {
      await base44.asServiceRole.entities.Bookmark.delete(bookmark.id);
      deletedCount++;
    }
    logs.push({ action: 'cleanup_old_bookmarks', count: deletedCount, status: 'success' });

    // 5. مزامنة المفضلة
    const stations = await base44.asServiceRole.entities.RadioStation.list();
    const activeStations = stations.filter(s => s.is_active).length;
    logs.push({ action: 'sync_radio_stations', active_count: activeStations, status: 'success' });

    // 6. تسجيل السجل الرئيسي
    await base44.asServiceRole.entities.SystemLog.create({
      event_type: 'optimization',
      action: 'daily_system_optimization',
      status: 'success',
      details: { optimization_results: logs },
      duration_ms: Date.now() - new Date(timestamp).getTime(),
      metadata: {
        surahs_count: surahs?.length || 0,
        recitations_count: recitations?.length || 0,
        cleanup_items: deletedCount
      }
    });

    return Response.json({
      success: true,
      timestamp,
      optimizations_completed: logs.length,
      details: logs
    });
  } catch (error) {
    console.error('Daily optimization error:', error);
    return Response.json({ 
      error: 'Optimization failed', 
      message: error.message 
    }, { status: 500 });
  }
});