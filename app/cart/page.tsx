"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ref, push, set } from "firebase/database";
import { loadRazorpayScript } from "@/utils/loadScript";
import { db } from "@/lib/firebase";
import {
  ArrowRight, Loader2, CheckCircle2, ShieldCheck, ChevronRight, Trash2, ShoppingBag,
  Truck, History, Search, Minus, Plus, AlertTriangle, Copy, Check, Lock, X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */
const GST_RATE = 0.05; // Confirm the correct rate for your products with your accountant
const SHIPPING_FEE = 60;
const FREE_SHIPPING_FROM = 3000; // free delivery when subtotal is this amount or more

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];

interface CartItem {
  id: string;
  title?: string;
  name?: string;
  price: number | string;
  qty: number;
  images?: string[];
  img?: string;
  category?: string;
  fabric?: string;
  stock?: number;
}

interface FormData {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; landmark: string; city: string; state: string; pincode: string; note: string;
}
const EMPTY_FORM: FormData = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", landmark: "", city: "", state: "Gujarat", pincode: "", note: "",
};

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800";
const inr = (n: number | string) => `₹${Number(n).toLocaleString("en-IN")}`;
const itemName = (i: CartItem) => i.title || i.name || "Untitled piece";
const itemFabric = (i: CartItem) => i.fabric || i.category || "";

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */
const validators: Partial<Record<keyof FormData, (v: string) => string>> = {
  firstName: (v) => (v.trim() ? "" : "Enter your first name"),
  lastName: (v) => (v.trim() ? "" : "Enter your last name"),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email, like name@example.com"),
  phone: (v) => (/^[6-9]\d{9}$/.test(v.replace(/[\s-]|^\+91/g, "")) ? "" : "Enter a 10-digit mobile number"),
  address: (v) => (v.trim().length >= 8 ? "" : "Enter your house number, street and area"),
  city: (v) => (v.trim() ? "" : "Enter your city"),
  state: (v) => (v ? "" : "Select your state"),
  pincode: (v) => (/^[1-9]\d{5}$/.test(v.trim()) ? "" : "Enter a 6-digit pincode"),
};

/* ------------------------------------------------------------------ */
/* Field (module-level so inputs never remount while typing)           */
/* ------------------------------------------------------------------ */
interface FieldProps {
  name: keyof FormData;
  label: string;
  value: string;
  error?: string;
  optional?: boolean;
  hint?: string;
  className?: string;
  as?: "input" | "select" | "textarea";
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  onChange: (name: keyof FormData, value: string) => void;
  onBlur: (name: keyof FormData) => void;
}

