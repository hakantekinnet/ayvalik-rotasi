import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Map } from "lucide-react";
import { PlaceDetailContent } from "@/components/ui/PlaceDetailContent";
import { JsonLd } from "@/components/seo/JsonLd";

async function getPlaceBySlug(slug: string) {
  const data = await client.fetch(
    `*[_type == "place" && (slug.current == $slug || _id == $slug)][0]{
      _id,
      "slug": coalesce(slug.current, _id),
      title,
      category,
      description,
      "imageUrls": images[].asset->url,
      "ogImage": images[0].asset->url,
      location,
      reelUrl,
      isOpportunity,
      opportunityText,
      opportunityCode,
      voteCount,
      ratingLezzet,
      ratingFiyat,
      ratingAtmosfer,
      ratingDeniz,
      ratingTemizlik,
      ratingTesis,
      ratingGenel
    }`,
    { slug }
  );
  return data;
}

// Calculate average rating for structured data
function calculateAvgRating(place: Record<string, unknown>): number | null {
  const voteCount = (place.voteCount as number) || 0;
  if (voteCount === 0) return null;

  const category = place.category as string;
  let total = 0;
  let criteria = 1;

  if (category === "Mekan") {
    total = ((place.ratingLezzet as number) || 0) + ((place.ratingFiyat as number) || 0) + ((place.ratingAtmosfer as number) || 0);
    criteria = 3;
  } else if (category === "Plaj") {
    total = ((place.ratingDeniz as number) || 0) + ((place.ratingTemizlik as number) || 0) + ((place.ratingTesis as number) || 0);
    criteria = 3;
  } else {
    total = (place.ratingGenel as number) || 0;
    criteria = 1;
  }

  const avg = total / (voteCount * criteria);
  return Math.round(avg * 10) / 10; // 1 decimal
}

// Dynamic SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place) {
    return { title: "Mekan Bulunamadı" };
  }

  return {
    title: `${place.title} — ${place.category}`,
    description:
      place.description?.slice(0, 160) ||
      `${place.title} hakkında detaylı bilgi, fotoğraflar ve değerlendirmeler.`,
    openGraph: {
      title: `${place.title} — ${place.category}`,
      description:
        place.description?.slice(0, 160) ||
        `Ayvalık'ta keşfet: ${place.title}`,
      images: place.ogImage ? [{ url: place.ogImage }] : undefined,
    },
  };
}

// Build JSON-LD schema for place
function buildPlaceSchema(place: Record<string, unknown>) {
  const isFood = (place.category as string) === "Mekan";
  const avgRating = calculateAvgRating(place);
  const slug = (place.slug as string) || (place._id as string);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": isFood ? "LocalBusiness" : "TouristAttraction",
    name: place.title,
    description: place.description || `${place.title} — Ayvalık'ta keşfedilecek bir yer.`,
    url: `https://ayvalik-rotasi.vercel.app/mekan/${slug}`,
    isAccessibleForFree: true,
    touristType: "Leisure",
  };

  // Image
  const imageUrls = place.imageUrls as string[] | undefined;
  if (imageUrls && imageUrls.length > 0) {
    schema.image = imageUrls[0];
  }

  // Geo coordinates
  const location = place.location as { lat?: number; lng?: number } | undefined;
  if (location?.lat && location?.lng) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: location.lat,
      longitude: location.lng,
    };
    schema.address = {
      "@type": "PostalAddress",
      addressLocality: "Ayvalık",
      addressRegion: "Balıkesir",
      addressCountry: "TR",
    };
  }

  // Aggregate rating
  const voteCount = (place.voteCount as number) || 0;
  if (avgRating && avgRating > 0 && voteCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating,
      bestRating: 5,
      worstRating: 1,
      reviewCount: voteCount,
    };
  }

  return schema;
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place) {
    notFound();
  }

  const placeSchema = buildPlaceSchema(place);

  return (
    <div className="min-h-screen bg-slate-50">
      <JsonLd schema={placeSchema} />

      {/* Back Navigation */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-muted hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Haritaya Dön
        </Link>
      </div>

      {/* Place Content */}
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <PlaceDetailContent place={place} />
        </div>

        {/* Map CTA */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-aegean-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-aegean-700 transition-colors"
          >
            <Map size={16} />
            Haritada Gör
          </Link>
        </div>
      </div>
    </div>
  );
}
