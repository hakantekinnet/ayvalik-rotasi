"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouteStore, RouteLocation } from "@/store/useRouteStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  MapPin,
  Navigation,
  ChevronLeft,
  Route,
  GripVertical,
} from "lucide-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ── Sortable Route Item ────────────────────────────────────────────────────

interface SortableRouteItemProps {
  location: RouteLocation;
  index: number;
  onRemove: (id: string) => void;
}

function SortableRouteItem({
  location,
  index,
  onRemove,
}: SortableRouteItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: location._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: "relative" as const,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-shadow duration-200 ${
        isDragging
          ? "shadow-xl border-aegean-300 ring-2 ring-aegean-400/30 scale-[1.02]"
          : "border-slate-100 hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-4">
        {/* Drag Handle */}
        <button
          className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-colors cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
          aria-label="Sırala"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>

        {/* Order number */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F766E] to-[#0D9488] flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white text-sm font-extrabold">
            {index + 1}
          </span>
        </div>

        {/* Location info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-800 truncate">
            {location.title}
          </h3>
          {location.geopoint?.lat && location.geopoint?.lng && (
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {location.geopoint.lat.toFixed(4)}°N,{" "}
              {location.geopoint.lng.toFixed(4)}°E
            </p>
          )}
          {location.isOpportunity && location.opportunityText && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md w-fit border border-amber-200">
              <span>🎁 {location.opportunityText}</span>
              {location.opportunityCode && (
                <span className="font-bold text-amber-700">
                  (Kod: {location.opportunityCode})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Remove button */}
        <button
          onClick={() => onRemove(location._id)}
          className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-500 transition-all duration-200 active:scale-90 flex-shrink-0"
          aria-label={`${location.title} mekanını rotadan çıkar`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function RotamPage() {
  const [mounted, setMounted] = useState(false);
  const { routeList, removeFromRoute, reorderRoute, clearRoute } =
    useRouteStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // DnD sensors — pointer (mouse), touch, and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = routeList.findIndex((l) => l._id === active.id);
    const newIndex = routeList.findIndex((l) => l._id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderRoute(oldIndex, newIndex);
    }
  };

  if (!mounted) return null;

  // Build Google Maps Directions URL with origin/waypoints/destination
  const validStops = routeList
    .filter((loc) => loc.geopoint?.lat != null && loc.geopoint?.lng != null)
    .map((loc) => `${loc.geopoint!.lat},${loc.geopoint!.lng}`);

  let mapsUrl = "https://www.google.com/maps/dir/?api=1&travelmode=walking";
  if (validStops.length === 1) {
    mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(validStops[0])}&travelmode=walking&dir_action=navigate`;
  } else if (validStops.length >= 2) {
    const origin = validStops[0];
    const destination = validStops[validStops.length - 1];
    const waypoints = validStops.slice(1, -1).join("|");
    mapsUrl += `&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
    if (waypoints) {
      mapsUrl += `&waypoints=${encodeURIComponent(waypoints)}`;
    }
  }

  // ── Empty State ──────────────────────────────────────────────────────────
  if (routeList.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-slate-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-sm"
        >
          {/* Empty illustration */}
          <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#0F766E]/10 to-[#0F766E]/5 flex items-center justify-center">
            <Route size={48} className="text-[#0F766E]/40" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-800 mb-3">
            Rotanız Henüz Boş
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Haritadan mekanları keşfedin ve &quot;Rotaya Ekle&quot; butonuyla
            kendi rotanızı oluşturun.
          </p>

          <Link href="/">
            <div className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0F766E] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#0F766E]/25 hover:shadow-xl hover:shadow-[#0F766E]/30 transition-all duration-300 hover:scale-105 active:scale-95">
              <MapPin size={18} />
              Haritaya Git
            </div>
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── List State ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-48">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors active:scale-95">
                <ChevronLeft size={20} className="text-slate-600" />
              </div>
            </Link>
            <div>
              <h1 className="text-lg font-extrabold text-slate-800 leading-tight">
                Rotam
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                {routeList.length} mekan seçildi · Sürükle & bırak ile sırala
              </p>
            </div>
          </div>

          {/* Clear all */}
          <button
            onClick={clearRoute}
            className="text-xs font-semibold text-red-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200"
          >
            Tümünü Sil
          </button>
        </div>
      </div>

      {/* Location List — DnD enabled */}
      <div className="max-w-lg mx-auto px-5 pt-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={routeList.map((l) => l._id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {routeList.map((loc, index) => (
                  <motion.div
                    key={loc._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: 60,
                      transition: { duration: 0.2 },
                    }}
                    transition={{
                      type: "spring",
                      damping: 25,
                      stiffness: 300,
                    }}
                  >
                    <SortableRouteItem
                      location={loc}
                      index={index}
                      onRemove={removeFromRoute}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </ul>
          </SortableContext>
        </DndContext>

        {/* Route path connector (visual decoration) */}
        <div className="flex flex-col items-center mt-6 mb-2">
          <div className="w-px h-8 bg-gradient-to-b from-slate-200 to-transparent" />
        </div>

        {/* Action Buttons — inline under list */}
        <div className="mt-10 flex flex-col gap-3 pb-32">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-3 py-4 px-8 rounded-2xl bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#14B8A6] text-white font-extrabold text-base tracking-wide shadow-xl shadow-[#0F766E]/30 cursor-pointer"
            >
              <Navigation size={20} strokeWidth={2.5} />
              Rotamı Haritalarda Aç
            </motion.div>
          </a>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              "Ayvalık'ta harika bir rota planladım! 🗺️✨\n\n" +
                routeList.map((loc) => "📍 " + loc.title).join("\n") +
                "\n\nHaritada görmek için tıkla:\n" +
                mapsUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-2xl bg-[#25D366] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#25D366]/25 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp&apos;ta Paylaş
            </motion.div>
          </a>

          <p className="text-center text-[11px] text-slate-400 mt-1 font-medium">
            Google Haritalar ile {routeList.length} duraklı rota
          </p>
        </div>
      </div>
    </div>
  );
}
