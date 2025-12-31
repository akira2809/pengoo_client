// app/(public)/collections/[slug]/page.tsx
import { Metadata } from "next";
import { collectionService } from "@/app/api/services/collectionService";
import CollectionLoader from "./CollectionLoader";

// Fetch collection data
async function getCollectionBySlug(slug: string) {
  try {
    const response = await collectionService.getCollectionBySlug(slug);
    if (response?.data) {
      return {
        collection: {
          id: String(response.data.id),
          name: response.data.name,
          slug: String(slug),
          description: response.data.description,
          image_url: response.data.image_url,
          products: response.data.products || [],
        },
        error: null,
      };
    }
    return { collection: null, error: "Collection not found" };
  } catch (err) {
    console.error("Error loading collection:", err);
    return {
      collection: null,
      error: "An error occurred while loading the collection",
    };
  }
}

// Generate enhanced SEO metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const { collection } = await getCollectionBySlug(slug);

  if (!collection) {
    return {
      title: "Bộ Sưu Tập Không Tồn Tại - PENGOO",
      description:
        "Xin lỗi, bộ sưu tập bạn tìm kiếm không tồn tại hoặc đã được gỡ bỏ.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const collectionName = collection.name || "Bộ Sưu Tập Board Game";
  const collectionDescription =
    collection.description ||
    `Khám phá bộ sưu tập ${collectionName} với những board game tuyệt vời được tuyển chọn kỹ lưỡng tại PENGOO.`;
  const collectionImageUrl =
    collection.image_url || "/images/default-collection.jpg";
  const productsCount = collection.products?.length || 0;

  // Generate keywords based on collection name and products
  const collectionKeywords = [
    collectionName.toLowerCase(),
    `bộ sưu tập ${collectionName.toLowerCase()}`,
    "board game collection",
    "danh mục board game",
    "PENGOO collection",
    `${productsCount} board games`,
    "trò chơi board game",
    "board game chủ đề",
    "bộ sưu tập game",
  ];

  return {
    title: `${collectionName} - Bộ Sưu Tập Board Game | PENGOO`,
    description: collectionDescription,
    keywords: collectionKeywords,
    alternates: {
      canonical: `https://pengoo.store/collections/${slug}`,
    },
    openGraph: {
      title: `${collectionName} | PENGOO Board Game Collection`,
      description: collectionDescription,
      url: `https://pengoo.store/collections/${slug}`,
      siteName: "PENGOO",
      images: [
        {
          url: collectionImageUrl,
          width: 1200,
          height: 630,
          alt: `${collectionName} - Bộ sưu tập board game PENGOO`,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${collectionName} | PENGOO Board Game Collection`,
      description: collectionDescription,
      creator: "@pengoo_boardgame",
      images: [collectionImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Add JSON-LD structured data for collection
function addCollectionJsonLd(collection: unknown, slug: string) {
  if (!collection) return { __html: "" };

  return {
    __html: `{
      "@context": "https://schema.org/",
      "@type": "CollectionPage",
      "name": "${collection.name}",
      "description": "${
        collection.description || `Bộ sưu tập ${collection.name} tại PENGOO`
      }",
      "url": "https://pengoo.store/collections/${slug}",
      "image": "${collection.image_url || "/images/default-collection.jpg"}",
      "mainEntity": {
        "@type": "ItemList",
        "name": "${collection.name}",
        "description": "${
          collection.description ||
          `Danh sách sản phẩm trong bộ sưu tập ${collection.name}`
        }",
        "numberOfItems": ${collection.products?.length || 0}
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Trang chủ",
            "item": "https://pengoo.store"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Bộ sưu tập",
            "item": "https://pengoo.store/collections"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "${collection.name}",
            "item": "https://pengoo.store/collections/${slug}"
          }
        ]
      },
      "publisher": {
        "@type": "Organization",
        "name": "PENGOO",
        "url": "https://pengoo.store"
      }
    }`,
  };
}

// Page component
const CollectionPage: React.FC<{ params: { slug: string } }> = async ({
  params,
}) => {
  const { slug } = params;
  const { collection, error } = await getCollectionBySlug(slug);

  return (
    <>
      {collection && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={addCollectionJsonLd(collection, slug)}
          key="collection-jsonld"
        />
      )}
      <CollectionLoader
        slug={slug}
        initialCollection={collection}
        initialError={error}
      />
    </>
  );
};

export default CollectionPage;
