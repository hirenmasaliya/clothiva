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

// --- SEO & METADATA ---
export const metadata: Metadata = {
  // Note: Make sure this matches your actual live domain to avoid SEO penalties
  metadataBase: new URL("https://clothivaelite.vercel.app"), 
  title: {
    default: "Clothiva | Authentic Jetpur Bandhani Dresses for Women",
    template: "%s | Clothiva Bandhani"
  },
  description: "Shop premium women's Bandhani dresses direct from Jetpur, Gujarat. Discover our exclusive collection of authentic, handcrafted cotton and satin Bandhej suits.",
  keywords: [
    "Women's Bandhani Dresses",
    "Jetpur Bandhani Suits",
    "Cotton Bandhani Dress",
    "Satin Bandhani for Women",
    "Authentic Gujarati Bandhej",
    "Hand-dyed Cotton Bandhani",
    "Premium Satin Ethnic Wear",
    "Clothiva Online Store Jetpur"
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
    title: "Clothiva | Authentic Jetpur Bandhani for Women",
    description: "Handcrafted cotton and satin Bandhani dresses direct from the artisans of Jetpur.",
    url: "https://clothivaelite.vercel.app",
    siteName: "Clothiva",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Clothiva Premium Women's Bandhani Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clothiva | Jetpur Bandhani Dresses",
    description: "Premium cotton and satin Bandhani for women. Handcrafted in Jetpur.",
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
  maximumScale: 5, 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org Structured Data for Google Search Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore", // Changed from ShoppingCenter to ClothingStore for better e-commerce SEO
    "name": "Clothiva",
    "url": "https://clothivaelite.vercel.app/",
    "logo": "https://clothivaelite.vercel.app/logo.png",
    "description": "Authentic women's cotton and satin Bandhani dresses crafted in Jetpur, Gujarat.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Jetpur",
      "addressRegion": "Gujarat",
      "addressCountry": "IN"
    },
    "hasMap": "https://maps.google.com/?q=Jetpur+Gujarat",
    "priceRange": "₹₹",
    "department": "Women",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://clothivaelite.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Replace with your actual Google Search Console verification tag */}
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