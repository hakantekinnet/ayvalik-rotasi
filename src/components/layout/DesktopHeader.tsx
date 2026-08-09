"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Newspaper, Vote, Route } from "lucide-react";
import { useRouteStore, useStoreHydration } from "@/store/useRouteStore";

const navLinks = [
  { href: "/", label: "Harita", icon: MapPin },
  { href: "/feed", label: "Haberler", icon: Newspaper },
  { href: "/vote", label: "Oylama", icon: Vote },
];

export function DesktopHeader() {
  const pathname = usePathname();
  const { routeList } = useRouteStore();
  const hasHydrated = useStoreHydration();
  const routeCount = hasHydrated ? routeList.length : 0;

  return (
    <header className="hidden lg:block sticky top-0 z-[var(--z-header)] glass border-b border-card-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aegean-400 to-aegean-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white text-xs font-bold">AR</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-foreground tracking-tight leading-none">
                Ayvalık Rotası
              </span>
              <span className="text-[10px] text-foreground-muted leading-none mt-0.5">
                Dijital Rehber
              </span>
            </div>
          </Link>

          {/* Center Navigation */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-aegean-50 text-aegean-700"
                      : "text-foreground-muted hover:text-foreground hover:bg-slate-50"
                  }`}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-3">
            <Link
              href="/rotam"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-aegean-600 text-white text-sm font-bold shadow-sm hover:bg-aegean-700 hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <Route size={16} strokeWidth={2.5} />
              Rotam
              {routeCount > 0 && (
                <span className="ml-0.5 bg-white/20 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full leading-none">
                  {routeCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
