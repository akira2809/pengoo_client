"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/app/stores/store";
import { productService } from "@/app/api/services/productService";
import { Product, ProductCategory } from "@/app/types/product";
import { ProductPageLayout } from "./component/ProductPageLayout";
import type { TagType } from "@/app/type/product";

// Utility functions for type-safe property access
const getStringProperty = (
  obj: Record<string, unknown>,
  key: string
): string => {
  const value = obj[key];
  return typeof value === "string" ? value : "";
};

const getNumberProperty = (
  obj: Record<string, unknown>,
  key: string
): number => {
  const value = obj[key];
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value) || 0;
  return 0;
};

const getCategoryName = (category: unknown): string => {
  if (typeof category === "object" && category !== null && "name" in category) {
    return String((category as { name: string }).name);
  }
  return String(category || "");
};

const getCategoryId = (category: unknown): number | ProductCategory => {
  if (typeof category === "object" && category !== null && "id" in category) {
    return category as ProductCategory;
  }
  if (typeof category === "string") return parseInt(category, 10) || 0;
  if (typeof category === "number") return category;
  return 0;
};

// Helper function to create a default product with empty values
const createDefaultProduct = (): Product => {
  const now = new Date().toISOString();
  return {
    id: 0,
    name: "",
    slug: "",
    description: "",
    price: 0,
    product_price: 0,
    product_name: "",
    image: "",
    image_url: "",
    images: [],
    category: "",
    category_ID: 0,
    publisher_ID: 0,
    status: "",
    discount: 0,
    quantity_stock: 0,
    quantity_sold: 0,
    rating: 0,
    reviews: 0,
    features: [],
    tags: [],
    meta_title: "",
    meta_description: "",
    created_at: now,
    updated_at: now,
    createdAt: now,
    updatedAt: now,
    tag_ID: 0,
  };
};

