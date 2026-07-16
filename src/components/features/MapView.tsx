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
          {/* ================================================
              INSERT REAL AYVALIK SVG PATH HERE
              
              Paste your SVG paths/groups below. Example:
              <g id="ayvalik-coastline">
                <path d="M..." fill="#E8DFC8" stroke="#D4C9AD" />
                <path d="M..." fill="#DDD5BE" /> 
              </g>
              
              The viewBox is set to 1000x1333 (3:4 ratio)
              but you can change it to match your SVG source.
              ================================================ */}

          {/* Placeholder land mass — remove when inserting real SVG */}
          <g id="placeholder-landmass" opacity="0.9">
            {/* Main body hint */}
            <rect
              x="300"
              y="100"
              width="400"
              height="1100"
              rx="180"
              fill="#E8DFC8"
              stroke="#D4C9AD"
              strokeWidth="2"
              opacity="0.5"
            />
            {/* Island hint top-left */}
            <ellipse
              cx="250"
              cy="380"
              rx="120"
              ry="80"
              fill="#DDD5BE"
              stroke="#D4C9AD"
              strokeWidth="1.5"
              opacity="0.5"
            />
          </g>
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
