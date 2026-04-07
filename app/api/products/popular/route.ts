import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = Number(searchParams.get("limit")) || 4;

        // 1. Fetch Orders and Products nodes
        const [ordersSnap, productsSnap] = await Promise.all([
            adminDb.ref("orders").once("value"),
            adminDb.ref("products").once("value")
        ]);

        if (!ordersSnap.exists()) {
            return NextResponse.json({ success: false, message: "No orders found" }, { status: 404 });
        }

        const allOrders = ordersSnap.val();
        const allProducts = productsSnap.val() || {};

        // This will track: { "productId": quantity }
        const productSales: Record<string, number> = {};

        // 2. Iterate through orders and their items array
        Object.values(allOrders).forEach((order: any) => {
            // Check if items exists and is an array/object
            if (!order?.items) return;

            const itemsArray = Array.isArray(order.items)
                ? order.items
                : Object.values(order.items);

            itemsArray.forEach((item: any) => {
                const productId = item?.id;
                if (!productId) return;

                // Sum up quantities (default to 1 if qty isn't provided)
                const qty = Number(item?.qty) || 1;
                productSales[productId] = (productSales[productId] || 0) + qty;
            });
        });

        // 3. Enrich with live data from the 'products' node
        const detailedProducts = Object.entries(productSales)
            .map(([id, totalQty]) => {
                const liveProduct = allProducts[id];
                if (!liveProduct) return null;

                return {
                    ...liveProduct,
                    id,            
                    count: totalQty,
                };
            })
            .filter(Boolean);

        // 4. Sort by most sold
        const sortedProducts = detailedProducts.sort((a, b) => b.count - a.count);

        return NextResponse.json({
            success: true,
            mostPopular: sortedProducts[0] || null,
            topProducts: sortedProducts.slice(0, limit),
            totalProducts: sortedProducts.length,
            rankings: sortedProducts,
        });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { success: false, error: error?.message },
            { status: 500 }
        );
    }
}