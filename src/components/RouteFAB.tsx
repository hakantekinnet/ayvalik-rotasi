"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouteStore } from "@/store/useRouteStore";
import { motion, AnimatePresence } from "framer-motion";

export function RouteFAB() {
  const { routeList } = useRouteStore();
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {routeList.length > 0 && pathname !== "/rotam" && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-[88px] left-1/2 -translate-x-1/2 z-50"
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
