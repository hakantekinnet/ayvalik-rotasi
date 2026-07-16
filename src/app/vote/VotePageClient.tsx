"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { contests } from "@/data/contests";
import { VoteContest } from "@/components/features/VoteContest";

export function VotePageClient() {
  const [activeContestIndex, setActiveContestIndex] = useState(0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-5 pt-12 pb-4">
        <h1 className="font-heading text-2xl font-extrabold text-foreground tracking-tight">
          Oylama
        </h1>
        <p className="text-sm text-foreground-muted mt-0.5">
          Favori mekanını seç, oyunu ver!
        </p>
      </header>

      {/* Contest Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2">
          {contests.map((contest, index) => (
            <motion.button
              key={contest.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveContestIndex(index)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeContestIndex === index
                  ? "bg-aegean-500 text-white shadow-md shadow-aegean-500/25"
                  : "bg-card-bg border border-card-border text-foreground-muted hover:bg-gray-50"
              }`}
            >
              {index === 0 ? "🌅 Gün Batımı" : "🥪 Tost"}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Active Contest */}
      <section className="px-4 pb-6">
        <VoteContest
          key={contests[activeContestIndex].id}
          contest={contests[activeContestIndex]}
        />
      </section>

      {/* Info Banner */}
      <section className="px-4 pb-6">
        <div className="bg-gradient-to-r from-aegean-50 to-olive-50 rounded-2xl border border-aegean-100 p-4">
          <p className="text-xs text-foreground-muted leading-relaxed">
            💡 <strong className="text-foreground">Bilgi:</strong> Oylamalar her
            ay yenilenir. Sonuçlar Ayvalık Rotası Instagram hesabında
            paylaşılır. Favori mekanlarınızı desteklemeyi unutmayın!
          </p>
        </div>
      </section>
    </div>
  );
}
