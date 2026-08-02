"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Sun, Waves, Sunset, Clock, ChevronRight, Loader2 } from "lucide-react";
import type { SanityNewsItem, SanityWeeklyEvent, SanityEvent } from "@/app/feed/page";
import { useRouteStore } from "@/store/useRouteStore";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

const staticNewsItems = [
  {
    id: "1",
    title: "Yeni Mekan Keşfi",
    description: "Cunda'da yeni açılan butik otel, ziyaretçilerini bekliyor.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    time: "2 saat önce",
  },
  {
    id: "2",
    title: "Zeytinyağı Festivali",
    description: "Ayvalık'ın meşhur zeytinyağı festivali bu hafta sonu başlıyor.",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
    time: "5 saat önce",
  },
  {
    id: "3",
    title: "Tekne Turu Rotası",
    description: "Ayvalık adaları arasında yeni tekne turu rotası hizmete girdi.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80",
    time: "Dün",
  },
];

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} dk önce`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} saat önce`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Dün";
  return `${diffDays} gün önce`;
}

interface NewsViewProps {
  sanityNews?: SanityNewsItem[];
  weeklyEvent?: SanityWeeklyEvent | null;
  events?: SanityEvent[];
}

export function NewsView({ sanityNews, weeklyEvent, events = [] }: NewsViewProps) {
  const { addToRoute, routeList } = useRouteStore();
  // Use Sanity data if available, otherwise fall back to static
  const newsItems = sanityNews && sanityNews.length > 0
    ? sanityNews.map((item) => ({
        id: item._id,
        title: item.title,
        description: item.summary || "",
        image: item.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        time: timeAgo(item._createdAt),
      }))
    : staticNewsItems;
  const [weather, setWeather] = useState<{
    temp: number;
    seaTemp: number;
    sunset: string;
  } | null>(null);
  const [activeHero, setActiveHero] = useState<"vitrin" | "takvim">("vitrin");

  useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then((data) =>
        setWeather({
          temp: data.temp ?? 28,
          seaTemp: data.seaTemp ?? 22,
          sunset: data.sunset ?? "20:34",
        })
      )
      .catch(() =>
        setWeather({ temp: 28, seaTemp: 22, sunset: "20:34" })
      );
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto pb-28 px-4 pt-6 bg-slate-50">
      {/* ── Top Dashboard: Weather & Quick Info ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="flex justify-between items-center bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/50 mb-8"
      >
        <div className="flex items-center gap-2">
          <Sun size={18} className="text-amber-500" />
          <div>
            <p className="text-sm font-medium text-gray-800">Ayvalık</p>
            <p className={`text-xs text-gray-500 ${!weather ? "animate-pulse" : ""}`}>
              {weather ? `${weather.temp}°C Güneşli` : "—"}
            </p>
          </div>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex items-center gap-2">
          <Waves size={18} className="text-cyan-500" />
          <div>
            <p className="text-sm font-medium text-gray-800">Deniz</p>
            <p className={`text-xs text-gray-500 ${!weather ? "animate-pulse" : ""}`}>
              {weather ? `${weather.seaTemp}°C` : "—"}
            </p>
          </div>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex items-center gap-2">
          <Sunset size={18} className="text-orange-500" />
          <div>
            <p className="text-sm font-medium text-gray-800">Batım</p>
            <p className={`text-xs text-gray-500 ${!weather ? "animate-pulse" : ""}`}>
              {weather ? weather.sunset : "—"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Hero Toggle ── */}
      <div className="flex bg-slate-100/80 p-1 rounded-xl w-full max-w-[280px] mx-auto mb-5 mt-2">
        <button
          onClick={() => setActiveHero("vitrin")}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${activeHero === "vitrin" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"}`}
        >
          Vitrin
        </button>
        <button
          onClick={() => setActiveHero("takvim")}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${activeHero === "takvim" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"}`}
        >
          Takvim
        </button>
      </div>

      {/* ── Featured News Card (Haftanın Etkinliği) / Takvim ── */}
      {activeHero === "vitrin" ? (
        <>
          {weeklyEvent ? (
            <Link href={`/news/${weeklyEvent._id}`}>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="relative w-full h-64 rounded-3xl overflow-hidden shadow-md mb-8 group cursor-pointer"
              >
                <Image
                  src={weeklyEvent.imageUrl || "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop"}
                  alt={weeklyEvent.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Featured Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold rounded-full border border-white/30">
                    ✨ Haftanın Etkinliği
                  </span>
                </div>

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h2 className="text-white text-xl font-bold leading-tight mb-1">
                    {weeklyEvent.title}
                  </h2>
                  {weeklyEvent.summary && (
                    <p className="text-white/70 text-xs">
                      {weeklyEvent.summary}
                    </p>
                  )}
                </div>
              </motion.div>
            </Link>
          ) : (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="relative w-full h-64 rounded-3xl overflow-hidden shadow-md mb-8 group cursor-pointer"
            >
              <Image
                src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop"
                alt="Ayvalık Amfitiyatro Konseri"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Featured Badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold rounded-full border border-white/30">
                  ✨ Haftanın Etkinliği
                </span>
              </div>

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h2 className="text-white text-xl font-bold leading-tight mb-1">
                  Amfitiyatro&apos;da Yaz Konseri
                </h2>
                <p className="text-white/70 text-xs">
                  Bu cuma akşamı, Ayvalık açık hava sahnesinde unutulmaz bir gece
                </p>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <div className="w-full mb-8">
          {events.length > 0 ? (
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar -mx-4 px-4">
              {events.map((evt) => {
                const dateObj = new Date(evt.eventDate);
                const day = dateObj.toLocaleDateString("tr-TR", { day: "numeric" });
                const month = dateObj.toLocaleDateString("tr-TR", { month: "short" });
                const time = dateObj.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
                const isInRoute = evt.location
                  ? routeList.some((r) => r._id === evt.location!._id)
                  : false;

                return (
                  <div
                    key={evt._id}
                    className="min-w-[240px] bg-white rounded-2xl shadow-sm border border-slate-100 p-3 snap-center shrink-0 flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-slate-800 text-white flex flex-col items-center justify-center rounded-xl w-14 h-14 shrink-0">
                        <span className="text-lg font-bold leading-none">{day}</span>
                        <span className="text-[10px] uppercase tracking-wider">{month}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">
                          {evt.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{time}</p>
                      </div>
                    </div>

                    {evt.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                        {evt.description}
                      </p>
                    )}

                    {evt.location && (
                      <button
                        onClick={() =>
                          addToRoute({
                            _id: evt.location!._id,
                            title: evt.location!.title,
                            slug: evt.location!.slug,
                            geopoint: evt.location!.geopoint,
                            isOpportunity: evt.location!.isOpportunity,
                            opportunityText: evt.location!.opportunityText,
                            opportunityCode: evt.location!.opportunityCode,
                          })
                        }
                        disabled={isInRoute}
                        className={`mt-auto w-full text-xs font-bold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 ${
                          isInRoute
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 active:scale-[0.97] cursor-pointer"
                        }`}
                      >
                        {isInRoute ? "✅ Rotada" : "📍 Konumu Rotaya Ekle"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-56 w-full bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-slate-400 font-medium">
              <span className="text-4xl mb-3">📅</span>
              <p className="text-sm">Henüz etkinlik eklenmedi</p>
              <p className="text-[11px] text-slate-300 mt-1">Etkinlikler, konserler ve festivaller</p>
            </div>
          )}
        </div>
      )}

      {/* ── News Feed List ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Son Duyurular</h3>
          <button className="text-xs text-aegean-600 font-semibold flex items-center gap-0.5 hover:underline">
            Tümü <ChevronRight size={12} />
          </button>
        </div>

        <div className="space-y-3">
          {newsItems.map((item, index) => (
            <Link key={item.id} href={`/news/${item.id}`}>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3 + index}
                className="flex bg-white rounded-2xl p-3 shadow-sm border border-gray-100 items-center gap-4 cursor-pointer hover:shadow-md transition-shadow duration-200 group"
              >
              {/* Thumbnail */}
              <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-800 mb-0.5 truncate">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-1">
                    <Clock size={10} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-medium">
                      {item.time}
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      "📢 " +
                        item.title +
                        "\n\n" +
                        item.description +
                        "\n\nDetaylar için tıkla:\nhttps://ayvalik-rotasi.vercel.app/news/" +
                        item.id
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors duration-200"
                    aria-label={`${item.title} haberini WhatsApp'ta paylaş`}
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="text-[10px] font-semibold">Paylaş</span>
                  </a>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight
                size={16}
                className="text-gray-300 flex-shrink-0 group-hover:text-aegean-500 transition-colors"
              />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
