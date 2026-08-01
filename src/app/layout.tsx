import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";
import { RouteFAB } from "@/components/RouteFAB";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "Ayvalık Rotası | Dijital Rehber ve Fırsatlar",
    template: "%s | Ayvalık Rotası",
  },
  description:
    "Ayvalık, Cunda ve çevresindeki en iyi mekanları keşfedin, kendi rotanızı oluşturun ve yerel esnaf fırsatlarından yararlanın.",
  keywords: [
    "Ayvalık",
    "Cunda",
    "Ege",
    "gezi",
    "turizm",
    "seyahat",
    "gün batımı",
    "rota planlama",
    "esnaf fırsatları",
  ],
  authors: [{ name: "Ayvalık Rotası" }],
  openGraph: {
    title: "Ayvalık Rotası | Kendi Tatilini Planla",
    description:
      "Ayvalık ve Cunda sokaklarında kaybolmadan önce kendi dijital rotanı oluştur, özel indirimleri yakala.",
    url: "https://ayvalik-rotasi.vercel.app",
    siteName: "Ayvalık Rotası",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ayvalık Rotası Önizleme",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayvalık Rotası | Dijital Rehber",
    description:
      "Ayvalık, Cunda ve çevresindeki en iyi mekanları keşfedin, rotanızı planlayın.",
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
    <html lang="tr" className={`${manrope.variable} h-full`}>
      <body
        className={`${manrope.className} antialiased text-slate-800 min-h-full flex flex-col`}
      >
        <main className="flex-1 pb-safe-nav">{children}</main>
        <RouteFAB />
        <BottomNav />
      </body>
    </html>
  );
}
