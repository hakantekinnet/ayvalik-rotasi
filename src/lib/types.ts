// ============================================
// AYVALIK ROTASI — Data Types (CMS-Ready)
// ============================================
// These interfaces are designed to map directly
// to a headless CMS schema (Supabase, Sanity, etc.)

export interface Location {
  id: string;
  name: string;
  description: string;
  image: string;
  coordinates: { x: number; y: number }; // Percentage-based for SVG map
  instagramUrl: string;
  category: "beach" | "historic" | "nature" | "food" | "viewpoint";
}

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  date: string; // ISO date string
  category: string;
  image?: string;
  shareUrl: string;
}

export interface VoteOption {
  id: string;
  title: string;
  image: string;
  votes: number;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO date string
  options: VoteOption[];
  totalVotes: number;
}
