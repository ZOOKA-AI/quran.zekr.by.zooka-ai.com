import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const timestamp = new Date().toISOString();
    const health = {
      status: 'healthy',
      checks: {}
    };

    // فحص قاعدة البيانات
    try {
      const startTime = Date.now();
      const surahs = await base44.asServiceRole.entities.Surah.list();
      health.checks.database = {
        status: 'healthy',
        response_time: Date.now() - startTime,
        records_count: surahs?.length || 0
      };
    } catch (error) {
      health.checks.database = { status: 'unhealthy', error: error.message };
      health.status = 'critical';
    }

    // فحص مصادر الصوت
    try {
      const recitations = await base44.asServiceRole.entities.Recitation.list();
      const validAudio = recitations?.filter(r => r.audio_url && r.is_available).length || 0;
      health.checks.audio_sources = {
        status: validAudio > 0 ? 'healthy' : 'degraded',
        total: recitations?.length || 0,
        available: validAudio
      };
    } catch (error) {
      health.checks.audio_sources = { status: 'unhealthy', error: error.message };
    }

    // فحص المستخدمين النشطين
    try {
      const listeningHistory = await base44.asServiceRole.entities.ListeningHistory.filter({}, '-created_date', 100);
      const uniqueUsers = new Set(listeningHistory?.map(h => h.created_by) || []);
      health.checks.active_users = {
        status: 'healthy',
        count: uniqueUsers.size,
        recent_plays: listeningHistory?.length || 0
      };
    } catch (error) {
      health.checks.active_users = { status: 'degraded', error: error.message };
    }

    // فحص التخزين
    try {
      const channels = await base44.asServiceRole.entities.Channel.list();
      const playlists = await base44.asServiceRole.entities.Playlist.list();
      health.checks.storage = {
        status: 'healthy',
        channels: channels?.length || 0,
        playlists: playlists?.length || 0
      };
    } catch (error) {
      health.checks.storage = { status: 'degraded', error: error.message };
    }

    // تسجيل الفحص
    await base44.asServiceRole.entities.SystemLog.create({
      event_type: 'performance',
      action: 'system_health_check',
      status: health.status,
      details: health,
      metadata: { timestamp }
    });

    return Response.json({
      success: true,
      health,
      timestamp
    });
  } catch (error) {
    console.error('Health check error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});