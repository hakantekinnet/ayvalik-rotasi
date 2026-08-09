import { client } from "@/sanity/lib/client";
import { Suspense } from "react";
import { NewsView } from "@/components/features/NewsView";
import { JsonLd } from "@/components/seo/JsonLd";
import { urlFor } from "@/sanity/lib/image";

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

// Build schema.org/Event array for JSON-LD
function buildEventSchemas(events: SanityEvent[]) {
  return events.map((evt) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: evt.title,
      startDate: evt.startsAt,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
    };

    if (evt.endsAt) {
      schema.endDate = evt.endsAt;
    }

    if (evt.description) {
      schema.description = evt.description;
    }

    if (evt.coverImage) {
      try {
        schema.image = urlFor(evt.coverImage).url();
      } catch {
        // Skip if image URL generation fails
      }
    }

    if (evt.location) {
      schema.location = {
        "@type": "Place",
        name: evt.location.title,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ayvalık",
          addressRegion: "Balıkesir",
          addressCountry: "TR",
        },
      };
      if (evt.location.geopoint?.lat && evt.location.geopoint?.lng) {
        schema.location.geo = {
          "@type": "GeoCoordinates",
          latitude: evt.location.geopoint.lat,
          longitude: evt.location.geopoint.lng,
        };
      }
    }

    return schema;
  });
}

export default async function FeedPage() {
  const [sanityNews, events] = await Promise.all([
    getNews(),
    getEvents(),
  ]);

  const serializedNews = JSON.parse(JSON.stringify(sanityNews));
  const serializedEvents = JSON.parse(JSON.stringify(events));
  const eventSchemas = buildEventSchemas(events);

  return (
    <div className="min-h-screen">
      {/* Event structured data */}
      {eventSchemas.map((schema, i) => (
        <JsonLd key={`event-ld-${i}`} schema={schema} />
      ))}

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
