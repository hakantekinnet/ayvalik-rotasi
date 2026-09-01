import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Haberler ve Etkinlikler",
  description:
    "Ayvalık ve Cunda'dan güncel haberleri, duyuruları ve yaklaşan etkinlikleri takip edin.",
  path: "/feed",
});

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
