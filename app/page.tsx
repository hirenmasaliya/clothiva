"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ArrowRight, MapPin, Award, CheckCircle2, Sparkles, Waves, Sun,
  ShieldCheck, Heart, Coffee, Globe, Check, RefreshCw,
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
    icon: Heart,
    tint: "bg-red-50 text-red-800",
    title: "Ma No Prem",
    text: "Like a mother’s touch: gentle and pure. Every thread is woven with the same care she puts into her daily prayers.",
  },
  {
    icon: Sun,
    tint: "bg-amber-50 text-amber-700",
    title: "Saurashtra’s Sun",
    text: "Our fabrics are dried naturally under the golden Gujarat sun, locking in colours that stay vibrant for generations.",
  },
  {
    icon: Coffee,
    tint: "bg-orange-50 text-orange-800",
    title: "Asli Parampara",
    text: "No mass machinery. Just slow, rhythmic artistry by hand, celebrating the authentic knot of Bandhani.",
  },
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
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(43,10,10,0.88) 100%), url('/images/Website_Banner.png')`,
          }}
        />

        <div className="relative z-10 w-full max-w-7xl px-6 pb-16 pt-32 text-center md:px-24 md:text-left">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-red-50 backdrop-blur-md">
            <Sparkles size={14} className="text-amber-400" />
            Padharo. A piece of Gujarat awaits you.
          </p>

          <h1
            id="hero-title"
            className="mb-8 font-serif text-5xl leading-[0.95] tracking-tight text-white sm:text-7xl md:text-[104px]"
          >
            Varse Chhe <br />
            <span className="font-light italic text-red-300">Rangon ni Mausam</span>
          </h1>

          <p className="mb-10 max-w-2xl text-lg font-light leading-relaxed text-stone-200 md:text-2xl">
            “The colours of Jetpur don’t just sit on fabric; they live in our souls.”
            <span className="mt-2 block text-base text-stone-300 md:text-lg">
              Hand-dyed masterpieces that feel like home.
            </span>
          </p>

          <div className="flex flex-col items-center gap-5 sm:flex-row md:items-center">
            <Link
              href="/shop"
              className={`group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-red-800 px-10 text-base font-semibold text-white shadow-2xl transition-colors hover:bg-red-700 ${FOCUS}`}
            >
              Shop the collection
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
            <span className="inline-flex items-center gap-2 text-sm text-white/85">
              <MapPin size={16} className="text-red-300" />
              Born in Jetpur, loved globally
            </span>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section aria-labelledby="values-title" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <h2 id="values-title" className="sr-only">What goes into every piece</h2>
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
              <p className="mx-auto max-w-sm text-base leading-relaxed text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MATERIAL */}
      <section aria-labelledby="material-title" className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
        <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
          <div className="order-2 space-y-7 md:order-1">
            <p className="inline-flex items-center gap-3 text-sm text-stone-500">
              <span className="rounded bg-red-800 px-2.5 py-1 text-xs font-semibold text-white">Artisan choice</span>
              Pure satin cotton
            </p>
            <h2 id="material-title" className="font-serif text-4xl tracking-tight text-stone-900 md:text-5xl">
              As smooth as <br />
              <span className="font-medium italic text-red-800/70">morning dew on the Narmada.</span>
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-stone-600">
              Our <strong className="font-semibold text-stone-900">satin cotton</strong> is the perfect blend of strength and
              softness. Woven with a four-over-one technique, it gives a royal lustre on the outside while keeping the
              inside cool and breathable, perfect for Indian weather.
            </p>
            <div className="grid gap-4 pt-2 sm:grid-cols-2">
              {[
                { icon: Waves, title: "Sateen glow", text: "A subtle, natural shine that doesn’t scream, but whispers elegance." },
                { icon: Sun, title: "Stays fresh all day", text: "A 100% cotton base keeps you comfortable from morning puja to evening dinner." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-stone-100 bg-[#fdf8f4] p-6">
                  <Icon className="mb-3 text-red-900" size={22} strokeWidth={1.75} />
                  <h3 className="mb-1.5 text-base font-semibold text-stone-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-stone-600">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <figure className="relative order-1 md:order-2">
            <img
              src="https://5.imimg.com/data5/YE/AN/PT/SELLER-22984508/cotton-satin-fabric.jpg"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-xl"
              alt="Folds of premium satin cotton fabric with a soft sheen"
            />
            <figcaption className="absolute -bottom-5 right-4 rounded-2xl border border-stone-100 bg-white px-6 py-4 shadow-lg md:-right-6">
              <p className="font-serif text-3xl leading-none text-red-900">80g</p>
              <p className="mt-1 text-xs text-stone-500">per metre density</p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <section aria-labelledby="popular-title" className="mx-3 rounded-[2rem] bg-stone-50 py-24 md:mx-4 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex flex-col items-center justify-between gap-5 md:flex-row md:items-end">
            <div className="text-center md:text-left">
              <h2 id="popular-title" className="font-serif text-4xl italic tracking-tight text-stone-900 md:text-5xl">
                Vikasit Varsa
              </h2>
              <p className="mt-2 text-base text-red-800">What Gujarat is wearing today</p>
            </div>
            <Link
              href="/shop"
              className={`group inline-flex items-center gap-2 text-base font-semibold text-stone-900 hover:text-red-800 ${FOCUS}`}
            >
              View all collections
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5 motion-reduce:transition-none" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8" aria-busy="true" aria-label="Loading popular products">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[3/4] animate-pulse rounded-2xl bg-stone-200 motion-reduce:animate-none" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200 motion-reduce:animate-none" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200 motion-reduce:animate-none" />
                </div>
              ))}
            </div>
          ) : error || popularProducts.length === 0 ? (
            <div className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-10 text-center">
              <p className="font-serif text-2xl text-stone-900">
                {error ? "We couldn’t load the bestsellers" : "No bestsellers yet"}
              </p>
              <p className="mt-2 text-base text-stone-600">
                {error ? "Check your connection and try again, or browse the full collection." : "Browse the full collection while we update this list."}
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                {error && (
                  <button
                    type="button"
                    onClick={fetchPopular}
                    className={`inline-flex h-12 items-center justify-center gap-2 rounded-full bg-red-800 px-6 text-sm font-semibold text-white hover:bg-red-700 ${FOCUS}`}
                  >
                    <RefreshCw size={16} /> Try again
                  </button>
                )}
                <Link
                  href="/shop"
                  className={`inline-flex h-12 items-center justify-center rounded-full border border-stone-300 px-6 text-sm font-semibold text-stone-800 hover:border-red-800 hover:text-red-800 ${FOCUS}`}
                >
                  Browse collections
                </Link>
              </div>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-8">
              {popularProducts.map((item, idx) => {
                const added = addedId === item.id;
                return (
                  <li key={item.id} className="group flex flex-col">
                    <Link href={productHref(item.id)} className={`block ${FOCUS}`}>
                      <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
                        {idx === 0 && (
                          <span className="absolute left-3 top-3 z-10 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-stone-900">
                            Most loved
                          </span>
                        )}
                        <img
                          src={item.images?.[0]}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                        />
                      </div>
                      <h3 className="font-serif text-lg leading-snug text-stone-900 group-hover:text-red-800">{item.title}</h3>
                    </Link>
                    <div className="mt-1.5 flex items-baseline justify-between gap-2">
                      <p className="text-base font-semibold text-red-950">₹{item.price.toLocaleString("en-IN")}</p>
                      <span className="text-xs text-stone-500">{item.count} sold recently</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAdd(item)}
                      aria-live="polite"
                      className={`mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-colors ${FOCUS} ${
                        added
                          ? "border-emerald-700 bg-emerald-700 text-white"
                          : "border-stone-300 bg-white text-stone-900 hover:border-red-800 hover:bg-red-800 hover:text-white"
                      }`}
                    >
                      {added ? (<><Check size={16} /> Added to cart</>) : "Add to cart"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ARTISANS */}
      <section
        aria-labelledby="artisans-title"
        className="mx-3 my-24 overflow-hidden rounded-[2rem] bg-[#1a1512] py-24 text-white md:mx-4 md:my-32 md:py-28"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2 md:gap-24 md:px-8">
          <div className="space-y-8">
            <p className="flex items-center gap-3 text-base text-amber-400">
              <Award size={20} /> Karigari heritage
            </p>
            <h2 id="artisans-title" className="font-serif text-5xl leading-tight tracking-tight md:text-6xl">
              Meet the <br />
              <span className="font-light italic text-stone-400">Sisters of Jetpur.</span>
            </h2>
            <p className="max-w-xl text-lg font-light leading-relaxed text-stone-300">
              Every single knot is tied by local women artisans who have kept this 400-year-old tradition alive. This isn’t
              a factory; it’s a neighbourhood coming together to weave magic.
            </p>
            <ul className="space-y-3">
              {["100% fair wages, paid directly", "Supporting rural education"].map((t) => (
                <li key={t} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <CheckCircle2 className="shrink-0 text-amber-400" size={20} />
                  <span className="text-base font-medium">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-red-900/25 blur-[100px]" aria-hidden />
            <div className="relative grid grid-cols-2 gap-4">
              <img
                src="https://cdn.shopify.com/s/files/1/0902/3202/files/Bandhani-process_large.jpg?v=1533699306"
                alt="An artisan tying the small knots of Bandhani on cloth"
                loading="lazy"
                className="aspect-[4/5] w-full rounded-2xl object-cover"
              />
              <img
                src="https://villagehaat.store/wp-content/uploads/2022/02/image.jpg.webp"
                alt="Bandhani cloth, dyed and ready to be unknotted"
                loading="lazy"
                className="mt-10 aspect-[4/5] w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        aria-labelledby="cta-title"
        className="relative m-3 flex min-h-[70vh] items-center justify-center overflow-hidden rounded-[2rem] md:m-4"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=2000')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-red-950/80" />
        <div className="relative z-10 px-6 py-20 text-center text-white">
          <h2 id="cta-title" className="mb-10 font-serif text-5xl font-extralight italic md:text-8xl">
            Carry your culture.
          </h2>
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className={`group inline-flex h-14 items-center gap-3 rounded-full bg-white px-10 text-base font-semibold text-stone-900 transition-colors hover:bg-amber-400 ${FOCUS}`}
            >
              Shop the collection
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
            <Link
              href="/bulk-orders"
              className={`inline-flex h-14 items-center rounded-full border border-white/50 px-10 text-base font-semibold text-white transition-colors hover:bg-white/10 ${FOCUS}`}
            >
              Order in bulk
            </Link>
          </div>
          <ul className="mt-12 flex justify-center gap-10 text-sm text-white/80">
            <li className="flex flex-col items-center gap-2">
              <ShieldCheck size={22} className="text-amber-400" /> Secure delivery
            </li>
            <li className="flex flex-col items-center gap-2">
              <Globe size={22} className="text-amber-400" /> Pan-India and global
            </li>
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-16 md:flex-row">
        <div className="space-y-1.5 text-center md:text-left">
          <p className="font-serif text-xl italic text-stone-800">Clothiva Heritage</p>
          <p className="text-sm text-stone-500">© 2026 Crafted with love in Jetpur, Gujarat</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {[
            { name: "Our story", href: "/story" },
            { name: "Bulk orders", href: "/bulk-orders" },
            { name: "Privacy", href: "/privacy" },
            { name: "Terms", href: "/terms" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className={`text-sm text-stone-600 hover:text-red-800 ${FOCUS}`}>
              {l.name}
            </Link>
          ))}
          {INSTAGRAM_URL && (
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={`text-sm text-stone-600 hover:text-red-800 ${FOCUS}`}>
              Instagram
            </a>
          )}
        </nav>
      </footer>
    </main>
  );
}