import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Map } from "lucide-react";
import { PlaceDetailContent } from "@/components/ui/PlaceDetailContent";

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
      title: `${place.title} | Ayvalık Rotası`,
      description:
        place.description?.slice(0, 160) ||
        `Ayvalık'ta keşfet: ${place.title}`,
      images: place.ogImage ? [{ url: place.ogImage }] : undefined,
    },
  };
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

  return (
    <div className="min-h-screen bg-slate-50">
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
