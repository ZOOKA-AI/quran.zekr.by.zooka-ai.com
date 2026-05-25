import { createClient } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClient({
      serviceRoleKey: Deno.env.get('BASE44_SERVICE_ROLE_KEY'),
      appId: Deno.env.get('BASE44_APP_ID')
    });

    const body = await req.json();
    const { user_email, surah_number, duration_seconds, activity_type, is_completed, completed_verses } = body;

    if (!user_email || !surah_number) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // حساب النقاط: 10 نقاط لكل دقيقة
    const duration_minutes = duration_seconds / 60;
    const points_earned = Math.floor(duration_minutes * 10);

    // تسجيل النشاط
    await base44.entities.ActivityLog.create({
      user_email,
      surah_number,
      activity_type: activity_type || 'listen',
      duration_seconds,
      points_earned,
      is_completed: is_completed || false,
      completed_verses: completed_verses || 0,
      timestamp: new Date().toISOString()
    });

    // جلب أو إنشاء UserPoints للمستخدم
    let userPoints = await base44.entities.UserPoints.filter({ created_by: user_email });
    userPoints = userPoints[0];

    if (!userPoints) {
      // إنشاء سجل جديد
      userPoints = await base44.entities.UserPoints.create({
        total_points: points_earned,
        level: 1,
        khatam_count: is_completed ? 1 : 0,
        listening_hours: duration_minutes / 60,
        comments_count: 0,
        shares_count: 0,
        badges: is_completed ? [{
          name: `ختم السورة ${surah_number}`,
          icon: '🏆',
          earned_date: new Date().toISOString()
        }] : []
      });
    } else {
      // تحديث السجل الموجود
      const updated_points = userPoints.total_points + points_earned;
      const updated_hours = (userPoints.listening_hours || 0) + (duration_minutes / 60);
      const updated_khatam = userPoints.khatam_count + (is_completed ? 1 : 0);
      const new_level = Math.floor(updated_points / 1000) + 1;

      let badges = userPoints.badges || [];
      if (is_completed) {
        // إضافة وسام جديد عند اكتمال السورة
        badges = [...badges, {
          name: `ختم السورة ${surah_number}`,
          icon: '🏆',
          earned_date: new Date().toISOString()
        }];
      }

      await base44.entities.UserPoints.update(userPoints.id, {
        total_points: updated_points,
        level: new_level,
        khatam_count: updated_khatam,
        listening_hours: updated_hours,
        badges: badges,
        current_streak: Math.floor((new Date().getTime() - new Date(userPoints.created_date).getTime()) / (1000 * 60 * 60 * 24))
      });
    }

    return Response.json({
      success: true,
      message: `تم تحديث النقاط (${points_earned} نقطة)`,
      points_earned,
      badge_earned: is_completed
    });

  } catch (error) {
    console.error('Update progress error:', error);
    return Response.json({
      error: error.message,
      details: 'فشل تحديث التقدم'
    }, { status: 500 });
  }
});