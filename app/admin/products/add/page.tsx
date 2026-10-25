"use client";
// Place at: app/admin/products/add/page.tsx
import React from "react";
import { useRouter } from "next/navigation";
import ProductForm, { EMPTY_PRODUCT, ProductValues } from "@/components/admin/ProductForm";

export default function AddProductPage() {
  const router = useRouter();

  const handlePublish = async (values: ProductValues) => {
    const { images, ...rest } = values;
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // The create endpoint expects the photo list as `imageUrls`
      body: JSON.stringify({
        ...rest,
        price: Number(values.price),
        comparePrice: values.comparePrice === "" ? "" : Number(values.comparePrice),
        stock: Number(values.stock),
        imageUrls: images,
      }),
    });

    if (!response.ok) {
      let message = "We couldn’t publish this product. Please try again.";
      try {
        const body = await response.json();
        if (body?.error) message = body.error;
      } catch { /* keep default message */ }
      throw new Error(message);
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <ProductForm
      mode="add"
      initial={EMPTY_PRODUCT}
      heading="Add a product"
      submitLabel="Publish to store"
      savingLabel="Publishing…"
      onSubmit={handlePublish}
      onCancel={() => router.push("/admin/products")}
    />
  );
}