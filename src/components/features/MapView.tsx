"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { locations } from "@/data/locations";
import { LocationCard } from "@/components/ui/LocationCard";
import { Location } from "@/lib/types";

export function MapView() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handlePinClick = (location: Location) => {
    setSelectedLocation(location);
    setIsSheetOpen(true);
  };

  return (
    <div className="relative w-full">
      {/* Map Container */}
      <div className="relative w-full aspect-[3/4] max-h-[65vh] rounded-3xl overflow-hidden shadow-lg">
        {/* Sea Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#48B4D1] to-[#0891B2]">
          {/* Wave Pattern Overlay */}
          <svg
            className="absolute bottom-0 left-0 w-full opacity-10"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,64 C150,100 350,0 500,60 C650,120 800,20 1000,80 C1100,100 1150,70 1200,64 L1200,120 L0,120 Z"
              fill="white"
            />
          </svg>
          <svg
            className="absolute bottom-8 left-0 w-full opacity-8"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,80 C200,40 400,100 600,60 C800,20 1000,90 1200,50 L1200,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>

        {/*
          =====================================================
          AYVALIK MAP SVG — Scalable Blank Canvas
          =====================================================
          This SVG acts as the map layer. Replace the placeholder
          content below with a real Ayvalık coastline SVG.

          USAGE:
          1. Export your SVG at any resolution (viewBox will scale).
          2. Paste all <path>, <polygon>, <g> elements below.
          3. Pins are positioned independently via percentage
             coordinates, so they'll overlay correctly regardless
             of SVG content.
          =====================================================
        */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 1333"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ayvalık Anakara */}
          <path 
            d="M650,150 C750,200 850,400 800,650 C750,900 850,1100 700,1200 C550,1300 350,1250 400,1100 C450,950 550,750 500,500 C450,250 550,100 650,150 Z" 
            fill="currentColor" 
            className="text-cyan-700/20 drop-shadow-md transition-all duration-700 hover:text-cyan-700/30" 
          />

          {/* Cunda Adası */}
          <path 
            d="M300,350 C420,320 480,450 400,550 C320,650 200,600 220,450 C240,300 180,380 300,350 Z" 
            fill="currentColor" 
            className="text-cyan-700/20 drop-shadow-md transition-all duration-700 hover:text-cyan-700/30" 
          />

          {/* Lale Adası Bağlantısı */}
          <ellipse 
            cx="480" cy="480" rx="35" ry="50" 
            fill="currentColor" 
            className="text-cyan-700/20 drop-shadow-sm" 
          />

          {/* Dekoratif Adacıklar */}
          <circle cx="200" cy="700" r="15" fill="currentColor" className="text-olive-600/20" />
          <circle cx="850" cy="300" r="12" fill="currentColor" className="text-olive-600/20" />
          <circle cx="150" cy="500" r="20" fill="currentColor" className="text-olive-600/20" />
        </svg>

        {/* 
          =====================================================
          DYNAMIC MAP PINS
          =====================================================
          Pins are positioned using percentage-based coordinates
          from each location's `coordinates: { x, y }` values.
          
          x = percentage from left (0–100)
          y = percentage from top  (0–100)
          
          These sit on top of the SVG layer, so they work
          regardless of the map artwork underneath.
          =====================================================
        */}
        {locations.map((location, index) => (
          <motion.button
            key={location.id}
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.3 + index * 0.12,
            }}
            whileHover={{ scale: 1.2, y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePinClick(location)}
            className="absolute group"
            style={{
              left: `${location.coordinates.x}%`,
              top: `${location.coordinates.y}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            {/* Pin Shadow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 rounded-full blur-[2px]" />
            {/* Pin */}
            <div className="relative">
              <MapPin
                size={28}
                className="text-aegean-600 drop-shadow-lg"
                fill="#0891B2"
                strokeWidth={1.5}
                stroke="white"
              />
              {/* Pulse ring */}
              <motion.div
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: index * 0.4,
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-aegean-400"
              />
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-white/95 rounded-lg shadow-lg text-[10px] font-semibold text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {location.name}
            </div>
          </motion.button>
        ))}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 glass rounded-xl px-3 py-2 shadow-md">
          <p className="text-[10px] text-foreground-muted font-medium">
            📍 {locations.length} keşfedilecek nokta
          </p>
        </div>
      </div>

      {/* Location Bottom Sheet */}
      <LocationCard
        location={selectedLocation}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  );
}
