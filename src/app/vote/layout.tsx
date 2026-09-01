import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Topluluk Oylamaları",
  description:
    "Ayvalık'ın en sevilen mekanlarını oylayın ve topluluk fotoğraflarını keşfedin.",
  path: "/vote",
});

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
