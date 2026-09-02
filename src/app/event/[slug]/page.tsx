import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { EditorialMeta } from "@/components/ui/EditorialMeta";
import { AddToCalendar } from "@/components/ui/AddToCalendar";
import { urlFor } from "@/sanity/lib/image";
import {
  createPageMetadata,
  truncateDescription,
  absoluteUrl,
  SITE_URL,
  SITE_NAME,
} from "@/lib/site";
import { formatDateFull, formatTime, isPastDate } from "@/utils/dateUtils";

async function getEventBySlug(slug: string) {
  const data = await client.fetch(
    `*[_type == "event" && (slug.current == $slug || _id == $slug)][0]{
      _id,
      "slug": coalesce(slug.current, _id),
      title,
      description,
      startsAt,
      endsAt,
      coverImage,
      routeEnabled,
      "location": location->{
        _id,
        title,
        "slug": coalesce(slug.current, _id),
        "geopoint": location
      },
      sourceName,
      sourceUrl,
      originalPublishedAt,
      verifiedAt,
      expiresAt,
      imageCredit,
      editorNote
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
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "Etkinlik Bulunamadı",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const eventPath = `/event/${event.slug || event._id}`;

  return createPageMetadata({
    title: event.title,
    description: truncateDescription(
      event.description || `${event.title} — Ayvalık'ta yaklaşan etkinlik.`
    ),
    path: eventPath,
    image: event.coverImage ? urlFor(event.coverImage).url() : "/og-image.png",
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <span className="text-6xl mb-6 block">🎭</span>
          <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
            Etkinlik bulunamadı
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Aradığınız etkinlik silinmiş veya taşınmış olabilir.
          </p>
          <Link
            href="/feed?tab=takvim"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F766E] text-white rounded-full font-semibold text-sm shadow-lg hover:bg-[#0d6b63] transition-colors"
          >
            <ArrowLeft size={16} />
            Etkinliklere Dön
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = event.coverImage
    ? urlFor(event.coverImage).url()
    : "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1000&q=80";

  const formattedDate = formatDateFull(event.startsAt) || "";
  const formattedTime = formatTime(event.startsAt) || "";
  const formattedEndTime = formatTime(event.endsAt);
  const eventIsPast = isPastDate(event.endsAt || event.startsAt);

  // JSON-LD structured data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventJsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startsAt,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: eventIsPast
      ? "https://schema.org/EventCompleted"
      : "https://schema.org/EventScheduled",
    image: imageUrl,
    url: absoluteUrl(`/event/${event.slug || event._id}`),
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
  if (event.endsAt) eventJsonLd.endDate = event.endsAt;
  if (event.description) eventJsonLd.description = event.description;
  if (event.location) {
    eventJsonLd.location = {
      "@type": "Place",
      name: event.location.title,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ayvalık",
        addressRegion: "Balıkesir",
        addressCountry: "TR",
      },
    };
    if (event.location.geopoint?.lat && event.location.geopoint?.lng) {
      eventJsonLd.location.geo = {
        "@type": "GeoCoordinates",
        latitude: event.location.geopoint.lat,
        longitude: event.location.geopoint.lng,
      };
    }
  }

  // WhatsApp share message
  const shareMessage = [
    `🎭 ${event.title}`,
    `📅 ${formattedDate} ${formattedTime}`,
    event.location ? `📍 ${event.location.title}` : "",
    "",
    "Detaylar için:",
    absoluteUrl(`/event/${event.slug || event._id}`),
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Hero Image */}
      <div className="relative w-full h-72 overflow-hidden">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 900px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back Button */}
        <Link
          href="/feed?tab=takvim"
          className="absolute top-6 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={16} />
          Etkinliklere Dön
        </Link>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-white text-2xl font-extrabold leading-tight mb-2">
            {event.title}
          </h1>
          <div className="flex items-center gap-4 text-white/70">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span className="text-xs font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span className="text-xs font-medium">
                {formattedTime}
                {formattedEndTime && ` – ${formattedEndTime}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="px-5 py-8 max-w-2xl mx-auto">
        {/* Location badge */}
        {event.location && (
          <Link
            href={`/mekan/${event.location.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm text-sm font-semibold text-slate-700 hover:shadow-md hover:border-aegean-200 transition-all mb-6"
          >
            <MapPin size={16} className="text-aegean-500" />
            {event.location.title}
            <span className="text-[10px] text-aegean-500 font-bold ml-1">
              Mekanı Gör →
            </span>
          </Link>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-base text-gray-700 leading-relaxed border-l-4 border-[#0F766E] pl-4 mb-6">
            {event.description}
          </p>
        )}

        {/* Expired banner + Editor's Note */}
        <EditorialMeta
          expiresAt={event.expiresAt}
          editorNote={event.editorNote}
          expiredLabel="Bu etkinlik"
        />

        {/* Event Info Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            Etkinlik Detayları
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Calendar size={16} className="text-aegean-500" />
              <span className="font-semibold">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Clock size={16} className="text-aegean-500" />
              <span className="font-semibold">
                {formattedTime}
                {formattedEndTime && ` – ${formattedEndTime}`}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <MapPin size={16} className="text-aegean-500" />
                <span className="font-semibold">{event.location.title}</span>
              </div>
            )}
          </div>
          {/* Add to Calendar */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <AddToCalendar
              title={event.title}
              description={event.description}
              startsAt={event.startsAt}
              endsAt={event.endsAt}
              location={event.location?.title}
            />
          </div>
        </div>

        {/* Source & Credits Footer */}
        <EditorialMeta
          sourceName={event.sourceName}
          sourceUrl={event.sourceUrl}
          originalPublishedAt={event.originalPublishedAt}
          verifiedAt={event.verifiedAt}
          imageCredit={event.imageCredit}
        />

        {/* WhatsApp Share */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-[#25D366]/25 hover:scale-[1.02] active:scale-95 transition-transform"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp&apos;ta Paylaş
          </a>
        </div>

        {/* Back CTA */}
        <div className="mt-6">
          <Link
            href="/feed?tab=etkinlikler"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F766E] text-white rounded-full font-semibold text-sm shadow-lg hover:bg-[#0d6b63] transition-colors active:scale-95"
          >
            <ArrowLeft size={16} />
            Etkinliklere Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
