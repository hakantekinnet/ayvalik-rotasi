// ============================================
// AYVALIK ROTASI — Data Types (CMS-Ready)
// ============================================
// These interfaces are designed to map directly
// to a headless CMS schema (Supabase, Sanity, etc.)

export interface LocationData {
  id: string;
  slug?: string;
  title: string;
  category: "Plaj" | "Tarihi" | "Manzara" | "Mekan" | "Eğlence";
  region?: string;
  description: string;
  top: string;
  left: string;
  images?: string[];
  imageUrls?: string[];
  reelsUrl?: string;
  reelUrl?: string;
  isOpportunity?: boolean;
  opportunityText?: string;
  opportunityCode?: string;
  // Rating system
  voteCount?: number;
  ratingLezzet?: number;
  ratingFiyat?: number;
  ratingAtmosfer?: number;
  ratingDeniz?: number;
  ratingTemizlik?: number;
  ratingTesis?: number;
  ratingGenel?: number;
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
