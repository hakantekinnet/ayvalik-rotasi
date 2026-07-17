"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, Play, ExternalLink, Upload } from "lucide-react";
import Image from "next/image";
import { LocationData } from "@/lib/types";

interface LocationCardProps {
  location: LocationData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LocationCard({ location, isOpen, onClose }: LocationCardProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  // Reset carousel position when location changes
  const handleExitComplete = () => {
    setActiveImageIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  };

  // Track active image via scroll position
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.offsetWidth * 0.85 + 12; // 85% width + 12px gap
    const index = Math.round(scrollLeft / itemWidth);
    setActiveImageIndex(index);
  }, []);

  // Reset index when location changes while open
  useEffect(() => {
    setActiveImageIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [location?.id]);

  const categoryColors: Record<string, string> = {
    Plaj: "bg-aegean-100 text-aegean-700",
    Tarihi: "bg-amber-100 text-amber-700",
    Manzara: "bg-purple-100 text-purple-700",
    Mekan: "bg-orange-100 text-orange-700",
  };

  // Build the Instagram redirect URL — accepts both reel URLs and profile URLs
  const getInstagramRedirectUrl = (url: string): string => {
    if (url.startsWith("http")) return url;
    return `https://www.instagram.com${url}`;
  };

  const hasImages = location?.images && location.images.length > 0;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isOpen && location && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 z-[70] w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] max-h-[85vh] overflow-hidden pointer-events-auto"
          >
            {/* Drag Handle — only this area triggers drag-to-dismiss */}
            <div className="w-full flex justify-center pt-4 pb-3 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            >
              <X size={18} className="text-foreground-muted" />
            </button>

            {/* Scrollable Content — Safe Zone */}
            <div
              className="max-h-[75vh] overflow-y-auto touch-pan-y overscroll-contain px-5 pb-12"
              onPointerDownCapture={(e) => e.stopPropagation()}
            >
              {/* Category Badge */}
              <div className="mb-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    categoryColors[location.category] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {location.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">
                {location.title}
              </h2>

              {/* Image Gallery Carousel */}
              {hasImages && (
                <div className="mb-4">
                  <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex w-full overflow-x-auto snap-x snap-mandatory gap-3 hide-scrollbar"
                  >
                    {location.images!.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative w-[85%] flex-shrink-0 aspect-[4/3] rounded-2xl snap-center overflow-hidden shadow-sm border border-gray-100"
                      >
                        <Image
                          src={src}
                          alt={`${location.title} - ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 85vw, 400px"
                          className="object-cover"
                          loading={idx === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Dot Indicators */}
                  {location.images!.length > 1 && (
                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      {location.images!.map((_, idx) => (
                        <div
                          key={idx}
                          className={`rounded-full transition-all duration-300 ${
                            idx === activeImageIndex
                              ? "w-5 h-1.5 bg-aegean-500"
                              : "w-1.5 h-1.5 bg-gray-300"
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
                        {location.title}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-foreground-muted text-sm leading-relaxed mb-6">
                {location.description}
              </p>

              {/* Community Photo Upload — Benim Kadrajım */}
              <div className="mt-2 border-t border-gray-100 pt-6 mb-6">
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                  📸 Benim Kadrajım
                </h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  Bu mekanda çektiğin en güzel kareyi yükle, Ayvalık Rotası
                  topluluğuyla ve Instagram sayfamızda yer alma şansını yakala!
                </p>
                <div className="w-full border-2 border-dashed border-[#0F766E]/40 bg-[#0F766E]/5 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[#0F766E]/10 transition-all duration-300 active:scale-95 group">
                  <div className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform">
                    <Upload size={24} className="text-[#0F766E]" />
                  </div>
                  <span className="text-[#0F766E] font-bold text-base">
                    Fotoğraf Seç veya Sürükle
                  </span>
                  <span className="text-xs text-gray-500 mt-2 font-medium">
                    Maksimum 5MB (JPEG, PNG)
                  </span>
                </div>
              </div>

              {/* CTA Button — Premium Instagram Reels */}
              <motion.a
                href={location.reelsUrl ? getInstagramRedirectUrl(location.reelsUrl) : "#"}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-aegean-500 via-aegean-600 to-aegean-700 text-white rounded-2xl font-semibold text-sm shadow-xl shadow-aegean-600/30 hover:shadow-aegean-600/50 transition-all duration-300 overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="relative flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm">
                    <Play size={16} fill="white" className="ml-0.5" />
                  </div>
                  <span>Instagram Reels&apos;de İzle</span>
                  <ExternalLink size={14} className="opacity-60" />
                </div>
              </motion.a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
