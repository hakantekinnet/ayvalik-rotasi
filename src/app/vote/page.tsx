import { client } from "@/sanity/lib/client";
import { VotingView } from "@/components/features/VotingView";

export const dynamic = 'force-dynamic';

export interface SanityPoll {
  _id: string;
  title: string;
  category: "versus" | "classic";
  emoji?: string;
  optionA_title: string;
  optionA_emoji?: string;
  optionB_title: string;
  optionB_emoji?: string;
}

async function getPolls(): Promise<SanityPoll[]> {
  try {
    const data = await client.fetch(
      `*[_type == "poll" && isActive == true] | order(_createdAt desc){
        _id,
        title,
        category,
        emoji,
        optionA_title,
        optionA_emoji,
        optionB_title,
        optionB_emoji
      }`
    );
    return data || [];
  } catch (err) {
    console.warn("Sanity polls fetch failed:", err);
    return [];
  }
}

export default async function VotePage() {
  const polls = await getPolls();
  const serializedPolls = JSON.parse(JSON.stringify(polls));

  return <VotingView sanityPolls={serializedPolls} />;
}
