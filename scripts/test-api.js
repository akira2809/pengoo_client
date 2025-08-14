// Test API endpoints
const https = require('https');

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pengoo-back-end.vercel.app';

const endpoints = [
  { url: `${apiUrl}/products`, name: 'Products API' },
  { url: `${apiUrl}/collections`, name: 'Collections API' },
  { url: `${apiUrl}/posts`, name: 'Posts API' },
];

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    console.log(`🔍 Testing: ${endpoint.url}`);
    
    const request = https.get(endpoint.url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const count = Array.isArray(parsed) ? parsed.length : 
                       (Array.isArray(parsed.data) ? parsed.data.length : 'Unknown');
          
          console.log(`✅ ${endpoint.name}: ${res.statusCode} (${count} items)`);
          resolve({ ...endpoint, success: true, status: res.statusCode, count });
        } catch (e) {
          console.log(`⚠️  ${endpoint.name}: ${res.statusCode} (Invalid JSON)`);
          resolve({ ...endpoint, success: false, status: res.statusCode, error: 'Invalid JSON' });
        }
      });
    });
    
    request.on('error', (err) => {
      console.log(`❌ ${endpoint.name}: Error - ${err.message}`);
      resolve({ ...endpoint, success: false, error: err.message });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      console.log(`❌ ${endpoint.name}: Timeout`);
      resolve({ ...endpoint, success: false, error: 'Timeout' });
    });
  });
}

async function testAllEndpoints() {
  console.log('🚀 Testing API endpoints...\n');
  console.log(`API Base URL: ${apiUrl}\n`);
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    console.log(''); // Empty line
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  console.log('📊 API TEST SUMMARY:');
  console.log(`${successful}/${results.length} endpoints working\n`);
  
  if (successful === results.length) {
    console.log('🎉 All API endpoints are working!');
    console.log('💡 If sitemaps still 404, try restarting your dev server.');
  } else {
    console.log('⚠️  Some API endpoints have issues:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`- ${result.name}: ${result.error || 'Unknown error'}`);
    });
    console.log('\n💡 Fix API issues before testing sitemaps.');
  }
}

testAllEndpoints().catch(console.error);