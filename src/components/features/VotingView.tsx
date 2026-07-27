"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Swords, UtensilsCrossed, Sparkles } from "lucide-react";
import type { SanityPoll } from "@/app/vote/page";

// Static fallback polls
const staticPolls: SanityPoll[] = [
  {
    _id: "static-1",
    title: "Haftanın Kapışması: Hangi Plaj?",
    category: "versus",
    emoji: "⚔️",
    optionA_title: "Sarımsaklı",
    optionA_emoji: "🏖️",
    optionB_title: "Badavut",
    optionB_emoji: "🌊",
  },
  {
    _id: "static-2",
    title: "Akşam Yemeği Klasikleri",
    category: "classic",
    emoji: "🍽️",
    optionA_title: "Ayvalık Tostu",
    optionA_emoji: "🥪",
    optionB_title: "Papalina",
    optionB_emoji: "🐟",
  },
];

interface VotingViewProps {
  sanityPolls?: SanityPoll[];
}

export function VotingView({ sanityPolls }: VotingViewProps) {
  const polls =
    sanityPolls && sanityPolls.length > 0 ? sanityPolls : staticPolls;

  // Track votes per poll by _id
  const [votes, setVotes] = useState<Record<string, "a" | "b">>({});

  // Simulated results — in a real app these would come from a backend
  const getResults = () => ({ a: 65, b: 35 });

  const handleVote = (pollId: string, option: "a" | "b") => {
    if (votes[pollId]) return; // already voted
    setVotes((prev) => ({ ...prev, [pollId]: option }));
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

      {/* Dynamic Poll Cards */}
      {polls.map((poll) => {
        const voted = votes[poll._id];
        const results = getResults();
        const isVersus = poll.category === "versus";
        const IconComp = isVersus ? Swords : UtensilsCrossed;
        const iconColor = isVersus ? "text-rose-500" : "text-orange-500";
        const selectedColor = isVersus ? "blue" : "orange";

        return (
          <div
            key={poll._id}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <IconComp size={18} className={iconColor} />
              <h3 className="text-lg font-bold text-gray-800">{poll.title}</h3>
            </div>

            {isVersus ? (
              /* ── Versus Mode ── */
              <div className="flex gap-3">
                {/* Option A */}
                <button
                  onClick={() => handleVote(poll._id, "a")}
                  disabled={!!voted}
                  className={`relative flex-1 overflow-hidden rounded-2xl border-2 p-4 text-center transition-all duration-300 ${
                    voted === "a"
                      ? `border-${selectedColor}-400 bg-${selectedColor}-50`
                      : voted
                        ? "border-gray-100 bg-gray-50"
                        : `border-gray-200 bg-white hover:border-${selectedColor}-300 hover:shadow-md cursor-pointer`
                  }`}
                >
                  <AnimatePresence>
                    {voted && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${results.a}%` }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: 0.2,
                        }}
                        className={`absolute left-0 top-0 h-full rounded-2xl ${
                          voted === "a" ? `bg-${selectedColor}-100` : "bg-gray-100"
                        }`}
                      />
                    )}
                  </AnimatePresence>
                  <div className="relative z-10">
                    <span className="text-2xl block mb-1">
                      {poll.optionA_emoji || "🔵"}
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {poll.optionA_title}
                    </span>
                    {voted && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-1"
                      >
                        <span
                          className={`text-xl font-extrabold text-${selectedColor}-600`}
                        >
                          %{results.a}
                        </span>
                      </motion.div>
                    )}
                    {voted === "a" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute -top-1 -right-1 w-5 h-5 bg-${selectedColor}-500 rounded-full flex items-center justify-center`}
                      >
                        <Check size={12} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>
                </button>

                {/* VS Divider */}
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                    <span className="text-white text-xs font-extrabold">
                      VS
                    </span>
                  </div>
                </div>

                {/* Option B */}
                <button
                  onClick={() => handleVote(poll._id, "b")}
                  disabled={!!voted}
                  className={`relative flex-1 overflow-hidden rounded-2xl border-2 p-4 text-center transition-all duration-300 ${
                    voted === "b"
                      ? `border-${selectedColor}-400 bg-${selectedColor}-50`
                      : voted
                        ? "border-gray-100 bg-gray-50"
                        : `border-gray-200 bg-white hover:border-${selectedColor}-300 hover:shadow-md cursor-pointer`
                  }`}
                >
                  <AnimatePresence>
                    {voted && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${results.b}%` }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: 0.2,
                        }}
                        className={`absolute left-0 top-0 h-full rounded-2xl ${
                          voted === "b" ? `bg-${selectedColor}-100` : "bg-gray-100"
                        }`}
                      />
                    )}
                  </AnimatePresence>
                  <div className="relative z-10">
                    <span className="text-2xl block mb-1">
                      {poll.optionB_emoji || "🔴"}
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {poll.optionB_title}
                    </span>
                    {voted && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-1"
                      >
                        <span
                          className={`text-xl font-extrabold text-${selectedColor}-600`}
                        >
                          %{results.b}
                        </span>
                      </motion.div>
                    )}
                    {voted === "b" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute -top-1 -right-1 w-5 h-5 bg-${selectedColor}-500 rounded-full flex items-center justify-center`}
                      >
                        <Check size={12} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>
                </button>
              </div>
            ) : (
              /* ── Classic Bar Poll ── */
              <div className="flex flex-col gap-3">
                {/* Option A */}
                <button
                  onClick={() => handleVote(poll._id, "a")}
                  disabled={!!voted}
                  className={`relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                    voted === "a"
                      ? "border-orange-400 bg-orange-50"
                      : voted
                        ? "border-gray-100 bg-gray-50"
                        : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md cursor-pointer"
                  }`}
                >
                  <AnimatePresence>
                    {voted && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${results.a}%` }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: 0.2,
                        }}
                        className={`absolute left-0 top-0 h-full rounded-2xl ${
                          voted === "a" ? "bg-orange-100" : "bg-gray-100"
                        }`}
                      />
                    )}
                  </AnimatePresence>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {poll.optionA_emoji || "🅰️"}
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {poll.optionA_title}
                      </span>
                      {voted === "a" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"
                        >
                          <Check
                            size={12}
                            className="text-white"
                            strokeWidth={3}
                          />
                        </motion.div>
                      )}
                    </div>
                    {voted && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg font-extrabold text-orange-600"
                      >
                        %{results.a}
                      </motion.span>
                    )}
                  </div>
                </button>

                {/* Option B */}
                <button
                  onClick={() => handleVote(poll._id, "b")}
                  disabled={!!voted}
                  className={`relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                    voted === "b"
                      ? "border-orange-400 bg-orange-50"
                      : voted
                        ? "border-gray-100 bg-gray-50"
                        : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md cursor-pointer"
                  }`}
                >
                  <AnimatePresence>
                    {voted && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${results.b}%` }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: 0.2,
                        }}
                        className={`absolute left-0 top-0 h-full rounded-2xl ${
                          voted === "b" ? "bg-orange-100" : "bg-gray-100"
                        }`}
                      />
                    )}
                  </AnimatePresence>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {poll.optionB_emoji || "🅱️"}
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {poll.optionB_title}
                      </span>
                      {voted === "b" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"
                        >
                          <Check
                            size={12}
                            className="text-white"
                            strokeWidth={3}
                          />
                        </motion.div>
                      )}
                    </div>
                    {voted && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg font-extrabold text-orange-600"
                      >
                        %{results.b}
                      </motion.span>
                    )}
                  </div>
                </button>
              </div>
            )}

            {/* Vote count */}
            {voted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-[11px] text-gray-400 mt-3"
              >
                Oyun kaydedildi ✓
              </motion.p>
            )}
          </div>
        );
      })}

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
