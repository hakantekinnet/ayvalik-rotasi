import type { Metadata } from "next";

export const SITE_NAME = "Ayvalık Rotası";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://ayvalikrotasi.com"
).replace(/\/$/, "");

export const SITE_DESCRIPTION =
  "Ayvalık, Cunda ve çevresindeki mekanları keşfedin, kendi rotanızı oluşturun ve güncel etkinlikleri takip edin.";

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = "/og-image.png",
  type = "website",
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },

    openGraph: {
      type,
      locale: "tr_TR",
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },
  };
}

export function truncateDescription(
  text: string,
  maxLength = 155,
) {
  const cleanText = text.replace(/\s+/g, " ").trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  const shortened = cleanText.slice(0, maxLength);
  const lastSpace = shortened.lastIndexOf(" ");

  return `${shortened.slice(0, lastSpace)}…`;
}
