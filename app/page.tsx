"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ArrowRight, MapPin, Award, CheckCircle2, Sparkles, Waves, Sun,
  ShieldCheck, Heart, Coffee, Globe, Check, RefreshCw, Star, 
  Droplets, Scissors, Palette, Gem
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  title: string;
  count: number;
  price: number;
  images: string[];
  category?: string;
  description?: string;
  stock?: number;
  status?: string;
}

// Adjust to your real product route.
const productHref = (id: string) => `/shop/${id}`;
// Set to your Instagram URL; the link is hidden while empty.
const INSTAGRAM_URL = "";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-800";

const VALUES = [
  {
    icon: Gem,
    tint: "bg-red-50 text-red-800",
    title: "100% Hand-Tied Bandhej",
    text: "We reject mass-production. Every piece features thousands of individual knots tied by hand, ensuring true artisanal authenticity.",
  },
  {
    icon: Waves,
    tint: "bg-amber-50 text-amber-700",
    title: "Premium Satin Cotton",
    text: "Sourced for ultimate comfort and regal lustre. Our fabrics are breathable for Indian summers yet hold a beautiful, elegant drape.",
  },
  {
    icon: Award,
    tint: "bg-orange-50 text-orange-800",
    title: "Ethically Crafted in Jetpur",
    text: "Direct from the artisans to you. We ensure fair wages and sustainable livelihoods for the traditional craftswomen of Gujarat.",
  },
];

const COLLECTIONS = [
  {
    title: "Bridal & Trousseau",
    desc: "Heirloom pieces for your most cherished moments.",
    image: "https://images.unsplash.com/photo-1583391733958-b65749a5b3a4?q=80&w=800",
    link: "/shop?category=bridal"
  },
  {
    title: "Everyday Elegance",
    desc: "Lightweight, breathable drapes for daily sophistication.",
    image: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?q=80&w=800",
    link: "/shop?category=satin"
  },
  {
    title: "Festive Dupattas",
    desc: "A vibrant touch of heritage to elevate any ensemble.",
    image: "https://images.unsplash.com/photo-1610189045558-75b223fb39fb?q=80&w=800",
    link: "/shop?category=dupattas"
  }
];

const PROCESS_STEPS = [
  { icon: Scissors, title: "Design & Curation", text: "Selecting the finest satin cotton and tracing intricate, generations-old motifs." },
  { icon: Droplets, title: "Artisanal Tying", text: "Skilled women artisans tightly pinch and tie thousands of tiny knots by hand." },
  { icon: Palette, title: "Vat Dyeing", text: "Immersing the fabric in rich, skin-safe colors rooted in traditional Gujarati palettes." },
  { icon: Sun, title: "Sun-Drying & Finishing", text: "Naturally dried under the Saurashtra sun to lock in vibrancy, then carefully unknotted." },
];

const TESTIMONIALS = [
  {
    name: "Ananya S.",
    location: "Mumbai, India",
    text: "The quality of the satin cotton is unmatched. I wore the crimson bandhani suit for a family event and received endless compliments. It feels luxurious yet wonderfully breathable.",
  },
  {
    name: "Priya M.",
    location: "London, UK",
    text: "I ordered customized dupattas in bulk for my bridesmaids. The Clothiva team provided impeccable service, and the handcrafted detail left everyone speechless.",
  },
  {
    name: "Meera V.",
    location: "Ahmedabad, India",
    text: "You can instantly tell these aren't machine-printed. The slight, beautiful variations in the dots showcase true Jetpur craftsmanship. An absolute wardrobe staple.",
  }
];

