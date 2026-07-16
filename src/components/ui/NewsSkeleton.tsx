export function NewsSkeleton() {
  return (
    <div className="bg-card-bg rounded-2xl border border-card-border p-5 shadow-sm animate-pulse">
      {/* Category + Date */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
      </div>

      {/* Headline */}
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>

      {/* Summary */}
      <div className="space-y-1.5 mb-4">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
      </div>

      {/* Buttons */}
      <div className="flex gap-2.5">
        <div className="flex-1 h-10 bg-gray-200 rounded-xl" />
        <div className="flex-1 h-10 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}
