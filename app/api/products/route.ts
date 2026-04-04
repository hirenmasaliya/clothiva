import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Ensure this points to your firebase config
import { ref, push, set, serverTimestamp, get, child } from "firebase/database";

export async function GET() {
  try {
    // 1. Reference the 'products' node in Firebase
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, 'products'));

    // 2. Check if data exists
    if (snapshot.exists()) {
      const data = snapshot.val();
      
      // 3. Convert Firebase object to an Array (easier for React to map)
      const productsArray = Object.keys(data).map((key) => ({
        id: key, // This is the unique Firebase ID (e.g., -NXj...)
        ...data[key],
      }));

      // 4. Sort by newest first (optional but recommended)
      productsArray.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      return NextResponse.json(productsArray, { status: 200 });
    } else {
      // Return empty array if no products found
      return NextResponse.json([], { status: 200 });
    }
  } catch (error: any) {
    console.error("Fetch API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Extract data from the request body
    const body = await request.json();
    const { title, description, price, comparePrice, stock, category, imageUrls, sku } = body;

    // 2. Basic Server-Side Validation
    if (!title || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields: Title, Price, and Category are mandatory." },
        { status: 400 }
      );
    }

    // 3. Prepare the Product Object
    const productData = {
      title: title.trim(),
      description: description || "",
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      stock: parseInt(stock) || 0,
      category: category,
      images: imageUrls || [], // Array of URLs from Cloudinary
      sku: sku || `CLO-${Math.random().toString(36).toUpperCase().substring(2, 7)}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: parseInt(stock) > 0 ? "active" : "out_of_stock",
    };

    // 4. Save to Firebase Realtime Database
    const productsRef = ref(db, "products");
    const newProductRef = push(productsRef); // Generates a unique ID
    
    await set(newProductRef, productData);

    return NextResponse.json(
      { 
        message: "Masterpiece added successfully", 
        id: newProductRef.key 
      }, 
      { status: 201 }
    );

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}