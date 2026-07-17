"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Sun, Waves, Sunset, Clock, ChevronRight } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

const newsItems = [
  {
    id: "1",
    title: "Yeni Mekan Keşfi",
    description: "Cunda'da yeni açılan butik otel, ziyaretçilerini bekliyor.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    time: "2 saat önce",
  },
  {
    id: "2",
    title: "Zeytinyağı Festivali",
    description: "Ayvalık'ın meşhur zeytinyağı festivali bu hafta sonu başlıyor.",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
    time: "5 saat önce",
  },
  {
    id: "3",
    title: "Tekne Turu Rotası",
    description:
      "Ayvalık adaları arasında yeni tekne turu rotası hizmete girdi.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80",
    time: "Dün",
  },
];

export function NewsView() {
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
            <p className="text-xs text-gray-500">28°C Güneşli</p>
          </div>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex items-center gap-2">
          <Waves size={18} className="text-cyan-500" />
          <div>
            <p className="text-sm font-medium text-gray-800">Deniz</p>
            <p className="text-xs text-gray-500">22°C</p>
          </div>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex items-center gap-2">
          <Sunset size={18} className="text-orange-500" />
          <div>
            <p className="text-sm font-medium text-gray-800">Batım</p>
            <p className="text-xs text-gray-500">20:34</p>
          </div>
        </div>
      </motion.div>

      {/* ── Featured News Card ── */}
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
            <motion.div
              key={item.id}
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
                <div className="flex items-center gap-1 mt-1.5">
                  <Clock size={10} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400 font-medium">
                    {item.time}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight
                size={16}
                className="text-gray-300 flex-shrink-0 group-hover:text-aegean-500 transition-colors"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
