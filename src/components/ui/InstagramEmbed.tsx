"use client";

interface InstagramEmbedProps {
  url: string;
}

/**
 * Cleans a raw Instagram URL for embedding:
 * 1. Strips query parameters (?igsh=..., ?utm_source=..., etc.)
 * 2. Ensures a trailing slash
 * 3. Appends /embed/ if not already present
 *
 * Example:
 *   "https://www.instagram.com/reel/XYZ/?igsh=123"
 *   → "https://www.instagram.com/reel/XYZ/embed/"
 */
function cleanInstagramUrl(rawUrl: string): string {
  // Strip query params and hash
  const url = new URL(rawUrl);
  let path = url.origin + url.pathname;

  // Ensure trailing slash
  if (!path.endsWith("/")) path += "/";

  // Strip existing /embed/ to avoid duplication, then re-add
  path = path.replace(/\/embed\/$/, "/");

  return path + "embed/";
}

export function InstagramEmbed({ url }: InstagramEmbedProps) {
  const embedUrl = cleanInstagramUrl(url);

  return (
    <iframe
      src={embedUrl}
      className="w-full aspect-[9/16] max-w-sm mx-auto rounded-xl border border-gray-200 overflow-hidden"
      allow="encrypted-media"
      scrolling="no"
      frameBorder="0"
      loading="lazy"
      title="Instagram Reel"
    />
  );
}
