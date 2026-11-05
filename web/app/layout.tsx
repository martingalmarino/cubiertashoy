import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@/components/Analytics";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/SkipLink";
import { JsonLd } from "@/components/JsonLd";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getMedidas, getVehicleSearchIndex } from "@/lib/data";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import "./globals.css";

const adsenseEnabled =
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" &&
  Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID);

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Precio neumáticos Argentina | compará cubiertas por medida`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Compará precios de neumáticos y cubiertas en tiendas de Argentina. Por medida o por auto, actualizado a diario.",
  applicationName: SITE_NAME,
  keywords: [
    "precio neumáticos",
    "neumáticos Argentina",
    "cubiertas",
    "175/65 R14",
    "comparador precios",
  ],
  authors: [{ name: SITE_NAME }],
  other: {
    "color-scheme": "light",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Compará precios de neumáticos y cubiertas en tiendas de Argentina. Por medida o por auto.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Compará precios de neumáticos y cubiertas en tiendas de Argentina. Por medida o por auto.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const medidas = getMedidas();
  const vehicles = getVehicleSearchIndex();

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/icon`,
    description:
      "Comparador de precios de neumáticos y cubiertas por medida en Argentina.",
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: "es-AR",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
    },
  };

  return (
    <html
      lang="es-AR"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip bg-fondo font-sans text-tinta-900">
        <JsonLd data={orgLd} />
        <JsonLd data={websiteLd} />
        <TooltipProvider>
          <SkipLink />
          <Header medidas={medidas} vehicles={vehicles} />
          <main id="contenido" className="flex-1 overflow-x-clip pb-24 md:pb-0">
            {children}
          </main>
          <Footer />
        </TooltipProvider>
        <Analytics />
        {adsenseEnabled ? (
          <Script
            id="adsense"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        ) : null}
      </body>
    </html>
  );
}
