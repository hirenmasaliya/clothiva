"use client";
// Place at: components/admin/ProductForm.tsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import {
  Save, ChevronRight, Upload, Loader2, X, ArrowLeft, ArrowRight, Star, AlertTriangle, ImageIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Shared constants + types                                            */
/* ------------------------------------------------------------------ */
// NOTE: existing products saved with the old spellings ("Sartin Cotton", "Cotton Bandhni") are
// still shown in the dropdown as "legacy spelling" so nothing is lost. Re-save them with the
// corrected category to merge them in the shop filters.
export const CATEGORIES = ["Satin Cotton", "Cotton Bandhani", "Pure Georgette", "Modal Silk", "Gaji Silk"];
export const LOW_STOCK_AT = 5;

export interface ProductValues {
  title: string;
  description: string;
  price: string;
  comparePrice: string;
  stock: string;
  sku: string;
  category: string;
  isFeatured: boolean;
  images: string[];
}
export const EMPTY_PRODUCT: ProductValues = {
  title: "", description: "", price: "", comparePrice: "", stock: "", sku: "", category: "", isFeatured: false, images: [],
};

export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800";
export const inr = (n: number | string) => `₹${Number(n).toLocaleString("en-IN")}`;

/* ------------------------------------------------------------------ */
/* Confirm dialog                                                      */
/* ------------------------------------------------------------------ */
export const ConfirmDialog = ({
  open, title, message, confirmLabel, cancelLabel = "Cancel", danger, busy, error, onConfirm, onCancel,
}: {
  open: boolean; title: string; message: React.ReactNode; confirmLabel: string; cancelLabel?: string; danger?: boolean;
  busy?: boolean; error?: string | null; onConfirm: () => void; onCancel: () => void;
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4">
      <div className="absolute inset-0 bg-stone-950/50" onClick={() => !busy && onCancel()} />
      <div role="alertdialog" aria-modal="true" aria-labelledby="cd-title" aria-describedby="cd-msg" className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 id="cd-title" className="font-serif text-2xl text-stone-900">{title}</h2>
        <div id="cd-msg" className="mt-2 text-base leading-relaxed text-stone-600">{message}</div>
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button ref={cancelRef} type="button" onClick={onCancel} disabled={busy} className={`h-11 rounded-full border border-stone-300 px-6 text-sm font-semibold text-stone-800 hover:border-stone-500 disabled:opacity-50 ${FOCUS}`}>
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white disabled:opacity-60 ${danger ? "bg-red-700 hover:bg-red-800" : "bg-stone-900 hover:bg-stone-700"} ${FOCUS}`}
          >
            {busy && <Loader2 size={16} className="animate-spin" />} {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Small form pieces                                                   */
/* ------------------------------------------------------------------ */
const inputBase = (invalid: boolean) =>
  `w-full rounded-xl border bg-white px-4 text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 ${
    invalid ? "border-red-600 focus:ring-red-200" : "border-stone-300 focus:border-red-800 focus:ring-red-100"
  }`;

const Card = ({ title, children, description }: { title: string; description?: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
    <div className="border-b border-stone-100 px-6 py-4">
      <h2 className="font-serif text-xl text-stone-900">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-stone-500">{description}</p>}
    </div>
    <div className="p-6">{children}</div>
  </section>
);

const FieldWrap = ({ id, label, optional, hint, error, children, className = "" }: {
  id: string; label: string; optional?: boolean; hint?: string; error?: string; children: React.ReactNode; className?: string;
}) => (
  <div className={className}>
    <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-stone-800">
      <span>{label}</span>
      {optional && <span className="text-xs font-normal text-stone-500">Optional</span>}
    </label>
    {children}
    {error ? <p id={`${id}-err`} className="mt-1.5 text-sm text-red-700">{error}</p> : hint ? <p id={`${id}-hint`} className="mt-1.5 text-sm text-stone-500">{hint}</p> : null}
  </div>
);

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */
interface ProductFormProps {
  mode: "add" | "edit";
  initial: ProductValues;
  heading: string;
  submitLabel: string;
  savingLabel: string;
  productId?: string; // edit mode: enables "View on store"
  onSubmit: (values: ProductValues) => Promise<void>; // throw Error(message) to show a failure
  onCancel: () => void;
  extra?: React.ReactNode; // e.g. a delete section
}

export default function ProductForm({ mode, initial, heading, submitLabel, savingLabel, productId, onSubmit, onCancel, extra }: ProductFormProps) {
  const [values, setValues] = useState<ProductValues>(initial);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discardOpen, setDiscardOpen] = useState(false);
  const skipGuard = useRef(false);

  const initialJson = useRef(JSON.stringify(initial));
  const dirty = useMemo(() => JSON.stringify(values) !== initialJson.current, [values]);

  // Warn before closing the tab with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty && !skipGuard.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const set = <K extends keyof ProductValues>(k: K, v: ProductValues[K]) => setValues((p) => ({ ...p, [k]: v }));
  const blur = (k: string) => setTouched((p) => ({ ...p, [k]: true }));

  /* ---------- validation ---------- */
  const price = Number(values.price);
  const compare = Number(values.comparePrice);
  const stock = Number(values.stock);
  const errors: Record<string, string> = {};
  if (!values.title.trim()) errors.title = "Enter a product title";
  if (!values.category) errors.category = "Choose a fabric";
  if (values.price === "" || !(price > 0)) errors.price = "Enter a price above ₹0";
  if (values.comparePrice !== "" && !(compare > price)) errors.comparePrice = "The original price should be higher than the selling price";
  if (values.stock === "" || !Number.isInteger(stock) || stock < 0) errors.stock = "Enter a whole number, 0 or more";
  if (values.images.length === 0) errors.images = "Add at least one photo";
  const show = (k: string) => (touched[k] || submitted ? errors[k] : undefined);

  const stockNum = values.stock === "" ? null : stock;
  const stockNote =
    stockNum === null ? "" : stockNum <= 0 ? "Customers will see this as sold out." : stockNum <= LOW_STOCK_AT ? `Low stock: shown as “Only ${stockNum} left”.` : "In stock.";

  const categoryOptions = CATEGORIES.includes(values.category) || !values.category ? CATEGORIES : [...CATEGORIES, values.category];

  /* ---------- images ---------- */
  const addImage = useCallback((url?: string) => {
    if (!url) return;
    setValues((p) => (p.images.includes(url) ? p : { ...p, images: [...p.images, url] }));
  }, []);
  const removeImage = (i: number) => set("images", values.images.filter((_, idx) => idx !== i));
  const moveImage = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= values.images.length) return;
    const next = [...values.images];
    [next[i], next[j]] = [next[j], next[i]];
    set("images", next);
  };
  const makeCover = (i: number) => {
    const next = [...values.images];
    const [img] = next.splice(i, 1);
    set("images", [img, ...next]);
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSubmitted(true);
    setError(null);
    const first = Object.keys(errors)[0];
    if (first) {
      document.getElementById(first === "images" ? "upload-btn" : `p-${first}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      skipGuard.current = true;
      await onSubmit({ ...values, title: values.title.trim(), sku: values.sku.trim() });
    } catch (err) {
      skipGuard.current = false;
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => (dirty ? setDiscardOpen(true) : onCancel());

  const discount = compare > price && price > 0 ? Math.round((1 - price / compare) * 100) : 0;

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-350 space-y-8 pb-16">
      {/* HEADER */}
      <div className="sticky top-16 z-30 -mx-4 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 bg-stone-50/90 px-4 py-4 backdrop-blur-md md:top-20 md:-mx-8 md:px-8">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/admin/products" className={`hover:text-red-900 ${FOCUS}`}>Products</Link>
            <ChevronRight size={14} aria-hidden />
            <span aria-current="page" className="text-stone-900">{mode === "add" ? "Add product" : "Edit product"}</span>
          </nav>
          <h1 className="mt-1 truncate font-serif text-2xl text-stone-900 md:text-3xl">{heading}</h1>
        </div>
        <div className="flex items-center gap-3">
          {dirty && <span className="hidden text-sm text-amber-700 sm:inline">Unsaved changes</span>}
          {productId && (
            <a href={`/shop/${productId}`} target="_blank" rel="noopener noreferrer" className={`hidden h-11 items-center rounded-full border border-stone-300 px-5 text-sm font-semibold text-stone-700 hover:border-red-800 hover:text-red-800 sm:inline-flex ${FOCUS}`}>
              View on store
            </a>
          )}
          <button type="button" onClick={handleCancel} className={`h-11 rounded-full px-5 text-sm font-semibold text-stone-600 hover:bg-stone-100 ${FOCUS}`}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`inline-flex h-11 items-center gap-2 rounded-full bg-red-900 px-7 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60 ${FOCUS}`}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? savingLabel : submitLabel}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-base text-red-900">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}
      {submitted && Object.keys(errors).length > 0 && (
        <p role="alert" className="text-sm text-red-700">
          Please fix {Object.keys(errors).length === 1 ? "1 thing" : `${Object.keys(errors).length} things`} below before saving.
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-12">
        {/* LEFT */}
        <div className="space-y-8 lg:col-span-8">
          <Card title="Details">
            <div className="space-y-6">
              <FieldWrap id="p-title" label="Title" error={show("title")}>
                <input
                  id="p-title" value={values.title} onChange={(e) => set("title", e.target.value)} onBlur={() => blur("title")}
                  placeholder="e.g. Royal maroon Rai Bandhej suit" aria-invalid={!!show("title")} aria-describedby={show("title") ? "p-title-err" : undefined}
                  className={`${inputBase(!!show("title"))} h-12 font-serif text-lg`}
                />
              </FieldWrap>
              <FieldWrap id="p-description" label="Description" optional hint={`${values.description.length} characters. Customers see this under “About this piece”.`}>
                <textarea
                  id="p-description" rows={6} value={values.description} onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe the fabric, the knotting and what makes this piece special."
                  className={`${inputBase(false)} py-3 leading-relaxed`}
                />
              </FieldWrap>
            </div>
          </Card>

          <Card title="Pricing and stock">
            <div className="grid gap-6 md:grid-cols-2">
              <FieldWrap id="p-price" label="Selling price (₹)" error={show("price")}>
                <input id="p-price" type="number" inputMode="decimal" min="0" value={values.price} onChange={(e) => set("price", e.target.value)} onBlur={() => blur("price")} placeholder="0" aria-invalid={!!show("price")} className={`${inputBase(!!show("price"))} h-12`} />
              </FieldWrap>
              <FieldWrap id="p-comparePrice" label="Original price (₹)" optional error={show("comparePrice")} hint={discount > 0 ? `Customers will see ${discount}% off.` : "Shown crossed out next to the selling price."}>
                <input id="p-comparePrice" type="number" inputMode="decimal" min="0" value={values.comparePrice} onChange={(e) => set("comparePrice", e.target.value)} onBlur={() => blur("comparePrice")} placeholder="0" aria-invalid={!!show("comparePrice")} className={`${inputBase(!!show("comparePrice"))} h-12`} />
              </FieldWrap>
              <FieldWrap id="p-stock" label="Stock quantity" error={show("stock")} hint={stockNote}>
                <input id="p-stock" type="number" inputMode="numeric" min="0" step="1" value={values.stock} onChange={(e) => set("stock", e.target.value)} onBlur={() => blur("stock")} placeholder="0" aria-invalid={!!show("stock")} className={`${inputBase(!!show("stock"))} h-12`} />
              </FieldWrap>
              <FieldWrap id="p-sku" label="SKU" optional hint="Your own code for tracking this piece.">
                <input id="p-sku" value={values.sku} onChange={(e) => set("sku", e.target.value)} placeholder="e.g. JK-BND-014" className={`${inputBase(false)} h-12 font-mono`} />
              </FieldWrap>
            </div>
          </Card>

          {extra}
        </div>

        {/* RIGHT */}
        <div className="space-y-8 lg:col-span-4">
          <Card title="Photos" description="The first photo is the cover shown in the shop.">
            <div className="space-y-4">
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{ multiple: true, maxFiles: 8 }}
                onSuccess={(result: any) => addImage(result?.info?.secure_url)}
              >
                {({ open }) => (
                  <button
                    id="upload-btn"
                    type="button"
                    onClick={() => open()}
                    className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8 text-base font-medium transition-colors hover:border-red-800 hover:text-red-800 ${FOCUS} ${
                      show("images") ? "border-red-400 text-red-800" : "border-stone-300 text-stone-600"
                    }`}
                  >
                    <Upload size={24} /> Upload photos
                  </button>
                )}
              </CldUploadWidget>
              {show("images") && <p className="text-sm text-red-700">{errors.images}</p>}

              {values.images.length > 0 && (
                <ul className="grid grid-cols-2 gap-3">
                  {values.images.map((url, i) => (
                    <li key={url} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                      <div className="relative aspect-[3/4] bg-stone-100">
                        <img src={url} alt={`Product photo ${i + 1}${i === 0 ? " (cover)" : ""}`} className="h-full w-full object-cover object-top" />
                        {i === 0 && (
                          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-stone-900">
                            <Star size={12} /> Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          aria-label={`Remove photo ${i + 1}`}
                          className={`absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-red-800 shadow hover:bg-red-800 hover:text-white ${FOCUS}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-1">
                        <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`} className={`grid h-9 w-9 place-items-center rounded-lg text-stone-600 hover:bg-stone-100 disabled:opacity-30 ${FOCUS}`}><ArrowLeft size={16} /></button>
                        {i !== 0 && <button type="button" onClick={() => makeCover(i)} className={`rounded-lg px-2 py-1.5 text-xs font-semibold text-red-900 hover:bg-red-50 ${FOCUS}`}>Make cover</button>}
                        <button type="button" onClick={() => moveImage(i, 1)} disabled={i === values.images.length - 1} aria-label={`Move photo ${i + 1} later`} className={`grid h-9 w-9 place-items-center rounded-lg text-stone-600 hover:bg-stone-100 disabled:opacity-30 ${FOCUS}`}><ArrowRight size={16} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <Card title="Organisation">
            <div className="space-y-6">
              <FieldWrap id="p-category" label="Fabric" error={show("category")}>
                <select id="p-category" value={values.category} onChange={(e) => set("category", e.target.value)} onBlur={() => blur("category")} aria-invalid={!!show("category")} className={`${inputBase(!!show("category"))} h-12`}>
                  <option value="">Select fabric</option>
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>{CATEGORIES.includes(c) ? c : `${c} (legacy spelling)`}</option>
                  ))}
                </select>
              </FieldWrap>

              <label htmlFor="p-featured" className="flex min-h-11 cursor-pointer items-start gap-3">
                <input id="p-featured" type="checkbox" checked={values.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="mt-1 h-5 w-5 rounded border-stone-300 accent-red-900" />
                <span>
                  <span className="block text-base font-medium text-stone-900">Feature on the homepage</span>
                  <span className="block text-sm text-stone-500">Shows this piece in highlighted sections.</span>
                </span>
              </label>
            </div>
          </Card>

          {/* LIVE PREVIEW */}
          <Card title="Shop preview" description="How this appears in the collection.">
            <div className="mx-auto max-w-[220px]">
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-stone-100">
                {values.images[0] ? (
                  <img src={values.images[0]} alt="" className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="grid h-full place-items-center text-stone-400"><ImageIcon size={32} strokeWidth={1.25} /></div>
                )}
                {stockNum !== null && stockNum <= 0 && <span className="absolute left-2 top-2 rounded-full bg-stone-900 px-2.5 py-1 text-xs font-semibold text-white">Sold out</span>}
                {(stockNum === null || stockNum > 0) && discount > 0 && <span className="absolute left-2 top-2 rounded-full bg-red-800 px-2.5 py-1 text-xs font-semibold text-white">{discount}% off</span>}
              </div>
              <div className="mt-3 space-y-1">
                {values.category && <p className="text-sm text-red-800/80">{values.category}</p>}
                <p className="font-serif text-lg leading-snug text-stone-900">{values.title || "Product title"}</p>
                <p className="flex items-baseline gap-2">
                  <span className="font-serif text-xl text-stone-900">{values.price !== "" && price > 0 ? inr(price) : "₹0"}</span>
                  {discount > 0 && <span className="text-sm text-stone-500 line-through">{inr(compare)}</span>}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={discardOpen}
        title="Discard your changes?"
        message="You have unsaved changes. If you leave now, they will be lost."
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        danger
        onConfirm={() => {
          skipGuard.current = true;
          setDiscardOpen(false);
          onCancel();
        }}
        onCancel={() => setDiscardOpen(false)}
      />
    </form>
  );
}