export default function Home() {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addToCart } = useCart();

  const fetchPopular = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/products/popular");
      const data = await res.json();
      if (data.success) {
        setPopularProducts(data.rankings.slice(0, 4));
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error fetching popular products:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopular();
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, [fetchPopular]);

  const handleAdd = (item: Product) => {
    addToCart(item);
    setAddedId(item.id);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <main className="min-h-screen bg-[#FFFDFB] font-sans antialiased selection:bg-red-900 selection:text-white">
      {/* HERO */}
      <section
        aria-labelledby="hero-title"
        className="relative flex min-h-svh items-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(43,10,10,0.85) 100%), url('/images/Website_Banner.png')`,
          }}
        />

        <div className="relative z-10 w-full max-w-7xl px-6 pb-16 pt-32 text-center md:px-24 md:text-left">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-red-50 backdrop-blur-md">
            <Sparkles size={14} className="text-amber-400" />
            Authentic Jetpur Bandhani
          </p>

          <h1
            id="hero-title"
            className="mb-8 font-serif text-5xl leading-[1.05] tracking-tight text-white sm:text-7xl md:text-[90px]"
          >
            The Colors of <br />
            <span className="font-light italic text-red-300">Timeless Heritage</span>
          </h1>

          <p className="mb-10 max-w-2xl text-lg font-light leading-relaxed text-stone-200 md:text-xl">
            Discover premium, hand-tied ethnic wear crafted by master artisans in Gujarat. Where traditional legacy meets modern elegance.
          </p>

          <div className="flex flex-col items-center gap-5 sm:flex-row md:items-center">
            <Link
              href="/shop"
              className={`group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-red-900 px-10 text-sm font-semibold uppercase tracking-wider text-white shadow-2xl transition-colors hover:bg-red-800 ${FOCUS}`}
            >
              Explore Collection
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-white/85">
              <MapPin size={16} className="text-red-300" />
              Designed & Crafted in Gujarat, India
            </span>
          </div>
        </div>
      </section>

      {/* USPs / VALUES */}
      <section aria-labelledby="values-title" className="mx-auto max-w-7xl px-6 py-20 md:py-24 border-b border-stone-100">
        <h2 id="values-title" className="sr-only">Our Quality Promise</h2>
        <div className="grid gap-12 md:grid-cols-3 md:gap-0">
          {VALUES.map(({ icon: Icon, tint, title, text }, i) => (
            <div
              key={title}
              className={`space-y-4 text-center md:px-10 ${i > 0 ? "md:border-l md:border-stone-200" : ""}`}
            >
              <div className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${tint}`}>
                <Icon size={24} strokeWidth={1.75} />
              </div>
              <h3 className="font-serif text-2xl text-stone-900">{title}</h3>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section aria-labelledby="categories-title" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mb-12 text-center md:flex md:items-end md:justify-between md:text-left">
          <div>
            <h2 id="categories-title" className="font-serif text-4xl tracking-tight text-stone-900 md:text-5xl">
              Curated <span className="italic text-red-800">Collections</span>
            </h2>
            <p className="mt-4 text-lg text-stone-600">Find the perfect drape for your every mood and occasion.</p>
          </div>
          <Link
            href="/shop"
            className={`group mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-stone-900 hover:text-red-800 md:mt-0 ${FOCUS}`}
          >
            View All Categories
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5 motion-reduce:transition-none" />
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {COLLECTIONS.map((category) => (
            <Link 
              key={category.title} 
              href={category.link}
              className={`group relative flex h-[450px] w-full flex-col justify-end overflow-hidden rounded-2xl p-8 ${FOCUS}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent transition-colors duration-500 group-hover:via-stone-900/40 z-10" />
              <img 
                src={category.image} 
                alt={category.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="relative z-20 translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="font-serif text-3xl text-white">{category.title}</h3>
                <p className="mt-3 text-sm text-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">{category.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PREMIUM MATERIAL FOCUS */}
      <section aria-labelledby="material-title" className="bg-stone-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
            <div className="order-2 space-y-7 md:order-1">
              <p className="inline-flex items-center gap-3 text-sm uppercase tracking-widest text-stone-500 font-bold">
                <span className="rounded bg-red-900 px-2.5 py-1 text-[10px] text-white">Signature Fabric</span>
                The Clothiva Standard
              </p>
              <h2 id="material-title" className="font-serif text-4xl tracking-tight text-stone-900 md:text-5xl">
                Experience the luxury of <br />
                <span className="font-medium italic text-red-800">Pure Satin Cotton.</span>
              </h2>
              <p className="max-w-xl text-lg leading-relaxed text-stone-600">
                We utilize a specialized four-over-one weave technique. The result? A fabric that possesses the magnificent, glowing drape of silk on the outside, while retaining the breathable, sweat-wicking comfort of pure cotton against your skin.
              </p>
              <div className="grid gap-4 pt-4 sm:grid-cols-2">
                {[
                  { icon: Sparkles, title: "Elegant Sheen", text: "A subtle, sophisticated luster suitable for formal events." },
                  { icon: Sun, title: "All-Day Comfort", text: "Highly breathable composition designed specifically for Indian climates." },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                    <Icon className="mb-3 text-red-900" size={20} strokeWidth={2} />
                    <h3 className="mb-1.5 text-sm font-bold text-stone-900">{title}</h3>
                    <p className="text-xs leading-relaxed text-stone-500">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <figure className="relative order-1 md:order-2">
              <img
                src="https://5.imimg.com/data5/YE/AN/PT/SELLER-22984508/cotton-satin-fabric.jpg"
                loading="lazy"
                className="aspect-[4/5] w-full rounded-2xl object-cover shadow-2xl"
                alt="Close up of premium satin cotton fabric folds"
              />
              <figcaption className="absolute -bottom-6 -left-6 rounded-xl border border-stone-100 bg-white p-6 shadow-xl md:-left-12">
                <p className="font-serif text-4xl leading-none text-red-900 font-bold">80g</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-stone-400">Thread Density</p>
                <p className="mt-1 text-xs text-stone-500">For maximum durability</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* POPULAR PRODUCTS / BESTSELLERS */}
      <section aria-labelledby="popular-title" className="mx-auto max-w-7xl px-6 py-24 md:py-28">
        <div className="mb-14 flex flex-col items-center justify-between gap-5 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <h2 id="popular-title" className="font-serif text-4xl tracking-tight text-stone-900 md:text-5xl">
              Bestselling <span className="italic text-red-800">Silhouettes</span>
            </h2>
            <p className="mt-2 text-base text-stone-600">The most sought-after pieces this season.</p>
          </div>
          <Link
            href="/shop"
            className={`group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-stone-900 hover:text-red-800 ${FOCUS}`}
          >
            Shop All Arrivals
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5 motion-reduce:transition-none" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8" aria-busy="true" aria-label="Loading popular products">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[3/4] animate-pulse rounded-xl bg-stone-100 motion-reduce:animate-none" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-stone-100 motion-reduce:animate-none" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-stone-100 motion-reduce:animate-none" />
              </div>
            ))}
          </div>
        ) : error || popularProducts.length === 0 ? (
          <div className="mx-auto max-w-md rounded-xl border border-stone-200 bg-stone-50 p-10 text-center">
            <p className="font-serif text-2xl text-stone-900">
              {error ? "Unable to load catalogue" : "No new arrivals yet"}
            </p>
            <p className="mt-2 text-sm text-stone-500">
              {error ? "Please check your connection and try again." : "We are updating our inventory. Please check back soon."}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              {error && (
                <button
                  type="button"
                  onClick={fetchPopular}
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-red-900 px-6 text-sm font-semibold text-white hover:bg-red-800 ${FOCUS}`}
                >
                  <RefreshCw size={16} /> Retry
                </button>
              )}
            </div>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-8">
            {popularProducts.map((item, idx) => {
              const added = addedId === item.id;
              return (
                <li key={item.id} className="group flex flex-col">
                  <Link href={productHref(item.id)} className={`block ${FOCUS}`}>
                    <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-xl bg-stone-100 transition-all duration-300 group-hover:shadow-md">
                      {idx === 0 && (
                        <span className="absolute left-3 top-3 z-10 rounded bg-stone-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                          Top Seller
                        </span>
                      )}
                      <img
                        src={item.images?.[0]}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                      />
                    </div>
                    <h3 className="font-serif text-lg leading-snug text-stone-900 group-hover:text-red-800 line-clamp-1">{item.title}</h3>
                  </Link>
                  <div className="mt-1.5 flex items-baseline justify-between gap-2">
                    <p className="text-base font-semibold text-stone-900">₹{item.price.toLocaleString("en-IN")}</p>
                    <span className="text-xs text-stone-400">Sold: {item.count}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAdd(item)}
                    aria-live="polite"
                    className={`mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors ${FOCUS} ${
                      added
                        ? "border-emerald-700 bg-emerald-700 text-white"
                        : "border-stone-300 bg-white text-stone-900 hover:border-red-900 hover:bg-red-900 hover:text-white"
                    }`}
                  >
                    {added ? (<><Check size={16} /> Added</>) : "Add to Cart"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* THE PROCESS */}
      <section aria-labelledby="process-title" className="border-y border-stone-100 bg-white py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 id="process-title" className="font-serif text-4xl tracking-tight text-stone-900 md:text-5xl">
              The Anatomy of <span className="italic text-red-800">Authenticity</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
              True Bandhani cannot be rushed. Discover the meticulous four-step process that brings every Clothiva piece to life.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {PROCESS_STEPS.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-900">
                  <step.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 font-serif text-xl text-stone-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-stone-500 px-2">{step.text}</p>
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="absolute right-0 top-8 -mr-6 hidden -translate-y-1/2 text-stone-300 md:block">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND ETHOS / ARTISANS */}
      <section
        aria-labelledby="artisans-title"
        className="mx-3 my-16 overflow-hidden rounded-3xl bg-stone-950 py-24 text-white md:mx-auto md:max-w-7xl md:my-24 md:py-28"
      >
        <div className="grid items-center gap-16 px-6 md:grid-cols-2 md:gap-24 md:px-16">
          <div className="space-y-8">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-amber-500">
              <Award size={16} /> Ethical Fashion Promise
            </p>
            <h2 id="artisans-title" className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              Empowering the <br />
              <span className="font-light italic text-stone-400">Master Artisans of Jetpur.</span>
            </h2>
            <p className="max-w-xl text-lg font-light leading-relaxed text-stone-300">
              Clothiva is deeply committed to preserving India's textile heritage. By operating directly in Jetpur, we eliminate middlemen, ensuring our female artisan partners receive the fair compensation and recognition their artistry demands.
            </p>
            <ul className="space-y-4">
              {["100% Fair Trade & Direct Compensation", "Funding Local Community Education"].map((t) => (
                <li key={t} className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <CheckCircle2 className="shrink-0 text-amber-500" size={20} />
                  <span className="text-sm font-medium tracking-wide">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-red-900/20 blur-[100px]" aria-hidden />
            <div className="relative grid grid-cols-2 gap-4">
              <img
                src="https://cdn.shopify.com/s/files/1/0902/3202/files/Bandhani-process_large.jpg?v=1533699306"
                alt="Artisan hands crafting detailed bandhani knots"
                loading="lazy"
                className="aspect-[4/5] w-full rounded-xl object-cover shadow-2xl"
              />
              <img
                src="https://villagehaat.store/wp-content/uploads/2022/02/image.jpg.webp"
                alt="Freshly dyed fabric drying in the sun"
                loading="lazy"
                className="mt-12 aspect-[4/5] w-full rounded-xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section aria-labelledby="testimonials-title" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mb-14 text-center">
          <h2 id="testimonials-title" className="font-serif text-4xl tracking-tight text-stone-900 md:text-5xl">
            Client <span className="italic text-red-800">Experiences</span>
          </h2>
          <p className="mt-4 text-lg text-stone-600">Hear from women who have made Clothiva a part of their story.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((review, i) => (
            <div key={i} className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
              <div>
                <div className="mb-6 flex text-amber-500">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-stone-600">&quot;{review.text}&quot;</p>
              </div>
              <div className="mt-8 border-t border-stone-100 pt-4">
                <p className="font-bold text-stone-900">{review.name}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mt-1">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        aria-labelledby="cta-title"
        className="relative mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center overflow-hidden bg-stone-900 md:rounded-3xl mb-12"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-red-950/90 to-stone-900/60" />
        <div className="relative z-10 px-6 py-20 text-center text-white">
          <h2 id="cta-title" className="mb-8 font-serif text-4xl md:text-6xl">
            Ready to drape <br/> <span className="font-light italic">pure elegance?</span>
          </h2>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className={`group inline-flex h-14 items-center gap-3 rounded-full bg-white px-8 text-sm font-bold uppercase tracking-wider text-stone-900 transition-colors hover:bg-stone-200 ${FOCUS}`}
            >
              Shop The Collection
            </Link>
            <Link
              href="/bulk-orders"
              className={`inline-flex h-14 items-center rounded-full border border-white/30 px-8 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10 hover:border-white/50 ${FOCUS}`}
            >
              Corporate & Bridal Bulk
            </Link>
          </div>
          <ul className="mt-12 flex flex-wrap justify-center gap-8 text-xs font-medium uppercase tracking-widest text-white/70">
            <li className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-amber-500" /> Secure Checkout
            </li>
            <li className="flex items-center gap-2">
              <Globe size={18} className="text-amber-500" /> Worldwide Shipping
            </li>
            <li className="flex items-center gap-2">
              <RefreshCw size={18} className="text-amber-500" /> Easy Returns
            </li>
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-12 md:flex-row">
          <div className="space-y-2 text-center md:text-left">
            <p className="font-serif text-2xl font-bold text-stone-900">Clothiva <span className="italic font-light">Heritage</span></p>
            <p className="text-xs uppercase tracking-widest text-stone-400">© 2026 Jetpur, Gujarat</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {[
              { name: "About Us", href: "/story" },
              { name: "Bulk Inquiries", href: "/bulk-orders" },
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms of Service", href: "/terms" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className={`text-sm font-medium text-stone-500 hover:text-red-900 transition-colors ${FOCUS}`}>
                {l.name}
              </Link>
            ))}
            {INSTAGRAM_URL && (
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={`text-sm font-medium text-stone-500 hover:text-red-900 transition-colors ${FOCUS}`}>
                Instagram
              </a>
            )}
          </nav>
        </div>
      </footer>
    </main>
  );
}