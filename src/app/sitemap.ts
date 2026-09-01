import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ayvalik-rotasi.vercel.app";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/feed`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/vote`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/rotam`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  ];

  // Dynamic place pages
  let placePages: MetadataRoute.Sitemap = [];
  try {
    const places = await client.fetch<{ slug: string; _updatedAt: string }[]>(
      `*[_type == "place"]{ "slug": coalesce(slug.current, _id), _updatedAt }`
    );
    placePages = places.map((p) => ({
      url: `${baseUrl}/mekan/${p.slug}`,
      lastModified: new Date(p._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Sanity may be unreachable during build
  }

  // Dynamic event pages
  let eventPages: MetadataRoute.Sitemap = [];
  try {
    const events = await client.fetch<{ slug: string; _updatedAt: string }[]>(
      `*[_type == "event"]{ "slug": coalesce(slug.current, _id), _updatedAt }`
    );
    eventPages = events.map((e) => ({
      url: `${baseUrl}/event/${e.slug}`,
      lastModified: new Date(e._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Sanity may be unreachable during build
  }

  return [...staticPages, ...placePages, ...eventPages];
}
