"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouteStore, useStoreHydration } from "@/store/useRouteStore";
import { motion, AnimatePresence } from "framer-motion";

export function RouteFAB() {
  const { routeList } = useRouteStore();
  const pathname = usePathname();
  const hasHydrated = useStoreHydration();

  // Don't render until localStorage has been read — prevents hydration mismatch
  if (!hasHydrated) return null;

  return (
    <AnimatePresence>
      {routeList.length > 0 && pathname !== "/rotam" && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-[88px] left-1/2 -translate-x-1/2 z-40 md:hidden"
        >
          <Link href="/rotam" prefetch={false}>
            <div className="px-6 py-3.5 rounded-full flex items-center gap-2.5 bg-white/80 backdrop-blur-md shadow-2xl border border-white/40 transition-all duration-300 hover:scale-105 hover:bg-white/90 active:scale-95 cursor-pointer">
              <span className="text-lg leading-none">🗺️</span>
              <span className="text-sm font-bold text-slate-800 tracking-wide whitespace-nowrap">
                Rotanı Gör ({routeList.length} Mekan)
              </span>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
