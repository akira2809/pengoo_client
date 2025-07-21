// src/app/(public)/product/[slug]/page.tsx
// Đây là Server Component chính cho trang chi tiết sản phẩm
import { Metadata } from "next";
import { productService } from "@/app/api/services/productService";
import { ProductData } from "@/app/type/product";

// Define types that are used in the product data
interface CategoryType {
  id: number;
  name: string;
}

interface PublisherType {
  id: number;
  name: string;
}

// Import ProductLoader Client Component wrapper
import ProductLoader from "./ProductLoader";

// Hàm fetch dữ liệu sản phẩm (sẽ chạy trên server)
async function getProductBySlug(
  slug: string
): Promise<{ product: ProductData | null; error: string | null }> {
  if (!slug) {
    return { product: null, error: "Slug sản phẩm không hợp lệ" };
  }

  try {
    const response = await productService.getProductBySlug(slug);
    if (response?.data) {
      // Map the response to match ProductData type
      const productData: ProductData = {
        ...response.data,
        // Ensure all required fields are present with proper types
        id: response.data.id || 0,
        product_name: response.data.product_name || "",
        description: response.data.description || "",
        product_price: response.data.product_price || 0,
        slug: response.data.slug || slug,
        status: response.data.status || "active",
        image_url:
          response.data.image_url || response.data.images?.[0]?.url || "",
        discount: response.data.discount || 0,
        meta_title: response.data.meta_title || "",
        meta_description: response.data.meta_description || "",
        quantity_sold: response.data.quantity_sold || 0,
        category_ID:
          typeof response.data.category_ID === "object"
            ? (response.data.category_ID as CategoryType)?.id || 0
            : (response.data.category_ID as number) || 0,
        tag_ID:
          typeof response.data.tag_ID === "string"
            ? parseInt(response.data.tag_ID, 10) || 0
            : (response.data.tag_ID as number) || 0,
        publisher_ID:
          typeof response.data.publisher_ID === "object"
            ? (response.data.publisher_ID as PublisherType)?.id || 0
            : (response.data.publisher_ID as number) || 0,
        tags: response.data.tags || [],
        images: response.data.images || [],
        features: response.data.features || [],
        created_at: response.data.created_at || new Date().toISOString(),
        updated_at: response.data.updated_at || new Date().toISOString(),
        quantity_stock: response.data.quantity_stock || 0,
        warranty: response.data.warranty || "",
        shipping_info: response.data.shipping_info || "",
        cmsContent: response.data.cmsContent,
      };
      return { product: productData, error: null };
    }
    return { product: null, error: "Không tìm thấy sản phẩm" };
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm trên server:", err);
    return { product: null, error: "Đã xảy ra lỗi khi tải thông tin sản phẩm" };
  }
}

// Hàm generateMetadata để tạo metadata động (Chỉ chạy trên server)
export async function generateMetadata(props: {
  params: { slug: string };
}): Promise<Metadata> {
  // Lấy slug từ params (đã được resolve bởi Next.js)
  const { slug } = props.params;
  if (!slug) {
    return {
      title: "Sản phẩm không tồn tại - PENGOO",
      description: "Xin lỗi, sản phẩm bạn tìm kiếm không tồn tại.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { product, error } = await getProductBySlug(slug);

  if (!product) {
    console.warn(
      `Không tìm thấy sản phẩm với slug: ${slug}. Lỗi: ${error || "Không rõ."}`
    );
    return {
      title: "Sản phẩm không tồn tại - PENGOO",
      description: "Xin lỗi, sản phẩm bạn tìm kiếm không tồn tại.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const productName = product.product_name || "Sản phẩm Board Game";
  const productDescription =
    product.description ||
    `Khám phá ${productName} - một trò chơi board game tuyệt vời từ PENGOO.`;
  const productImageUrl =
    product.images?.[0]?.url || "/placeholder-product.jpg";

  // Handle category name safely
  const getCategoryName = (
    categoryId: number | CategoryType | undefined
  ): string => {
    if (!categoryId) return "board game";
    if (typeof categoryId === "object" && "name" in categoryId) {
      return categoryId.name;
    }
    return "board game";
  };

  const productKeywords = [
    productName.toLowerCase(),
    getCategoryName(product.category_ID).toLowerCase(),
    "PENGOO",
    "trò chơi",
    "board game",
    `mua ${productName.toLowerCase()}`,
    ...(product.features || [])
      .map((f) => f.title)
      .filter(Boolean)
      .map((f) => f.toLowerCase()),
    ...(product.tags || [])
      .filter((t): t is string => typeof t === "string" && t.trim() !== "")
      .map((t) => t.toLowerCase()),
  ]
    .filter(Boolean)
    .slice(0, 10);

  return {
    title: `${productName} | Board Game Chính Hãng tại PENGOO`,
    description: productDescription,
    keywords: productKeywords,
    openGraph: {
      title: `${productName} | Board Game Chính Hãng tại PENGOO`,
      description: productDescription,
      url: `https://yourwebsite.com/product/${product.slug}`,
      siteName: "PENGOO",
      images: [
        {
          url: productImageUrl,
          width: 800,
          height: 600,
          alt: `Hình ảnh ${productName} - Board Game PENGOO`,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${productName} | Board Game Chính Hãng tại PENGOO`,
      description: productDescription,
      creator: "@yourtwitterhandle",
      images: [productImageUrl],
    },
    alternates: {
      canonical: `https://yourwebsite.com/product/${product.slug}`,
    },
  };
}

// Đây là component trang chính của bạn
export default async function ProductPage(props: { params: { slug: string } }) {
  // Lấy slug từ params (đã được resolve bởi Next.js)
  const { slug } = props.params;
  if (!slug) {
    return <div>Không tìm thấy sản phẩm</div>;
  }

  const { product, error } = await getProductBySlug(slug);

  const schemaData = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.product_name || "Sản phẩm Board Game",
        image: product.images?.[0]?.url || "/placeholder-product.jpg",
        description:
          product.description ||
          `Khám phá ${
            product.product_name || "Sản phẩm Board Game"
          } - một trò chơi board game tuyệt vời từ PENGOO.`,
        // Remove sku and mpn as they don't exist in ProductData
        brand: {
          "@type": "Brand",
          name: "PENGOO",
        },
        offers: {
          "@type": "Offer",
          url: `https://yourwebsite.com/product/${product.slug}`,
          priceCurrency: "VND",
          price: product.product_price || 0,
          itemCondition: "https://schema.org/NewCondition",
          availability:
            (product.quantity_stock || 0) > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "PENGOO",
          },
        },
        // Remove aggregateRating as the properties don't exist in ProductData
      }
    : null;

  return (
    <>
      {/* Render Schema Markup nếu có dữ liệu sản phẩm */}
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      {/* Truyền dữ liệu sản phẩm đã fetch được vào Client Component Loader */}
      <ProductLoader initialProduct={product} initialError={error} />
    </>
  );
}
