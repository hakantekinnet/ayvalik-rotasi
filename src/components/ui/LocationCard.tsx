"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, Play, ExternalLink } from "lucide-react";
import { Location } from "@/lib/types";

interface LocationCardProps {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LocationCard({ location, isOpen, onClose }: LocationCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  // Reset image state when location changes
  const handleOpen = () => {
    setImageLoaded(false);
    setImageError(false);
  };

  const categoryLabels: Record<string, string> = {
    beach: "Plaj",
    historic: "Tarihi",
    nature: "Doğa",
    food: "Yeme-İçme",
    viewpoint: "Manzara",
  };

  const categoryColors: Record<string, string> = {
    beach: "bg-aegean-100 text-aegean-700",
    historic: "bg-amber-100 text-amber-700",
    nature: "bg-olive-100 text-olive-700",
    food: "bg-orange-100 text-orange-700",
    viewpoint: "bg-purple-100 text-purple-700",
  };

  // Build the Instagram redirect URL — accepts both reel URLs and profile URLs
  const getInstagramRedirectUrl = (url: string): string => {
    // If it's already a full URL, use it directly
    if (url.startsWith("http")) return url;
    // If it's a relative path like /reel/ABC123, prepend instagram.com
    return `https://www.instagram.com${url}`;
  };

  return (
    <AnimatePresence onExitComplete={handleOpen}>
      {isOpen && location && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-50"
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
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            >
              <X size={18} className="text-foreground-muted" />
            </button>

            <div className="px-5 pb-8 overflow-y-auto">
              {/* Image with Skeleton Loader */}
              <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-4 bg-gray-100">
                {/* Skeleton loader — shown while image loads */}
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-[skeleton_1.5s_ease-in-out_infinite]" />
                  </div>
                )}

                {/* Error fallback — shown when image fails */}
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-aegean-50 to-aegean-100">
                    <div className="text-center">
                      <span className="text-3xl mb-1 block">📷</span>
                      <span className="text-xs text-aegean-600 font-medium">
                        {location.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actual Image — Next.js optimized */}
                {!imageError && (
                  <Image
                    src={location.image}
                    alt={location.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className={`object-cover transition-opacity duration-500 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    priority
                  />
                )}
              </div>

              {/* Category Badge */}
              <div className="mb-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    categoryColors[location.category] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {categoryLabels[location.category] || location.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">
                {location.name}
              </h2>

              {/* Description */}
              <p className="text-foreground-muted text-sm leading-relaxed mb-6">
                {location.description}
              </p>

              {/* CTA Button — Dynamic Instagram URL */}
              <motion.a
                href={getInstagramRedirectUrl(location.instagramUrl)}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-3 w-full py-3.5 px-6 bg-gradient-to-r from-aegean-500 to-aegean-600 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-aegean-500/25 hover:shadow-aegean-500/40 transition-shadow"
              >
                <Play size={18} fill="white" />
                Instagram Reels&apos;de İzle
                <ExternalLink size={14} className="opacity-60" />
              </motion.a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
