import { permanentRedirect } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export default function OldProductPage({ params }: Props) {
  // Redirect to new URL structure
  console.log("🔀 Product redirect page triggered for:", params.slug);
  permanentRedirect(`/products/${params.slug}`);
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {
  return {
    title: "Redirecting...",
    robots: {
      index: false,
      follow: false,
    },
  };
}
