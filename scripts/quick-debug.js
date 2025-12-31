// Quick debug script
const https = require('https');

const baseUrl = 'http://localhost:3000'; // Local testing

const testUrls = [
  { url: `${baseUrl}/api/test/simple`, name: 'Simple API test' },
  { url: `${baseUrl}/api/debug/env`, name: 'Environment debug' },
  { url: `${baseUrl}/api/test/sitemap`, name: 'Simple sitemap test' },
  { url: `${baseUrl}/api/sitemaps/products`, name: 'Products sitemap API' },
];

function testUrl(testCase) {
  return new Promise((resolve) => {
    console.log(`🔍 Testing: ${testCase.url}`);
    
    const protocol = testCase.url.startsWith('https:') ? https : require('http');
    
    const request = protocol.get(testCase.url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const success = res.statusCode >= 200 && res.statusCode < 300;
        console.log(`${success ? '✅' : '❌'} ${testCase.name}: ${res.statusCode}`);
        console.log(`   Content-Type: ${res.headers['content-type']}`);
        
        if (testCase.name.includes('debug')) {
          try {
            const parsed = JSON.parse(data);
            console.log('   Env vars:', parsed.env);
          } catch (e) {
            console.log('   Could not parse JSON');
          }
        }
        
        resolve({ ...testCase, success, status: res.statusCode });
      });
    });
    
    request.on('error', (err) => {
      console.log(`❌ ${testCase.name}: Error - ${err.message}`);
      resolve({ ...testCase, success: false, error: err.message });
    });
    
    request.setTimeout(5000, () => {
      request.destroy();
      console.log(`❌ ${testCase.name}: Timeout`);
      resolve({ ...testCase, success: false, error: 'Timeout' });
    });
  });
}

async function quickDebug() {
  console.log('🚀 Quick debug test...\n');
  
  for (const testCase of testUrls) {
    await testUrl(testCase);
    console.log(''); // Empty line
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('💡 Next steps:');
  console.log('1. If simple tests work, the issue is with specific sitemap routes');
  console.log('2. If env debug shows undefined, restart dev server');
  console.log('3. Check terminal console for middleware logs when testing redirects');
}

quickDebug().catch(console.error);