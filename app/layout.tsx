import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"]
});

// --- SEO & ASO METADATA ---
export const metadata: Metadata = {
  metadataBase: new URL("https://clothiva.com"),
  title: {
    default: "Clothiva | Premium Jetpur Bandhani & Gaji Silk for Men & Women",
    template: "%s | Clothiva Bandhani"
  },
  description: "Shop authentic Jetpur Bandhani suits, Gaji Silk sarees, and handcrafted ethnic wear for all ages. Experience the soul of Gujarat's heritage with worldwide shipping.",
  keywords: [
    "Bandhani Suits Women",
    "Mens Bandhani Kurta",
    "Gaji Silk Dupatta",
    "Jetpur Bandhani Shop",
    "Traditional Gujarati Wear",
    "Ethnic Wear for Men and Women",
    "Hand-dyed Silk Suits",
    "Clothiva Online Store"
  ],
  authors: [{ name: "Clothiva Artisans" }],
  creator: "Clothiva",
  publisher: "Clothiva",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Clothiva | The Soul of Authentic Bandhej",
    description: "Handcrafted heritage from the heart of Jetpur. Luxury ethnic wear for every generation.",
    url: "https://clothivaelite.vercel.app",
    siteName: "Clothiva",
    images: [
      {
        url: "/og-image.jpg", // Ensure this exists in your public folder
        width: 1200,
        height: 630,
        alt: "Clothiva Premium Bandhani Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clothiva | Authentic Jetpur Heritage",
    description: "Premium Bandhani and Gaji Silk delivered worldwide.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://clothivaelite.vercel.app",
  },
};

export const viewport: Viewport = {
  themeColor: "#721c24", // Clothiva Deep Red
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Good for accessibility/elderly users zooming in
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org Structured Data for Google Search Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ShoppingCenter",
    "name": "Clothiva",
    "url": "https://clothivaelite.vercel.app/",
    "logo": "https://clothivaelite.vercel.app/logo.png",
    "description": "Authentic Bandhani and Gaji Silk from Jetpur, Gujarat.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Jetpur",
      "addressRegion": "Gujarat",
      "addressCountry": "IN"
    },
    "hasMap": "https://maps.google.com/?q=Jetpur+Gujarat",
    "priceRange": "₹₹",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://clothiva.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="google-site-verification" content="ujepGveDMXYuesLNDXExdHvx6bJVO6a9MODRvUAt4kg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${playfair.variable} antialiased bg-[#FCFAF8] text-stone-900 selection:bg-[#721c24] selection:text-white`}
      >
        <CartProvider>
          <Navbar />
          <main id="main-content" role="main" className="min-h-screen">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}