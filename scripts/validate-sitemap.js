// Script to validate sitemap URLs
const https = require("https");
const http = require("http");

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pengoo.store";
const sitemaps = [
  `${baseUrl}/sitemap.xml`,
  `${baseUrl}/api/sitemaps/products`,
  `${baseUrl}/api/sitemaps/collections`,
  `${baseUrl}/api/sitemaps/blogs`,
];

// Function to check if URL is accessible
function checkUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith("https:") ? https : http;

    const request = protocol.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode,
        success: res.statusCode >= 200 && res.statusCode < 300,
        contentType: res.headers["content-type"],
      });
    });

    request.on("error", (err) => {
      resolve({
        url,
        status: "ERROR",
        success: false,
        error: err.message,
      });
    });

    request.setTimeout(10000, () => {
      request.destroy();
      resolve({
        url,
        status: "TIMEOUT",
        success: false,
        error: "Request timeout",
      });
    });
  });
}

// Function to parse XML and extract URLs
function extractUrlsFromSitemap(xmlContent) {
  const urlMatches = xmlContent.match(/<loc>(.*?)<\/loc>/g);
  if (!urlMatches) return [];

  return urlMatches.map((match) => match.replace(/<\/?loc>/g, ""));
}

// Function to fetch and validate sitemap
async function validateSitemap(sitemapUrl) {
  console.log(`\n🔍 Validating sitemap: ${sitemapUrl}`);

  const result = await checkUrl(sitemapUrl);

  if (!result.success) {
    console.log(
      `❌ Sitemap not accessible: ${result.status} - ${
        result.error || "Unknown error"
      }`
    );
    return { valid: false, urlCount: 0 };
  }

  console.log(`✅ Sitemap accessible (${result.status})`);
  console.log(`📄 Content-Type: ${result.contentType}`);

  // For a more thorough validation, you could fetch the content and parse it
  // This is a basic validation that just checks accessibility
  return { valid: true, urlCount: "Unknown (not parsed)" };
}

// Main validation function
async function validateAllSitemaps() {
  console.log("🚀 Starting sitemap validation...\n");

  const results = [];

  for (const sitemapUrl of sitemaps) {
    const result = await validateSitemap(sitemapUrl);
    results.push({ url: sitemapUrl, ...result });

    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Summary
  console.log("\n📊 VALIDATION SUMMARY:");
  results.forEach((result) => {
    const status = result.valid ? "✅ VALID" : "❌ INVALID";
    console.log(`${status}: ${result.url}`);
  });

  const validCount = results.filter((r) => r.valid).length;
  console.log(`\n${validCount}/${results.length} sitemaps are valid`);

  if (validCount === results.length) {
    console.log("\n🎉 All sitemaps are valid and accessible!");
  } else {
    console.log(
      "\n⚠️  Some sitemaps have issues. Please check the logs above."
    );
  }
}

// Run validation
validateAllSitemaps().catch(console.error);
