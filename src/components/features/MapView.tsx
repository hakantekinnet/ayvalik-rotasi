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
      <div className="relative w-full min-h-[60vh] rounded-3xl overflow-hidden shadow-lg">
        {/* Map Image */}
        <img
          src="/ayvalik-harita-final.png"
          alt="Stilize Ayvalık Haritası Final"
          className="w-full h-full object-contain opacity-90 drop-shadow-lg"
        />

        {/* Dynamic Map Pins — percentage-based overlay */}
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
