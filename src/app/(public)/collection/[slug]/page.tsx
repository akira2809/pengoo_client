import { permanentRedirect } from 'next/navigation'

interface Props {
  params: {
    slug: string
  }
}

export default function OldCollectionPage({ params }: Props) {
  // Redirect to new URL structure
  console.log('🔀 Collection redirect page triggered for:', params.slug)
  permanentRedirect(`/collections/${params.slug}`)
}

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: 'Redirecting...',
    robots: {
      index: false,
      follow: false,
    },
  }
}