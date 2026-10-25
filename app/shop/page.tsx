"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { X, SlidersHorizontal, PackageX, ChevronRight, ChevronDown, RefreshCw } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number | string;
  comparePrice?: number | string;
  images?: string[];
  category?: string;
  description?: string;
  stock?: number;
  createdAt?: string;
}

type SortKey = "newest" | "price-low" | "price-high";

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "newest", label: "Newest first" },
  { id: "price-low", label: "Price: low to high" },
  { id: "price-high", label: "Price: high to low" },
];

// Used only until products load, or if the API returns no categories.
const FALLBACK_CATEGORIES = ["Satin Cotton", "Cotton Bandhani", "Pure Georgette", "Modal Silk"];

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800";
const inr = (n: number | string) => `₹${Number(n).toLocaleString("en-IN")}`;

/* ---------------------------------------------------------------- */
/* PRODUCT CARD                                                      */
/* ---------------------------------------------------------------- */
const ProductCard = ({ product }: { product: Product }) => {
  const [first, second] = product.images ?? [];
  const price = Number(product.price);
  const compare = Number(product.comparePrice ?? 0);
  const discount = compare > price ? Math.round((1 - price / compare) * 100) : 0;
  const soldOut = typeof product.stock === "number" && product.stock <= 0;

  return (
    <li>
      <Link href={`/shop/${product.id}`} className={`group block rounded-2xl ${FOCUS}`}>
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-stone-100 shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
          <img
            src={first || "/placeholder.jpg"}
            alt={product.title}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover object-top ${soldOut ? "opacity-60" : ""}`}
          />
          {/* Second photo appears on hover / keyboard focus (no auto-rotating carousels) */}
          {second && (
            <img
              src={second}
              alt=""
              loading="lazy"
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
            />
          )}

          <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
            {soldOut && (
              <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">Sold out</span>
            )}
            {!soldOut && discount > 0 && (
              <span className="rounded-full bg-red-800 px-3 py-1 text-xs font-semibold text-white">{discount}% off</span>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-1.5 px-1">
          {product.category && <p className="text-sm text-red-800/80">{product.category}</p>}
          <h3 className="font-serif text-lg leading-snug text-stone-900 transition-colors group-hover:text-red-800">
            {product.title}
          </h3>
          <p className="flex items-baseline gap-2">
            <span className="font-serif text-xl text-stone-900">{inr(price)}</span>
            {discount > 0 && (
              <span className="text-sm text-stone-500 line-through">
                <span className="sr-only">Original price </span>
                {inr(compare)}
              </span>
            )}
          </p>
        </div>
      </Link>
    </li>
  );
};

/* ---------------------------------------------------------------- */
/* FILTER FIELDS (shared by sidebar and mobile drawer)               */
/* ---------------------------------------------------------------- */
interface FilterFieldsProps {
  idPrefix: string;
  categories: { name: string; count: number }[];
  selected: string[];
  onToggle: (name: string) => void;
  maxPrice: number;
  ceiling: number;
  onMaxPrice: (n: number) => void;
}

const FilterFields = ({ idPrefix, categories, selected, onToggle, maxPrice, ceiling, onMaxPrice }: FilterFieldsProps) => (
  <div className="space-y-10">
    <fieldset>
      <legend className="mb-4 w-full border-b border-stone-200 pb-2 text-sm font-semibold text-stone-900">Fabric</legend>
      <ul className="space-y-1">
        {categories.map(({ name, count }) => {
          const id = `${idPrefix}-${name.replace(/\s+/g, "-")}`;
          return (
            <li key={name}>
              <label htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-1 hover:bg-stone-50">
                <input
                  id={id}
                  type="checkbox"
                  checked={selected.includes(name)}
                  onChange={() => onToggle(name)}
                  className="h-5 w-5 shrink-0 cursor-pointer rounded border-stone-300 accent-red-900"
                />
                <span className={`flex-1 text-base ${selected.includes(name) ? "font-semibold text-red-900" : "text-stone-700"}`}>
                  {name}
                </span>
                <span className="text-sm text-stone-400">{count}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>

    <div>
      <label htmlFor={`${idPrefix}-price`} className="mb-4 block w-full border-b border-stone-200 pb-2 text-sm font-semibold text-stone-900">
        Maximum price
      </label>
      <p className="mb-3 font-serif text-2xl text-stone-900">{inr(maxPrice)}</p>
      <input
        id={`${idPrefix}-price`}
        type="range"
        min={500}
        max={ceiling}
        step={500}
        value={maxPrice}
        onChange={(e) => onMaxPrice(parseInt(e.target.value, 10))}
        className="h-2 w-full cursor-pointer accent-red-900"
      />
      <div className="mt-1 flex justify-between text-xs text-stone-500">
        <span>{inr(500)}</span>
        <span>{inr(ceiling)}</span>
      </div>
    </div>
  </div>
);

/* ---------------------------------------------------------------- */
/* PAGE                                                              */
/* ---------------------------------------------------------------- */
export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [isFilterOpen, setFilterOpen] = useState(false);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [maxPriceState, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [query, setQuery] = useState("");

  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data?.products ?? []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    // Pick up searches coming from the navbar (/shop?q=...)
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q);
  }, [fetchProducts]);

  // Categories come from the real catalogue, so filters always match the data
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => p.category && counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    if (counts.size === 0) return FALLBACK_CATEGORIES.map((name) => ({ name, count: 0 }));
    return [...counts.entries()].map(([name, count]) => ({ name, count }));
  }, [products]);

  const ceiling = useMemo(() => {
    const max = Math.max(0, ...products.map((p) => Number(p.price) || 0));
    return Math.max(1000, Math.ceil(max / 500) * 500);
  }, [products]);
  const maxPrice = Math.min(maxPriceState ?? ceiling, ceiling);
  const priceActive = maxPrice < ceiling;

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const time = (p: Product) => (p.createdAt ? new Date(p.createdAt).getTime() || 0 : 0);
    const result = products.filter((p) => {
      if (Number(p.price) > maxPrice) return false;
      if (selectedFabrics.length && !selectedFabrics.includes(p.category ?? "")) return false;
      if (q && !`${p.title} ${p.category ?? ""} ${p.description ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sortBy === "price-low") result.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === "price-high") result.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy === "newest") result.sort((a, b) => time(b) - time(a));
    return result;
  }, [products, selectedFabrics, maxPrice, sortBy, query]);

  const toggleFabric = (fabric: string) =>
    setSelectedFabrics((prev) => (prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]));

  const clearAll = () => {
    setSelectedFabrics([]);
    setMaxPrice(null);
    setQuery("");
  };

  const activeCount = selectedFabrics.length + (priceActive ? 1 : 0) + (query ? 1 : 0);
  const filterBadge = selectedFabrics.length + (priceActive ? 1 : 0);

  // Drawer: Escape to close, lock page scroll, move focus in and back out
  const closeDrawer = useCallback(() => {
    setFilterOpen(false);
    openRef.current?.focus();
  }, []);
  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "";
    if (isFilterOpen) {
      const t = setTimeout(() => closeRef.current?.focus(), 300);
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
      window.addEventListener("keydown", onKey);
      return () => {
        clearTimeout(t);
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen, closeDrawer]);

  const chip = `inline-flex min-h-9 items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 text-sm text-red-900 transition-colors hover:bg-red-100 ${FOCUS}`;

  return (
    <main className="min-h-screen bg-[#FFFDFB] pt-28 antialiased selection:bg-red-900 selection:text-white md:pt-36">
      {/* HEADER */}
      <header className="mx-auto mb-10 max-w-400 px-6 text-center md:mb-14 md:px-12">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center justify-center gap-2 text-sm text-stone-500">
          <Link href="/" className={`hover:text-red-900 ${FOCUS}`}>Home</Link>
          <ChevronRight size={14} aria-hidden />
          <span aria-current="page" className="text-stone-900">Collections</span>
        </nav>
        <h1 className="font-serif text-5xl tracking-tight text-stone-900 md:text-7xl">
          The <span className="font-light italic text-stone-400">Virasat</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base font-light italic leading-relaxed text-stone-600">
          “Curated from the heart of Jetpur. Every knot tells a story of 10,000 ties and 14 days of sun-curing.”
        </p>
      </header>

      <div className="mx-auto flex max-w-400 flex-col gap-10 px-6 md:px-12 lg:flex-row lg:gap-16">
        {/* DESKTOP SIDEBAR */}
        <aside aria-label="Filters" className="sticky top-28 hidden h-fit w-72 shrink-0 lg:block">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-stone-900">Filters</h2>
            {activeCount > 0 && (
              <button type="button" onClick={clearAll} className={`text-sm text-red-900 underline underline-offset-4 ${FOCUS}`}>
                Clear all
              </button>
            )}
          </div>
          <FilterFields
            idPrefix="d"
            categories={categories}
            selected={selectedFabrics}
            onToggle={toggleFabric}
            maxPrice={maxPrice}
            ceiling={ceiling}
            onMaxPrice={setMaxPrice}
          />
        </aside>

        <div className="min-w-0 flex-1 pb-24">
          {/* TOOLBAR: count + sort (all sizes) + filters button (mobile) */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <p aria-live="polite" className="text-base text-stone-600">
              {loading ? "Loading pieces…" : `${filteredProducts.length} ${filteredProducts.length === 1 ? "piece" : "pieces"}`}
            </p>
            <div className="flex items-center gap-3">
              <button
                ref={openRef}
                type="button"
                onClick={() => setFilterOpen(true)}
                aria-haspopup="dialog"
                className={`inline-flex h-11 items-center gap-2 rounded-full border border-stone-300 px-5 text-sm font-semibold text-stone-900 hover:border-red-800 lg:hidden ${FOCUS}`}
              >
                <SlidersHorizontal size={16} /> Filters
                {filterBadge > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-red-900 px-1 text-xs text-white">{filterBadge}</span>
                )}
              </button>
              <div className="relative">
                <label htmlFor="sort" className="sr-only">Sort by</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className={`h-11 cursor-pointer appearance-none rounded-full border border-stone-300 bg-white pl-5 pr-10 text-sm font-semibold text-stone-900 hover:border-red-800 ${FOCUS}`}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-500" />
              </div>
            </div>
          </div>

          {/* ACTIVE FILTER CHIPS */}
          {activeCount > 0 && (
            <div className="mb-8 flex flex-wrap items-center gap-2">
              {query && (
                <button type="button" onClick={() => setQuery("")} className={chip} aria-label={`Remove search for ${query}`}>
                  Search: “{query}” <X size={14} />
                </button>
              )}
              {selectedFabrics.map((fab) => (
                <button key={fab} type="button" onClick={() => toggleFabric(fab)} className={chip} aria-label={`Remove filter ${fab}`}>
                  {fab} <X size={14} />
                </button>
              ))}
              {priceActive && (
                <button type="button" onClick={() => setMaxPrice(null)} className={chip} aria-label="Remove price filter">
                  Up to {inr(maxPrice)} <X size={14} />
                </button>
              )}
              <button type="button" onClick={clearAll} className={`px-2 text-sm text-stone-600 underline underline-offset-4 hover:text-red-900 ${FOCUS}`}>
                Clear all
              </button>
            </div>
          )}

          {/* GRID */}
          {loading ? (
            <div aria-busy="true" aria-label="Loading products" className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[2/3] animate-pulse rounded-2xl bg-stone-100 motion-reduce:animate-none" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-stone-100 motion-reduce:animate-none" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-stone-100 motion-reduce:animate-none" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center rounded-3xl border border-stone-200 bg-white px-6 py-24 text-center">
              <h2 className="mb-2 font-serif text-2xl text-stone-900">We couldn’t load the collection</h2>
              <p className="mb-8 max-w-sm text-base text-stone-600">Check your connection and try again.</p>
              <button
                type="button"
                onClick={fetchProducts}
                className={`inline-flex h-12 items-center gap-2 rounded-full bg-red-800 px-8 text-sm font-semibold text-white hover:bg-red-700 ${FOCUS}`}
              >
                <RefreshCw size={16} /> Try again
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-stone-200 bg-white px-6 py-24 text-center">
              <div className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-stone-50">
                <PackageX size={28} className="text-stone-400" strokeWidth={1.25} />
              </div>
              <h2 className="mb-2 font-serif text-2xl text-stone-900">No pieces match these filters</h2>
              <p className="mb-8 max-w-sm text-base leading-relaxed text-stone-600">
                Try a higher price limit or remove a fabric to see more of the collection.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className={`inline-flex h-12 items-center rounded-full bg-red-800 px-8 text-sm font-semibold text-white hover:bg-red-700 ${FOCUS}`}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        aria-hidden={!isFilterOpen}
        inert={!isFilterOpen}
        className={`fixed inset-0 z-200 lg:hidden ${isFilterOpen ? "visible" : "invisible delay-500"}`}
      >
        <div
          className={`absolute inset-0 bg-stone-950/50 backdrop-blur-sm transition-opacity duration-500 ${isFilterOpen ? "opacity-100" : "opacity-0"}`}
          onClick={closeDrawer}
        />
        <div
          className={`absolute inset-y-0 right-0 flex w-full flex-col bg-[#FFFDFB] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none sm:max-w-md ${
            isFilterOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
            <h2 className="font-serif text-3xl text-stone-900">Filters</h2>
            <button
              ref={closeRef}
              type="button"
              onClick={closeDrawer}
              aria-label="Close filters"
              className={`grid h-11 w-11 place-items-center rounded-full bg-stone-100 text-stone-700 ${FOCUS}`}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8">
            <FilterFields
              idPrefix="m"
              categories={categories}
              selected={selectedFabrics}
              onToggle={toggleFabric}
              maxPrice={maxPrice}
              ceiling={ceiling}
              onMaxPrice={setMaxPrice}
            />
          </div>

          <div className="flex gap-3 border-t border-stone-200 px-6 py-4">
            <button
              type="button"
              onClick={clearAll}
              disabled={activeCount === 0}
              className={`h-13 rounded-full border border-stone-300 px-6 text-sm font-semibold text-stone-800 disabled:opacity-40 ${FOCUS}`}
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={closeDrawer}
              className={`h-13 flex-1 rounded-full bg-red-800 text-sm font-semibold text-white hover:bg-red-700 ${FOCUS}`}
            >
              Show {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
            </button>
          </div>
        </div>
      </div>

      <footer className="px-6 py-16 text-center">
        <div className="mx-auto mb-6 h-px w-20 bg-stone-200" />
        <p className="text-sm text-stone-500">Jetpur Heritage · J K Creation</p>
      </footer>
    </main>
  );
}