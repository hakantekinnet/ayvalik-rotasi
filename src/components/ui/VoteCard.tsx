"use client";

import { motion } from "framer-motion";
import { Check, MapPin } from "lucide-react";
import { VoteOption } from "@/lib/types";

interface VoteCardProps {
  option: VoteOption;
  totalVotes: number;
  isSelected: boolean;
  hasVoted: boolean;
  onVote: (optionId: string) => void;
  index: number;
}

export function VoteCard({
  option,
  totalVotes,
  isSelected,
  hasVoted,
  onVote,
  index,
}: VoteCardProps) {
  const percentage =
    totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileTap={!hasVoted ? { scale: 0.97 } : undefined}
      onClick={() => !hasVoted && onVote(option.id)}
      disabled={hasVoted}
      className={`relative w-full text-left rounded-2xl border overflow-hidden transition-all duration-300 ${
        isSelected
          ? "border-aegean-400 bg-aegean-50 shadow-md shadow-aegean-500/10"
          : hasVoted
          ? "border-card-border bg-card-bg opacity-70"
          : "border-card-border bg-card-bg hover:border-aegean-200 hover:shadow-sm active:bg-aegean-50/50"
      }`}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Image Placeholder */}
        <div
          className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors duration-300 ${
            isSelected
              ? "bg-gradient-to-br from-aegean-400 to-aegean-500"
              : "bg-gradient-to-br from-gray-100 to-gray-200"
          }`}
        >
          <MapPin
            size={22}
            className={isSelected ? "text-white" : "text-foreground-muted"}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4
              className={`font-heading font-bold text-sm truncate ${
                isSelected ? "text-aegean-700" : "text-foreground"
              }`}
            >
              {option.title}
            </h4>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 20,
                }}
                className="flex-shrink-0 w-6 h-6 rounded-full bg-aegean-500 flex items-center justify-center"
              >
                <Check size={14} className="text-white" strokeWidth={3} />
              </motion.div>
            )}
          </div>

          {/* Vote Bar */}
          {hasVoted && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-foreground-muted">
                  {option.votes} oy
                </span>
                <span
                  className={`text-xs font-bold ${
                    isSelected ? "text-aegean-600" : "text-foreground-muted"
                  }`}
                >
                  %{percentage}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2 + index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className={`h-full rounded-full ${
                    isSelected
                      ? "bg-gradient-to-r from-aegean-400 to-aegean-500"
                      : "bg-gray-300"
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
