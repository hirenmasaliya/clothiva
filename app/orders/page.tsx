"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import {
    ChevronLeft,
    Search,
    Printer,
    Truck,
    ArrowRight,
    MapPin,
    CreditCard
} from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const userEmail = searchParams.get("email");

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [emailInput, setEmailInput] = useState("");

    useEffect(() => {
        if (!userEmail) {
            setLoading(false);
            return;
        }

        const ordersRef = ref(db, "orders");
        onValue(ordersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const userOrders = Object.values(data)
                    .filter((order: any) => order.customer?.email?.toLowerCase() === userEmail.toLowerCase())
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setOrders(userOrders);
            }
            setLoading(false);
        });
    }, [userEmail]);

    const handlePrint = (order: any) => {
        const subtotal = order.breakdown?.subtotal || Number(order.amount);
        const gst = order.breakdown?.gst || Math.round(subtotal * 0.05);
        const shipping = order.breakdown?.shipping ?? 60;
        const total = order.breakdown?.total || (subtotal + gst + shipping);

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`
      <html>
        <head>
          <title>Invoice_Clothiva_${order.paymentId.slice(-6)}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
            
            body { 
                font-family: 'Inter', sans-serif; 
                padding: 0; margin: 0; 
                background-color: #FFFFFF; 
                color: #1C1917; 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important; 
            }
            .page { padding: 50px; max-width: 850px; margin: auto; }
            
            /* TOP BRANDING */
            .header-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                border-bottom: 2px solid #1C1917; 
                padding-bottom: 30px; 
                margin-bottom: 40px; 
            }
            .logo-area h1 { 
                font-family: 'Playfair Display', serif; 
                font-size: 36px; margin: 0; 
                font-weight: 700; 
                letter-spacing: -0.02em; 
            }
            .logo-area span { 
                display: block; 
                font-size: 9px; 
                text-transform: uppercase; 
                letter-spacing: 0.5em; 
                font-weight: 800; 
                color: #7F1D1D; 
                margin-top: 5px; 
            }
            .brand-address { 
                font-size: 10px; 
                color: #78716C; 
                margin-top: 15px; 
                line-height: 1.6; 
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            .invoice-meta { text-align: right; }
            .invoice-meta h2 { 
                font-size: 11px; 
                text-transform: uppercase; 
                letter-spacing: 0.4em; 
                margin-bottom: 15px; 
                font-weight: 800; 
                color: #7F1D1D; 
            }
            .meta-details { font-size: 12px; line-height: 2; font-weight: 600; }
            .meta-details b { color: #78716C; text-transform: uppercase; font-size: 9px; margin-right: 8px; }

            /* CLIENT & PAYMENT INFO */
            .billing-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 50px; 
                margin-bottom: 50px; 
            }
            .info-label { 
                font-size: 9px; 
                text-transform: uppercase; 
                letter-spacing: 0.2em; 
                color: #A8A29E; 
                border-bottom: 1px solid #E7E5E4; 
                padding-bottom: 8px; 
                margin-bottom: 12px; 
                font-weight: 800; 
            }
            .info-content { font-family: 'Playfair Display', serif; font-size: 17px; font-style: italic; line-height: 1.4; }
            .info-sub { font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; color: #57534E; margin-top: 8px; font-weight: 500; }

            /* TABLE STYLES */
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { 
                padding: 15px 10px; 
                font-size: 10px; 
                text-transform: uppercase; 
                letter-spacing: 0.2em; 
                color: #1C1917; 
                border-bottom: 1px solid #1C1917; 
                text-align: left; 
                font-weight: 800;
            }
            td { padding: 20px 10px; border-bottom: 1px solid #F5F5F4; font-size: 13px; font-weight: 600; }
            
            .item-title { font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; margin-bottom: 4px; }
            .item-subtitle { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #A8A29E; }
            
            .text-right { text-align: right; }
            .text-center { text-align: center; }

            /* TOTALS SECTION */
            .summary-container { display: flex; justify-content: flex-end; }
            .summary-box { width: 320px; }
            .summary-line { 
                display: flex; 
                justify-content: space-between; 
                padding: 2px 0; 
                font-size: 11px; 
                font-weight: 600; 
                text-transform: uppercase; 
                letter-spacing: 0.1em; 
                color: #78716C; 
            }
            .summary-line span:last-child { color: #1C1917; font-family: 'Playfair Display', serif; font-size: 14px; text-transform: none; }
            
            .grand-total-line { 
                border-top: 2px solid #1C1917; 
                margin-top: 5px; 
                padding-top: 10px; 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
            }
            .grand-total-line .label { font-size: 10px; font-weight: 900; color: #7F1D1D; text-transform: uppercase; letter-spacing: 0.3em; }
            .grand-total-line .amount { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #7F1D1D; }

            /* FOOTER */
            .footer { 
                margin-top: 80px; 
                border-top: 1px solid #E7E5E4; 
                padding-top: 30px; 
                text-align: center; 
            }
            .footer p { font-size: 10px; color: #A8A29E; font-style: italic; margin-bottom: 15px; line-height: 1.8; max-width: 500px; margin-left: auto; margin-right: auto; }
            .auth-sign { margin-top: 40px; display: flex; justify-content: flex-end; }
            .sign-box { border-top: 1px solid #1C1917; width: 180px; text-align: center; padding-top: 8px; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header-grid">
              <div class="logo-area">
                <h1>CLOTHIVA</h1>
                <span>Jetpur Boutique Atelier</span>
                <div class="brand-address">
                    Station Road, Jetpur, Rajkot<br/>
                    Gujarat, India — 360370<br/>
                    GSTIN: 24ABCDE1234F1Z5
                </div>
              </div>
              <div class="invoice-meta">
                <h2>Tax Invoice</h2>
                <div class="meta-details">
                  <b>Registry</b> #${order.paymentId.slice(-10).toUpperCase()}<br/>
                  <b>Date</b> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}<br/>
                  <b>Status</b> Paid in Full
                </div>
              </div>
            </div>

            <div class="billing-grid">
              <div class="info-box">
                <div class="info-label">Client Details</div>
                <div class="info-content">${order.customer.firstName} ${order.customer.lastName}</div>
                <div class="info-sub">
                  ${order.customer.address}, ${order.customer.city}<br/>
                  Contact: ${order.customer.phone}
                </div>
              </div>
              <div class="info-box">
                <div class="info-label">Transaction Registry</div>
                <div class="info-sub" style="line-height: 2;">
                  Method: <b>Razorpay Secure Checkout</b><br/>
                  Payment ID: <b>${order.paymentId}</b><br/>
                  Atelier: <b>Jetpur Craft Unit</b>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 60%;">Description</th>
                  <th class="text-center">Qty</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map((item: { title: any; fabric: any; qty: number; price: number; }) => `
                  <tr>
                    <td>
                      <div class="item-title">${item.title}</div>
                      <div class="item-subtitle">${item.fabric || 'Authentic Gaji Silk'} • Handcrafted</div>
                    </td>
                    <td class="text-center">${item.qty}</td>
                    <td class="text-right">₹${Number(item.price).toLocaleString()}</td>
                    <td class="text-right">₹${(item.price * item.qty).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="summary-container">
              <div class="summary-box">
                <div class="summary-line">
                  <span>Base Amount</span>
                  <span>₹${subtotal.toLocaleString()}</span>
                </div>
                <div class="summary-line">
                  <span>GST (5%)</span>
                  <span>₹${gst.toLocaleString()}</span>
                </div>
                <div class="summary-line">
                  <span>Boutique Delivery</span>
                  <span>${shipping === 0 ? 'Complimentary' : '₹' + shipping}</span>
                </div>
                <div class="grand-total-line">
                  <div class="label">Total Due</div>
                  <div class="amount">₹${total.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div class="footer">
              <p>This document certifies the acquisition of authentic handcrafted Bandhani from the Clothiva Atelier. Each piece is uniquely dyed and processed in Jetpur, maintaining centuries-old craft traditions.</p>
              <div class="auth-sign">
                <div class="sign-box">Authorized Signatory</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); }, 600);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailInput) router.push(`/orders?email=${emailInput}`);
    };

    return (
        <main className="bg-[#FCFAF8] min-h-screen pt-32 pb-40 selection:bg-red-900 selection:text-white">
            <div className="max-w-6xl mx-auto px-6">

                {/* BREADCRUMB */}
                <nav className="mb-12">
                    <Link href="/shop" className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 hover:text-red-900 transition-colors">
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Boutique
                    </Link>
                </nav>

                {/* HEADER */}
                <header className="mb-20 space-y-4">
                    <h1 className="text-6xl md:text-8xl font-serif text-stone-900 tracking-tighter leading-none italic font-light">
                        My <span className="font-normal not-italic underline decoration-red-900/10 underline-offset-[12px]">Ledger</span>
                    </h1>
                    <p className="text-[11px] uppercase tracking-[0.4em] font-black text-stone-400">
                        {userEmail ? `Authenticated Identity: ${userEmail}` : "Search Order History"}
                    </p>
                </header>

                {loading ? (
                    <div className="py-20 text-center animate-pulse text-stone-400 uppercase tracking-widest text-xs">Accessing Records...</div>
                ) : orders.length > 0 ? (
                    <div className="space-y-16">
                        {orders.map((order) => (
                            <section key={order.paymentId} className="group bg-white border border-stone-100 rounded-[3rem] overflow-hidden transition-all duration-700 hover:shadow-3xl hover:shadow-stone-200/40">

                                {/* ORDER BAR */}
                                <div className="bg-stone-50/50 px-10 py-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-stone-100">
                                    <div className="flex flex-wrap gap-12">
                                        <div>
                                            <span className="block text-[8px] uppercase tracking-[0.2em] text-stone-400 font-black mb-2">Acquisition Date</span>
                                            <p className="text-sm font-serif italic text-stone-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                        <div>
                                            <span className="block text-[8px] uppercase tracking-[0.2em] text-stone-400 font-black mb-2">Registry ID</span>
                                            <p className="text-sm font-mono text-stone-500 uppercase tracking-tight">#{order.paymentId.slice(-8)}</p>
                                        </div>
                                        <div>
                                            <span className="block text-[8px] uppercase tracking-[0.2em] text-stone-400 font-black mb-2">Status</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">{order.status || "Paid"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handlePrint(order)}
                                        className="group/print flex items-center gap-3 bg-stone-900 text-white px-8 py-4 rounded-2xl hover:bg-red-900 transition-all active:scale-95 shadow-xl shadow-stone-900/20"
                                    >
                                        <Printer size={16} className="group-hover/print:rotate-12 transition-transform" />
                                        <span className="text-[10px] uppercase tracking-[0.2em] font-black">Get Invoice</span>
                                    </button>
                                </div>

                                {/* CONTENT */}
                                <div className="p-10">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                                        {/* ITEMS LIST */}
                                        <div className="lg:col-span-7 space-y-10">
                                            {order.items.map((item: any, i: number) => (
                                                <div key={i} className="flex items-center gap-8 group/item">
                                                    <div className="w-24 h-32 bg-stone-100 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-sm transition-transform duration-700 group-hover/item:scale-105">
                                                        <img src={item.img || item.images?.[0]} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="" />
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <span className="text-[9px] uppercase tracking-widest font-black text-red-900/60">{item.fabric || "Authentic Gaji"}</span>
                                                        <h4 className="font-serif italic text-2xl text-stone-900 leading-tight">{item.title}</h4>
                                                        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Qty: {item.qty} • Piece Price: ₹{Number(item.price).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* FINANCIAL BREAKDOWN & SHIPPING */}
                                        <div className="lg:col-span-5 space-y-8">
                                            <div className="bg-stone-50 rounded-[2.5rem] p-10 space-y-8">
                                                <div className="flex gap-5">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                        <MapPin size={18} className="text-red-900" />
                                                    </div>
                                                    <div>
                                                        <span className="block text-[8px] uppercase tracking-widest text-stone-400 font-black mb-1">Shipping Destination</span>
                                                        <p className="text-xs text-stone-600 leading-relaxed font-medium uppercase tracking-wider">
                                                            {order.customer.firstName} {order.customer.lastName}<br />
                                                            {order.customer.address}, {order.customer.city}<br />
                                                            {order.customer.pincode}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="pt-8 border-t border-stone-200 space-y-4">
                                                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-stone-400">
                                                        <span>Subtotal</span>
                                                        <span className="text-stone-900 font-serif">₹{(order.breakdown?.subtotal || Number(order.amount)).toLocaleString()}</span>
                                                    </div>
                                                    {order.breakdown?.gst && (
                                                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-stone-400">
                                                            <span>GST (5%)</span>
                                                            <span className="text-stone-900 font-serif">₹{order.breakdown.gst.toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-stone-400">
                                                        <span>Delivery</span>
                                                        <span className="text-stone-900 italic font-serif">
                                                            {(order.breakdown?.shipping === 0) ? "Complimentary" : `₹${order.breakdown?.shipping || 60}`}
                                                        </span>
                                                    </div>

                                                    <div className="pt-6 mt-4 border-t-2 border-stone-900/5 flex justify-between items-end">
                                                        <div className="space-y-1">
                                                            <span className="block text-[9px] uppercase tracking-[0.3em] font-black text-red-900">Total Investment</span>
                                                            <p className="text-[10px] text-stone-400 italic font-medium">Verified Transaction</p>
                                                        </div>
                                                        <p className="text-4xl font-serif font-bold text-stone-900 tracking-tighter">
                                                            ₹{(Number(order.amount) || Number(order.breakdown?.total) || 0).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="px-6 flex items-center gap-4 text-stone-400">
                                                <CreditCard size={18} strokeWidth={1.5} />
                                                <p className="text-[9px] uppercase tracking-[0.2em] font-bold leading-tight">Secure Payment via Razorpay <br /> Verified Boutique Ledger</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </section>
                        ))}
                    </div>
                ) : (
                    /* SEARCH STATE */
                    <div className="max-w-xl mx-auto bg-white p-16 rounded-[4rem] shadow-3xl shadow-stone-200/40 text-center border border-stone-100">
                        <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-12">
                            <Search size={36} strokeWidth={1} className="text-stone-200" />
                        </div>
                        <h2 className="text-4xl font-serif italic text-stone-900 mb-6 tracking-tight">Access the Ledger</h2>
                        <p className="text-stone-400 text-sm font-light italic mb-12 leading-relaxed">Please provide the email identity associated with your handcrafted acquisitions to retrieve your records.</p>
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                type="email"
                                placeholder="YOUR@EMAIL.COM"
                                className="w-full bg-stone-50 border-none rounded-2xl py-7 px-10 text-[11px] font-black uppercase tracking-[0.3em] focus:ring-1 focus:ring-red-900/20 transition-all placeholder:text-stone-300"
                                onChange={(e) => setEmailInput(e.target.value)}
                                required
                            />
                            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-stone-900 text-white rounded-2xl flex items-center justify-center hover:bg-red-900 transition-all shadow-xl shadow-stone-900/30 group-hover:scale-105">
                                <ArrowRight size={24} />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}