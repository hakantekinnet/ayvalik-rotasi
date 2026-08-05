"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface LocationRatingProps {
  locationId: string;
  category: string;
  currentVoteCount: number;
}

// Map category values from Sanity schema to rating criteria
const getCriteria = (category: string) => {
  switch (category) {
    case "Mekan":
      return [
        { key: "ratingLezzet", label: "Lezzet" },
        { key: "ratingFiyat", label: "Fiyat/Performans" },
        { key: "ratingAtmosfer", label: "Atmosfer" },
      ];
    case "Plaj":
      return [
        { key: "ratingDeniz", label: "Deniz Kalitesi" },
        { key: "ratingTemizlik", label: "Temizlik" },
        { key: "ratingTesis", label: "Tesis" },
      ];
    case "Manzara":
    case "Tarihi":
      return [{ key: "ratingGenel", label: "Genel Puan" }];
    default:
      return [{ key: "ratingGenel", label: "Genel Puan" }];
  }
};

export default function LocationRating({
  locationId,
  category,
  currentVoteCount,
}: LocationRatingProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});

  const criteria = getCriteria(category);

  useEffect(() => {
    const votedLocations: string[] = JSON.parse(
      localStorage.getItem("votedLocations") || "[]"
    );
    if (votedLocations.includes(locationId)) setHasVoted(true);
  }, [locationId]);

  const handleScoreChange = (key: string, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(scores).length < criteria.length) {
      return toast.error("Lütfen tüm kriterlere puan verin.");
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rate-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId, scores }),
      });

      if (!res.ok) throw new Error("Hata oluştu");

      const votedLocations: string[] = JSON.parse(
        localStorage.getItem("votedLocations") || "[]"
      );
      localStorage.setItem(
        "votedLocations",
        JSON.stringify([...votedLocations, locationId])
      );

      setHasVoted(true);
      toast.success("Değerlendirmeniz kaydedildi! 🌟");
    } catch {
      toast.error("Puan gönderilemedi, tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasVoted) {
    return (
      <div className="mt-4 p-4 bg-emerald-50 rounded-xl text-center border border-emerald-100">
        <p className="text-sm font-bold text-emerald-700">
          Değerlendirmeniz için teşekkürler! 🌟
        </p>
        <p className="text-xs text-emerald-600 mt-1">
          Bu mekanı {currentVoteCount + 1} kişi oyladı.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
      <h4 className="text-sm font-bold text-slate-800 mb-3">Sen de Puanla</h4>
      <div className="space-y-3 mb-4">
        {criteria.map((c) => (
          <div key={c.key} className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              {c.label}
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleScoreChange(c.key, star)}
                  className={`text-lg transition-colors cursor-pointer ${
                    (scores[c.key] || 0) >= star
                      ? "text-amber-400"
                      : "text-slate-300 hover:text-amber-200"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full py-2.5 bg-slate-800 text-white text-sm font-bold rounded-lg shadow hover:bg-slate-700 transition disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? "Gönderiliyor..." : "Puanı Gönder"}
      </button>
    </div>
  );
}
