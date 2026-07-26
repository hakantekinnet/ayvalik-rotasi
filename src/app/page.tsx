import { client } from "@/sanity/lib/client";
export const dynamic = 'force-dynamic';
import { LocationData } from "@/lib/types";
import { locations as staticLocations } from "@/data/locations";
import { HomeClient } from "@/components/features/HomeClient";

export interface SanityPlace {
  _id: string;
  title: string;
  category: string;
  description: string;
  imageUrls?: string[];
  location?: { lat: number; lng: number; alt?: number };
  reelUrl?: string;
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
        reelUrl
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
        };
      });
    }
  } catch (err) {
    console.warn("Sanity places fetch failed, using static data:", err);
  }

  return staticLocations;
}

export default async function HomePage() {
  const places = await getPlaces();
  const serializedPlaces = JSON.parse(JSON.stringify(places));

  return <HomeClient places={serializedPlaces} />;
}
