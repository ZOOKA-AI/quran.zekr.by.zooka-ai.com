import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notes, fileName } = await req.json();
    
    if (!notes || !fileName) {
      return Response.json({ error: 'Notes and fileName are required' }, { status: 400 });
    }

    // الحصول على access token من Google Drive
    const accessToken = await base44.asServiceRole.connectors.getAccessToken("googledrive");

    // إنشاء محتوى الملف
    const fileContent = `# ملاحظاتي القرآنية
## ${user.full_name || user.email}
## التاريخ: ${new Date().toLocaleDateString('ar-EG')}

---

${notes}

---
تم الحفظ من تطبيق القرآن الكريم
`;

    // إنشاء الملف في Google Drive
    const metadata = {
      name: `${fileName}.txt`,
      mimeType: 'text/plain',
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([fileContent], { type: 'text/plain' }));

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: form,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Google Drive error:', error);
      return Response.json({ error: 'Failed to save to Drive' }, { status: 500 });
    }

    const result = await response.json();

    return Response.json({
      success: true,
      fileId: result.id,
      fileName: result.name,
      message: 'تم حفظ الملاحظات في Google Drive بنجاح'
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});