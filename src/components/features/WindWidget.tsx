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
    <div className="absolute top-20 right-4 z-[50] bg-white/85 backdrop-blur-md shadow-md rounded-full pl-2 pr-4 py-1.5 border border-white/60 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer">
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
