"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { LocationData } from "@/lib/types";

interface LocationCardProps {
  location: LocationData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LocationCard({ location, isOpen, onClose }: LocationCardProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
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

  const hasImages = location?.images && location.images.length > 0;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const file = e.target.files[0];
    try {
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        { method: "POST", body: file }
      );
      if (!response.ok) throw new Error("Upload failed");
      alert("Fotoğraf efsane duruyor! Başarıyla yüklendi.");
    } catch {
      alert("Yükleme sırasında bir hata oluştu. Lütfen tekrar dene.");
    } finally {
      setIsUploading(false);
    }
  };

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
                <label
                  className={`w-full border-2 border-dashed border-[#0F766E]/40 bg-[#0F766E]/5 rounded-3xl p-6 flex flex-col items-center justify-center transition-all duration-300 ${
                    isUploading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-[#0F766E]/10 active:scale-95 group"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={isUploading}
                  />
                  <div className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform">
                    {isUploading ? (
                      <Loader2 size={24} className="text-[#0F766E] animate-spin" />
                    ) : (
                      <Upload size={24} className="text-[#0F766E]" />
                    )}
                  </div>
                  <span className="text-[#0F766E] font-bold text-base">
                    {isUploading ? "Yükleniyor..." : "Fotoğraf Seç veya Sürükle"}
                  </span>
                  <span className="text-xs text-gray-500 mt-2 font-medium">
                    Maksimum 5MB (JPEG, PNG)
                  </span>
                </label>
              </div>

              {/* Instagram Reels Embed */}
              {location.reelUrl && (
                <div className="mt-2 border-t border-gray-100 pt-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-pink-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
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
                        location.reelUrl.endsWith("embed")
                          ? location.reelUrl
                          : `${location.reelUrl}embed`
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
