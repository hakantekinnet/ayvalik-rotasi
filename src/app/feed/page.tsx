import { client } from "@/sanity/lib/client";
import { NewsView } from "@/components/features/NewsView";

export interface SanityNewsItem {
  _id: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  _createdAt: string;
}

async function getNews(): Promise<SanityNewsItem[]> {
  try {
    const data = await client.fetch(
      `*[_type == "news"] | order(_createdAt desc){
        _id,
        title,
        summary,
        _createdAt,
        "imageUrl": mainImage.asset->url
      }`
    );
    return data || [];
  } catch (err) {
    console.warn("Sanity news fetch failed:", err);
    return [];
  }
}

export default async function FeedPage() {
  const sanityNews = await getNews();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-5 pt-12 pb-2">
        <h1 className="font-heading text-2xl font-extrabold text-foreground tracking-tight">
          Haberler
        </h1>
        <p className="text-sm text-foreground-muted mt-0.5">
          Ayvalık&apos;tan son gelişmeler
        </p>
      </header>

      {/* News Dashboard View */}
      <NewsView sanityNews={sanityNews} />
    </div>
  );
}
