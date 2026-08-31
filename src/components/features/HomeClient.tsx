"use client";

import { useState, useMemo } from "react";
import { Search, X, MapPin } from "lucide-react";
import Link from "next/link";
import { MapView } from "@/components/features/MapView";
import { WindWidget } from "@/components/features/WindWidget";
import { LocationData } from "@/lib/types";
import {
  CuratedRoutesList,
  CuratedRoute,
} from "@/components/CuratedRoutesList";

const regions = ["Merkez", "Cunda", "Sarımsaklı", "Küçükköy", "Altınova", "Şeytan Sofrası"];

const categoryEmojis: Record<string, string> = {
  Plaj: "🏖️",
  Tarihi: "🏛️",
  Manzara: "📸",
  Mekan: "🍽️",
  Eğlence: "🎭",
};

interface HomeClientProps {
  places: LocationData[];
  curatedRoutes?: CuratedRoute[];
}

export function HomeClient({ places, curatedRoutes = [] }: HomeClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryClick = (category: string) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  const handleRegionClick = (region: string) => {
    setActiveRegion((prev) => (prev === region ? null : region));
  };

  // Count per region (for chips)
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of regions) {
      counts[r] = places.filter((p) => p.region === r).length;
    }
    return counts;
  }, [places]);

  // Search results for peek dropdown (max 5)
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q.length < 2) return [];
    return places
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.region?.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [places, searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Mobile Header — hidden on desktop (DesktopHeader handles it) */}
      <header className="px-5 pt-12 pb-5 lg:hidden">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-aegean-400 to-aegean-600 flex items-center justify-center shadow-md shadow-aegean-500/20">
            <span className="text-white text-sm font-bold">AR</span>
          </div>
          <div>

            <h1 className="font-heading text-xl font-extrabold text-foreground tracking-tight">
              Ayvalık Rotası
            </h1>
            <p className="text-xs text-foreground-muted -mt-0.5">
              Ege&apos;nin incisini keşfet
            </p>
          </div>
        </div>
      </header>

      {/* Desktop: 2-column split layout | Mobile: vertical stack */}
      <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,2fr)_360px] lg:gap-6 lg:pt-6">
        {/* ── Left Column: Map ── */}
        <section className="px-4 lg:px-0 relative">
          {/* WindWidget: absolute over map on mobile, hidden on desktop */}
          <div className="lg:hidden">
            <WindWidget />
          </div>
          <MapView
            activeCategory={activeCategory}
            activeRegion={activeRegion}
            searchQuery={searchQuery}
            places={places}
          />
        </section>

        {/* ── Right Column: Sidebar ── */}
        <aside className="lg:pt-0">
          {/* WindWidget: in sidebar flow on desktop, hidden on mobile */}
          <div className="hidden lg:block mb-4">
            <WindWidget />
          </div>

          {/* Search Bar */}
          <section className="px-5 lg:px-0 mb-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Mekan veya bölge ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-aegean-500/20 focus:border-aegean-500 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Aramayı temizle"
                >
                  <X size={14} className="text-gray-400" />
                </button>
              )}

              {/* Search Results Peek Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-100 shadow-xl z-40 overflow-hidden">
                  {searchResults.map((place) => (
                    <Link
                      key={place.id}
                      href={`/mekan/${place.slug || place.id}`}
                      onClick={() => setSearchQuery("")}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-gray-50 last:border-b-0"
                    >
                      <span className="text-lg flex-shrink-0">
                        {categoryEmojis[place.category] || "📍"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {place.title}
                        </p>
                        {place.region && (
                          <p className="text-[10px] text-slate-400 font-medium">
                            {place.region}
                          </p>
                        )}
                      </div>
                      <MapPin size={14} className="text-slate-300 flex-shrink-0" />
                    </Link>
                  ))}
                  {searchQuery.trim().length >= 2 && (
                    <div className="px-4 py-2 bg-slate-50 text-[10px] text-slate-400 font-medium text-center">
                      {searchResults.length} sonuç · Haritada da filtrelendi
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Region Chips */}
          <section className="px-5 lg:px-0 mb-5">
            <h2 className="font-heading text-sm font-bold text-foreground-muted uppercase tracking-wider mb-2.5">
              Bölge
            </h2>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => handleRegionClick(region)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                    activeRegion === region
                      ? "bg-aegean-500 text-white border-aegean-500 shadow-sm shadow-aegean-500/25"
                      : "bg-white text-gray-600 border-gray-200 hover:border-aegean-300 hover:text-aegean-700"
                  }`}
                >
                  {region}
                  {regionCounts[region] > 0 && (
                    <span
                      className={`ml-1.5 text-[10px] ${
                        activeRegion === region
                          ? "text-white/70"
                          : "text-gray-400"
                      }`}
                    >
                      {regionCounts[region]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Quick Discovery */}
          <section className="px-5 py-6 lg:px-0 lg:py-0 lg:mb-6">
            <h2 className="font-heading text-sm font-bold text-foreground-muted uppercase tracking-wider mb-3">
              Hızlı Keşif
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: "🏖️", label: "Plajlar", category: "Plaj", count: "12" },
                { emoji: "🏛️", label: "Tarihi", category: "Tarihi", count: "8" },
                { emoji: "🌅", label: "Manzara", category: "Manzara", count: "6" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleCategoryClick(item.category)}
                  className={`rounded-xl border p-3 text-center transition-all duration-300 cursor-pointer ${
                    activeCategory === item.category
                      ? "bg-aegean-50 border-aegean-400 shadow-md shadow-aegean-500/15 ring-1 ring-aegean-400/50"
                      : "bg-card-bg border-card-border hover:shadow-sm"
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <p
                    className={`text-xs font-semibold mt-1 transition-colors duration-300 ${
                      activeCategory === item.category
                        ? "text-aegean-700"
                        : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-[10px] text-foreground-muted">
                    {item.count} nokta
                  </p>
                </button>
              ))}
            </div>

            {/* Curated Routes from Sanity */}
            <CuratedRoutesList routes={curatedRoutes} />
          </section>
        </aside>
      </div>
    </div>
  );
}
