import { client } from "@/sanity/lib/client";
export const revalidate = 60;
import { LocationData } from "@/lib/types";
import { locations as staticLocations } from "@/data/locations";
import { HomeClient } from "@/components/features/HomeClient";
import type { CuratedRoute } from "@/components/CuratedRoutesList";

export interface SanityPlace {
  _id: string;
  title: string;
  category: string;
  description: string;
  imageUrls?: string[];
  location?: { lat: number; lng: number; alt?: number };
  reelUrl?: string;
  isOpportunity?: boolean;
  opportunityText?: string;
  opportunityCode?: string;
  voteCount?: number;
  ratingLezzet?: number;
  ratingFiyat?: number;
  ratingAtmosfer?: number;
  ratingDeniz?: number;
  ratingTemizlik?: number;
  ratingTesis?: number;
  ratingGenel?: number;
}

// Bounding box for Ayvalık region — converts GPS to map percentages
function gpsToMapPercent(lat: number, lng: number): { top: string; left: string } {
  const bounds = { north: 39.38, south: 39.28, west: 26.64, east: 26.78 };
  const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100;
  const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100;
  return {
    top: `${Math.max(0, Math.min(100, y))}%`,
    left: `${Math.max(0, Math.min(100, x))}%`,
  };
}

async function getPlaces(): Promise<LocationData[]> {
  try {
    const data: SanityPlace[] = await client.fetch(
       `*[_type == "place"]{
        _id,
        title,
        category,
        description,
        "imageUrls": images[].asset->url,
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
      }`
    );

    if (data && data.length > 0) {
      return data.map((place) => {
        const coords = place.location
          ? gpsToMapPercent(place.location.lat, place.location.lng)
          : { top: "50%", left: "50%" };

          return {
          id: place._id,
          title: place.title || "",
          category: (place.category as LocationData["category"]) || "Mekan",
          description: place.description || "",
          top: coords.top,
          left: coords.left,
          imageUrls: place.imageUrls || [],
          images: place.imageUrls || [],
          reelUrl: place.reelUrl,
          isOpportunity: place.isOpportunity,
          opportunityText: place.opportunityText,
          opportunityCode: place.opportunityCode,
          voteCount: place.voteCount || 0,
          ratingLezzet: place.ratingLezzet || 0,
          ratingFiyat: place.ratingFiyat || 0,
          ratingAtmosfer: place.ratingAtmosfer || 0,
          ratingDeniz: place.ratingDeniz || 0,
          ratingTemizlik: place.ratingTemizlik || 0,
          ratingTesis: place.ratingTesis || 0,
          ratingGenel: place.ratingGenel || 0,
        };
      });
    }
  } catch (err) {
    console.warn("Sanity places fetch failed, using static data:", err);
  }

  return staticLocations;
}

async function getCuratedRoutes(): Promise<CuratedRoute[]> {
  try {
    const data = await client.fetch<CuratedRoute[]>(
      `*[_type == "curatedRoute"]{
        _id,
        title,
        description,
        coverImage,
        "locations": locations[]->{
          _id,
          title,
          "slug": _id,
          "geopoint": location,
          isOpportunity,
          opportunityText,
          opportunityCode
        }
      }`
    );
    return data || [];
  } catch (err) {
    console.warn("Sanity curated routes fetch failed:", err);
    return [];
  }
}

export default async function HomePage() {
  const [places, curatedRoutes] = await Promise.all([
    getPlaces(),
    getCuratedRoutes(),
  ]);
  const serializedPlaces = JSON.parse(JSON.stringify(places));
  const serializedRoutes = JSON.parse(JSON.stringify(curatedRoutes));

  return (
    <HomeClient places={serializedPlaces} curatedRoutes={serializedRoutes} />
  );
}
