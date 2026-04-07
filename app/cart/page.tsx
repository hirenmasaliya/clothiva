"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ref, push, set } from 'firebase/database';
import { loadRazorpayScript } from '@/utils/loadScript';
import { 
  ArrowRight, Loader2, CheckCircle2, ShieldCheck, 
  ChevronRight, Trash2, ShoppingBag, Truck, History, Search 
} from 'lucide-react';
import { db } from '@/lib/firebase';

export default function CartPage() {
  const { cart, updateQty, removeItem, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showLookup, setShowLookup] = useState(false);
  const [lookupEmail, setLookupEmail] = useState("");

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', 
    address: '', city: '', pincode: ''
  });

  // --- FINANCIAL CALCULATIONS ---
  const subtotal = cart.reduce((acc: number, item: any) => acc + (Number(item.price) * item.qty), 0);
  
  const gstRate = 0.05; // 5% GST for Textiles
  const gstAmount = Math.round(subtotal * gstRate);
  
  const shippingFee = 60; // Decreased shipping charge
  const shippingThreshold = 3000; // Free shipping above this amount
  const shipping = (subtotal > shippingThreshold || cart.length === 0) ? 0 : shippingFee;
  
  const total = subtotal + gstAmount + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsProcessing(true);

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Payment gateway failed to load. Please check your connection.");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: Math.round(total * 100),
      currency: "INR",
      name: "Clothiva Jetpur",
      description: "Authentic Gaji Silk Collection",
      handler: async function (response: any) {
        try {
          const orderData = {
            paymentId: response.razorpay_payment_id,
            customer: formData,
            items: cart.map((item: any) => ({
              id: item.id,
              title: item.title || item.name,
              price: item.price,
              qty: item.qty,
              img: item.images?.[0] || item.img,
              fabric: item.fabric || "Gaji Silk"
            })),
            breakdown: {
              subtotal,
              gst: gstAmount,
              shipping,
              total
            },
            status: "Paid",
            deliveryStatus: "Processing",
            createdAt: new Date().toISOString(),
          };

          const ordersRef = ref(db, 'orders');
          const newOrderRef = push(ordersRef);
          await set(newOrderRef, orderData);

          setIsSuccess(true);
          clearCart();
        } catch (error) {
          console.error("Firebase Sync Error:", error);
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: "#7F1D1D" }, 
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
    setIsProcessing(false);
  };

  if (isSuccess) return (
    <div className="min-h-screen bg-[#FCFAF8] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8">
        <CheckCircle2 size={48} className="text-green-600" strokeWidth={1.5} />
      </div>
      <h2 className="text-5xl font-serif italic text-stone-900 mb-4">Masterpiece Secured</h2>
      <p className="text-stone-500 max-w-sm font-light leading-relaxed mb-10">
        Your order is being registered in our Jetpur ledger. You can now track your collection using your email.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={`/orders?email=${formData.email}`} className="bg-stone-900 text-white px-10 py-5 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-red-900 transition-all">
          Track My Order
        </Link>
        <Link href="/shop" className="border border-stone-200 px-10 py-5 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-stone-50 transition-all">
          Continue Shopping
        </Link>
      </div>
    </div>
  );

  return (
    <main className="bg-[#FCFAF8] min-h-screen pt-32 md:pt-44 pb-32 antialiased selection:bg-red-900 selection:text-white">
      <div className="max-w-350 mx-auto px-6 md:px-12">
        
        {/* --- PAGE HEADER --- */}
        <header className="mb-16 border-b border-stone-200 pb-12 flex justify-between items-end">
          <div className="space-y-6">
            <nav className="text-[10px] uppercase tracking-[0.5em] text-stone-400 flex items-center gap-3 font-bold">
                <Link href="/shop" className="hover:text-red-900 transition-colors uppercase">Collection</Link>
                <ChevronRight size={10} />
                <span className="text-stone-900 italic underline underline-offset-8">Checkout</span>
            </nav>
            <h1 className="text-6xl md:text-8xl font-serif text-stone-900 tracking-tighter leading-none">
                Shopping <span className="italic font-light text-stone-400">Bag</span>
            </h1>
          </div>
          
          <button 
            onClick={() => setShowLookup(!showLookup)}
            className="hidden md:flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black text-stone-400 hover:text-red-900 transition-colors"
          >
            <History size={16} /> {showLookup ? "Close Lookup" : "Order History"}
          </button>
        </header>

        {/* --- LOOKUP PANEL --- */}
        {showLookup && (
          <div className="mb-16 bg-white border border-stone-100 p-10 rounded-[3rem] animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="max-w-xl mx-auto text-center space-y-6">
                <h3 className="text-2xl font-serif italic text-stone-900 tracking-tight">Find Your Collections</h3>
                <p className="text-stone-400 text-xs uppercase tracking-widest leading-relaxed">Enter your registered email to see your order status direct from Jetpur.</p>
                <div className="relative">
                    <input 
                        type="email" 
                        placeholder="your@email.com" 
                        className="w-full bg-stone-50 border-none rounded-2xl py-5 px-8 text-sm focus:ring-2 focus:ring-red-900/10 transition-all"
                        onChange={(e) => setLookupEmail(e.target.value)}
                    />
                    <Link 
                        href={`/orders?email=${lookupEmail}`}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-stone-900 text-white p-3 rounded-xl hover:bg-red-900 transition-all"
                    >
                        <Search size={18} />
                    </Link>
                </div>
             </div>
          </div>
        )}

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
            
            {/* --- LEFT: SHIPPING & REVIEW --- */}
            <div className="lg:col-span-7 space-y-20">
              <form id="checkout-form" onSubmit={handleConfirmOrder} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="md:col-span-2 flex items-center gap-4 mb-4">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-red-900 bg-red-50 px-4 py-1 rounded-full italic">01 Destination</span>
                </div>
                <input required name="firstName" placeholder="First Name" onChange={handleInputChange} className="luxury-input" />
                <input required name="lastName" placeholder="Last Name" onChange={handleInputChange} className="luxury-input" />
                <input required type="email" name="email" placeholder="Email Address" onChange={handleInputChange} className="luxury-input md:col-span-2" />
                <input required type="tel" name="phone" placeholder="Phone Number" onChange={handleInputChange} className="luxury-input md:col-span-2" />
                <input required name="address" placeholder="Full Street Address" onChange={handleInputChange} className="luxury-input md:col-span-2" />
                <input required name="city" placeholder="City" onChange={handleInputChange} className="luxury-input" />
                <input required name="pincode" placeholder="Pincode" onChange={handleInputChange} className="luxury-input" />
              </form>

              <div className="space-y-8 pt-10 border-t border-stone-100">
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-400 bg-stone-100 px-4 py-1 rounded-full italic">02 Item Review</span>
                </div>
                {cart.map((item: any) => (
                  <div key={item.id} className="flex gap-8 items-center group">
                    <div className="w-24 h-32 bg-stone-100 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 group-hover:shadow-md transition-shadow">
                      <img src={item.images?.[0] || item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xl font-serif text-stone-900 italic tracking-tight">{item.title}</h4>
                      <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Qty: {item.qty} • {item.fabric || 'Gaji Silk'}</p>
                      <p className="text-lg font-serif">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-stone-300 hover:text-red-900 transition-colors">
                        <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* --- RIGHT: INVESTMENT SUMMARY --- */}
            <div className="lg:col-span-5 sticky top-32">
              <div className="bg-[#1C1917] text-stone-100 p-10 rounded-[3rem] shadow-2xl border border-stone-800/40">
                <h2 className="text-[10px] uppercase tracking-[0.5em] font-bold text-stone-500 mb-10 border-b border-stone-800 pb-6 text-center">
                    Investment Summary
                </h2>
                
                <div className="space-y-6 mb-12">
                  <div className="flex justify-between text-stone-400 text-[11px] font-bold uppercase tracking-widest">
                    <span>Base Amount</span>
                    <span className="text-stone-100 font-serif">₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-stone-400 text-[11px] font-bold uppercase tracking-widest">
                    <span>GST (5%)</span>
                    <span className="text-stone-100 font-serif">₹{gstAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-stone-400 text-[11px] font-bold uppercase tracking-widest">
                    <span>Boutique Delivery</span>
                    <span className="flex flex-col items-end">
                        {shipping === 0 ? (
                            <span className="text-green-500 italic lowercase tracking-normal font-serif">Complimentary</span>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="line-through text-stone-600 text-[10px]">₹250</span>
                                <span className="text-stone-100 font-serif">₹{shipping}</span>
                            </div>
                        )}
                        <span className="text-[8px] text-stone-600 mt-1 lowercase tracking-normal italic">Direct from Jetpur</span>
                    </span>
                  </div>

                  <div className="pt-8 mt-4 border-t border-stone-800 flex justify-between items-end">
                    <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-[0.3em] font-black text-red-500">Total Investment</span>
                        <p className="text-[9px] text-stone-500 italic">Inclusive of all duties</p>
                    </div>
                    <span className="text-5xl font-serif font-light text-white tracking-tighter">
                        ₹{Math.round(total).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button 
                  form="checkout-form"
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-red-900 text-white py-8 rounded-2xl text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-red-800 transition-all active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50 shadow-xl shadow-red-900/20"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : <>Pay & Secure Order <ArrowRight size={18} /></>}
                </button>

                <div className="mt-12 space-y-4 pt-8 border-t border-stone-800/30">
                    <div className="flex items-center gap-4 text-stone-500">
                        <Truck size={16} strokeWidth={1} />
                        <span className="text-[9px] uppercase tracking-widest font-bold leading-tight">Global Express <br/> from Jetpur Atelier</span>
                    </div>
                    <div className="flex items-center gap-4 text-stone-500">
                        <ShieldCheck size={16} strokeWidth={1} />
                        <span className="text-[9px] uppercase tracking-widest font-bold leading-tight">Secure Lab-Tested <br/> Gaji Silk Guarantee</span>
                    </div>
                </div>
              </div>
              <p className="text-center mt-8 text-stone-400 text-[9px] uppercase tracking-widest font-medium italic">
                Secure SSL Encrypted Checkout via Razorpay
              </p>
            </div>

          </div>
        ) : (
          /* --- EMPTY STATE --- */
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-40 h-40 bg-stone-50 rounded-full flex items-center justify-center mb-10 relative">
                <ShoppingBag size={48} strokeWidth={1} className="text-stone-200" />
                <div className="absolute inset-0 border border-dashed border-stone-200 rounded-full animate-[spin_20s_linear_infinite]"></div>
            </div>
            <h2 className="text-4xl font-serif italic mb-8 text-stone-400 tracking-tight leading-relaxed">Your collection <br/> awaits its first masterpiece</h2>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop" className="bg-stone-900 text-white px-16 py-6 rounded-full text-[10px] uppercase tracking-[0.5em] font-bold shadow-2xl hover:bg-red-900 transition-all">Explore Boutique</Link>
                <button onClick={() => setShowLookup(true)} className="border border-stone-200 text-stone-900 px-16 py-6 rounded-full text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-stone-50 transition-all">Track My Order</button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .luxury-input {
          background: transparent;
          border-bottom: 1px solid #E7E5E4;
          padding: 1.25rem 0;
          font-size: 0.95rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          color: #1C1917;
          font-family: serif;
          font-style: italic;
        }
        .luxury-input:focus {
          border-bottom-color: #7F1D1D;
          padding-left: 0.75rem;
        }
        .luxury-input::placeholder {
          color: #A8A29E;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 9px;
          font-weight: 800;
          font-family: sans-serif;
          font-style: normal;
        }
      `}</style>
    </main>
  );
}