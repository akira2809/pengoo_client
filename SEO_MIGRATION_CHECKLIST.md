# SEO Migration Checklist

## ✅ Pre-Deployment
- [ ] All redirect files created (`middleware.ts`, fallback pages)
- [ ] All sitemap files created (main, products, collections, blogs, index)
- [ ] Environment variables set (`NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_BASE_URL`)
- [ ] Scripts tested locally (`npm run seo:monitor`)

## 🚀 Deployment
- [ ] Deploy all files to production
- [ ] Verify environment variables in production
- [ ] Test redirects work: `npm run seo:test-redirects`
- [ ] Validate sitemaps: `npm run sitemap:validate`

## 📊 Post-Deployment (Day 1)
- [ ] Submit sitemaps to Google: `npm run sitemap:submit`
- [ ] Test sample old URLs manually in browser
- [ ] Check Google Search Console for crawl errors
- [ ] Monitor server logs for 404s

## 🔍 Google Search Console Actions
- [ ] Submit new sitemaps:
  - [ ] `/sitemap.xml`
  - [ ] `/products-sitemap.xml`
  - [ ] `/collections-sitemap.xml`
  - [ ] `/blogs-sitemap.xml`
  - [ ] `/sitemap-index.xml`
- [ ] Request removal of old URL patterns:
  - [ ] `/product/*`
  - [ ] `/collection/*`
  - [ ] `/blog/*`
- [ ] Monitor "Coverage" section for issues

## 📈 Week 1 Monitoring
- [ ] Daily SEO monitoring: `npm run seo:monitor`
- [ ] Check Google Search Console for:
  - [ ] Crawl errors decreasing
  - [ ] New URLs being indexed
  - [ ] Old URLs being removed
- [ ] Monitor organic traffic for drops

## 🎯 Week 2-4 Optimization
- [ ] Analyze which old URLs still get traffic
- [ ] Add specific redirects for high-traffic old URLs
- [ ] Monitor page load speeds
- [ ] Check for any missed redirect patterns

## 🚨 Emergency Actions (if issues found)
- [ ] Revert middleware if causing problems
- [ ] Add specific redirect rules for missed URLs
- [ ] Contact Google via Search Console if major issues

## 📋 Success Metrics
- [ ] 0 high-priority 404 errors in GSC
- [ ] All old URLs redirect with 301 status
- [ ] New sitemaps indexed by Google
- [ ] Organic traffic maintained or improved
- [ ] Page load times under 2 seconds

## 🛠️ Useful Commands
```bash
# Full SEO check
npm run seo:full-check

# Monitor all SEO aspects
npm run seo:monitor

# Test redirects specifically
npm run seo:test-redirects

# Submit sitemaps to search engines
npm run sitemap:submit

# Validate all sitemaps
npm run sitemap:validate
```

## 📞 Contacts
- **Google Search Console**: [Your GSC URL]
- **Analytics**: [Your GA4 URL]
- **Server Logs**: [Your server monitoring URL]

---
**Last Updated**: $(date)
**Migration Status**: In Progress / Complete