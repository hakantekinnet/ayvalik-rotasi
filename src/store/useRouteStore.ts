import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface RouteLocation {
  _id: string;
  title: string;
  slug: string | { current: string };
  geopoint?: {
    lat: number;
    lng: number;
    _type?: string;
  };
  isOpportunity?: boolean;
  opportunityText?: string;
  opportunityCode?: string;
}

export interface RouteState {
  routeList: RouteLocation[];
  addToRoute: (location: RouteLocation) => void;
  addMultipleToRoute: (locations: RouteLocation[]) => void;
  removeFromRoute: (id: string) => void;
  clearRoute: () => void;
}

// ── Store ───────────────────────────────────────────────────────────────────

export const useRouteStore = create<RouteState>()(
  persist(
    (set, get) => ({
      routeList: [],

      addToRoute: (location) => {
        const exists = get().routeList.some((l) => l._id === location._id);
        if (exists) return; // prevent duplicates
        set((state) => ({ routeList: [...state.routeList, location] }));
      },

      addMultipleToRoute: (locations) => {
        set((state) => {
          const newLocations = locations.filter(
            (newLoc) =>
              !state.routeList.some(
                (existingLoc) => existingLoc._id === newLoc._id
              )
          );
          if (newLocations.length === 0) return state;
          return { routeList: [...state.routeList, ...newLocations] };
        });
      },

      removeFromRoute: (id) => {
        set((state) => ({
          routeList: state.routeList.filter((l) => l._id !== id),
        }));
      },

      clearRoute: () => {
        set({ routeList: [] });
      },
    }),
    {
      name: "ayvalik-route-storage", // localStorage key
    }
  )
);

export default useRouteStore;
