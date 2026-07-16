import { MapView } from "@/components/features/MapView";

export default function HomePage() {
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
        <MapView />
      </section>

      {/* Quick Info */}
      <section className="px-5 py-6">
        <h2 className="font-heading text-sm font-bold text-foreground-muted uppercase tracking-wider mb-3">
          Hızlı Keşif
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { emoji: "🏖️", label: "Plajlar", count: "12" },
            { emoji: "🏛️", label: "Tarihi", count: "8" },
            { emoji: "🌅", label: "Manzara", count: "6" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-card-bg rounded-xl border border-card-border p-3 text-center hover:shadow-sm transition-shadow"
            >
              <span className="text-2xl">{item.emoji}</span>
              <p className="text-xs font-semibold text-foreground mt-1">
                {item.label}
              </p>
              <p className="text-[10px] text-foreground-muted">
                {item.count} nokta
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
