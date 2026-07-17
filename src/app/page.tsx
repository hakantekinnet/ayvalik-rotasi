"use client";

import { useState } from "react";
import { MapView } from "@/components/features/MapView";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-5 pt-12 pb-5">
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

      {/* Map Section */}
      <section className="px-4">
        <MapView activeCategory={activeCategory} />
      </section>

      {/* Quick Info */}
      <section className="px-5 py-6">
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
      </section>
    </div>
  );
}
