"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Swords, UtensilsCrossed, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { toast } from "sonner";
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

  const [activeTab, setActiveTab] = useState<"kadraj" | "mekan">("kadraj");
  const [votes, setVotes] = useState<Record<string, "a" | "b">>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [photos, setPhotos] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [topLocations, setTopLocations] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const votedPhotos: string[] = JSON.parse(
          localStorage.getItem("votedPhotos") || "[]"
        );
        const data = await client.fetch(
          `*[_type == "userPhoto" && isApproved == true] | order(_createdAt desc){
            _id, photo, photographer, votes
          }`
        );
        const photosWithVotes = (data || []).map((p: Record<string, unknown>) => ({
          ...p,
          hasVoted: votedPhotos.includes(p._id as string),
        }));
        setPhotos(photosWithVotes);
      } catch (err) {
        console.warn("User photos fetch failed:", err);
      }
    };

    const fetchTopLocations = async () => {
      try {
        const locationsData = await client.fetch(
          `*[_type == "place" && voteCount > 0]{
            _id, title, category, voteCount,
            ratingLezzet, ratingFiyat, ratingAtmosfer,
            ratingDeniz, ratingTemizlik, ratingTesis,
            ratingGenel
          }`
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const calculated = (locationsData || []).map((loc: any) => {
          let avg = 0;
          if (loc.category === "Mekan") {
            avg =
              ((loc.ratingLezzet || 0) +
                (loc.ratingFiyat || 0) +
                (loc.ratingAtmosfer || 0)) /
              (loc.voteCount * 3);
          } else if (loc.category === "Plaj") {
            avg =
              ((loc.ratingDeniz || 0) +
                (loc.ratingTemizlik || 0) +
                (loc.ratingTesis || 0)) /
              (loc.voteCount * 3);
          } else {
            avg = (loc.ratingGenel || 0) / loc.voteCount;
          }
          return { ...loc, avgScore: Number(avg.toFixed(1)) };
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        calculated.sort((a: any, b: any) => b.avgScore - a.avgScore);
        setTopLocations(calculated);
      } catch (err) {
        console.warn("Top locations fetch failed:", err);
      }
    };

    fetchPhotos();
    fetchTopLocations();
  }, []);

  // Calculate real vote percentages from Sanity data
  const getResults = (poll: SanityPoll) => {
    const a = poll.votesA || 0;
    const b = poll.votesB || 0;
    const total = a + b;
    if (total === 0) return { a: 50, b: 50, total: 0 };
    return {
      a: Math.round((a / total) * 100),
      b: Math.round((b / total) * 100),
      total,
    };
  };

  // Calculate remaining time for active polls
  const getRemainingTime = (endsAt?: string): string | null => {
    if (!endsAt) return null;
    const now = new Date();
    const end = new Date(endsAt);
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return "Sona erdi";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `Kalan: ${days} Gün`;
    if (hours > 0) return `Kalan: ${hours} Saat`;
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `Kalan: ${minutes} dk`;
  };

  const handlePollVote = (pollId: string, option: "a" | "b") => {
    if (votes[pollId]) return;
    setVotes((prev) => ({ ...prev, [pollId]: option }));
  };

  const handlePhotoVote = async (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p._id === photoId
          ? { ...p, votes: (p.votes || 0) + 1, hasVoted: true }
          : p
      )
    );
    const votedPhotos: string[] = JSON.parse(
      localStorage.getItem("votedPhotos") || "[]"
    );
    if (!votedPhotos.includes(photoId)) {
      votedPhotos.push(photoId);
      localStorage.setItem("votedPhotos", JSON.stringify(votedPhotos));
    }
    try {
      await fetch("/api/vote-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      });
    } catch (error) {
      console.error("Oy gönderilemedi:", error);
    }
  };

  // ── Upload Modal State ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadFile(file);
    } else {
      toast.error("Sadece görsel dosyaları yüklenebilir.");
    }
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return toast.error("Lütfen bir fotoğraf seçin!");

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("username", username);

    try {
      const res = await fetch("/api/upload-photo", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Yükleme hatası");

      toast.success("Fotoğrafın incelemeye gönderildi! 📸");
      setIsModalOpen(false);
      setUploadFile(null);
      setUsername("");
    } catch {
      toast.error("Bir hata oluştu. Tekrar dene.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal on Escape
  useEffect(() => {
    if (!isModalOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isModalOpen]);

  return (
    <div className="min-h-screen pb-24">
      {/* Header — mobile only */}
      <div className="pt-8 pb-4 px-4 lg:hidden">
        <h1 className="text-2xl font-bold text-slate-800">Oylama</h1>
        <p className="text-sm text-slate-500 mt-1">
          Ayvalık&apos;ın en iyilerini sen belirle
        </p>
      </div>

      {/* Toggle Pill — with proper tab accessibility */}
      <div
        className="flex bg-slate-100/80 p-1 rounded-xl w-full max-w-[320px] mx-auto mb-6 lg:mt-6"
        role="tablist"
        aria-label="Oylama sekmesi"
      >
        <button
          role="tab"
          aria-selected={activeTab === "kadraj"}
          id="tab-kadraj"
          aria-controls="panel-kadraj"
          onClick={() => setActiveTab("kadraj")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
            activeTab === "kadraj"
              ? "bg-white shadow-sm text-slate-800"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          📸 Benim Kadrajımdan
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "mekan"}
          id="tab-mekan"
          aria-controls="panel-mekan"
          onClick={() => setActiveTab("mekan")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
            activeTab === "mekan"
              ? "bg-white shadow-sm text-slate-800"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          🌟 En İyiler
        </button>
      </div>

      {/* Content Area */}
      <div className="px-4">
        {activeTab === "kadraj" ? (
          /* ── Benim Kadrajımdan Tab ── */
          <div
            role="tabpanel"
            id="panel-kadraj"
            aria-labelledby="tab-kadraj"
          >
            {/* Header + CTA (desktop: side by side) */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">
                📸 Topluluk Kadrajı
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="hidden xl:flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <Upload size={14} /> Fotoğraf Gönder
              </button>
            </div>

            {/* Responsive Photo Grid */}
            {photos.length > 0 ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                {photos.map((photo) => (
                  <div
                    key={photo._id}
                    className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
                  >
                    {photo.photo && (
                      <div
                        className="relative aspect-[4/5] overflow-hidden rounded-t-2xl cursor-pointer group"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <Image
                          src={urlFor(photo.photo).url()}
                          alt={photo.photographer || "Kullanıcı Fotoğrafı"}
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
                      </div>
                    )}
                    <div className="p-2.5 flex items-center justify-between bg-white">
                      <span className="text-[10px] font-bold text-slate-700 truncate mr-2">
                        {photo.photographer || "@anonim"}
                      </span>
                      <button
                        onClick={() =>
                          !photo.hasVoted && handlePhotoVote(photo._id)
                        }
                        className={`flex items-center gap-1 text-xs font-bold px-2 py-1.5 rounded-lg transition-colors ${
                          photo.hasVoted
                            ? "bg-red-50 text-red-500"
                            : "bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500 cursor-pointer"
                        }`}
                      >
                        <span>{photo.hasVoted ? "❤️" : "🤍"}</span>
                        <span>{photo.votes || 0}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-40 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 mb-6">
                <span className="text-2xl mb-2">📷</span>
                <span className="text-sm font-medium">
                  Henüz fotoğraf eklenmedi
                </span>
              </div>
            )}

            {/* CTA — mobile only (desktop has it in header) */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="xl:hidden w-full py-3.5 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Kendi Fotoğrafını Gönder 📸
            </button>
          </div>
        ) : (
          /* ── En İyiler Tab ── */
          <div
            role="tabpanel"
            id="panel-mekan"
            aria-labelledby="tab-mekan"
          >
            {/* Desktop: 2-column layout */}
            <div className="xl:grid xl:grid-cols-[420px_minmax(0,1fr)] xl:gap-6 space-y-6 xl:space-y-0">
              {/* Left: Leaderboard */}
              <div className="space-y-4">
                <div className="bg-slate-800 text-white rounded-2xl p-6 text-center shadow-lg">
                  <h2 className="text-xl font-bold mb-2">
                    Ayvalık&apos;ın Zirvesi 🏆
                  </h2>
                  <p className="text-xs text-slate-300">
                    Topluluğun oylarıyla belirlenen en iyi mekanlar ve gizli
                    hazineler.
                  </p>
                </div>

                {topLocations.length === 0 ? (
                  <div className="text-center p-8 text-sm text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                    Henüz hiç mekan oylanmadı. Haritadan ilk oyu sen ver!
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {topLocations.map((loc, index) => {
                      let badge = "bg-slate-100 text-slate-500";
                      let border = "border-slate-100";
                      if (index === 0) {
                        badge = "bg-amber-400 text-white shadow-md";
                        border = "border-amber-300 ring-2 ring-amber-100";
                      }
                      if (index === 1) {
                        badge = "bg-slate-300 text-slate-700 shadow";
                        border = "border-slate-300";
                      }
                      if (index === 2) {
                        badge = "bg-orange-300 text-white shadow";
                        border = "border-orange-200";
                      }

                      return (
                        <div
                          key={loc._id}
                          className={`flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border ${border} transition-all`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${badge}`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-800 text-sm capitalize">
                                {loc.title}
                              </h3>
                              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                                {loc.category}
                              </span>
                            </div>
                          </div>
                          {/* Clean rating display */}
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1">
                              <span className="text-amber-400 text-sm">★</span>
                              <span className="text-lg font-black text-slate-800">
                                {loc.avgScore}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {loc.voteCount} değerlendirme
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right: Polls */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Haftalık Anketler
                  </span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {polls.map((poll) => {
                  const voted = votes[poll._id];
                  const results = getResults(poll);
                  const isVersus = poll.category === "versus";
                  const IconComp = isVersus ? Swords : UtensilsCrossed;
                  const iconColor = isVersus ? "text-rose-500" : "text-orange-500";
                  const selectedColor = isVersus ? "blue" : "orange";

                  return (
                    <div
                      key={poll._id}
                      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconComp size={18} className={iconColor} />
                        <h3 className="text-lg font-bold text-gray-800 flex-1">
                          {poll.title}
                        </h3>
                      </div>
                      {/* Meta: total votes + countdown */}
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium mb-4">
                        {results.total > 0 && (
                          <span>🗳️ {results.total} oy</span>
                        )}
                        {getRemainingTime(poll.endsAt) && (
                          <span className="flex items-center gap-1">
                            ⏱️ {getRemainingTime(poll.endsAt)}
                          </span>
                        )}
                      </div>

                      {isVersus ? (
                        <div className="flex gap-3">
                          {/* Option A */}
                          <button
                            onClick={() => handlePollVote(poll._id, "a")}
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
                                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                  className={`absolute left-0 top-0 h-full rounded-2xl ${
                                    voted === "a" ? `bg-${selectedColor}-100` : "bg-gray-100"
                                  }`}
                                />
                              )}
                            </AnimatePresence>
                            <div className="relative z-10">
                              <span className="text-2xl block mb-1">{poll.optionA_emoji || "🔵"}</span>
                              <span className="text-sm font-bold text-gray-800">{poll.optionA_title}</span>
                              {voted && (
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.5 }}
                                  className="mt-1"
                                >
                                  <span className={`text-xl font-extrabold text-${selectedColor}-600`}>%{results.a}</span>
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

                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                              <span className="text-white text-xs font-extrabold">VS</span>
                            </div>
                          </div>

                          {/* Option B */}
                          <button
                            onClick={() => handlePollVote(poll._id, "b")}
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
                                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                  className={`absolute left-0 top-0 h-full rounded-2xl ${
                                    voted === "b" ? `bg-${selectedColor}-100` : "bg-gray-100"
                                  }`}
                                />
                              )}
                            </AnimatePresence>
                            <div className="relative z-10">
                              <span className="text-2xl block mb-1">{poll.optionB_emoji || "🔴"}</span>
                              <span className="text-sm font-bold text-gray-800">{poll.optionB_title}</span>
                              {voted && (
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.5 }}
                                  className="mt-1"
                                >
                                  <span className={`text-xl font-extrabold text-${selectedColor}-600`}>%{results.b}</span>
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
                        <div className="flex flex-col gap-3">
                          {/* Classic Option A */}
                          <button
                            onClick={() => handlePollVote(poll._id, "a")}
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
                                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                  className={`absolute left-0 top-0 h-full rounded-2xl ${
                                    voted === "a" ? "bg-orange-100" : "bg-gray-100"
                                  }`}
                                />
                              )}
                            </AnimatePresence>
                            <div className="relative z-10 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{poll.optionA_emoji || "🅰️"}</span>
                                <span className="text-sm font-bold text-gray-800">{poll.optionA_title}</span>
                                {voted === "a" && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                                    <Check size={12} className="text-white" strokeWidth={3} />
                                  </motion.div>
                                )}
                              </div>
                              {voted && (
                                <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="text-lg font-extrabold text-orange-600">
                                  %{results.a}
                                </motion.span>
                              )}
                            </div>
                          </button>

                          {/* Classic Option B */}
                          <button
                            onClick={() => handlePollVote(poll._id, "b")}
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
                                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                  className={`absolute left-0 top-0 h-full rounded-2xl ${
                                    voted === "b" ? "bg-orange-100" : "bg-gray-100"
                                  }`}
                                />
                              )}
                            </AnimatePresence>
                            <div className="relative z-10 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{poll.optionB_emoji || "🅱️"}</span>
                                <span className="text-sm font-bold text-gray-800">{poll.optionB_title}</span>
                                {voted === "b" && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                                    <Check size={12} className="text-white" strokeWidth={3} />
                                  </motion.div>
                                )}
                              </div>
                              {voted && (
                                <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="text-lg font-extrabold text-orange-600">
                                  %{results.b}
                                </motion.span>
                              )}
                            </div>
                          </button>
                        </div>
                      )}

                      {voted && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                          className="text-center text-[11px] text-gray-400 mt-3"
                        >
                          Oyun kaydedildi ✓ · Toplam {results.total} oy
                        </motion.p>
                      )}
                    </div>
                  );
                })}

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-aegean-50 to-amber-50 rounded-2xl border border-aegean-100 p-4">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    💡 <strong className="text-gray-700">Bilgi:</strong> Oylamalar
                    her ay yenilenir. Sonuçlar Ayvalık Rotası Instagram hesabında
                    paylaşılır. Favori mekanlarınızı desteklemeyi unutmayın!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Upload Modal with Styled Dropzone ── */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[var(--z-overlay)]"
              onClick={() => setIsModalOpen(false)}
              aria-hidden="true"
            />
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="upload-dialog-title"
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[var(--z-modal)] bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Kapat"
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>

              <h3 id="upload-dialog-title" className="text-xl font-bold text-slate-800 mb-2">
                Fotoğraf Gönder
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Ayvalık kadrajını bizimle paylaş, onaylandıktan sonra oylamaya
                eklensin.
              </p>

              <form onSubmit={handleUpload} className="flex flex-col gap-4">
                {/* Styled Dropzone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Fotoğraf
                  </label>
                  <div
                    ref={dropzoneRef}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleFileDrop}
                    className={`relative w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                      isDragOver
                        ? "border-aegean-500 bg-aegean-50"
                        : uploadFile
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                    }`}
                    onClick={() => dropzoneRef.current?.querySelector("input")?.click()}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      uploadFile ? "bg-emerald-100" : "bg-white shadow-sm"
                    }`}>
                      <Upload size={20} className={uploadFile ? "text-emerald-600" : "text-slate-400"} />
                    </div>
                    {uploadFile ? (
                      <span className="text-sm font-semibold text-emerald-700 truncate max-w-[200px]">
                        ✓ {uploadFile.name}
                      </span>
                    ) : (
                      <>
                        <span className="text-sm font-semibold text-slate-600">
                          Sürükle & bırak veya tıkla
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1">
                          JPEG, PNG, WEBP — Maks. 5MB
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Instagram Adın (İsteğe Bağlı)
                  </label>
                  <input
                    type="text"
                    placeholder="@kullaniciadi"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors text-sm cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      "Gönder"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full w-10 h-10 flex items-center justify-center transition-all z-50 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(null);
            }}
            aria-label="Kapat"
          >
            <X size={24} />
          </button>

          <div
            className="relative w-full max-w-4xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlFor(selectedPhoto.photo).url()}
              alt={selectedPhoto.photographer || "Ayvalık"}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          <div
            className="mt-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white font-bold text-lg">
              {selectedPhoto.photographer || "@anonim"}
            </p>
            <p className="text-white/60 text-sm mt-1">
              {selectedPhoto.votes || 0} beğeni
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
