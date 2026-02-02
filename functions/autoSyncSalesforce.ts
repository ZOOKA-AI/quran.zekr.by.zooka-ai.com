import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// هذه الدالة تُستدعى تلقائياً عند تحديث بيانات المستخدم
Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // جلب جميع المستخدمين مع نقاطهم
        const allUserPoints = await base44.asServiceRole.entities.UserPoints.list();
        
        // الحصول على Access Token من Salesforce
        const accessToken = await base44.asServiceRole.connectors.getAccessToken("salesforce");
        const sfInstanceUrl = 'https://login.salesforce.com';
        
        let syncedCount = 0;
        let errors = [];

        // مزامنة كل مستخدم
        for (const userPoint of allUserPoints) {
            try {
                const userEmail = userPoint.created_by;
                
                // البحث عن Contact
                const searchResponse = await fetch(
                    `${sfInstanceUrl}/services/data/v60.0/query?q=${encodeURIComponent(`SELECT Id FROM Contact WHERE Email = '${userEmail}' LIMIT 1`)}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                const searchData = await searchResponse.json();
                let contactId;

                if (searchData.records && searchData.records.length > 0) {
                    contactId = searchData.records[0].Id;
                    
                    // تحديث البيانات
                    await fetch(
                        `${sfInstanceUrl}/services/data/v60.0/sobjects/Contact/${contactId}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                Quran_Points__c: userPoint.total_points || 0,
                                Quran_Level__c: userPoint.level || 1,
                                Khatam_Count__c: userPoint.khatam_count || 0,
                                Current_Streak__c: userPoint.current_streak || 0,
                                Listening_Hours__c: userPoint.listening_hours || 0,
                                Last_Auto_Sync__c: new Date().toISOString()
                            })
                        }
                    );
                    
                    syncedCount++;
                }
            } catch (e) {
                errors.push({ email: userPoint.created_by, error: e.message });
            }
        }

        return Response.json({
            success: true,
            message: `تمت مزامنة ${syncedCount} مستخدم مع Salesforce`,
            synced_count: syncedCount,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Auto sync error:', error);
        return Response.json({
            error: error.message,
            details: 'فشل المزامنة التلقائية'
        }, { status: 500 });
    }
});