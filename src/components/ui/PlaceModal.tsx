"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useCallback } from "react";

interface PlaceModalProps {
  children: React.ReactNode;
}

export function PlaceModal({ children }: PlaceModalProps) {
  const router = useRouter();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 z-[var(--z-overlay)]"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        role="dialog"
        aria-modal="true"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[var(--z-modal)] w-[calc(100%-24px)] max-w-2xl max-h-[90dvh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Kapat"
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-20"
        >
          <X size={18} className="text-gray-600" />
        </button>

        {children}
      </motion.div>
    </>
  );
}
