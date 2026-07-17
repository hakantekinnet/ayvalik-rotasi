import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ayvalık Rotası",
  description:
    "Ege'nin incisi Ayvalık'ı keşfet. Plajlar, tarihi mekanlar ve en iyi rotalar.",
  keywords: [
    "Ayvalık",
    "Cunda",
    "Ege",
    "gezi",
    "turizm",
    "seyahat",
    "gün batımı",
  ],
  authors: [{ name: "Ayvalık Rotası" }],
  openGraph: {
    title: "Ayvalık Rotası - Ege'nin İncisini Keşfet",
    description:
      "Ayvalık'ın gizli kalmış plajlarını, tarihi sokaklarını ve en iyi lezzet duraklarını interaktif harita ile keşfet.",
    type: "website",
    locale: "tr_TR",
    images: [
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FAFAFA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <main className="flex-1 pb-safe-nav">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
