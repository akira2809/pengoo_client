// app/sitemap.ts
import { MetadataRoute } from 'next';

// Đảm bảo NEXT_PUBLIC_APP_URL được định nghĩa trong .env.local hoặc môi trường triển khai
// Ví dụ: NEXT_PUBLIC_APP_URL=https://pengoo.vn
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pengoo.vn'; // Cập nhật domain thực tế ở đây!

// Define types for our API responses
interface Product {
  slug: string;
  updatedAt?: string;
}

interface BlogPost {
  slug: string;
  canonical?: string;
  updatedAt?: string;
  created_at?: string;
}

interface Collection {
  slug: string;
  updatedAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date(); // Lấy thời gian hiện tại cho các trang tĩnh

  // 1. Các trang tĩnh quan trọng
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`, // Trang chủ
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`, // Trang giới thiệu
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`, // Trang liên hệ
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`, // Trang danh mục sản phẩm chính
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`, // Trang danh sách blog
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/collections`, // Trang danh mục collections chính
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/termsOfServicePolicy`, // Trang chính sách sử dụng
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/promotionPolicy`, // Trang chính sách khuyến mãi
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/returnPolicy`, // Trang chính sách đổi trả
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shippingPolicy`, // Trang chính sách giao hàng
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/commitment`, // Trang cam kết
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 2. Lấy dữ liệu sản phẩm động
  const products = await getProducts();
  const productPages: MetadataRoute.Sitemap = products.map((product: Product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 3. Lấy dữ liệu bài viết blog động
  const blogPosts = await getBlogPosts();
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post: BlogPost) => ({
    url: `${baseUrl}/blogs/${post.canonical || post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.created_at || now),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 4. Lấy dữ liệu collection động
  const collections = await getCollections();
  const collectionPages: MetadataRoute.Sitemap = collections.map((collection: Collection) => ({
    url: `${baseUrl}/collections/${collection.slug}`,
    lastModified: collection.updatedAt ? new Date(collection.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...blogPages, ...collectionPages];
}

// --- Các hàm lấy dữ liệu từ API của bạn ---

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch('https://api.pengoo.vn/products', { 
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      console.error('Failed to fetch products for sitemap:', res.statusText);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch('https://api.pengoo.vn/blogs', { 
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      console.error('Failed to fetch blog posts for sitemap:', res.statusText);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [];
  }
}

async function getCollections(): Promise<Collection[]> {
  try {
    const res = await fetch('https://api.pengoo.vn/collections', { 
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      console.error('Failed to fetch collections for sitemap:', res.statusText);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching collections for sitemap:', error);
    return [];
  }
}