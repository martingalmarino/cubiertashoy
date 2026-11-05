import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/SkipLink";
import { JsonLd } from "@/components/JsonLd";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getMedidas } from "@/lib/data";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — precio de cubiertas por medida`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Compará precios de cubiertas por medida en Argentina. El mejor precio de hoy y si el descuento es real.",
  applicationName: SITE_NAME,
  keywords: [
    "precio cubiertas",
    "cubiertas Argentina",
    "neumáticos",
    "175/65 R14",
    "comparador precios",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "El mejor precio de tu cubierta, hoy. Compará tiendas de todo el país.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "El mejor precio de tu cubierta, hoy. Compará tiendas de todo el país.",
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

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/icon`,
    description:
      "Comparador de precios de cubiertas por medida en Argentina.",
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
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-fondo font-sans text-tinta-900">
        <ThemeProvider>
          <JsonLd data={orgLd} />
          <JsonLd data={websiteLd} />
          <TooltipProvider>
            <SkipLink />
            <Header medidas={medidas} />
            <main id="contenido" className="flex-1">
              {children}
            </main>
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