const Field = ({
  name, label, value, error, optional, hint, className = "", as = "input", type = "text",
  autoComplete, inputMode, maxLength, onChange, onBlur,
}: FieldProps) => {
  const id = `f-${name}`;
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  const base = `w-full rounded-xl border bg-white px-4 text-base text-stone-900 transition-colors placeholder:text-stone-400 focus:outline-none focus:ring-2 ${
    error ? "border-red-600 focus:ring-red-200" : "border-stone-300 focus:border-red-800 focus:ring-red-100"
  }`;
  const common = {
    id, name, value, autoComplete, "aria-invalid": !!error, "aria-describedby": describedBy,
    onBlur: () => onBlur(name),
  };
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-stone-800">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-stone-500">Optional</span>}
      </label>
      {as === "select" ? (
        <select {...common} onChange={(e) => onChange(name, e.target.value)} className={`${base} h-12`}>
          <option value="">Select state</option>
          {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      ) : as === "textarea" ? (
        <textarea {...common} rows={3} maxLength={maxLength} onChange={(e) => onChange(name, e.target.value)} className={`${base} py-3`} />
      ) : (
        <input
          {...common}
          type={type}
          inputMode={inputMode}
          maxLength={maxLength}
          onChange={(e) => onChange(name, e.target.value)}
          className={`${base} h-12`}
        />
      )}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-red-700">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-stone-500">{hint}</p>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function CartPage() {
  const router = useRouter();
  const { cart, updateQty, removeItem, clearCart } = useCart();
  const items = (cart ?? []) as CartItem[];

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<any>(null); // saved order (success screen)
  const [unsavedOrder, setUnsavedOrder] = useState<any>(null); // paid, but Firebase write failed
  const [retrying, setRetrying] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showLookup, setShowLookup] = useState(false);
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupError, setLookupError] = useState("");

  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  /* ---------- totals ---------- */
  const itemCount = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((acc, i) => acc + Number(i.price) * i.qty, 0);
  const gstAmount = Math.round(subtotal * GST_RATE);
  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
  const total = subtotal + gstAmount + shipping;
  const remainingForFree = Math.max(0, FREE_SHIPPING_FROM - subtotal);
  const freeProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_FROM) * 100));

  /* ---------- form ---------- */
  const errors = useMemo(() => {
    const out: Partial<Record<keyof FormData, string>> = {};
    (Object.keys(validators) as (keyof FormData)[]).forEach((k) => {
      const msg = validators[k]!(formData[k]);
      if (msg) out[k] = msg;
    });
    return out;
  }, [formData]);

  const showError = (k: keyof FormData) => (touched[k] || submitted ? errors[k] : undefined);
  const handleChange = (name: keyof FormData, value: string) => setFormData((p) => ({ ...p, [name]: value }));
  const handleBlur = (name: keyof FormData) => setTouched((p) => ({ ...p, [name]: true }));
  const fieldProps = (name: keyof FormData) => ({
    name, value: formData[name], error: showError(name), onChange: handleChange, onBlur: handleBlur,
  });

  // NOTE: assumes updateQty(id, newQuantity). If your CartContext expects a change
  // (+1 / -1) instead, change this one line.
  const setQty = (item: CartItem, qty: number) => updateQty(item.id, qty);

  /* ---------- order saving ---------- */
  const saveOrder = async (order: any) => {
    const newOrderRef = push(ref(db, "orders"));
    await set(newOrderRef, order);
  };

  const buildOrder = (paymentId: string) => ({
    paymentId,
    customer: formData,
    items: items.map((i) => ({
      id: i.id,
      title: itemName(i),
      price: i.price,
      qty: i.qty,
      img: i.images?.[0] || i.img || "",
      fabric: itemFabric(i),
    })),
    breakdown: { subtotal, gst: gstAmount, shipping, total },
    status: "Paid",
    deliveryStatus: "Processing",
    createdAt: new Date().toISOString(),
  });

  const retrySave = async () => {
    if (!unsavedOrder) return;
    setRetrying(true);
    try {
      await saveOrder(unsavedOrder);
      setPlacedOrder(unsavedOrder);
      setUnsavedOrder(null);
      clearCart();
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setRetrying(false);
    }
  };

  const copyPaymentId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  /* ---------- payment ---------- */
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || isProcessing) return;

    setSubmitted(true);
    const firstInvalid = (Object.keys(errors) as (keyof FormData)[])[0];
    if (firstInvalid) {
      document.getElementById(`f-${firstInvalid}`)?.focus();
      return;
    }

    setPayError(null);
    setIsProcessing(true);

    const loaded = await loadRazorpayScript();
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
    if (!loaded || !key) {
      setPayError(
        !loaded
          ? "The payment window couldn’t load. Check your connection and try again."
          : "Payments are temporarily unavailable. Please try again later."
      );
      setIsProcessing(false);
      return;
    }

    const options = {
      key,
      amount: Math.round(total * 100),
      currency: "INR",
      name: "Clothiva Jetpur",
      description: `Order of ${itemCount} ${itemCount === 1 ? "piece" : "pieces"}`,
      handler: async (response: any) => {
        const order = buildOrder(response.razorpay_payment_id);
        try {
          await saveOrder(order);
          setPlacedOrder(order);
          clearCart();
        } catch (err) {
          console.error("Firebase Sync Error:", err);
          setUnsavedOrder(order); // money is taken: never leave the customer without a record
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: "#7F1D1D" },
      modal: { ondismiss: () => setIsProcessing(false) },
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (res: any) => {
        setPayError(
          `${res?.error?.description || "Your payment didn’t go through."} If any amount was deducted, your bank usually reverses it automatically.`
        );
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setPayError("We couldn’t start the payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lookupEmail.trim())) {
      setLookupError("Enter the email you used when ordering");
      return;
    }
    setLookupError("");
    router.push(`/orders?email=${encodeURIComponent(lookupEmail.trim())}`);
  };

  /* ================================================================ */
  /* PAID BUT NOT SAVED                                                */
  /* ================================================================ */
  if (unsavedOrder) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FCFAF8] px-6 pt-28 pb-16">
        <div className="w-full max-w-lg rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm md:p-10">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-amber-50">
            <AlertTriangle size={32} className="text-amber-600" />
          </div>
          <h1 className="font-serif text-3xl text-stone-900">Payment received, order not saved yet</h1>
          <p className="mt-3 text-base leading-relaxed text-stone-600">
            Your payment of {inr(unsavedOrder.breakdown.total)} went through, but we couldn’t record your order. Please don’t pay again.
            Try saving it once more, and if it keeps failing, contact us with the payment ID below.
          </p>
          <div className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-stone-50 px-4 py-3 text-left">
            <div className="min-w-0">
              <p className="text-xs text-stone-500">Payment ID</p>
              <p className="truncate font-mono text-sm text-stone-900">{unsavedOrder.paymentId}</p>
            </div>
            <button
              type="button"
              onClick={() => copyPaymentId(unsavedOrder.paymentId)}
              className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-stone-300 px-4 text-sm font-semibold text-stone-800 hover:border-red-800 ${FOCUS}`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <button
            type="button"
            onClick={retrySave}
            disabled={retrying}
            className={`mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-red-900 text-base font-semibold text-white hover:bg-red-800 disabled:opacity-60 ${FOCUS}`}
          >
            {retrying ? <><Loader2 size={18} className="animate-spin" /> Saving…</> : "Save my order again"}
          </button>
        </div>
      </main>
    );
  }

  /* ================================================================ */
  /* SUCCESS                                                           */
  /* ================================================================ */
  if (placedOrder) {
    const c = placedOrder.customer as FormData;
    const b = placedOrder.breakdown;
    return (
      <main className="min-h-screen bg-[#FCFAF8] px-6 pb-20 pt-28 md:pt-36">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-green-50">
              <CheckCircle2 size={44} className="text-green-600" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-4xl text-stone-900 md:text-5xl">Thank you, {c.firstName}</h1>
            <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-stone-600">
              Your order is confirmed. Track it any time using the email you ordered with: <strong className="font-semibold text-stone-900">{c.email}</strong>.
            </p>
          </div>

          <div className="mt-10 space-y-6 rounded-3xl border border-stone-200 bg-white p-6 md:p-8">
            <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-5">
              <div className="min-w-0">
                <p className="text-sm text-stone-500">Payment ID</p>
                <p className="truncate font-mono text-sm text-stone-900">{placedOrder.paymentId}</p>
              </div>
              <button
                type="button"
                onClick={() => copyPaymentId(placedOrder.paymentId)}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-stone-300 px-4 text-sm font-semibold text-stone-800 hover:border-red-800 ${FOCUS}`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <ul className="space-y-4">
              {placedOrder.items.map((i: any) => (
                <li key={i.id} className="flex items-center gap-4">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    {i.img && <img src={i.img} alt="" className="h-full w-full object-cover object-top" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-lg text-stone-900">{i.title}</p>
                    <p className="text-sm text-stone-500">Qty {i.qty}{i.fabric ? ` · ${i.fabric}` : ""}</p>
                  </div>
                  <p className="font-serif text-lg text-stone-900">{inr(Number(i.price) * i.qty)}</p>
                </li>
              ))}
            </ul>

            <dl className="space-y-2 border-t border-stone-100 pt-5 text-base">
              <div className="flex justify-between text-stone-600"><dt>Subtotal</dt><dd>{inr(b.subtotal)}</dd></div>
              <div className="flex justify-between text-stone-600"><dt>GST</dt><dd>{inr(b.gst)}</dd></div>
              <div className="flex justify-between text-stone-600"><dt>Delivery</dt><dd>{b.shipping === 0 ? "Free" : inr(b.shipping)}</dd></div>
              <div className="flex justify-between border-t border-stone-100 pt-3 font-serif text-xl text-stone-900"><dt>Total paid</dt><dd>{inr(b.total)}</dd></div>
            </dl>

            <div className="rounded-2xl bg-stone-50 p-5 text-base">
              <p className="mb-1 text-sm text-stone-500">Delivering to</p>
              <p className="text-stone-900">{c.firstName} {c.lastName}</p>
              <p className="text-stone-700">
                {c.address}{c.landmark ? `, ${c.landmark}` : ""}, {c.city}, {c.state} {c.pincode}
              </p>
              <p className="text-stone-700">{c.phone}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={`/orders?email=${encodeURIComponent(c.email)}`}
              className={`inline-flex h-13 items-center justify-center rounded-full bg-stone-900 px-10 text-base font-semibold text-white hover:bg-red-900 ${FOCUS}`}
            >
              Track my order
            </Link>
            <Link
              href="/shop"
              className={`inline-flex h-13 items-center justify-center rounded-full border border-stone-300 px-10 text-base font-semibold text-stone-800 hover:border-red-800 hover:text-red-800 ${FOCUS}`}
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ================================================================ */
  /* CART + CHECKOUT                                                   */
  /* ================================================================ */
  const payLabel = `Pay ${inr(total)}`;
  const submitContent = isProcessing ? (
    <><Loader2 className="animate-spin" size={20} /> Opening payment…</>
  ) : (
    <><Lock size={18} /> {payLabel}</>
  );

  return (
    <main className="min-h-screen bg-[#FCFAF8] pb-32 pt-28 antialiased selection:bg-red-900 selection:text-white md:pt-36 lg:pb-20">
      <div className="mx-auto max-w-350 px-6 md:px-12">
        {/* HEADER */}
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-8">
          <div className="space-y-4">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-stone-500">
              <Link href="/shop" className={`hover:text-red-900 ${FOCUS}`}>Collections</Link>
              <ChevronRight size={14} aria-hidden />
              <span aria-current="page" className="text-stone-900">Bag and checkout</span>
            </nav>
            <h1 className="font-serif text-4xl tracking-tight text-stone-900 md:text-6xl">
              Your bag
              {items.length > 0 && (
                <span className="ml-3 font-sans text-lg font-normal text-stone-500">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              )}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setShowLookup((v) => !v)}
            aria-expanded={showLookup}
            className={`inline-flex h-11 items-center gap-2 rounded-full border border-stone-300 px-5 text-sm font-semibold text-stone-700 hover:border-red-800 hover:text-red-800 ${FOCUS}`}
          >
            <History size={16} /> {showLookup ? "Close order lookup" : "Track an order"}
          </button>
        </header>

        {/* ORDER LOOKUP */}
        {showLookup && (
          <form onSubmit={handleLookup} noValidate className="mx-auto mb-10 max-w-xl rounded-3xl border border-stone-200 bg-white p-6 md:p-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-stone-900">Find your order</h2>
                <p className="mt-1 text-base text-stone-600">Enter the email you used when ordering to see its status.</p>
              </div>
              <button type="button" onClick={() => setShowLookup(false)} aria-label="Close order lookup" className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-stone-100 text-stone-600 ${FOCUS}`}>
                <X size={18} />
              </button>
            </div>
            <label htmlFor="lookup-email" className="mb-1.5 block text-sm font-medium text-stone-800">Email address</label>
            <div className="flex gap-2">
              <input
                id="lookup-email"
                type="email"
                autoComplete="email"
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                aria-invalid={!!lookupError}
                className={`h-12 min-w-0 flex-1 rounded-xl border bg-white px-4 text-base focus:outline-none focus:ring-2 ${lookupError ? "border-red-600 focus:ring-red-200" : "border-stone-300 focus:border-red-800 focus:ring-red-100"}`}
                placeholder="name@example.com"
              />
              <button type="submit" className={`inline-flex h-12 items-center gap-2 rounded-xl bg-stone-900 px-5 text-sm font-semibold text-white hover:bg-red-900 ${FOCUS}`}>
                <Search size={16} /> Find
              </button>
            </div>
            {lookupError && <p className="mt-1.5 text-sm text-red-700">{lookupError}</p>}
          </form>
        )}

        {items.length > 0 ? (
          <div className="grid gap-12 lg:grid-cols-12 xl:gap-20">
            {/* LEFT */}
            <div className="space-y-14 lg:col-span-7">
              {/* 1. ITEMS */}
              <section aria-labelledby="items-title">
                <h2 id="items-title" className="mb-5 font-serif text-2xl text-stone-900">1. Review your items</h2>

                {/* Free delivery progress */}
                <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-5">
                  <p className="flex items-center gap-2 text-base text-stone-800">
                    <Truck size={18} className="text-red-900" />
                    {remainingForFree > 0
                      ? <>Add <strong className="font-semibold">{inr(remainingForFree)}</strong> more for free delivery</>
                      : <strong className="font-semibold text-emerald-700">You’ve unlocked free delivery</strong>}
                  </p>
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={freeProgress}
                    aria-label="Progress to free delivery"
                    className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100"
                  >
                    <div className={`h-full rounded-full transition-all duration-500 motion-reduce:transition-none ${remainingForFree > 0 ? "bg-red-800" : "bg-emerald-600"}`} style={{ width: `${freeProgress}%` }} />
                  </div>
                </div>

                <ul className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
                  {items.map((item) => {
                    const max = typeof item.stock === "number" && item.stock > 0 ? item.stock : undefined;
                    const atMax = max !== undefined && item.qty >= max;
                    const fabric = itemFabric(item);
                    return (
                      <li key={item.id} className="flex gap-4 p-4 md:gap-6 md:p-6">
                        <Link href={`/shop/${item.id}`} className={`h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100 md:h-40 md:w-32 ${FOCUS}`}>
                          <img src={item.images?.[0] || item.img || "/placeholder.jpg"} alt={itemName(item)} className="h-full w-full object-cover object-top" />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link href={`/shop/${item.id}`} className={`font-serif text-lg leading-snug text-stone-900 hover:text-red-800 md:text-xl ${FOCUS}`}>
                                {itemName(item)}
                              </Link>
                              {fabric && <p className="mt-1 text-sm text-stone-500">{fabric}</p>}
                              <p className="mt-1 text-sm text-stone-500">{inr(item.price)} each</p>
                            </div>
                            <p className="shrink-0 font-serif text-lg text-stone-900 md:text-xl">{inr(Number(item.price) * item.qty)}</p>
                          </div>

                          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                            <div role="group" aria-label={`Quantity of ${itemName(item)}`} className="inline-flex items-center rounded-full border border-stone-300">
                              <button
                                type="button"
                                onClick={() => setQty(item, item.qty - 1)}
                                disabled={item.qty <= 1}
                                aria-label="Decrease quantity"
                                className={`grid h-11 w-11 place-items-center rounded-full text-stone-800 hover:bg-stone-100 disabled:opacity-30 ${FOCUS}`}
                              >
                                <Minus size={16} />
                              </button>
                              <span aria-live="polite" className="w-8 text-center text-base font-semibold text-stone-900">{item.qty}</span>
                              <button
                                type="button"
                                onClick={() => setQty(item, item.qty + 1)}
                                disabled={atMax}
                                aria-label="Increase quantity"
                                className={`grid h-11 w-11 place-items-center rounded-full text-stone-800 hover:bg-stone-100 disabled:opacity-30 ${FOCUS}`}
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-stone-600 hover:bg-red-50 hover:text-red-900 ${FOCUS}`}
                            >
                              <Trash2 size={16} strokeWidth={1.5} /> Remove
                            </button>
                          </div>
                          {atMax && <p className="mt-2 text-sm text-amber-700">That’s all we have in stock.</p>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* 2. DELIVERY DETAILS */}
              <section aria-labelledby="delivery-title">
                <h2 id="delivery-title" className="mb-1 font-serif text-2xl text-stone-900">2. Delivery details</h2>
                <p className="mb-6 text-base text-stone-600">We’ll use these to deliver your order and send updates.</p>

                <form id="checkout-form" onSubmit={handleConfirmOrder} noValidate className="grid gap-x-6 gap-y-5 md:grid-cols-2">
                  <Field {...fieldProps("firstName")} label="First name" autoComplete="given-name" />
                  <Field {...fieldProps("lastName")} label="Last name" autoComplete="family-name" />
                  <Field {...fieldProps("email")} label="Email" type="email" autoComplete="email" className="md:col-span-2" hint="Used to track your order." />
                  <Field {...fieldProps("phone")} label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={13} className="md:col-span-2" hint="10 digits. The courier may call you." />
                  <Field {...fieldProps("address")} label="Address" autoComplete="street-address" className="md:col-span-2" hint="House or flat number, street, area." />
                  <Field {...fieldProps("landmark")} label="Landmark" optional autoComplete="off" className="md:col-span-2" hint="For example, near a temple or school." />
                  <Field {...fieldProps("city")} label="City" autoComplete="address-level2" />
                  <Field {...fieldProps("pincode")} label="Pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} />
                  <Field {...fieldProps("state")} label="State" as="select" autoComplete="address-level1" className="md:col-span-2" />
                  <Field {...fieldProps("note")} label="Note for us" as="textarea" optional maxLength={300} className="md:col-span-2" hint="Anything we should know about this order or delivery." />
                </form>
              </section>
            </div>

            {/* RIGHT: SUMMARY */}
            <aside aria-labelledby="summary-title" className="lg:col-span-5">
              <div className="sticky top-28 space-y-5">
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
                  <h2 id="summary-title" className="mb-6 font-serif text-2xl text-stone-900">Order summary</h2>

                  <dl className="space-y-3 text-base">
                    <div className="flex justify-between text-stone-700">
                      <dt>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</dt>
                      <dd className="text-stone-900">{inr(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between text-stone-700">
                      <dt>GST ({Math.round(GST_RATE * 100)}%)</dt>
                      <dd className="text-stone-900">{inr(gstAmount)}</dd>
                    </div>
                    <div className="flex justify-between text-stone-700">
                      <dt>Delivery from Jetpur</dt>
                      <dd className={shipping === 0 ? "font-semibold text-emerald-700" : "text-stone-900"}>
                        {shipping === 0 ? "Free" : inr(shipping)}
                      </dd>
                    </div>
                    <div className="flex items-end justify-between border-t border-stone-200 pt-5">
                      <div>
                        <dt className="font-semibold text-stone-900">Total</dt>
                        <p className="text-sm text-stone-500">Including GST and delivery</p>
                      </div>
                      <dd className="font-serif text-4xl text-stone-900">{inr(total)}</dd>
                    </div>
                  </dl>

                  {payError && (
                    <div role="alert" className="mt-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-900">
                      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                      <p>{payError}</p>
                    </div>
                  )}

                  {submitted && Object.keys(errors).length > 0 && (
                    <p role="alert" className="mt-6 text-sm text-red-700">
                      Please fix {Object.keys(errors).length === 1 ? "1 field" : `${Object.keys(errors).length} fields`} in the delivery details.
                    </p>
                  )}

                  <button
                    form="checkout-form"
                    type="submit"
                    disabled={isProcessing}
                    className={`mt-6 hidden h-14 w-full items-center justify-center gap-3 rounded-full bg-red-900 text-base font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-60 lg:flex ${FOCUS}`}
                  >
                    {submitContent}
                  </button>

                  <p className="mt-4 text-center text-sm leading-relaxed text-stone-500">
                    By paying you agree to our{" "}
                    <Link href="/terms" className="underline underline-offset-2 hover:text-red-900">Terms</Link> and{" "}
                    <Link href="/privacy" className="underline underline-offset-2 hover:text-red-900">Privacy Policy</Link>.
                  </p>
                </div>

                <ul className="space-y-3 rounded-2xl bg-stone-50 p-5 text-sm text-stone-600">
                  <li className="flex items-center gap-3"><ShieldCheck size={18} className="shrink-0 text-red-900/60" strokeWidth={1.5} /> Secure payment through Razorpay</li>
                  <li className="flex items-center gap-3"><Truck size={18} className="shrink-0 text-red-900/60" strokeWidth={1.5} /> Ships from Jetpur, Gujarat</li>
                </ul>
              </div>
            </aside>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-8 grid h-28 w-28 place-items-center rounded-full bg-stone-100">
              <ShoppingBag size={44} strokeWidth={1} className="text-stone-400" />
            </div>
            <h2 className="mb-3 font-serif text-3xl text-stone-900">Your bag is empty</h2>
            <p className="mb-8 max-w-sm text-base text-stone-600">Browse hand-knotted Bandhani from Jetpur and add your favourites here.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className={`inline-flex h-13 items-center justify-center rounded-full bg-red-900 px-10 text-base font-semibold text-white hover:bg-red-800 ${FOCUS}`}>
                Shop the collection
              </Link>
              <button type="button" onClick={() => setShowLookup(true)} className={`inline-flex h-13 items-center justify-center rounded-full border border-stone-300 px-10 text-base font-semibold text-stone-800 hover:border-red-800 hover:text-red-800 ${FOCUS}`}>
                Track an order
              </button>
            </div>
          </div>
        )}
      </div>

      {/* STICKY MOBILE PAY BAR */}
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex items-center gap-4 border-t border-stone-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
          <div className="shrink-0">
            <p className="text-xs text-stone-500">Total</p>
            <p className="font-serif text-2xl leading-none text-stone-900">{inr(total)}</p>
          </div>
          <button
            form="checkout-form"
            type="submit"
            disabled={isProcessing}
            className={`inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-red-900 text-base font-semibold text-white hover:bg-red-800 disabled:opacity-60 ${FOCUS}`}
          >
            {isProcessing ? <><Loader2 className="animate-spin" size={20} /> Opening…</> : <>Pay now <ArrowRight size={18} /></>}
          </button>
        </div>
      )}
    </main>
  );
}