"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ref, onValue } from "firebase/database";
import { db, auth } from "@/lib/firebase";
import {
  CreditCard, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight, ChevronRight,
  Download, Plus, AlertTriangle, RefreshCw, PackageX,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types + helpers                                                     */
/* ------------------------------------------------------------------ */
interface Order {
  key: string;
  paymentId?: string;
  customer?: {
    firstName?: string; lastName?: string; email?: string; phone?: string;
    address?: string; city?: string; state?: string; pincode?: string;
  };
  items?: { title?: string; qty?: number }[];
  breakdown?: { subtotal?: number; gst?: number; shipping?: number; total?: number };
  status?: string;
  deliveryStatus?: string;
  createdAt?: string;
}
interface LowStockProduct { id: string; title: string; stock: number }

type Period = 7 | 30 | 90;
const PERIODS: Period[] = [7, 30, 90];
const DAY = 86_400_000;

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const when = (o: Order) => (o.createdAt ? new Date(o.createdAt).getTime() || 0 : 0);
const total = (o: Order) => Number(o.breakdown?.total ?? 0);
const isCounted = (o: Order) => !/cancel|refund/i.test(o.status ?? "");
const customerName = (o: Order) =>
  `${o.customer?.firstName ?? ""} ${o.customer?.lastName ?? ""}`.trim() || o.customer?.email || "Guest";
const itemSummary = (o: Order) => {
  const items = o.items ?? [];
  if (!items.length) return "No items";
  const first = `${items[0].title ?? "Item"}${(items[0].qty ?? 1) > 1 ? ` ×${items[0].qty}` : ""}`;
  return items.length > 1 ? `${first} +${items.length - 1} more` : first;
};
const shortDate = (ms: number) => new Date(ms).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const ago = (ms: number) => {
  const mins = Math.max(0, Math.round((Date.now() - ms) / 60000));
  if (mins < 60) return `${mins || 1} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
};
const norm = (s?: string) => (s ?? "").trim().toLowerCase();

const STATUS_STYLE: Record<string, string> = {
  processing: "bg-amber-50 text-amber-800 ring-amber-200",
  shipped: "bg-blue-50 text-blue-800 ring-blue-200",
  delivered: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};
const StatusBadge = ({ status }: { status?: string }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
      STATUS_STYLE[norm(status)] ?? "bg-stone-100 text-stone-700 ring-stone-200"
    }`}
  >
    {status || "Unknown"}
  </span>
);

const pct = (cur: number, prev: number): number | null =>
  prev === 0 ? (cur > 0 ? null : 0) : ((cur - prev) / prev) * 100;

