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
  title: "Ayvalık Rotası | Keşfet, Paylaş, Oyla",
  description:
    "Ayvalık'ın en güzel rotalarını keşfedin, haberleri takip edin ve favori mekanlarınıza oy verin. Ayvalık Rotası ile Ege'nin incisini cebinize taşıyın.",
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
    title: "Ayvalık Rotası",
    description: "Ayvalık'ı keşfetmenin en güzel yolu",
    type: "website",
    locale: "tr_TR",
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
