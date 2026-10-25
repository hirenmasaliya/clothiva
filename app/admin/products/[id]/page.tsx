"use client";
// Place at: app/admin/products/[id]/page.tsx
import React, { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw, Trash2 } from "lucide-react";
import ProductForm, { ConfirmDialog, FOCUS, ProductValues } from "@/components/admin/ProductForm";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: productId } = use(params);
  const router = useRouter();

  const [initial, setInitial] = useState<ProductValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<"failed" | "notfound" | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (res.status === 404) return setLoadError("notfound");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data || data.error) return setLoadError("notfound");
      setInitial({
        title: data.title ?? "",
        description: data.description ?? "",
        price: data.price != null ? String(data.price) : "",
        comparePrice: data.comparePrice != null && data.comparePrice !== "" ? String(data.comparePrice) : "",
        stock: data.stock != null ? String(data.stock) : "",
        sku: data.sku ?? "",
        category: data.category ?? "",
        isFeatured: Boolean(data.isFeatured),
        images: Array.isArray(data.images) ? data.images : [],
      });
    } catch (err) {
      console.error("Failed to load product", err);
      setLoadError("failed");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (values: ProductValues) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values, // includes `images`, which the update endpoint expects
        price: Number(values.price),
        comparePrice: values.comparePrice === "" ? "" : Number(values.comparePrice),
        stock: Number(values.stock),
      }),
    });
    if (!res.ok) {
      let message = "We couldn’t save your changes. Please try again.";
      try {
        const body = await res.json();
        if (body?.error) message = body.error;
      } catch { /* keep default message */ }
      throw new Error(message);
    }
    router.push("/admin/products");
    router.refresh();
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/admin/products");
      router.refresh();
    } catch {
      setDeleteError("We couldn’t delete this product. Please try again.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div role="status" aria-label="Loading product" aria-busy="true" className="mx-auto grid max-w-350 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div className="h-72 animate-pulse rounded-2xl bg-stone-100 motion-reduce:animate-none" />
          <div className="h-56 animate-pulse rounded-2xl bg-stone-100 motion-reduce:animate-none" />
        </div>
        <div className="lg:col-span-4">
          <div className="h-96 animate-pulse rounded-2xl bg-stone-100 motion-reduce:animate-none" />
        </div>
      </div>
    );
  }

  if (loadError || !initial) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-10 text-center">
        <h1 className="font-serif text-2xl text-stone-900">
          {loadError === "notfound" ? "This product doesn’t exist" : "We couldn’t load this product"}
        </h1>
        <p className="mt-2 text-base text-stone-600">
          {loadError === "notfound" ? "It may have been deleted." : "Check your connection and try again."}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {loadError !== "notfound" && (
            <button type="button" onClick={load} className={`inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red-900 px-6 text-sm font-semibold text-white hover:bg-red-800 ${FOCUS}`}>
              <RefreshCw size={16} /> Try again
            </button>
          )}
          <Link href="/admin/products" className={`inline-flex h-11 items-center justify-center rounded-full border border-stone-300 px-6 text-sm font-semibold text-stone-800 hover:border-red-800 hover:text-red-800 ${FOCUS}`}>
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProductForm
        mode="edit"
        productId={productId}
        initial={initial}
        heading={initial.title || "Edit product"}
        submitLabel="Save changes"
        savingLabel="Saving…"
        onSubmit={handleSave}
        onCancel={() => router.push("/admin/products")}
        extra={
          <section className="rounded-2xl border border-red-200 bg-white p-6">
            <h2 className="font-serif text-xl text-stone-900">Delete product</h2>
            <p className="mt-1 text-base text-stone-600">
              This removes the product from your store for good. If it’s just out of stock, set the stock to 0 instead.
            </p>
            <button
              type="button"
              onClick={() => { setDeleteError(null); setDeleteOpen(true); }}
              className={`mt-4 inline-flex h-11 items-center gap-2 rounded-full border border-red-300 px-6 text-sm font-semibold text-red-800 hover:bg-red-50 ${FOCUS}`}
            >
              <Trash2 size={16} /> Delete product
            </button>
          </section>
        }
      />
      <ConfirmDialog
        open={deleteOpen}
        title="Delete this product?"
        message={<><strong className="font-semibold text-stone-900">{initial.title}</strong> will be removed from your store. This can’t be undone.</>}
        confirmLabel="Delete product"
        danger
        busy={deleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}