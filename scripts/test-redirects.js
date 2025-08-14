// Script to test redirects are working
const https = require('https');

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pengoo.store';

// Test redirect URLs
const redirectTests = [
  {
    old: `${baseUrl}/product/exploding-kittens`,
    expected: `${baseUrl}/products/exploding-kittens`,
    description: 'Product redirect'
  },
  {
    old: `${baseUrl}/collection/board-games`,
    expected: `${baseUrl}/collections/board-games`,
    description: 'Collection redirect'
  },
  {
    old: `${baseUrl}/blog/how-to-play`,
    expected: `${baseUrl}/blogs/how-to-play`,
    description: 'Blog redirect'
  }
];

function testRedirect(testCase) {
  return new Promise((resolve) => {
    console.log(`🔍 Testing: ${testCase.old}`);
    
    const request = https.get(testCase.old, {
      // Don't follow redirects automatically
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Test-Bot/1.0)'
      }
    }, (res) => {
      const isRedirect = res.statusCode >= 300 && res.statusCode < 400;
      const location = res.headers.location;
      
      if (isRedirect && location) {
        const fullLocation = location.startsWith('http') ? location : `${baseUrl}${location}`;
        const success = fullLocation === testCase.expected;
        
        console.log(`${success ? '✅' : '❌'} ${testCase.description}:`);
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Redirects to: ${fullLocation}`);
        console.log(`   Expected: ${testCase.expected}`);
        
        resolve({ ...testCase, success, actualLocation: fullLocation, status: res.statusCode });
      } else {
        console.log(`❌ ${testCase.description}: No redirect (Status: ${res.statusCode})`);
        resolve({ ...testCase, success: false, status: res.statusCode });
      }
    });
    
    request.on('error', (err) => {
      console.log(`❌ ${testCase.description}: Error - ${err.message}`);
      resolve({ ...testCase, success: false, error: err.message });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      console.log(`❌ ${testCase.description}: Timeout`);
      resolve({ ...testCase, success: false, error: 'Timeout' });
    });
  });
}

async function testAllRedirects() {
  console.log('🚀 Testing redirects...\n');
  
  const results = [];
  
  for (const testCase of redirectTests) {
    const result = await testRedirect(testCase);
    results.push(result);
    console.log(''); // Empty line for readability
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  console.log('📊 REDIRECT TEST SUMMARY:');
  console.log(`${successful}/${results.length} redirects working correctly\n`);
  
  if (successful === results.length) {
    console.log('🎉 All redirects are working perfectly!');
  } else {
    console.log('⚠️  Some redirects need attention:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`- ${result.description}: ${result.old}`);
    });
  }
}

testAllRedirects().catch(console.error);