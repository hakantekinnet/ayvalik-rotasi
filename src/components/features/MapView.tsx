"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Crosshair, Loader2 } from "lucide-react";
import { LocationData } from "@/lib/types";

// Gold pin helper — calculates average score across category criteria
const calculateAverageScore = (loc: LocationData) => {
  if (!loc.voteCount || loc.voteCount === 0) return 0;

  if (loc.category === "Mekan") {
    const total = (loc.ratingLezzet || 0) + (loc.ratingFiyat || 0) + (loc.ratingAtmosfer || 0);
    return total / (loc.voteCount * 3);
  }
  if (loc.category === "Plaj") {
    const total = (loc.ratingDeniz || 0) + (loc.ratingTemizlik || 0) + (loc.ratingTesis || 0);
    return total / (loc.voteCount * 3);
  }
  return (loc.ratingGenel || 0) / loc.voteCount;
};

interface MapViewProps {
  activeCategory?: string | null;
  activeRegion?: string | null;
  searchQuery?: string;
  places?: LocationData[];
}

const categories = ["Tümü", "🏖️ Plajlar", "🏛️ Tarih", "🍽️ Lezzet", "📸 Manzara"];

const categoryMap: Record<string, string | null> = {
  "Tümü": null,
  "🏖️ Plajlar": "Plaj",
  "🏛️ Tarih": "Tarihi",
  "🍽️ Lezzet": "Mekan",
  "📸 Manzara": "Manzara",
};

export function MapView({ activeCategory = null, activeRegion = null, searchQuery = "", places = [] }: MapViewProps) {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{ top: string; left: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tümü");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Placeholder: convert real GPS coordinates to map percentages
  const mapGpsToPixels = (lat: number, lng: number): { top: string; left: string } => {
    const bounds = {
      north: 39.38,
      south: 39.28,
      west: 26.64,
      east: 26.78,
    };
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100;
    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100;
    return {
      top: `${Math.max(0, Math.min(100, y))}%`,
      left: `${Math.max(0, Math.min(100, x))}%`,
    };
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Tarayıcınız konum özelliğini desteklemiyor.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapped = mapGpsToPixels(latitude, longitude);
        setUserLocation(mapped);
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Konum alınamadı. Lütfen konum izni verdiğinizden emin olun.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Auto-center the scrollable map on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth, scrollHeight, clientHeight } = scrollContainerRef.current;
      const scrollLeft = (scrollWidth - clientWidth) / 2;
      const scrollTop = (scrollHeight - clientHeight) / 2;

      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({ left: scrollLeft, top: scrollTop, behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const handlePinClick = (location: LocationData) => {
    const slug = location.slug || location.id;
    router.push(`/mekan/${slug}`, { scroll: false });
  };

  // ── Combined filtering: Category (local bar OR parent) + Region + Search ──
  const filteredLocations = useMemo(() => {
    const effectiveCategory = categoryMap[activeFilter] ?? activeCategory;
    const query = searchQuery.toLowerCase().trim();

    return places.filter((location) => {
      // Category filter
      if (effectiveCategory && location.category !== effectiveCategory) return false;
      // Region filter
      if (activeRegion && location.region !== activeRegion) return false;
      // Search filter
      if (query) {
        const matchesTitle = location.title.toLowerCase().includes(query);
        const matchesDesc = location.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }
      return true;
    });
  }, [places, activeFilter, activeCategory, activeRegion, searchQuery]);

  return (
    <div className="relative w-full">
      {/* Floating Category Filter Bar */}
      <div
        className="absolute top-6 left-0 w-full z-[60] overflow-x-auto touch-pan-x pointer-events-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        <div className="flex gap-2 w-max px-4 pb-2 pr-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap shadow-sm backdrop-blur-md transition-all duration-300 ease-out border ${
                activeFilter === cat
                  ? "bg-[#0F766E]/90 text-white border-transparent scale-105"
                  : "bg-white/70 text-gray-700 border-white/60 hover:bg-white/90 active:scale-95"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Outer Window — scrollable viewport */}
      <div ref={scrollContainerRef} className="relative w-full max-w-4xl mx-auto h-[50vh] max-h-[500px] lg:h-[calc(100vh-5rem)] lg:max-h-none lg:sticky lg:top-20 rounded-3xl overflow-auto shadow-xl border border-white/20 touch-pan-x touch-pan-y hide-scrollbar">
        {/* Inner Canvas — larger than viewport to enable panning */}
        <div className="relative w-[200%] md:w-[150%] lg:w-full aspect-[3/4] min-h-full">
          {/* Map Image */}
          <img
            src="/ayvalik-harita-final.png"
            alt="Stilize Ayvalık Haritası Final"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Dynamic Map Pins — percentage-based, pan with canvas */}
          <AnimatePresence>
            {filteredLocations.map((location, index) => {
              const avgScore = calculateAverageScore(location);
              const isGold = avgScore >= 4.5 && (location.voteCount || 0) >= 5;

              return (
              <motion.button
                key={location.id}
                initial={{ scale: 0, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: -10 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.05 + index * 0.06,
                }}
                whileHover={{ scale: 1.2, y: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePinClick(location)}
                className="absolute group"
                style={{
                  left: location.left,
                  top: location.top,
                  transform: "translate(-50%, -100%)",
                }}
              >
                {/* Pin Shadow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 rounded-full blur-[2px]" />
                {/* Pin */}
                <div className="relative">
                  <MapPin
                    size={28}
                    className={isGold ? "text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" : "text-aegean-600 drop-shadow-lg"}
                    fill={isGold ? "#F59E0B" : "#0891B2"}
                    strokeWidth={1.5}
                    stroke="white"
                  />
                  {/* Pulse ring */}
                  <motion.div
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: index * 0.4,
                    }}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${isGold ? "bg-amber-400" : "bg-aegean-400"}`}
                  />
                  {/* Gold Badge */}
                  {isGold && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center shadow-sm border border-white">
                      <span className="text-[8px]">⭐</span>
                    </div>
                  )}
                </div>
                {/* Tooltip */}
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg shadow-lg text-[10px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${isGold ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-white/95 text-foreground"}`}>
                  {isGold && <span className="mr-0.5">⭐</span>}{location.title}
                </div>
              </motion.button>
              );
            })}
          </AnimatePresence>

          {/* User Location Dot */}
          {userLocation && (
            <div
              className="absolute z-50 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"
              style={{
                top: userLocation.top,
                left: userLocation.left,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="absolute inset-0 w-full h-full bg-blue-400 rounded-full animate-ping opacity-50" />
              <div className="absolute inset-0 w-full h-full bg-blue-500 rounded-full animate-pulse" />
            </div>
          )}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 glass rounded-xl px-3 py-2 shadow-md">
            <p className="text-[10px] text-foreground-muted font-medium">
              📍 {filteredLocations.length} / {places.length} nokta
            </p>
          </div>
        </div>
      </div>

      {/* Locate Me FAB — floats over the map viewport */}
      <button
        onClick={handleLocateMe}
        disabled={isLocating}
        className="absolute bottom-6 right-6 z-[60] bg-white text-gray-800 font-medium py-3 px-5 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 active:scale-95 transition-transform"
      >
        {isLocating ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Crosshair size={16} />
        )}
        {isLocating ? "Aranıyor…" : "📍 Konum"}
      </button>

    </div>
  );
}
