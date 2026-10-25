"use client";
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShoppingBag, ChevronRight, ChevronLeft, ShieldCheck, Truck, Share2, Check,
  Sparkles, Scissors, Droplets, Ruler, MapPin, Info, RefreshCw,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  title: string;
  price: number | string;
  comparePrice?: number | string;
  images?: string[];
  category?: string;
  description?: string;
  stock?: number;
  // Optional fields. Details rows only appear when these exist on the product.
  color?: string;
  length?: string;
}

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800";
const inr = (n: number | string) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function ProductDetails() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { addToCart } = useCart();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAllProducts(Array.isArray(data) ? data : data?.products ?? []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProduct();
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, [fetchProduct]);

  useEffect(() => {
    setActiveImg(0);
    setAdded(false);
  }, [id]);

  const product = useMemo(() => allProducts.find((p) => String(p.id) === String(id)), [allProducts, id]);
  const related = useMemo(
    () =>
      allProducts
        .filter((p) => String(p.id) !== String(id) && product?.category && p.category === product.category)
        .slice(0, 4),
    [allProducts, id, product]
  );

  const images = product?.images?.length ? product.images : [];
  const goTo = useCallback(
    (i: number) => setActiveImg(images.length ? (i + images.length) % images.length : 0),
    [images.length]
  );

  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  const handleAdd = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    later(() => setAdded(false), 2500);
  };

  const handleShare = async () => {
    if (!product) return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        later(() => setCopied(false), 2000);
      }
    } catch {
      /* user cancelled the share sheet */
    }
  };

  /* ---------------- loading / error / not found ---------------- */
  if (loading) {
    return (
      <main aria-busy="true" aria-label="Loading product" className="min-h-screen bg-[#FFFDFB] pt-28 md:pt-36">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-12 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <div className="aspect-[3/4] animate-pulse rounded-3xl bg-stone-100 motion-reduce:animate-none" />
          </div>
          <div className="space-y-5 lg:col-span-5">
            {[40, 90, 30, 100, 100].map((w, i) => (
              <div key={i} className="h-6 animate-pulse rounded bg-stone-100 motion-reduce:animate-none" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FFFDFB] px-6 pt-28 text-center">
        <div className="max-w-md">
          <h1 className="mb-3 font-serif text-3xl text-stone-900">
            {error ? "We couldn’t load this piece" : "This piece is no longer available"}
          </h1>
          <p className="mb-8 text-base text-stone-600">
            {error ? "Check your connection and try again." : "It may have found its home already. See what else is in the collection."}
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            {error && (
              <button
                type="button"
                onClick={fetchProduct}
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-full bg-red-800 px-8 text-sm font-semibold text-white hover:bg-red-700 ${FOCUS}`}
              >
                <RefreshCw size={16} /> Try again
              </button>
            )}
            <Link
              href="/shop"
              className={`inline-flex h-12 items-center justify-center rounded-full border border-stone-300 px-8 text-sm font-semibold text-stone-800 hover:border-red-800 hover:text-red-800 ${FOCUS}`}
            >
              Browse collections
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ---------------- derived values ---------------- */
  const price = Number(product.price);
  const compare = Number(product.comparePrice ?? 0);
  const discount = compare > price ? Math.round((1 - price / compare) * 100) : 0;
  const soldOut = typeof product.stock === "number" && product.stock <= 0;
  const lowStock = typeof product.stock === "number" && product.stock > 0 && product.stock <= 5;

  const details = [
    product.category && { icon: Scissors, label: "Fabric", value: product.category },
    product.color && { icon: Droplets, label: "Colour", value: product.color },
    product.length && { icon: Ruler, label: "Length", value: product.length },
    { icon: MapPin, label: "Made in", value: "Jetpur, Gujarat" },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

  const cartLabel = soldOut ? "Sold out" : added ? "Added to cart" : "Add to cart";
  const renderCartButton = (className = "") => (
    <button
      type="button"
      onClick={handleAdd}
      disabled={soldOut}
      aria-live="polite"
      className={`inline-flex h-14 items-center justify-center gap-3 rounded-full px-8 text-base font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-stone-300 ${
        added ? "bg-emerald-700" : "bg-red-900 hover:bg-red-800"
      } ${FOCUS} ${className}`}
    >
      {added ? <Check size={20} /> : <ShoppingBag size={20} strokeWidth={1.75} />}
      {cartLabel}
    </button>
  );

  return (
    <main className="min-h-screen bg-[#FFFDFB] pb-28 pt-24 antialiased selection:bg-red-900 selection:text-white md:pt-32 lg:pb-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-stone-500">
          <Link href="/" className={`hover:text-red-900 ${FOCUS}`}>Home</Link>
          <ChevronRight size={14} aria-hidden />
          <Link href="/shop" className={`hover:text-red-900 ${FOCUS}`}>Collections</Link>
          <ChevronRight size={14} aria-hidden />
          <span aria-current="page" className="max-w-[16rem] truncate text-stone-900">{product.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 xl:gap-20">
          {/* GALLERY */}
          <div className="lg:col-span-7">
            <div
              role="group"
              aria-roledescription="carousel"
              aria-label={`${product.title} photos`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") goTo(activeImg - 1);
                if (e.key === "ArrowRight") goTo(activeImg + 1);
              }}
              onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchStartX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(dx) > 50) goTo(activeImg + (dx < 0 ? 1 : -1));
                touchStartX.current = null;
              }}
              className={`relative aspect-[3/4] overflow-hidden rounded-3xl bg-stone-100 ${FOCUS}`}
            >
              {images.length > 0 ? (
                <img src={images[activeImg]} alt={`${product.title}, photo ${activeImg + 1} of ${images.length}`} className="h-full w-full object-cover object-top" />
              ) : (
                <div className="grid h-full place-items-center text-stone-400">No photo available</div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goTo(activeImg - 1)}
                    aria-label="Previous photo"
                    className={`absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-stone-900 shadow-md hover:bg-white ${FOCUS}`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(activeImg + 1)}
                    aria-label="Next photo"
                    className={`absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-stone-900 shadow-md hover:bg-white ${FOCUS}`}
                  >
                    <ChevronRight size={20} />
                  </button>
                  <span className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
                    {activeImg + 1} / {images.length}
                  </span>
                </>
              )}

              <p className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-stone-800 shadow">
                <Sparkles size={14} className="text-amber-600" /> Hand-knotted Bandhej
              </p>
            </div>

            {images.length > 1 && (
              <ul className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <li key={i} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveImg(i)}
                      aria-label={`Show photo ${i + 1} of ${images.length}`}
                      aria-pressed={activeImg === i}
                      className={`block aspect-[3/4] w-16 overflow-hidden rounded-xl border-2 transition-opacity md:w-24 ${FOCUS} ${
                        activeImg === i ? "border-red-900" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* DETAILS */}
          <div className="lg:col-span-5">
            <div className="border-b border-stone-200 pb-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {product.category && <p className="mb-2 text-sm text-red-800">{product.category}</p>}
                  <h1 className="font-serif text-3xl leading-tight tracking-tight text-stone-900 md:text-4xl">{product.title}</h1>
                </div>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label={copied ? "Link copied" : "Share this piece"}
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-stone-300 text-stone-700 hover:border-red-800 hover:text-red-800 ${FOCUS}`}
                >
                  {copied ? <Check size={18} /> : <Share2 size={18} />}
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span className="font-serif text-4xl text-stone-900">{inr(price)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-stone-500 line-through">
                      <span className="sr-only">Original price </span>
                      {inr(compare)}
                    </span>
                    <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-900">{discount}% off</span>
                  </>
                )}
              </div>
              <p className={`mt-3 text-sm font-medium ${soldOut ? "text-stone-500" : lowStock ? "text-amber-700" : "text-emerald-700"}`}>
                {soldOut ? "Currently sold out" : lowStock ? `Only ${product.stock} left` : "In stock, ready to ship"}
              </p>
              <p className="mt-1 text-sm text-stone-500">Inclusive of all taxes</p>
            </div>

            {/* Primary action (desktop). On mobile a sticky bar below takes over. */}
            <div className="hidden py-8 lg:block">
              {renderCartButton("w-full")}
              {added && (
                <Link href="/cart" className={`mt-3 block text-center text-sm font-semibold text-red-900 underline underline-offset-4 ${FOCUS}`}>
                  View cart
                </Link>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3 py-8 lg:pt-0">
              <h2 className="font-serif text-xl text-stone-900">About this piece</h2>
              <p className="text-base leading-relaxed text-stone-700">
                {product.description ||
                  "Like the morning dew on Saurashtra’s fields, this piece is soft, pure and rare. Every knot was tied by hands that carry the songs of Gujarat."}
              </p>
            </div>

            {/* Specs */}
            <dl className="grid grid-cols-2 gap-4 border-y border-stone-200 py-8">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-900">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <div>
                    <dt className="text-sm text-stone-500">{label}</dt>
                    <dd className="text-base font-medium text-stone-900">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            {/* Care */}
            <div className="my-8 flex items-start gap-4 rounded-2xl bg-stone-900 p-6 text-white">
              <Info size={20} className="mt-0.5 shrink-0 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-white/70">Dadi’s wisdom</p>
                <p className="mt-1 text-base italic">“Dry clean only, beta. This gold deserves to last forever.”</p>
              </div>
            </div>

            {/* Trust */}
            <ul className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Pan-India delivery" },
                { icon: ShieldCheck, label: "Secure delivery" },
                { icon: Sparkles, label: "Hand-knotted in Jetpur" },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-white p-4 text-center">
                  <Icon size={22} className="text-red-900/60" strokeWidth={1.5} />
                  <span className="text-xs leading-snug text-stone-600">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <section aria-labelledby="related-title" className="mt-24 border-t border-stone-200 pt-14">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 id="related-title" className="font-serif text-3xl text-stone-900">More in {product.category}</h2>
              <Link href="/shop" className={`text-sm font-semibold text-red-900 underline underline-offset-4 ${FOCUS}`}>View all</Link>
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-8">
              {related.map((p) => (
                <li key={p.id}>
                  <Link href={`/shop/${p.id}`} className={`group block rounded-2xl ${FOCUS}`}>
                    <div className="mb-3 aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100">
                      <img
                        src={p.images?.[0] || "/placeholder.jpg"}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                      />
                    </div>
                    <h3 className="font-serif text-base leading-snug text-stone-900 group-hover:text-red-800">{p.title}</h3>
                    <p className="mt-1 font-serif text-lg text-stone-900">{inr(p.price)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* STICKY MOBILE BAR */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center gap-4 border-t border-stone-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
        <div className="shrink-0">
          <p className="font-serif text-2xl leading-none text-stone-900">{inr(price)}</p>
          {discount > 0 && <p className="mt-1 text-xs text-stone-500 line-through">{inr(compare)}</p>}
        </div>
        {renderCartButton("flex-1")}
      </div>
    </main>
  );
}