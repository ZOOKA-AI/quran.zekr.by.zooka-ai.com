// Netlify serverless function to generate sitemap.xml

const handler = async (event, context) => {
  // Get the site URL from environment or use a default
  const siteUrl = process.env.URL || 'https://quran.zekr.by.zooka-ai.com';

  // List of all pages from the application
  const pages = [
    '',  // Homepage (Quran page - the main page)
    '/AdminPanel',
    '/Assistant',
    '/Athkar',
    '/Bookmarks',
    '/Calligraphy',
    '/Community',
    '/DonationSuccess',
    '/Ibtihaalat',
    '/Library',
    '/Messages',
    '/Muathin',
    '/NotificationSettings',
    '/Orphans',
    '/PrayerTimes',
    '/Profile',
    '/Quran',
    '/QuranRadio',
    '/Ramadan',
    '/Reciters',
    '/Rewards',
    '/StaticPageView',
    '/SurahView',
    '/Tawasheeh',
    '/Tilawa',
    '/Channels',
    '/ShareLibrary',
  ];

  // Generate XML sitemap
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urlEntries = pages.map(page => {
    const url = `${siteUrl}${page}`;
    // Higher priority for main pages
    const priority = page === '' || page === '/Quran' ? '1.0' : '0.8';
    const changefreq = page === '' || page === '/Quran' ? 'daily' : 'weekly';
    
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
    body: sitemap,
  };
};

module.exports = { handler };
