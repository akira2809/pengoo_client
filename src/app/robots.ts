import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pengoo.store";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/product/", // Disallow old product URLs
          "/collection/", // Disallow old collection URLs
          "/blog/", // Disallow old blog URLs
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/api/sitemaps/products`,
      `${baseUrl}/api/sitemaps/collections`,
      `${baseUrl}/api/sitemaps/blogs`,
    ],
  };
}
