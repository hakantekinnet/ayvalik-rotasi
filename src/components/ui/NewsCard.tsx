"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, MessageCircle, Check } from "lucide-react";
import { NewsArticle } from "@/lib/types";

interface NewsCardProps {
  article: NewsArticle;
  index: number;
}

export function NewsCard({ article, index }: NewsCardProps) {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const categoryColors: Record<string, string> = {
    Etkinlik: "bg-aegean-100 text-aegean-700",
    Ulaşım: "bg-blue-100 text-blue-700",
    Turizm: "bg-olive-100 text-olive-700",
    Kültür: "bg-amber-100 text-amber-700",
    Gelişim: "bg-purple-100 text-purple-700",
  };

  /**
   * Share to WhatsApp using the official URL scheme.
   * - Mobile: opens WhatsApp app directly
   * - Desktop: opens WhatsApp Web
   * Docs: https://faq.whatsapp.com/5913398998672956
   */
  const shareToWhatsApp = () => {
    const text = [
      `📰 *${article.headline}*`,
      "",
      article.summary,
      "",
      `🔗 ${article.shareUrl}`,
      "",
      "— Ayvalık Rotası",
    ].join("\n");

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  /**
   * Share to Instagram DM.
   * Instagram doesn't support direct DM deep links with prefilled text,
   * so we use a progressive strategy:
   * 1. Try the Web Share API (works on mobile — shows native share sheet)
   * 2. Fallback: copy link to clipboard with visual feedback
   */
  const shareToInstagram = async () => {
    const shareData = {
      title: article.headline,
      text: article.summary,
      url: article.shareUrl,
    };

    // Try native Web Share API first (mobile browsers)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or API failed — fall through to clipboard
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    // Fallback: copy to clipboard with visual confirmation
    const text = `${article.headline}\n${article.shareUrl}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch {
      // Last resort: manual select-copy prompt
      window.prompt(
        "Linki kopyalayın ve Instagram DM'de paylaşın:",
        article.shareUrl
      );
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="bg-card-bg rounded-2xl border border-card-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Category + Date */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            categoryColors[article.category] || "bg-gray-100 text-gray-600"
          }`}
        >
          {article.category}
        </span>
        <time className="text-xs text-foreground-muted">
          {formatDate(article.date)}
        </time>
      </div>

      {/* Headline */}
      <h3 className="font-heading text-base font-bold text-foreground leading-snug mb-2">
        {article.headline}
      </h3>

      {/* Summary */}
      <p className="text-foreground-muted text-sm leading-relaxed mb-4 line-clamp-2">
        {article.summary}
      </p>

      {/* Share Buttons */}
      <div className="flex gap-2.5">
        {/* WhatsApp — uses https://wa.me/ deep link */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={shareToWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:brightness-110 active:brightness-95"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageCircle size={16} fill="white" strokeWidth={0} />
          WhatsApp
        </motion.button>

        {/* Instagram — Web Share API → clipboard fallback */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={shareToInstagram}
          className="relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:brightness-110 active:brightness-95 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
          }}
        >
          <AnimatePresence mode="wait">
            {copiedToClipboard ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-1.5"
              >
                <Check size={16} />
                Kopyalandı!
              </motion.span>
            ) : (
              <motion.span
                key="share"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-1.5"
              >
                <Share2 size={16} />
                Instagram
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.article>
  );
}
