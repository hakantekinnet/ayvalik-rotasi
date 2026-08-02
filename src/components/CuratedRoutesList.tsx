"use client";

import { useRouteStore, RouteLocation } from "@/store/useRouteStore";

export interface CuratedRoute {
  _id: string;
  title: string;
  description?: string;
  locations: RouteLocation[];
}

interface CuratedRoutesListProps {
  routes: CuratedRoute[];
}

export function CuratedRoutesList({ routes }: CuratedRoutesListProps) {
  const { addMultipleToRoute, routeList } = useRouteStore();

  if (!routes || routes.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-sm font-bold text-foreground-muted uppercase tracking-wider mb-4">
        Önerilen Paket Rotalar
      </h3>
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar -mx-5 px-5">
        {routes.map((route) => {
          // Check how many locations from this route are already added
          const alreadyAddedCount = route.locations.filter((loc) =>
            routeList.some((existing) => existing._id === loc._id)
          ).length;
          const allAdded =
            alreadyAddedCount === route.locations.length &&
            route.locations.length > 0;

          return (
            <div
              key={route._id}
              className="min-w-[260px] bg-white rounded-2xl shadow-sm border border-slate-100 p-4 snap-center shrink-0"
            >
              <div className="h-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl mb-3 flex items-center justify-center text-4xl">
                🗺️
              </div>
              <h4 className="font-bold text-slate-800">{route.title}</h4>
              {route.description && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {route.description}
                </p>
              )}
              <button
                onClick={() => addMultipleToRoute(route.locations)}
                disabled={allAdded}
                className={`w-full mt-4 text-sm font-bold py-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                  allAdded
                    ? "bg-[#0F766E] text-white shadow-md shadow-[#0F766E]/20"
                    : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
              >
                {allAdded
                  ? "✅ Rotaya Eklendi"
                  : `+ Paketi Ekle (${route.locations.length} Mekan)`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
