"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { MapPin, Check } from "lucide-react";
import { useRouteStore } from "@/store/useRouteStore";
import LocationRating from "@/components/LocationRating";

interface PlaceData {
  _id: string;
  slug?: string;
  title: string;
  category: string;
  description?: string;
  imageUrls?: string[];
  reelUrl?: string;
  isOpportunity?: boolean;
  opportunityText?: string;
  opportunityCode?: string;
  voteCount?: number;
}

interface PlaceDetailContentProps {
  place: PlaceData;
}

const categoryColors: Record<string, string> = {
  Plaj: "bg-aegean-100 text-aegean-700",
  Tarihi: "bg-amber-100 text-amber-700",
  Manzara: "bg-purple-100 text-purple-700",
  Mekan: "bg-orange-100 text-orange-700",
  Eğlence: "bg-pink-100 text-pink-700",
};

export function PlaceDetailContent({ place }: PlaceDetailContentProps) {
  const { routeList, addToRoute, removeFromRoute } = useRouteStore();
  const isAdded = routeList.some((item) => item._id === place._id);
  const hasImages = place.imageUrls && place.imageUrls.length > 0;
  const imageCount = place.imageUrls?.length || 0;

  // Carousel active index tracking via IntersectionObserver
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setSlideRef = useCallback(
    (el: HTMLDivElement | null, idx: number) => {
      slideRefs.current[idx] = el;
    },
    []
  );

  useEffect(() => {
    if (!hasImages || imageCount <= 1) return;

    const observers: IntersectionObserver[] = [];
    slideRefs.current.forEach((el, idx) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveImageIndex(idx);
          }
        },
        { threshold: 0.6 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [hasImages, imageCount]);

  const handleRouteToggle = () => {
    if (isAdded) {
      removeFromRoute(place._id);
    } else {
      addToRoute({
        _id: place._id,
        title: place.title,
        slug: place.slug || place._id,
        isOpportunity: place.isOpportunity,
        opportunityText: place.opportunityText,
        opportunityCode: place.opportunityCode,
      });
    }
  };

  return (
    <div className="p-6">
      {/* Category Badge */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            categoryColors[place.category] || "bg-gray-100 text-gray-600"
          }`}
        >
          {place.category}
        </span>
        {place.isOpportunity && place.opportunityText && (
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-md">
            🎁 {place.opportunityText}
            {place.opportunityCode && (
              <span className="ml-0.5 opacity-90">
                · Kod: {place.opportunityCode}
              </span>
            )}
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="font-editorial text-2xl font-bold text-foreground mb-4">
        {place.title}
      </h2>

      {/* Image Gallery with Dot Indicators */}
      {hasImages && (
        <div className="mb-4">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 hide-scrollbar">
            {place.imageUrls!.map((src, idx) => (
              <div
                key={idx}
                ref={(el) => setSlideRef(el, idx)}
                className="relative w-full flex-shrink-0 aspect-[4/3] rounded-2xl snap-center overflow-hidden shadow-sm border border-gray-100"
              >
                <Image
                  src={src}
                  alt={`${place.title} - ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover object-center"
                  loading={idx === 0 ? "eager" : "lazy"}
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>

          {/* Dot Indicators */}
          {imageCount > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {place.imageUrls!.map((_, idx) => (
                <div
                  key={idx}
                  className={`rounded-full transition-all duration-300 ${
                    idx === activeImageIndex
                      ? "w-5 h-2 bg-aegean-500"
                      : "w-2 h-2 bg-slate-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fallback when no images */}
      {!hasImages && (
        <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-aegean-50 to-aegean-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl mb-1 block">📷</span>
              <span className="text-xs text-aegean-600 font-medium">
                {place.title}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {place.description && (
        <p className="text-foreground-muted text-sm leading-relaxed mb-5">
          {place.description}
        </p>
      )}

      {/* Route Toggle */}
      <button
        onClick={handleRouteToggle}
        className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 active:scale-[0.97] mb-6 ${
          isAdded
            ? "bg-[#0F766E] text-white shadow-lg shadow-[#0F766E]/25"
            : "bg-white text-[#0F766E] border-2 border-[#0F766E]/30 hover:border-[#0F766E] hover:bg-[#0F766E]/5"
        }`}
      >
        {isAdded ? (
          <>
            <Check size={18} strokeWidth={3} />
            Rotaya Eklendi
          </>
        ) : (
          <>
            <MapPin size={18} strokeWidth={2.5} />
            Rotaya Ekle
          </>
        )}
      </button>

      {/* Rating */}
      {place._id && place.category && (
        <LocationRating
          locationId={place._id}
          category={place.category}
          currentVoteCount={place.voteCount || 0}
        />
      )}

      {/* Instagram Reel */}
      {place.reelUrl && (
        <div className="mt-4 border-t border-gray-100 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">
              @ayvalik&apos;tan İncele
            </h3>
          </div>
          <div className="w-full relative rounded-2xl overflow-hidden bg-gray-50 shadow-inner flex justify-center items-center">
            <iframe
              src={
                place.reelUrl.endsWith("embed")
                  ? place.reelUrl
                  : `${place.reelUrl}embed`
              }
              width="100%"
              height="580"
              frameBorder="0"
              scrolling="no"
              allowTransparency={true}
              className="w-full max-w-[400px] rounded-2xl shadow-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
