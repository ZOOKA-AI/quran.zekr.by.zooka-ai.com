import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // الحصول على Access Token من Salesforce
        const accessToken = await base44.asServiceRole.connectors.getAccessToken("salesforce");
        
        // جلب بيانات المستخدم من التطبيق
        const [userPoints, bookmarks, listeningHistory, shares, comments] = await Promise.all([
            base44.entities.UserPoints.filter({ created_by: user.email }).then(r => r[0]),
            base44.entities.Bookmark.filter({ created_by: user.email }),
            base44.entities.ListeningHistory.filter({ created_by: user.email }),
            base44.entities.DailyShare.filter({ created_by: user.email }),
            base44.entities.Comment.filter({ created_by: user.email }),
        ]);

        // البحث عن Contact في Salesforce بناءً على البريد الإلكتروني
        const sfInstanceUrl = 'https://login.salesforce.com'; // سيتم تحديثه تلقائياً
        const searchResponse = await fetch(
            `${sfInstanceUrl}/services/data/v60.0/query?q=${encodeURIComponent(`SELECT Id FROM Contact WHERE Email = '${user.email}' LIMIT 1`)}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const searchData = await searchResponse.json();
        let contactId;

        // إنشاء Contact إذا لم يكن موجوداً
        if (searchData.records && searchData.records.length > 0) {
            contactId = searchData.records[0].Id;
        } else {
            const createContactResponse = await fetch(
                `${sfInstanceUrl}/services/data/v60.0/sobjects/Contact`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Email: user.email,
                        LastName: user.full_name || 'User',
                        Description: 'Quran App User'
                    })
                }
            );
            const createData = await createContactResponse.json();
            contactId = createData.id;
        }

        // تحديث Custom Fields في Contact
        await fetch(
            `${sfInstanceUrl}/services/data/v60.0/sobjects/Contact/${contactId}`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Quran_Points__c: userPoints?.total_points || 0,
                    Quran_Level__c: userPoints?.level || 1,
                    Khatam_Count__c: userPoints?.khatam_count || 0,
                    Current_Streak__c: userPoints?.current_streak || 0,
                    Listening_Hours__c: userPoints?.listening_hours || 0,
                    Shares_Count__c: userPoints?.shares_count || 0,
                    Comments_Count__c: userPoints?.comments_count || 0,
                    Bookmarks_Count__c: bookmarks.length,
                    Last_Sync_Date__c: new Date().toISOString()
                })
            }
        );

        // إنشاء Custom Object لسجل النشاطات (إذا كان موجوداً)
        const activityData = {
            Contact__c: contactId,
            Activity_Date__c: new Date().toISOString(),
            Total_Bookmarks__c: bookmarks.length,
            Total_Listening_Sessions__c: listeningHistory.length,
            Total_Community_Shares__c: shares.length,
            Total_Comments__c: comments.length,
            User_Points__c: userPoints?.total_points || 0,
            User_Level__c: userPoints?.level || 1
        };

        // محاولة إنشاء سجل نشاط (قد يفشل إذا لم يكن Custom Object موجوداً)
        try {
            await fetch(
                `${sfInstanceUrl}/services/data/v60.0/sobjects/Quran_Activity__c`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(activityData)
                }
            );
        } catch (e) {
            console.log('Custom object not created yet:', e);
        }

        // إنشاء Task لتتبع الختمات
        if (userPoints?.khatam_count > 0) {
            await fetch(
                `${sfInstanceUrl}/services/data/v60.0/sobjects/Task`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        WhoId: contactId,
                        Subject: `إنجاز: ${userPoints.khatam_count} ختمة قرآنية`,
                        Status: 'Completed',
                        Priority: 'Normal',
                        Description: `المستخدم أتم ${userPoints.khatam_count} ختمة للقرآن الكريم`,
                        ActivityDate: new Date().toISOString().split('T')[0]
                    })
                }
            );
        }

        return Response.json({
            success: true,
            message: 'تمت المزامنة بنجاح مع Salesforce',
            synced_data: {
                contact_id: contactId,
                total_points: userPoints?.total_points || 0,
                khatam_count: userPoints?.khatam_count || 0,
                bookmarks: bookmarks.length,
                listening_sessions: listeningHistory.length
            }
        });

    } catch (error) {
        console.error('Salesforce sync error:', error);
        return Response.json({
            error: error.message,
            details: 'فشل المزامنة مع Salesforce'
        }, { status: 500 });
    }
});