"use client";

import { useState } from "react";
import { MapView } from "@/components/features/MapView";
import { WindWidget } from "@/components/features/WindWidget";
import { LocationData } from "@/lib/types";
import {
  CuratedRoutesList,
  CuratedRoute,
} from "@/components/CuratedRoutesList";

interface HomeClientProps {
  places: LocationData[];
  curatedRoutes?: CuratedRoute[];
}

export function HomeClient({ places, curatedRoutes = [] }: HomeClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  };

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
          <MapView activeCategory={activeCategory} places={places} />
        </section>

        {/* ── Right Column: Sidebar (desktop only becomes side, stacks below on mobile) ── */}
        <aside className="lg:pt-0">
          {/* WindWidget: in sidebar flow on desktop, hidden on mobile */}
          <div className="hidden lg:block mb-4">
            <WindWidget />
          </div>

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
