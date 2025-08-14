// Script to notify search engines about sitemap changes
const https = require('https');

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pengoo.store';
const sitemaps = [
  `${baseUrl}/sitemap.xml`,
  `${baseUrl}/api/sitemaps/products`,
  `${baseUrl}/api/sitemaps/collections`,
  `${baseUrl}/api/sitemaps/blogs`,
];

console.log('🚀 Notifying search engines about sitemap updates...\n');

// Function to ping a search engine
function pingSearchEngine(engineName, pingUrl, sitemapUrl) {
  return new Promise((resolve) => {
    console.log(`📡 Pinging ${engineName} for: ${sitemapUrl}`);
    
    https.get(pingUrl, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${engineName}: Successfully notified`);
        resolve(true);
      } else {
        console.log(`❌ ${engineName}: Failed (Status: ${res.statusCode})`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error(`❌ ${engineName}: Error - ${err.message}`);
      resolve(false);
    });
  });
}

// Ping all sitemaps to all search engines
async function notifyAllSearchEngines() {
  const results = {
    google: { success: 0, total: 0 },
    bing: { success: 0, total: 0 }
  };

  for (const sitemapUrl of sitemaps) {
    console.log(`\n📄 Processing sitemap: ${sitemapUrl}`);
    
    // Google
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    results.google.total++;
    const googleSuccess = await pingSearchEngine('Google', googlePingUrl, sitemapUrl);
    if (googleSuccess) results.google.success++;
    
    // Bing
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    results.bing.total++;
    const bingSuccess = await pingSearchEngine('Bing', bingPingUrl, sitemapUrl);
    if (bingSuccess) results.bing.success++;
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('\n📊 SUMMARY:');
  console.log(`Google: ${results.google.success}/${results.google.total} successful`);
  console.log(`Bing: ${results.bing.success}/${results.bing.total} successful`);
  
  if (results.google.success === results.google.total && results.bing.success === results.bing.total) {
    console.log('\n🎉 All sitemaps successfully submitted to all search engines!');
  } else {
    console.log('\n⚠️  Some submissions failed. Check the logs above.');
  }
}

// Run the notification process
notifyAllSearchEngines().catch(console.error);