/* ------------------------------------------------------------------ */
/* Stat card                                                           */
/* ------------------------------------------------------------------ */
const StatCard = ({
  label, value, change, icon: Icon, tint, loading, period,
}: {
  label: string; value: string; change: number | null; icon: React.ElementType; tint: string; loading: boolean; period: Period;
}) => {
  const up = (change ?? 1) >= 0;
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${tint}`}>
          <Icon size={20} strokeWidth={1.75} />
        </span>
        {!loading && (
          <span
            className={`inline-flex items-center gap-1 text-sm font-semibold ${change === null ? "text-stone-600" : up ? "text-emerald-700" : "text-red-700"}`}
            title={`Compared with the previous ${period} days`}
          >
            {change === null ? "New" : `${up ? "+" : ""}${change.toFixed(1)}%`}
            {change !== null && (up ? <ArrowUpRight size={16} aria-hidden /> : <ArrowDownRight size={16} aria-hidden />)}
            {change !== null && <span className="sr-only">{up ? "up" : "down"} from the previous {period} days</span>}
          </span>
        )}
      </div>
      <p className="text-sm text-stone-600">{label}</p>
      {loading ? (
        <div className="mt-2 h-8 w-28 animate-pulse rounded bg-stone-100 motion-reduce:animate-none" />
      ) : (
        <p className="mt-1 font-serif text-3xl text-stone-900">{value}</p>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [period, setPeriod] = useState<Period>(30);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [greeting, setGreeting] = useState("Welcome");
  const [firstName, setFirstName] = useState("");

  // Greeting is computed after mount to avoid server/client time mismatches
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
    const name = auth.currentUser?.displayName?.split(" ")[0];
    if (name) setFirstName(name);
  }, []);

  // Live orders from Firebase
  useEffect(() => {
    setLoading(true);
    setError(false);
    const unsubscribe = onValue(
      ref(db, "orders"),
      (snap) => {
        const val = snap.val() as Record<string, Omit<Order, "key">> | null;
        setOrders(val ? Object.entries(val).map(([key, o]) => ({ key, ...o })) : []);
        setLoading(false);
      },
      (err) => {
        console.error("Orders listener failed:", err);
        setError(true);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [reloadKey]);

  // Low-stock products (optional: the card is hidden if this fails)
  useEffect(() => {
    let cancelled = false;
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data?.products ?? [];
        setLowStock(
          list
            .filter((p: any) => typeof p.stock === "number" && p.stock <= 5)
            .map((p: any) => ({ id: p.id, title: p.title, stock: p.stock }))
            .sort((a: LowStockProduct, b: LowStockProduct) => a.stock - b.stock)
            .slice(0, 5)
        );
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  /* ---------- metrics ---------- */
  const metrics = useMemo(() => {
    const counted = orders.filter(isCounted);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const end = startOfToday.getTime() + DAY;
    const curFrom = end - period * DAY;
    const prevFrom = curFrom - period * DAY;

    // A customer is "new" in the period their first order was placed
    const firstOrder = new Map<string, number>();
    counted.forEach((o) => {
      const email = norm(o.customer?.email);
      if (!email) return;
      firstOrder.set(email, Math.min(firstOrder.get(email) ?? Infinity, when(o)));
    });

    const summarise = (from: number, to: number) => {
      const inRange = counted.filter((o) => when(o) >= from && when(o) < to);
      const revenue = inRange.reduce((s, o) => s + total(o), 0);
      const newCustomers = [...firstOrder.values()].filter((t) => t >= from && t < to).length;
      return { revenue, orders: inRange.length, newCustomers, aov: inRange.length ? revenue / inRange.length : 0 };
    };

    const cur = summarise(curFrom, end);
    const prev = summarise(prevFrom, curFrom);

    // Daily revenue series
    const days = Array.from({ length: period }, (_, i) => ({ date: curFrom + i * DAY, total: 0 }));
    counted.forEach((o) => {
      const idx = Math.floor((when(o) - curFrom) / DAY);
      if (idx >= 0 && idx < period) days[idx].total += total(o);
    });
    const peak = days.reduce((m, d) => (d.total > m.total ? d : m), days[0]);

    return { cur, prev, days, peak, curFrom, end, counted };
  }, [orders, period]);

  const recent = useMemo(() => [...orders].sort((a, b) => when(b) - when(a)).slice(0, 6), [orders]);
  const attention = useMemo(
    () => orders.filter((o) => norm(o.deliveryStatus) === "processing" && isCounted(o)).sort((a, b) => when(a) - when(b)),
    [orders]
  );

  /* ---------- CSV export ---------- */
  const exportCsv = () => {
    const rows = metrics.counted
      .filter((o) => when(o) >= metrics.curFrom && when(o) < metrics.end)
      .sort((a, b) => when(b) - when(a));
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = [
      "Order key", "Date", "Payment ID", "Customer", "Email", "Phone", "Address", "City", "State", "Pincode",
      "Items", "Subtotal", "GST", "Delivery", "Total", "Payment status", "Delivery status",
    ];
    const lines = rows.map((o) =>
      [
        o.key, o.createdAt, o.paymentId, customerName(o), o.customer?.email, o.customer?.phone,
        o.customer?.address, o.customer?.city, o.customer?.state, o.customer?.pincode,
        (o.items ?? []).map((i) => `${i.title} x${i.qty ?? 1}`).join("; "),
        o.breakdown?.subtotal, o.breakdown?.gst, o.breakdown?.shipping, o.breakdown?.total,
        o.status, o.deliveryStatus,
      ].map(esc).join(",")
    );
    const blob = new Blob(["\ufeff" + [header.map(esc).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clothiva-orders-last-${period}-days.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const { cur, prev, days, peak } = metrics;
  const maxDay = Math.max(1, ...days.map((d) => d.total));

  const stats = [
    { label: "Revenue", value: inr(cur.revenue), change: pct(cur.revenue, prev.revenue), icon: CreditCard, tint: "bg-blue-50 text-blue-700" },
    { label: "Orders", value: String(cur.orders), change: pct(cur.orders, prev.orders), icon: ShoppingBag, tint: "bg-red-50 text-red-900" },
    { label: "New customers", value: String(cur.newCustomers), change: pct(cur.newCustomers, prev.newCustomers), icon: Users, tint: "bg-indigo-50 text-indigo-700" },
    { label: "Average order value", value: inr(cur.aov), change: pct(cur.aov, prev.aov), icon: TrendingUp, tint: "bg-emerald-50 text-emerald-700" },
  ];

  /* ---------- error ---------- */
  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-10 text-center">
        <AlertTriangle className="mx-auto mb-4 text-amber-600" size={32} />
        <h2 className="font-serif text-2xl text-stone-900">We couldn’t load your orders</h2>
        <p className="mt-2 text-base text-stone-600">
          Check your connection, and that your Firebase rules allow admins to read <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm">orders</code>.
        </p>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className={`mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-red-900 px-6 text-sm font-semibold text-white hover:bg-red-800 ${FOCUS}`}
        >
          <RefreshCw size={16} /> Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-stone-900">
            {greeting}{firstName ? `, ${firstName}` : ""}
          </h2>
          <p className="mt-1 text-base text-stone-600">
            {loading
              ? "Loading your store activity…"
              : attention.length > 0
              ? `${attention.length} ${attention.length === 1 ? "order is" : "orders are"} waiting to be shipped.`
              : "Here’s how Clothiva is doing."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div role="radiogroup" aria-label="Time period" className="inline-flex rounded-full border border-stone-300 bg-white p-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={period === p}
                onClick={() => setPeriod(p)}
                className={`h-9 rounded-full px-4 text-sm font-semibold transition-colors ${FOCUS} ${
                  period === p ? "bg-red-900 text-white" : "text-stone-600 hover:text-red-900"
                }`}
              >
                {p} days
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={exportCsv}
            disabled={loading || orders.length === 0}
            className={`inline-flex h-11 items-center gap-2 rounded-full border border-stone-300 bg-white px-5 text-sm font-semibold text-stone-800 hover:border-red-800 hover:text-red-800 disabled:opacity-40 ${FOCUS}`}
          >
            <Download size={16} /> Export orders
          </button>
          <Link
            href="/admin/products"
            className={`inline-flex h-11 items-center gap-2 rounded-full bg-red-900 px-5 text-sm font-semibold text-white hover:bg-red-800 ${FOCUS}`}
          >
            <Plus size={16} /> Add product
          </Link>
        </div>
      </div>

      {/* STATS */}
      <section aria-label={`Summary for the last ${period} days`} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} loading={loading} period={period} />
        ))}
      </section>

      {!loading && orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-20 text-center">
          <ShoppingBag className="mx-auto mb-4 text-stone-400" size={36} strokeWidth={1.25} />
          <h3 className="font-serif text-2xl text-stone-900">No orders yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-base text-stone-600">
            Your numbers will appear here as soon as the first customer completes checkout.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* REVENUE CHART */}
            <section aria-labelledby="chart-title" className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <h3 id="chart-title" className="font-serif text-xl text-stone-900">Revenue by day</h3>
                {!loading && cur.revenue > 0 && (
                  <p className="text-sm text-stone-600">
                    Best day: <strong className="font-semibold text-stone-900">{shortDate(peak.date)}</strong> · {inr(peak.total)}
                  </p>
                )}
              </div>
              {loading ? (
                <div className="h-56 animate-pulse rounded-xl bg-stone-100 motion-reduce:animate-none" />
              ) : cur.revenue === 0 ? (
                <p className="grid h-56 place-items-center text-base text-stone-500">No revenue in the last {period} days.</p>
              ) : (
                <>
                  <div
                    role="img"
                    aria-label={`Daily revenue for the last ${period} days. Total ${inr(cur.revenue)}. Best day ${shortDate(peak.date)} with ${inr(peak.total)}.`}
                    className="flex h-56 items-end gap-px border-b border-stone-200 sm:gap-0.5"
                  >
                    {days.map((d) => (
                      <div
                        key={d.date}
                        title={`${shortDate(d.date)}: ${inr(d.total)}`}
                        className="group relative flex h-full flex-1 items-end"
                      >
                        <div
                          className={`w-full rounded-t ${d.total === peak.total ? "bg-red-900" : "bg-red-800/50 group-hover:bg-red-800"}`}
                          style={{ height: `${d.total === 0 ? 0 : Math.max(3, (d.total / maxDay) * 100)}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-stone-500" aria-hidden>
                    <span>{shortDate(days[0].date)}</span>
                    <span>{shortDate(days[days.length - 1].date)}</span>
                  </div>
                </>
              )}
            </section>

            {/* NEEDS ATTENTION */}
            <section aria-labelledby="attention-title" className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 id="attention-title" className="font-serif text-xl text-stone-900">Waiting to ship</h3>
                {attention.length > 0 && (
                  <span className="grid h-7 min-w-7 place-items-center rounded-full bg-amber-100 px-2 text-sm font-semibold text-amber-900">
                    {attention.length}
                  </span>
                )}
              </div>
              {loading ? (
                <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-stone-100 motion-reduce:animate-none" />)}</div>
              ) : attention.length === 0 ? (
                <p className="text-base text-stone-600">You’re all caught up. No paid orders are waiting.</p>
              ) : (
                <ul className="divide-y divide-stone-100">
                  {attention.slice(0, 5).map((o) => (
                    <li key={o.key}>
                      <Link href="/admin/orders" className={`flex items-center justify-between gap-3 py-3 hover:bg-stone-50 ${FOCUS}`}>
                        <div className="min-w-0">
                          <p className="truncate text-base font-medium text-stone-900">{customerName(o)}</p>
                          <p className="truncate text-sm text-stone-500">{itemSummary(o)}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-stone-900">{inr(total(o))}</p>
                          <p className="text-xs text-stone-500">{ago(when(o))}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {attention.length > 5 && (
                <Link href="/admin/orders" className={`mt-3 inline-block text-sm font-semibold text-red-900 underline underline-offset-4 ${FOCUS}`}>
                  See all {attention.length}
                </Link>
              )}
            </section>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* RECENT ORDERS */}
            <section aria-labelledby="recent-title" className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
                <h3 id="recent-title" className="font-serif text-xl text-stone-900">Recent orders</h3>
                <Link href="/admin/orders" className={`text-sm font-semibold text-red-900 underline-offset-4 hover:underline ${FOCUS}`}>View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left">
                  <caption className="sr-only">Most recent orders</caption>
                  <thead className="bg-stone-50 text-sm text-stone-600">
                    <tr>
                      <th scope="col" className="px-6 py-3 font-medium">Customer</th>
                      <th scope="col" className="px-6 py-3 font-medium">Items</th>
                      <th scope="col" className="px-6 py-3 font-medium">Date</th>
                      <th scope="col" className="px-6 py-3 font-medium">Amount</th>
                      <th scope="col" className="px-6 py-3 font-medium">Delivery</th>
                      <th scope="col" className="px-6 py-3"><span className="sr-only">Open</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loading
                      ? [0, 1, 2, 3].map((i) => (
                          <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-6 animate-pulse rounded bg-stone-100 motion-reduce:animate-none" /></td></tr>
                        ))
                      : recent.map((o) => (
                          <tr key={o.key} className="text-base hover:bg-stone-50/60">
                            <td className="px-6 py-4">
                              <p className="font-medium text-stone-900">{customerName(o)}</p>
                              <p className="font-mono text-xs text-stone-500">#{o.key.slice(-6).toUpperCase()}</p>
                            </td>
                            <td className="max-w-56 truncate px-6 py-4 text-stone-700">{itemSummary(o)}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-stone-600">{when(o) ? shortDate(when(o)) : "n/a"}</td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold text-stone-900">{inr(total(o))}</td>
                            <td className="px-6 py-4"><StatusBadge status={o.deliveryStatus} /></td>
                            <td className="px-3 py-4 text-right">
                              <Link
                                href="/admin/orders"
                                aria-label={`Open orders for ${customerName(o)}`}
                                className={`inline-grid h-10 w-10 place-items-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-red-900 ${FOCUS}`}
                              >
                                <ChevronRight size={18} />
                              </Link>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* LOW STOCK */}
            <section aria-labelledby="stock-title" className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h3 id="stock-title" className="mb-5 font-serif text-xl text-stone-900">Low stock</h3>
              {lowStock.length === 0 ? (
                <p className="text-base text-stone-600">Nothing is running low. Products with 5 or fewer in stock will show up here.</p>
              ) : (
                <ul className="divide-y divide-stone-100">
                  {lowStock.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                      <p className="min-w-0 truncate text-base text-stone-900">{p.title}</p>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                          p.stock <= 0 ? "bg-red-50 text-red-800 ring-red-200" : "bg-amber-50 text-amber-800 ring-amber-200"
                        }`}
                      >
                        {p.stock <= 0 && <PackageX size={12} />}
                        {p.stock <= 0 ? "Sold out" : `${p.stock} left`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/admin/products" className={`mt-4 inline-block text-sm font-semibold text-red-900 underline underline-offset-4 ${FOCUS}`}>
                Manage products
              </Link>
            </section>
          </div>
        </>
      )}
    </div>
  );
}