// Script to check for old URLs that might need redirects
const https = require('https');

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pengoo.store';

// Common old URL patterns that might exist
const oldUrlPatterns = [
  '/product/',
  '/collection/',
  '/blog/',
  '/category/',
  '/tag/',
  '/page/',
];

// Function to check if URL returns 404
function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode,
        exists: res.statusCode !== 404,
        needsRedirect: res.statusCode === 404
      });
    }).on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        exists: false,
        needsRedirect: true,
        error: err.message
      });
    });
  });
}

// Sample URLs to test (you can expand this list)
const testUrls = [
  `${baseUrl}/product/exploding-kittens`,
  `${baseUrl}/product/dixit`,
  `${baseUrl}/collection/board-games`,
  `${baseUrl}/collection/card-games`,
  `${baseUrl}/blog/how-to-play`,
  `${baseUrl}/blog/game-reviews`,
];

async function checkOldUrls() {
  console.log('🔍 Checking for old URLs that might need redirects...\n');
  
  const results = [];
  
  for (const url of testUrls) {
    console.log(`Checking: ${url}`);
    const result = await checkUrl(url);
    results.push(result);
    
    if (result.needsRedirect) {
      console.log(`❌ ${result.status}: Needs redirect`);
    } else {
      console.log(`✅ ${result.status}: OK`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n📊 SUMMARY:');
  const needsRedirect = results.filter(r => r.needsRedirect);
  
  if (needsRedirect.length > 0) {
    console.log(`\n⚠️  ${needsRedirect.length} URLs need redirects:`);
    needsRedirect.forEach(result => {
      const newUrl = result.url
        .replace('/product/', '/products/')
        .replace('/collection/', '/collections/')
        .replace('/blog/', '/blogs/');
      console.log(`${result.url} → ${newUrl}`);
    });
    
    console.log('\n💡 Suggestions:');
    console.log('1. Update middleware.ts to handle these redirects');
    console.log('2. Create fallback pages for these old URLs');
    console.log('3. Submit removal requests in Google Search Console');
  } else {
    console.log('🎉 All checked URLs are working correctly!');
  }
}

// Run the check
checkOldUrls().catch(console.error);