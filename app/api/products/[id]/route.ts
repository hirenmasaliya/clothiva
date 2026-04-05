import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// GET: Fetch single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const productId = (await params).id;

    const snapshot = await adminDb.ref(`products/${productId}`).once("value");

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: productId,
      ...snapshot.val(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update product
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const productId = (await params).id;

    await adminDb.ref(`products/${productId}`).update({
      ...body,
      updatedAt: Date.now(), // ✅ instead of serverTimestamp
    });

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}