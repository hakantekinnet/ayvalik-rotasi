"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarPlus, ChevronDown } from "lucide-react";
import {
  generateGoogleCalendarUrl,
  downloadIcsFile,
  type CalendarEventInput,
} from "@/utils/calendarUtils";

interface AddToCalendarProps {
  title: string;
  description?: string;
  startsAt: string;
  endsAt?: string;
  location?: string;
  /** Compact mode for small cards */
  compact?: boolean;
}

export function AddToCalendar({
  title,
  description,
  startsAt,
  endsAt,
  location,
  compact = false,
}: AddToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Don't render if there's no start date
  if (!startsAt) return null;

  const eventData: CalendarEventInput = {
    title,
    description,
    startsAt,
    endsAt,
    location,
  };

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(eventData);
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const handleIcsDownload = () => {
    downloadIcsFile(eventData);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 font-semibold transition-all duration-200 rounded-xl border cursor-pointer ${
          compact
            ? "text-[10px] px-2.5 py-1.5 bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
            : "text-xs px-3.5 py-2 bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:border-blue-200"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <CalendarPlus size={compact ? 12 : 14} />
        Takvime Ekle
        <ChevronDown
          size={compact ? 10 : 12}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={handleGoogleCalendar}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
          >
            {/* Google Calendar icon */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10z"
                opacity="0.1"
              />
              <path
                fill="#4285F4"
                d="M17.5 6.5h-11a1 1 0 00-1 1v11a1 1 0 001 1h11a1 1 0 001-1v-11a1 1 0 00-1-1zm-1 11h-9v-7h9v7z"
              />
              <rect fill="#EA4335" x="7" y="4" width="2" height="4" rx="0.5" />
              <rect fill="#EA4335" x="15" y="4" width="2" height="4" rx="0.5" />
            </svg>
            <div>
              <span className="font-semibold block">Google Takvim</span>
              <span className="text-[10px] text-gray-400">Yeni sekmede açılır</span>
            </div>
          </button>

          <div className="h-px bg-gray-100" />

          <button
            onClick={handleIcsDownload}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
          >
            {/* Apple Calendar icon */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <rect
                x="2"
                y="3"
                width="20"
                height="18"
                rx="3"
                fill="#FF3B30"
                opacity="0.15"
              />
              <rect
                x="3"
                y="8"
                width="18"
                height="12"
                rx="2"
                fill="white"
                stroke="#FF3B30"
                strokeWidth="1"
              />
              <rect x="7" y="1" width="2" height="5" rx="1" fill="#FF3B30" />
              <rect x="15" y="1" width="2" height="5" rx="1" fill="#FF3B30" />
              <text
                x="12"
                y="17"
                textAnchor="middle"
                fontSize="7"
                fontWeight="bold"
                fill="#FF3B30"
              >
                .ics
              </text>
            </svg>
            <div>
              <span className="font-semibold block">Apple / Outlook</span>
              <span className="text-[10px] text-gray-400">.ics dosyası indirilir</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
