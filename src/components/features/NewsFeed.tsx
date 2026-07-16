"use client";

import { useState, useEffect } from "react";
import { newsArticles } from "@/data/news";
import { NewsCard } from "@/components/ui/NewsCard";
import { NewsSkeleton } from "@/components/ui/NewsSkeleton";

export function NewsFeed() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <NewsSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {newsArticles.map((article, index) => (
        <NewsCard key={article.id} article={article} index={index} />
      ))}
    </div>
  );
}
