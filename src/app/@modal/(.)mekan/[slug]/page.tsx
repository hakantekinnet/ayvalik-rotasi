import { client } from "@/sanity/lib/client";
import { PlaceModal } from "@/components/ui/PlaceModal";
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
      ratingGenel,
      recommendedDuration,
      visitHours,
      feeInfo,
      parkingInfo,
      publicTransport,
      accessibility,
      childFriendly,
      seasonalNote,
      lastVerified,
      officialSource
    }`,
    { slug }
  );
  return data;
}

export default async function InterceptedPlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place) {
    return null;
  }

  return (
    <PlaceModal>
      <PlaceDetailContent place={place} />
    </PlaceModal>
  );
}