function ProductsContent() {
  const { products, isLoading, error, fetchProducts } = useStore();

  // Removed unused filters state since it's not being used
  const [, setFilters] = useState({
    name: "",
    category: "",
    minPrice: 0,
    maxPrice: 5000000,
  });

  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; slug: string; productCount: number }>
  >([]);
  const [tags, setTags] = useState<
    Array<{ id: string; name: string; type: string }>
  >([]);
  const [collections, setCollections] = useState<
    Array<{
      id: string;
      name: string;
      slug: string;
      image_url: string;
      productCount: number;
    }>
  >([]);

  const searchParams = useSearchParams();
  const sort = searchParams.get("sort");
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);

  // Load products, categories, and tags
  useEffect(() => {
    const loadProducts = async () => {
      try {
        await fetchProducts(); // fetch và lưu vào store
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    const loadCategories = async () => {
      try {
        const response = await productService.getCategories();
        if (response && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    const loadTags = async () => {
      try {
        const response = await productService.getTags();
        if (response && response.data) {
          setTags(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };

    const loadCollections = async () => {
      setIsLoadingCollections(true);
      try {
        const response = await productService.getCategories();
        if (response?.data) {
          const collectionsData = response.data.map((cat: unknown) => {
            const category = cat as {
              id: string | number;
              name: string;
              slug: string;
              productCount?: number;
            };
            return {
              id: String(category.id),
              name: category.name,
              slug: category.slug,
              image_url: "",
              productCount: category.productCount || 0,
            };
          });
          setCollections(collectionsData);
          setCollectionsError(null);
        }
      } catch (err) {
        console.error("Failed to fetch collections:", err);
        setCollectionsError("Failed to load collections");
      } finally {
        setIsLoadingCollections(false);
      }
    };

    loadProducts();
    loadCategories();
    loadTags();
    loadCollections();
  }, [sort, fetchProducts, setCollections]);

  // Loading state
  if (isLoading || isLoadingCollections) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || collectionsError) {
    const errorMessage = error || collectionsError;
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      </div>
    );
  }

  // Format product data and filter by `sort`
  const formattedProducts = products
    .map((product: unknown) => {
      // Type guard to ensure product is an object
      if (typeof product !== "object" || product === null) {
        return createDefaultProduct();
      }

      const productObj = product as Record<string, unknown>;

      // Safely access product properties with type guards
      const productName =
        getStringProperty(productObj, "name") ||
        getStringProperty(productObj, "product_name") ||
        "";
      const productPrice =
        getNumberProperty(productObj, "price") ||
        getNumberProperty(productObj, "product_price") ||
        0;
      const productImage =
        getStringProperty(productObj, "image") ||
        getStringProperty(productObj, "image_url") ||
        "";
      const slug = getStringProperty(productObj, "slug") || "";
      const description = getStringProperty(productObj, "description") || "";

      // Ensure status is always a string
      const statusValue = productObj.status;
      const status =
        typeof statusValue === "number"
          ? statusValue.toString()
          : getStringProperty(productObj, "status");

      const metaTitle = getStringProperty(productObj, "meta_title") || "";
      const metaDescription =
        getStringProperty(productObj, "meta_description") || "";
      const updatedAt =
        getStringProperty(productObj, "updated_at") || new Date().toISOString();
      const createdAt =
        getStringProperty(productObj, "createdAt") || new Date().toISOString();

      // Create a base product object with required properties
      const baseProduct: Product = {
        id: getNumberProperty(productObj, "id") || 0,
        name: productName,
        slug,
        description,
        price: productPrice,
        product_price: productPrice,
        product_name: productName,
        image: productImage,
        image_url: productImage,
        images: Array.isArray(productObj.images) ? productObj.images : [],
        category: getCategoryName(productObj.category_ID),
        category_ID: getCategoryId(productObj.category_ID),
        publisher_ID: getNumberProperty(productObj, "publisher_ID") || 0,
        status,
        discount: getNumberProperty(productObj, "discount") || 0,
        quantity_stock: getNumberProperty(productObj, "quantity_stock") || 0,
        quantity_sold: getNumberProperty(productObj, "quantity_sold") || 0,
        rating: getNumberProperty(productObj, "rating") || 0,
        reviews: getNumberProperty(productObj, "reviews") || 0,
        features: Array.isArray(productObj.features)
          ? (productObj.features as string[])
          : [],
        tags: Array.isArray(productObj.tags)
          ? (productObj.tags as string[])
          : [],
        meta_title: metaTitle,
        meta_description: metaDescription,
        created_at: createdAt,
        updated_at: updatedAt,
        updatedAt, // Add updatedAt to match the Product type
        createdAt,
        tag_ID: getNumberProperty(productObj, "tag_ID") || 0,
      };

      return baseProduct;
    })
    .filter((product) => {
      if (sort === "discount") return product.discount > 0;
      return true;
    })
    .sort((a, b) => {
      if (sort === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    });
  // Convert Product[] to ProductData[] to match the expected type

  const productData = formattedProducts.map((product) => {
    // Convert category to the expected format
    // Convert category to the expected format
    const categoryId =
      typeof product.category_ID === "object"
        ? Number(product.category_ID.id) || 0
        : Number(product.category_ID) || 0;

    const categoryName =
      typeof product.category_ID === "object"
        ? String(product.category_ID.name || "")
        : String(product.category || "");

    // Ensure dates are strings
    const createdAt =
      typeof product.created_at === "string"
        ? product.created_at
        : typeof product.createdAt === "string"
        ? product.createdAt
        : new Date().toISOString();

    const updatedAt =
      typeof product.updated_at === "string"
        ? product.updated_at
        : typeof product.updatedAt === "string"
        ? product.updatedAt
        : new Date().toISOString();

    // Map tags to TagType[] to match ProductData type
    const tagsArray: TagType[] = Array.isArray(product.tags)
      ? product.tags.map((tag) => {
          if (typeof tag === "object" && tag !== null) {
            // If already TagType, return as is
            return tag as TagType;
          }
          // If string, wrap as TagType with name property
          return { id: 0, name: String(tag), type: "" };
        })
      : [];

    // Create a new object with only the properties that ProductData expects
    return {
      id: product.id,
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      price: Number(product.price) || 0,
      product_price: Number(product.product_price) || 0,
      product_name: product.product_name || product.name || "",
      image: product.image || "",
      image_url: product.image_url || product.image || "",
      images: product.images || [],
      category: categoryName,
      category_ID: categoryId,
      publisher_ID: Number(product.publisher_ID) || 0,
      status: String(product.status || ""),
      discount: Number(product.discount) || 0,
      quantity_stock: Number(product.quantity_stock) || 0,
      quantity_sold: Number(product.quantity_sold) || 0,
      rating: Number(product.rating) || 0,
      reviews: Number(product.reviews) || 0,
      features: Array.isArray(product.features)
        ? product.features.map((feature) => ({
            id: 0, // Default ID since we don't have it
            name: String(feature || ""),
            description: String(feature || ""),
            image: "",
            title: String(feature || ""),
            content: String(feature || ""),
            icon: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }))
        : [],
      tags: tagsArray,
      meta_title: String(product.meta_title || ""),
      meta_description: String(product.meta_description || ""),
      created_at: createdAt,
      updated_at: updatedAt,
      tag_ID: Number(product.tag_ID) || 0,
    };
  });

  return (
    <ProductPageLayout
      products={productData}
      isLoading={isLoading}
      error={error}
      setFilters={setFilters}
      categories={categories}
      tags={tags}
      collections={collections}
    />
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Đang tải sản phẩm...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
