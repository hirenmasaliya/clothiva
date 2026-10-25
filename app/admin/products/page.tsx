"use client";
// Place at: app/admin/products/page.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Plus, Search, Pencil, Trash2, ExternalLink, ChevronLeft, ChevronRight, PackageX, RefreshCw, X, ImageIcon, Check,
} from "lucide-react";
import { ConfirmDialog, FOCUS, inr, LOW_STOCK_AT } from "@/components/admin/ProductForm";

interface Product {
  id: string;
  title?: string;
  category?: string;
  price?: number | string;
  comparePrice?: number | string;
  stock?: number | string;
  sku?: string;
  images?: string[];
}

type StatusFilter = "all" | "live" | "low" | "sold";
type SortKey = "default" | "name" | "price-low" | "price-high" | "stock-low";

const PAGE_SIZE = 10;
const SORTS: { id: SortKey; label: string }[] = [
  { id: "default", label: "Default order" },
  { id: "name", label: "Name A to Z" },
  { id: "price-low", label: "Price: low to high" },
  { id: "price-high", label: "Price: high to low" },
  { id: "stock-low", label: "Stock: lowest first" },
];

const stockOf = (p: Product) => {
  const n = Number(p.stock);
  return Number.isFinite(n) ? n : 0;
};
const stateOf = (p: Product): Exclude<StatusFilter, "all"> => {
  const n = stockOf(p);
  return n <= 0 ? "sold" : n <= LOW_STOCK_AT ? "low" : "live";
};

