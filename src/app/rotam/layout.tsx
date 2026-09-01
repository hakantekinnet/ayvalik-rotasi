import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Rotam",
  description: "Ayvalık için oluşturduğun kişisel gezi rotası.",
  path: "/rotam",
  noIndex: true,
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
