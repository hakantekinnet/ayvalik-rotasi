import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";
import { DesktopHeader } from "@/components/layout/DesktopHeader";
import { RouteFAB } from "@/components/RouteFAB";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Ayvalık Rotası | Dijital Rehber ve Fırsatlar",
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,

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
  authors: [{ name: SITE_NAME }],

  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    title: "Ayvalık Rotası | Dijital Rehber ve Fırsatlar",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: absoluteUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "Ayvalık Rotası",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ayvalık Rotası | Dijital Rehber ve Fırsatlar",
    description: SITE_DESCRIPTION,
    images: [absoluteUrl("/og-image.png")],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFAFA",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "Ayvalik Rotasi",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.png"),
    },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
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
        <GoogleAnalytics gaId="G-SZKLTWQZVB" />
      </body>
    </html>
  );
}
