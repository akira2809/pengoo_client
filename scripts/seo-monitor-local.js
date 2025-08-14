// Local SEO monitoring script
const http = require('http');

const baseUrl = 'http://localhost:3000';

// URLs to monitor locally
const monitorUrls = [
  // Main pages
  { url: `${baseUrl}`, name: 'Homepage', priority: 'high' },
  { url: `${baseUrl}/products`, name: 'Products page', priority: 'high' },
  { url: `${baseUrl}/collections`, name: 'Collections page', priority: 'medium' },
  { url: `${baseUrl}/blogs`, name: 'Blogs page', priority: 'medium' },
  
  // Sitemaps (using working API approach)
  { url: `${baseUrl}/sitemap.xml`, name: 'Main sitemap', priority: 'high' },
  { url: `${baseUrl}/api/sitemaps/products`, name: 'Products sitemap', priority: 'high' },
  { url: `${baseUrl}/api/sitemaps/collections`, name: 'Collections sitemap', priority: 'medium' },
  { url: `${baseUrl}/api/sitemaps/blogs`, name: 'Blogs sitemap', priority: 'medium' },
  
  // SEO files
  { url: `${baseUrl}/robots.txt`, name: 'Robots.txt', priority: 'high' },
];

// Old URLs that should redirect
const redirectUrls = [
  { url: `${baseUrl}/product/exploding-kittens`, name: 'Old product URL', shouldRedirect: true },
  { url: `${baseUrl}/collection/board-games`, name: 'Old collection URL', shouldRedirect: true },
  { url: `${baseUrl}/blog/test-post`, name: 'Old blog URL', shouldRedirect: true },
];

function checkUrl(urlObj) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const request = http.get(urlObj.url, (res) => {
      const responseTime = Date.now() - startTime;
      const isRedirect = res.statusCode >= 300 && res.statusCode < 400;
      
      resolve({
        ...urlObj,
        status: res.statusCode,
        responseTime,
        isRedirect,
        location: res.headers.location,
        contentType: res.headers['content-type'],
        success: res.statusCode >= 200 && res.statusCode < 300,
        cacheControl: res.headers['cache-control'],
      });
    });
    
    request.on('error', (err) => {
      resolve({
        ...urlObj,
        status: 'ERROR',
        error: err.message,
        success: false,
        responseTime: Date.now() - startTime,
      });
    });
    
    request.setTimeout(15000, () => {
      request.destroy();
      resolve({
        ...urlObj,
        status: 'TIMEOUT',
        error: 'Request timeout',
        success: false,
        responseTime: Date.now() - startTime,
      });
    });
  });
}

async function monitorSEO() {
  console.log('🔍 Starting LOCAL SEO monitoring...\n');
  
  // Check main URLs
  console.log('📄 Checking main pages and SEO files:');
  const mainResults = [];
  
  for (const urlObj of monitorUrls) {
    const result = await checkUrl(urlObj);
    mainResults.push(result);
    
    const statusIcon = result.success ? '✅' : '❌';
    const priorityIcon = result.priority === 'high' ? '🔥' : result.priority === 'medium' ? '⚡' : '📝';
    
    console.log(`${statusIcon} ${priorityIcon} ${result.name}: ${result.status} (${result.responseTime}ms)`);
    
    if (result.contentType) {
      console.log(`   Content-Type: ${result.contentType}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n🔄 Checking redirects:');
  const redirectResults = [];
  
  for (const urlObj of redirectUrls) {
    const result = await checkUrl(urlObj);
    redirectResults.push(result);
    
    const isWorkingRedirect = result.isRedirect && (result.status === 301 || result.status === 307);
    const statusIcon = isWorkingRedirect ? '✅' : '❌';
    
    console.log(`${statusIcon} ${result.name}: ${result.status}`);
    if (result.location) {
      console.log(`   Redirects to: ${result.location}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Summary
  console.log('\n📊 LOCAL MONITORING SUMMARY:');
  
  const successfulMain = mainResults.filter(r => r.success).length;
  const highPriorityIssues = mainResults.filter(r => !r.success && r.priority === 'high').length;
  const workingRedirects = redirectResults.filter(r => r.isRedirect && (r.status === 301 || r.status === 307)).length;
  
  console.log(`Main pages: ${successfulMain}/${mainResults.length} working`);
  console.log(`High priority issues: ${highPriorityIssues}`);
  console.log(`Redirects: ${workingRedirects}/${redirectResults.length} working`);
  
  if (highPriorityIssues === 0 && workingRedirects === redirectResults.length) {
    console.log('\n🎉 All LOCAL SEO checks passed!');
  } else {
    console.log('\n⚠️  Some issues need attention locally.');
  }
}

monitorSEO().catch(console.error);