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

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { collection } = await getCollectionBySlug(slug);

  if (!collection) {
    return {
      title: "Collection not found - Store",
      description: "Sorry, the collection you are looking for does not exist.",
    };
  }

  return {
    title: `${collection.name} | Store`,
    description:
      collection.description ||
      `Explore ${collection.name} - a curated collection from our store.`,
  };
}

// Page component
export default async function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { collection, error } = await getCollectionBySlug(slug);

  return (
    <CollectionLoader
      slug={slug}
      initialCollection={collection}
      initialError={error}
    />
  );
}