const StockBadge = ({ product }: { product: Product }) => {
  const n = stockOf(product);
  const s = stateOf(product);
  const style =
    s === "sold" ? "bg-red-50 text-red-800 ring-red-200" : s === "low" ? "bg-amber-50 text-amber-800 ring-amber-200" : "bg-emerald-50 text-emerald-800 ring-emerald-200";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${style}`}>
      {s === "sold" ? "Sold out" : s === "low" ? `Low: ${n} left` : `${n} in stock`}
    </span>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("default");
  const [page, setPage] = useState(1);

  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data?.products ?? []);
    } catch (err) {
      console.error("Failed to load inventory:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, [fetchProducts]);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  /* ---------- derived ---------- */
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean) as string[])].sort(),
    [products]
  );

  const counts = useMemo(() => {
    const c = { all: products.length, live: 0, low: 0, sold: 0 };
    products.forEach((p) => { c[stateOf(p)] += 1; });
    return c;
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (status !== "all" && stateOf(p) !== status) return false;
      if (q && !`${p.title ?? ""} ${p.category ?? ""} ${p.sku ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sortBy === "name") list.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
    if (sortBy === "price-low") list.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === "price-high") list.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy === "stock-low") list.sort((a, b) => stockOf(a) - stockOf(b));
    return list;
  }, [products, search, category, status, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, filtered.length);

  const filtersActive = search !== "" || category !== "all" || status !== "all";
  const clearFilters = () => { setSearch(""); setCategory("all"); setStatus("all"); setPage(1); };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      // Assumes your API supports DELETE on /api/products/[id]
      const res = await fetch(`/api/products/${toDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setProducts((prev) => prev.filter((p) => p.id !== toDelete.id));
      showToast(`Deleted “${toDelete.title ?? "product"}”`);
      setToDelete(null);
    } catch (err) {
      console.error(err);
      setDeleteError("We couldn’t delete this product. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const tabs: { id: StatusFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "live", label: "In stock" },
    { id: "low", label: "Low stock" },
    { id: "sold", label: "Sold out" },
  ];

  const field = `h-11 rounded-xl border border-stone-300 bg-white px-4 text-sm text-stone-800 focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-100`;

  /* ---------- error ---------- */
  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-10 text-center">
        <h2 className="font-serif text-2xl text-stone-900">We couldn’t load your products</h2>
        <p className="mt-2 text-base text-stone-600">Check your connection and try again.</p>
        <button type="button" onClick={fetchProducts} className={`mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-red-900 px-6 text-sm font-semibold text-white hover:bg-red-800 ${FOCUS}`}>
          <RefreshCw size={16} /> Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-stone-900">Products</h2>
          <p className="mt-1 text-base text-stone-600">
            {loading ? "Loading…" : `${products.length} ${products.length === 1 ? "product" : "products"} in your store`}
          </p>
        </div>
        <Link href="/admin/products/add" className={`inline-flex h-11 items-center gap-2 rounded-full bg-red-900 px-6 text-sm font-semibold text-white hover:bg-red-800 ${FOCUS}`}>
          <Plus size={16} /> Add product
        </Link>
      </div>

      {/* STATUS TABS */}
      <div role="tablist" aria-label="Filter by stock" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={status === t.id}
            onClick={() => { setStatus(t.id); setPage(1); }}
            className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${FOCUS} ${
              status === t.id ? "border-red-900 bg-red-900 text-white" : "border-stone-300 bg-white text-stone-700 hover:border-red-800 hover:text-red-800"
            }`}
          >
            {t.label}
            <span className={`rounded-full px-2 text-xs ${status === t.id ? "bg-white/20" : "bg-stone-100 text-stone-600"}`}>{counts[t.id]}</span>
          </button>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <label htmlFor="product-search" className="sr-only">Search products</label>
          <Search size={18} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            id="product-search"
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title, fabric or SKU"
            className={`${field} w-full pl-11`}
          />
        </div>
        <label className="sr-only" htmlFor="cat-filter">Fabric</label>
        <select id="cat-filter" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className={`${field} md:w-52`}>
          <option value="all">All fabrics</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <label className="sr-only" htmlFor="sort-by">Sort by</label>
        <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} className={`${field} md:w-52`}>
          {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {filtersActive && !loading && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-stone-600">
          <span aria-live="polite">{filtered.length} {filtered.length === 1 ? "result" : "results"}</span>
          <button type="button" onClick={clearFilters} className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-semibold text-red-900 underline underline-offset-4 hover:bg-red-50 ${FOCUS}`}>
            <X size={14} /> Clear filters
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <caption className="sr-only">Products in your store</caption>
            <thead className="border-b border-stone-100 bg-stone-50 text-sm text-stone-600">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium md:px-6">Product</th>
                <th scope="col" className="hidden px-6 py-3 font-medium md:table-cell">Fabric</th>
                <th scope="col" className="px-4 py-3 font-medium md:px-6">Price</th>
                <th scope="col" className="px-4 py-3 font-medium md:px-6">Stock</th>
                <th scope="col" className="px-4 py-3 text-right font-medium md:px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 animate-pulse rounded-xl bg-stone-100 motion-reduce:animate-none" />
                        <div className="h-4 w-48 animate-pulse rounded bg-stone-100 motion-reduce:animate-none" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : pageItems.length > 0 ? (
                pageItems.map((p) => {
                  const title = p.title || "Untitled product";
                  const discount = Number(p.comparePrice) > Number(p.price) ? Math.round((1 - Number(p.price) / Number(p.comparePrice)) * 100) : 0;
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/60">
                      <td className="px-4 py-4 md:px-6">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                            ) : (
                              <div className="grid h-full place-items-center text-stone-400"><ImageIcon size={20} strokeWidth={1.25} /></div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link href={`/admin/products/${p.id}`} className={`block truncate text-base font-semibold text-stone-900 hover:text-red-800 ${FOCUS}`}>
                              {title}
                            </Link>
                            <p className="truncate text-sm text-stone-500">
                              <span className="md:hidden">{p.category}{p.category && p.sku ? " · " : ""}</span>
                              {p.sku && <span className="font-mono">{p.sku}</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-6 py-4 text-base text-stone-700 md:table-cell">{p.category || "n/a"}</td>
                      <td className="whitespace-nowrap px-4 py-4 md:px-6">
                        <p className="font-semibold text-stone-900">{inr(Number(p.price) || 0)}</p>
                        {discount > 0 && <p className="text-xs text-stone-500"><span className="line-through">{inr(Number(p.comparePrice))}</span> · {discount}% off</p>}
                      </td>
                      <td className="px-4 py-4 md:px-6"><StockBadge product={p} /></td>
                      <td className="px-4 py-4 md:px-6">
                        <div className="flex justify-end gap-1">
                          <Link href={`/admin/products/${p.id}`} aria-label={`Edit ${title}`} title="Edit" className={`grid h-10 w-10 place-items-center rounded-full text-stone-600 hover:bg-stone-100 hover:text-red-900 ${FOCUS}`}>
                            <Pencil size={17} />
                          </Link>
                          <a href={`/shop/${p.id}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${title} on the store`} title="View on store" className={`hidden h-10 w-10 place-items-center rounded-full text-stone-600 hover:bg-stone-100 hover:text-red-900 sm:grid ${FOCUS}`}>
                            <ExternalLink size={17} />
                          </a>
                          <button type="button" onClick={() => { setDeleteError(null); setToDelete(p); }} aria-label={`Delete ${title}`} title="Delete" className={`grid h-10 w-10 place-items-center rounded-full text-stone-600 hover:bg-red-50 hover:text-red-700 ${FOCUS}`}>
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <PackageX size={40} strokeWidth={1.25} className="mx-auto mb-4 text-stone-400" />
                    <p className="font-serif text-xl text-stone-900">{products.length === 0 ? "No products yet" : "No products match your filters"}</p>
                    <p className="mx-auto mt-1 max-w-sm text-base text-stone-600">
                      {products.length === 0 ? "Add your first piece to start selling." : "Try a different search, or clear the filters."}
                    </p>
                    {products.length === 0 ? (
                      <Link href="/admin/products/add" className={`mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-red-900 px-6 text-sm font-semibold text-white hover:bg-red-800 ${FOCUS}`}>
                        <Plus size={16} /> Add product
                      </Link>
                    ) : (
                      <button type="button" onClick={clearFilters} className={`mt-6 inline-flex h-11 items-center rounded-full border border-stone-300 px-6 text-sm font-semibold text-stone-800 hover:border-red-800 hover:text-red-800 ${FOCUS}`}>
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 bg-stone-50 px-4 py-3 md:px-6">
            <p className="text-sm text-stone-600" aria-live="polite">Showing {from}–{to} of {filtered.length}</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPage(safePage - 1)} disabled={safePage <= 1} aria-label="Previous page" className={`grid h-10 w-10 place-items-center rounded-full border border-stone-300 bg-white text-stone-700 hover:border-red-800 disabled:opacity-40 ${FOCUS}`}>
                <ChevronLeft size={16} />
              </button>
              <span className="px-2 text-sm text-stone-700">Page {safePage} of {pageCount}</span>
              <button type="button" onClick={() => setPage(safePage + 1)} disabled={safePage >= pageCount} aria-label="Next page" className={`grid h-10 w-10 place-items-center rounded-full border border-stone-300 bg-white text-stone-700 hover:border-red-800 disabled:opacity-40 ${FOCUS}`}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this product?"
        message={<><strong className="font-semibold text-stone-900">{toDelete?.title ?? "This product"}</strong> will be removed from your store. This can’t be undone. If it’s only out of stock, set its stock to 0 instead.</>}
        confirmLabel="Delete product"
        danger
        busy={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-3 rounded-full bg-stone-900 px-5 py-3 text-sm text-white shadow-xl">
          <Check size={16} className="text-emerald-400" /> {toast}
        </div>
      )}
    </div>
  );
}