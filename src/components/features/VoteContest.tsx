"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Calendar, CheckCircle2 } from "lucide-react";
import { Contest } from "@/lib/types";
import { VoteCard } from "@/components/ui/VoteCard";

interface VoteContestProps {
  contest: Contest;
}

export function VoteContest({ contest }: VoteContestProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [updatedContest, setUpdatedContest] = useState(contest);

  const handleVote = (optionId: string) => {
    setSelectedOptionId(optionId);
    setHasVoted(true);

    // Simulate vote count update
    setUpdatedContest((prev) => ({
      ...prev,
      totalVotes: prev.totalVotes + 1,
      options: prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      ),
    }));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-card-bg rounded-2xl border border-card-border overflow-hidden shadow-sm">
      {/* Contest Header */}
      <div className="p-5 border-b border-card-border">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aegean-400 to-aegean-600 flex items-center justify-center flex-shrink-0">
            <Trophy size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-foreground leading-snug">
              {contest.title}
            </h3>
            <p className="text-foreground-muted text-sm mt-1">
              {contest.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-foreground-muted">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            Son tarih: {formatDate(contest.deadline)}
          </span>
          <span className="font-semibold text-aegean-600">
            {updatedContest.totalVotes} toplam oy
          </span>
        </div>
      </div>

      {/* Vote Options */}
      <div className="p-4 space-y-2.5">
        {updatedContest.options.map((option, index) => (
          <VoteCard
            key={option.id}
            option={option}
            totalVotes={updatedContest.totalVotes}
            isSelected={selectedOptionId === option.id}
            hasVoted={hasVoted}
            onVote={handleVote}
            index={index}
          />
        ))}
      </div>

      {/* Voted Confirmation */}
      <AnimatePresence>
        {hasVoted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 pb-4"
          >
            <div className="flex items-center gap-2 py-2.5 px-4 bg-olive-50 rounded-xl">
              <CheckCircle2 size={16} className="text-olive-600" />
              <span className="text-sm font-medium text-olive-700">
                Oyunuz kaydedildi! Teşekkürler.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
