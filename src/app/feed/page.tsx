import { NewsView } from "@/components/features/NewsView";

export default function FeedPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-5 pt-12 pb-2">
        <h1 className="font-heading text-2xl font-extrabold text-foreground tracking-tight">
          Haberler
        </h1>
        <p className="text-sm text-foreground-muted mt-0.5">
          Ayvalık&apos;tan son gelişmeler
        </p>
      </header>

      {/* News Dashboard View */}
      <NewsView />
    </div>
  );
}
