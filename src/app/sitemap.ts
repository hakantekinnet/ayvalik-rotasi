import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { client } from "@/sanity/lib/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic content in parallel
  const [news, events, places] = await Promise.all([
    client
      .fetch<{ slug: string; _updatedAt: string }[]>(
        `*[_type == "news"]{ "slug": _id, _updatedAt }`
      )
      .catch(() => []),
    client
      .fetch<{ slug: string; _updatedAt: string }[]>(
        `*[_type == "event"]{ "slug": coalesce(slug.current, _id), _updatedAt }`
      )
      .catch(() => []),
    client
      .fetch<{ slug: string; _updatedAt: string }[]>(
        `*[_type == "place"]{ "slug": _id, _updatedAt }`
      )
      .catch(() => []),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/feed"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/vote"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
    url: absoluteUrl(`/news/${item.slug}`),
    lastModified: item._updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: absoluteUrl(`/event/${event.slug}`),
    lastModified: event._updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const placePages: MetadataRoute.Sitemap = places.map((place) => ({
    url: absoluteUrl(`/mekan/${place.slug}`),
    lastModified: place._updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...newsPages,
    ...eventPages,
    ...placePages,
  ];
}
