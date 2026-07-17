// ============================================
// AYVALIK ROTASI — Data Types (CMS-Ready)
// ============================================
// These interfaces are designed to map directly
// to a headless CMS schema (Supabase, Sanity, etc.)

export interface LocationData {
  id: string;
  title: string;
  category: "Plaj" | "Tarihi" | "Manzara" | "Mekan";
  description: string;
  top: string;
  left: string;
  images?: string[];
  reelsUrl?: string;
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
