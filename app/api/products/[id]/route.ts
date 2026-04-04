import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { ref, get, update, serverTimestamp } from "firebase/database";

// GET: Fetch single product details
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const productId = (await params).id;
        const snapshot = await get(ref(db, `products/${productId}`));
        if (!snapshot.exists()) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ id: productId, ...snapshot.val() });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH: Update product details
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const updates = {
            ...body,
            updatedAt: serverTimestamp(),
        };

        const productId = (await params).id;

        await update(ref(db, `products/${productId}`), updates);
        return NextResponse.json({ message: "Updated successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}