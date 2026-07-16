"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Newspaper, Vote } from "lucide-react";

const tabs = [
  { href: "/", label: "Harita", icon: MapPin },
  { href: "/feed", label: "Haberler", icon: Newspaper },
  { href: "/vote", label: "Oylama", icon: Vote },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-card-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 group"
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -inset-2.5 rounded-xl bg-aegean-50"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className="relative z-10"
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={`transition-colors duration-200 ${
                      isActive
                        ? "text-aegean-600"
                        : "text-foreground-muted group-hover:text-foreground"
                    }`}
                  />
                </motion.div>
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-aegean-600"
                    : "text-foreground-muted group-hover:text-foreground"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
