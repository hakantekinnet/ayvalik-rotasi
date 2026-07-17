"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Swords, UtensilsCrossed, Sparkles } from "lucide-react";

export function VotingView() {
  const [poll1Vote, setPoll1Vote] = useState<string | null>(null);
  const [poll2Vote, setPoll2Vote] = useState<string | null>(null);

  // Simulated results
  const poll1Results: Record<string, number> = {
    sarimsakli: 65,
    badavut: 35,
  };
  const poll2Results: Record<string, number> = {
    tost: 70,
    papalina: 30,
  };

  return (
    <div className="w-full h-full overflow-y-auto pb-28 px-4 pt-6 bg-slate-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-amber-500" />
          <h2 className="text-2xl font-extrabold text-gray-900">
            Senin Kararın
          </h2>
        </div>
        <p className="text-gray-500 mt-1">
          Ayvalık rotasını topluluk belirliyor. Tarafını seç!
        </p>
      </div>

      {/* ── Poll 1: Versus Mode — Beaches ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Swords size={18} className="text-rose-500" />
          <h3 className="text-lg font-bold text-gray-800">
            Haftanın Kapışması: Hangi Plaj?
          </h3>
        </div>

        <div className="flex gap-3">
          {/* Option: Sarımsaklı */}
          <button
            onClick={() => !poll1Vote && setPoll1Vote("sarimsakli")}
            disabled={!!poll1Vote}
            className={`relative flex-1 overflow-hidden rounded-2xl border-2 p-4 text-center transition-all duration-300 ${
              poll1Vote === "sarimsakli"
                ? "border-blue-400 bg-blue-50"
                : poll1Vote
                  ? "border-gray-100 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer"
            }`}
          >
            {/* Animated fill bar */}
            <AnimatePresence>
              {poll1Vote && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${poll1Results.sarimsakli}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className={`absolute left-0 top-0 h-full rounded-2xl ${
                    poll1Vote === "sarimsakli" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                />
              )}
            </AnimatePresence>
            <div className="relative z-10">
              <span className="text-2xl block mb-1">🏖️</span>
              <span className="text-sm font-bold text-gray-800">
                Sarımsaklı
              </span>
              {poll1Vote && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-1"
                >
                  <span className="text-xl font-extrabold text-blue-600">
                    %{poll1Results.sarimsakli}
                  </span>
                </motion.div>
              )}
              {poll1Vote === "sarimsakli" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <Check size={12} className="text-white" strokeWidth={3} />
                </motion.div>
              )}
            </div>
          </button>

          {/* VS Divider */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <span className="text-white text-xs font-extrabold">VS</span>
            </div>
          </div>

          {/* Option: Badavut */}
          <button
            onClick={() => !poll1Vote && setPoll1Vote("badavut")}
            disabled={!!poll1Vote}
            className={`relative flex-1 overflow-hidden rounded-2xl border-2 p-4 text-center transition-all duration-300 ${
              poll1Vote === "badavut"
                ? "border-blue-400 bg-blue-50"
                : poll1Vote
                  ? "border-gray-100 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer"
            }`}
          >
            <AnimatePresence>
              {poll1Vote && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${poll1Results.badavut}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className={`absolute left-0 top-0 h-full rounded-2xl ${
                    poll1Vote === "badavut" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                />
              )}
            </AnimatePresence>
            <div className="relative z-10">
              <span className="text-2xl block mb-1">🌊</span>
              <span className="text-sm font-bold text-gray-800">Badavut</span>
              {poll1Vote && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-1"
                >
                  <span className="text-xl font-extrabold text-blue-600">
                    %{poll1Results.badavut}
                  </span>
                </motion.div>
              )}
              {poll1Vote === "badavut" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <Check size={12} className="text-white" strokeWidth={3} />
                </motion.div>
              )}
            </div>
          </button>
        </div>

        {/* Vote count */}
        {poll1Vote && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-[11px] text-gray-400 mt-3"
          >
            243 kişi oy kullandı
          </motion.p>
        )}
      </div>

      {/* ── Poll 2: Classic Bar Poll — Food ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <UtensilsCrossed size={18} className="text-orange-500" />
          <h3 className="text-lg font-bold text-gray-800">
            Akşam Yemeği Klasikleri
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {/* Option: Ayvalık Tostu */}
          <button
            onClick={() => !poll2Vote && setPoll2Vote("tost")}
            disabled={!!poll2Vote}
            className={`relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
              poll2Vote === "tost"
                ? "border-orange-400 bg-orange-50"
                : poll2Vote
                  ? "border-gray-100 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md cursor-pointer"
            }`}
          >
            {/* Animated fill bar */}
            <AnimatePresence>
              {poll2Vote && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${poll2Results.tost}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className={`absolute left-0 top-0 h-full rounded-2xl ${
                    poll2Vote === "tost" ? "bg-orange-100" : "bg-gray-100"
                  }`}
                />
              )}
            </AnimatePresence>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥪</span>
                <span className="text-sm font-bold text-gray-800">
                  Ayvalık Tostu
                </span>
                {poll2Vote === "tost" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"
                  >
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </div>
              {poll2Vote && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg font-extrabold text-orange-600"
                >
                  %{poll2Results.tost}
                </motion.span>
              )}
            </div>
          </button>

          {/* Option: Papalina */}
          <button
            onClick={() => !poll2Vote && setPoll2Vote("papalina")}
            disabled={!!poll2Vote}
            className={`relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
              poll2Vote === "papalina"
                ? "border-orange-400 bg-orange-50"
                : poll2Vote
                  ? "border-gray-100 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md cursor-pointer"
            }`}
          >
            <AnimatePresence>
              {poll2Vote && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${poll2Results.papalina}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className={`absolute left-0 top-0 h-full rounded-2xl ${
                    poll2Vote === "papalina" ? "bg-orange-100" : "bg-gray-100"
                  }`}
                />
              )}
            </AnimatePresence>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🐟</span>
                <span className="text-sm font-bold text-gray-800">
                  Papalina
                </span>
                {poll2Vote === "papalina" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"
                  >
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </div>
              {poll2Vote && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg font-extrabold text-orange-600"
                >
                  %{poll2Results.papalina}
                </motion.span>
              )}
            </div>
          </button>
        </div>

        {/* Vote count */}
        {poll2Vote && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-[11px] text-gray-400 mt-3"
          >
            189 kişi oy kullandı
          </motion.p>
        )}
      </div>

      {/* ── Info Banner ── */}
      <div className="bg-gradient-to-r from-aegean-50 to-amber-50 rounded-2xl border border-aegean-100 p-4">
        <p className="text-xs text-gray-500 leading-relaxed">
          💡 <strong className="text-gray-700">Bilgi:</strong> Oylamalar her ay
          yenilenir. Sonuçlar Ayvalık Rotası Instagram hesabında paylaşılır.
          Favori mekanlarınızı desteklemeyi unutmayın!
        </p>
      </div>
    </div>
  );
}
