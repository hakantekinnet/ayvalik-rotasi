"use client";

import { useState } from "react";

export function WindWidget() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Enhanced mock data with specific beach recommendations
  const [wind] = useState({
    direction: "Kuzey (Poyraz)",
    speed: "18 km/s",
    recommendation: "Badavut veya Sarımsaklı",
    goodBeaches: ["Badavut Plajı", "Sarımsaklı Merkez", "Küçükköy Sahili"],
    badBeaches: ["Patriça Koyu", "Ortunç Koyu", "Cunda Arka Deniz"],
  });

  // EXPANDED VIEW (Detailed Card)
  if (isExpanded) {
    return (
      <div className="absolute top-20 right-4 z-[50] w-64 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-4 border border-white/60 transition-all origin-top-right">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-sm">🌬️</span>
            </div>
            <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">
              Rüzgar Asistanı
            </h4>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-0.5 mb-3 px-1">
          <p className="text-[11px] text-gray-500 font-medium">
            Yön:{" "}
            <span className="text-blue-600 font-bold">{wind.direction}</span>
          </p>
          <p className="text-[11px] text-gray-500 font-medium">
            Hız: <span className="text-gray-700">{wind.speed}</span>
          </p>
        </div>

        <div className="space-y-2">
          <div className="bg-emerald-50/80 rounded-xl p-2.5 border border-emerald-100">
            <p className="text-[10px] font-bold text-emerald-700 mb-1 flex items-center gap-1">
              ✅ BUGÜN SAKİN (GİDİLİR)
            </p>
            <p className="text-xs text-emerald-600 font-medium leading-tight">
              {wind.goodBeaches.join(", ")}
            </p>
          </div>
          <div className="bg-red-50/80 rounded-xl p-2.5 border border-red-100">
            <p className="text-[10px] font-bold text-red-700 mb-1 flex items-center gap-1">
              🌊 DALGALI OLABİLİR
            </p>
            <p className="text-xs text-red-600 font-medium leading-tight">
              {wind.badBeaches.join(", ")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // COMPACT VIEW (Pill)
  return (
    <div
      onClick={() => setIsExpanded(true)}
      className="absolute top-20 right-4 z-[50] bg-white/90 backdrop-blur-md shadow-md rounded-full pl-2 pr-4 py-1.5 border border-white/60 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer"
    >
      <div className="w-7 h-7 bg-blue-50/80 rounded-full flex items-center justify-center shadow-inner">
        <span className="text-sm leading-none">🌬️</span>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] font-extrabold text-gray-800 leading-none">
            {wind.direction}
          </span>
          <span className="text-[9px] font-medium text-gray-500 leading-none">
            ({wind.speed})
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#0F766E] leading-none mt-1 truncate max-w-[120px]">
          Rota: {wind.recommendation}
        </span>
      </div>
    </div>
  );
}
