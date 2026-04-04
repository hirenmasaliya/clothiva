import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"; // Added luxury font
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-serif", subsets: ["latin"] });

// --- STEP 1: SEO & ASO METADATA ---
export const metadata: Metadata = {
  title: {
    default: "Clothiva | Authentic Jetpur Bandhani & Gaji Silk",
    template: "%s | Clothiva Bandhani"
  },
  description: "Discover exclusive handcrafted Bandhani suits, Gaji Silk masterpieces, and artisanal ethnic wear from Jetpur, Gujarat. Worldwide shipping available.",
  keywords: ["Bandhani Suits", "Jetpur Bandhani", "Gaji Silk", "Hand-dyed Ethnic Wear", "Gujarat Heritage", "Luxury Indian Wear"],
  authors: [{ name: "Clothiva Artisans" }],
  openGraph: {
    title: "Clothiva | The Soul of Bandhej",
    description: "Handcrafted heritage from the heart of Jetpur.",
    url: "https://clothiva.com",
    siteName: "Clothiva",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clothiva | Authentic Bandhani",
    description: "Artisan-made Bandhani suits from Jetpur.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://clothiva.com",
  },
};

export const viewport: Viewport = {
  themeColor: "#721c24", // Clothiva Red
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${playfair.variable} antialiased bg-[#FCFAF8] text-stone-900`}>
        {/* Wrap EVERYTHING in CartProvider so Navbar can show cart count */}
        <CartProvider>
          <Navbar />
          <main id="main-content">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}