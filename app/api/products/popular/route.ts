import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

interface ProductStats {
    id: string;
    name: string;
    count: number;
    image: string;
    price: number;
}

interface OrderItem {
    name?: string;
    title?: string;
    qty?: number;
    image?: string;
    img?: string | string[];
    images?: string[];
    price?: number;
    [key: string]: any;
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = Number(searchParams.get("limit")) || 4;

        const ordersRef = adminDb.ref("orders");
        const snapshot = await ordersRef.once("value");

        if (!snapshot.exists()) {
            return NextResponse.json(
                { success: false, message: "No orders found" },
                { status: 404 }
            );
        }

        const productCounts: Record<string, ProductStats> = {};
        const allOrders = snapshot.val() as Record<string, any>;

        Object.values(allOrders).forEach((order) => {
            if (!order?.items) return;

            Object.entries(order.items as Record<string, OrderItem>).forEach(
                ([id, details]) => {
                    const qty = Number(details?.qty) || 0;

                    if (productCounts[id]) {
                        productCounts[id].count += qty;
                    } else {
                        // Resolve Image (Checks multiple common Firebase naming conventions)
                        const resolvedImage = Array.isArray(details?.images) ? details.images[0] 
                                            : Array.isArray(details?.img) ? details.img[0] 
                                            : details?.image || details?.img || "";

                        productCounts[id] = {
                            id,
                            name: details?.title || details?.name || "Unknown Product",
                            count: qty,
                            image: resolvedImage,
                            price: Number(details?.price) || 0, // ✅ Fixed: details.price
                        };
                    }
                }
            );
        });

        const sortedProducts = Object.values(productCounts).sort(
            (a, b) => b.count - a.count
        );

        return NextResponse.json({
            success: true,
            mostPopular: sortedProducts[0] || null,
            topProducts: sortedProducts.slice(0, limit),
            totalProducts: sortedProducts.length,
            rankings: sortedProducts,
        });

    } catch (error: any) {
        console.error("Popular Product API Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong",
                error: error?.message || "Unknown error",
            },
            { status: 500 }
        );
    }
}