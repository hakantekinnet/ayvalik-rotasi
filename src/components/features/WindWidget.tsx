"use client";

import { useState } from "react";

export function WindWidget() {
  // Mock state for wind data — wire to a real weather API later
  const [wind] = useState({
    direction: "Kuzey (Poyraz)",
    speed: "18 km/s",
    recommendation: "Badavut veya Sarımsaklı ideal!",
  });

  return (
    <div className="absolute top-24 right-4 z-[50] bg-white/70 backdrop-blur-xl shadow-lg rounded-2xl p-3 border border-white/60 w-44 transition-all hover:scale-105 cursor-pointer">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center shadow-inner">
          <span className="text-sm">🌬️</span>
        </div>
        <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">
          Rüzgar Asistanı
        </h4>
      </div>

      <div className="flex flex-col gap-0.5 mb-2">
        <p className="text-[11px] text-gray-500 font-medium">
          Yön:{" "}
          <span className="text-blue-600 font-bold">{wind.direction}</span>
        </p>
        <p className="text-[11px] text-gray-500 font-medium">
          Hız: <span className="text-gray-700">{wind.speed}</span>
        </p>
      </div>

      <div className="pt-2 border-t border-gray-200/50">
        <p className="text-[10px] text-gray-400 font-semibold mb-0.5">
          GÜNÜN ROTASI
        </p>
        <p className="text-xs font-bold text-[#0F766E] leading-tight">
          {wind.recommendation}
        </p>
      </div>
    </div>
  );
}
