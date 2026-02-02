import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const timestamp = new Date().toISOString();
    const syncResults = [];

    // جلب جميع السور والمقرئين
    const surahs = await base44.asServiceRole.entities.Surah.list();
    const reciters = await base44.asServiceRole.entities.Reciter.list();

    // مزامنة مصادر الصوت
    for (const surah of surahs || []) {
      const audioSources = [];

      for (const reciter of reciters || []) {
        if (reciter.audio_sources && reciter.audio_sources.length > 0) {
          const audioSource = reciter.audio_sources[0];
          audioSources.push({
            reciter_id: reciter.id,
            reciter_name: reciter.name_arabic,
            audio_url: audioSource.url,
            duration: 0
          });
        }
      }

      if (audioSources.length > 0) {
        await base44.asServiceRole.entities.Surah.update(surah.id, {
          audio_sources: audioSources,
          cache_status: 'fresh'
        });
        syncResults.push({
          surah_id: surah.id,
          surah_name: surah.name_arabic,
          audio_sources_count: audioSources.length,
          status: 'synced'
        });
      }
    }

    // تسجيل السجل
    await base44.asServiceRole.entities.SystemLog.create({
      event_type: 'api_sync',
      action: 'sync_audio_sources',
      status: 'success',
      details: { synced_surahs: syncResults.length },
      metadata: {
        total_audio_sources: syncResults.reduce((sum, r) => sum + r.audio_sources_count, 0),
        reciters_synced: reciters?.length || 0
      }
    });

    return Response.json({
      success: true,
      timestamp,
      surahs_synced: syncResults.length,
      total_audio_sources: syncResults.reduce((sum, r) => sum + r.audio_sources_count, 0)
    });
  } catch (error) {
    console.error('Audio sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});