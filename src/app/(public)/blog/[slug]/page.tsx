import { permanentRedirect } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export default function OldBlogPage({ params }: Props) {
  // Redirect to new URL structure (or to homepage if blogs don't exist)
  console.log("🔀 Blog redirect page triggered for:", params.slug);
  permanentRedirect(`/blogs/${params.slug}`);
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
