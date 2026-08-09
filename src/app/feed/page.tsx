import { client } from "@/sanity/lib/client";
import { Suspense } from "react";
import { NewsView } from "@/components/features/NewsView";

export const revalidate = 300;

export interface SanityNewsItem {
  _id: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  _createdAt: string;
}

export interface SanityEvent {
  _id: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverImage?: any;
  routeEnabled?: boolean;
  location?: {
    _id: string;
    title: string;
    slug: string;
    geopoint?: { lat: number; lng: number };
    isOpportunity?: boolean;
    opportunityText?: string;
    opportunityCode?: string;
  };
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

async function getEvents(): Promise<SanityEvent[]> {
  try {
    const data = await client.fetch(
      `*[_type == "event"] | order(startsAt asc){
        _id,
        title,
        startsAt,
        endsAt,
        description,
        coverImage,
        routeEnabled,
        "location": location->{
          _id,
          title,
          "slug": coalesce(slug.current, _id),
          "geopoint": location,
          isOpportunity,
          opportunityText,
          opportunityCode
        }
      }`
    );
    return data || [];
  } catch (err) {
    console.warn("Sanity events fetch failed:", err);
    return [];
  }
}

export default async function FeedPage() {
  const [sanityNews, events] = await Promise.all([
    getNews(),
    getEvents(),
  ]);

  const serializedNews = JSON.parse(JSON.stringify(sanityNews));
  const serializedEvents = JSON.parse(JSON.stringify(events));

  return (
    <div className="min-h-screen">
      {/* Header — mobile only (DesktopHeader handles lg+) */}
      <header className="px-5 pt-12 pb-2 lg:hidden">
        <h1 className="font-heading text-2xl font-extrabold text-foreground tracking-tight">
          Haberler
        </h1>
        <p className="text-sm text-foreground-muted mt-0.5">
          Ayvalık&apos;tan son gelişmeler
        </p>
      </header>

      {/* News Dashboard View — Suspense needed for useSearchParams */}
      <Suspense>
        <NewsView
          sanityNews={serializedNews}
          events={serializedEvents}
        />
      </Suspense>
    </div>
  );
}
