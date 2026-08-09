import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";
import { DesktopHeader } from "@/components/layout/DesktopHeader";
import { RouteFAB } from "@/components/RouteFAB";
import { JsonLd } from "@/components/seo/JsonLd";
import { Toaster } from "sonner";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800"],
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
  themeColor: "#FAFAFA",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Ayvalık Rotası",
  alternateName: "Ayvalik Rotasi",
  url: "https://ayvalik-rotasi.vercel.app",
  description:
    "Ayvalık, Cunda ve çevresindeki en iyi mekanları keşfedin, kendi rotanızı oluşturun ve yerel esnaf fırsatlarından yararlanın.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://ayvalik-rotasi.vercel.app/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "Ayvalık Rotası",
    url: "https://ayvalik-rotasi.vercel.app",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${manrope.variable} ${playfair.variable} h-full`}>
      <body
        className={`${manrope.className} antialiased text-slate-800 min-h-full flex flex-col`}
      >
        <DesktopHeader />
        <JsonLd schema={websiteSchema} />
        <main className="flex-1 pb-safe-nav lg:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        {modal}
        <Toaster position="top-center" richColors theme="light" />
        <RouteFAB />
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
