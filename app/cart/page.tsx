"use client";
import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, RotateCcw, ShoppingBag, ChevronRight } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQty, removeItem } = useCart();

  const subtotal = cart.reduce((acc: number, item: any) => acc + (Number(item.price) * item.qty), 0);
  const shipping = subtotal > 5000 || cart.length === 0 ? 0 : 250;
  const total = subtotal + shipping;

  return (
    <main className="bg-[#FCFAF8] min-h-screen pt-32 md:pt-48 pb-32 antialiased selection:bg-red-900 selection:text-white">
      <div className="max-w-350 mx-auto px-6 md:px-12">
        
        {/* --- DYNAMIC HEADER --- */}
        <header className="mb-16 border-b border-stone-200 pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <nav className="text-[10px] uppercase tracking-[0.4em] text-stone-400 flex items-center gap-3 font-bold">
                <Link href="/shop" className="hover:text-red-900 transition-colors">Collection</Link>
                <ChevronRight size={10} className="text-stone-300" />
                <span className="text-stone-900 italic underline decoration-red-900/20 underline-offset-4">Your Bag</span>
            </nav>
            <h1 className="text-6xl md:text-8xl font-serif text-stone-900 tracking-tighter leading-none">
                Shopping <span className="italic font-light text-stone-500">Bag</span>
            </h1>
          </div>
          <p className="text-stone-400 text-[11px] uppercase tracking-[0.3em] font-black">
             ({cart.length}) Pieces Curated
          </p>
        </header>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
            
            {/* --- CART ITEMS LIST (DYNAMIC) --- */}
            <div className="lg:col-span-8 space-y-12">
              {cart.map((item: any) => (
                <div key={item.id} className="group flex flex-col sm:flex-row gap-10 border-b border-stone-100 pb-12 transition-all">
                  {/* Image */}
                  <div className="w-full sm:w-48 aspect-[3/4] bg-stone-100 overflow-hidden rounded-[2rem] shadow-sm group-hover:shadow-xl transition-all duration-700">
                    <img 
                        src={item.images?.[0] || item.img} 
                        alt={item.title} 
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-1000" 
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-[0.3em] font-black text-red-900/60">{item.category || item.fabric}</span>
                          <h3 className="text-2xl font-serif text-stone-900 tracking-tight leading-tight italic">{item.title || item.name}</h3>
                        </div>
                        <p className="text-2xl font-serif font-bold text-stone-900">₹{(Number(item.price) * item.qty).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-10">
                      {/* Qty Controls */}
                      <div className="flex items-center bg-white border border-stone-100 rounded-full px-2 py-1 shadow-sm">
                        <button onClick={() => updateQty(item.id, -1)} className="p-3 hover:text-red-900 transition-colors"><Minus size={14} /></button>
                        <span className="px-6 text-sm font-bold text-stone-900 tabular-nums">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-3 hover:text-red-900 transition-colors"><Plus size={14} /></button>
                      </div>

                      {/* Remove */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-stone-300 hover:text-red-900 flex items-center gap-2 text-[10px] uppercase tracking-widest font-black transition-all"
                      >
                        <Trash2 size={14} /> Remove Piece
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- ORDER SUMMARY (DYNAMIC) --- */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-stone-100 p-10 rounded-[3rem] shadow-xl shadow-stone-200/40 sticky top-40">
                <h2 className="text-[11px] uppercase tracking-[0.4em] font-black text-stone-900 mb-10 border-b border-stone-50 pb-6">Investment Summary</h2>
                
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-stone-400 text-xs font-bold uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-stone-900">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-400 text-xs font-bold uppercase tracking-widest">
                    <span>Handcrafted Delivery</span>
                    <span className="text-stone-900">{shipping === 0 ? "Complimentary" : `₹${shipping}`}</span>
                  </div>
                  <div className="h-[1px] bg-stone-100 my-6"></div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400">Total Investment</span>
                    <span className="text-4xl font-serif font-bold text-red-900 tracking-tighter">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button className="w-full bg-stone-900 text-white py-7 rounded-2xl text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-red-900 transition-all shadow-2xl shadow-stone-900/20 active:scale-95 flex items-center justify-center gap-4 group">
                  Confirm & Checkout <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
                
                <div className="mt-12 space-y-6 pt-10 border-t border-stone-50">
                    <div className="flex items-center gap-4 text-stone-400">
                        <Truck size={18} strokeWidth={1.5} className="text-red-900/40" />
                        <span className="text-[9px] uppercase tracking-widest font-bold leading-tight">Express Worldwide Shipping <br/> Direct from Jetpur</span>
                    </div>
                    <div className="flex items-center gap-4 text-stone-400">
                        <ShieldCheck size={18} strokeWidth={1.5} className="text-red-900/40" />
                        <span className="text-[9px] uppercase tracking-widest font-bold leading-tight">Authentic Lab-Tested <br/> Gaji Silk Guarantee</span>
                    </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* --- EMPTY STATE --- */
          <div className="py-40 text-center flex flex-col items-center">
            <div className="w-32 h-32 bg-stone-50 rounded-full flex items-center justify-center mb-10">
                <ShoppingBag size={48} strokeWidth={1} className="text-stone-200" />
            </div>
            <h2 className="text-4xl font-serif text-stone-900 mb-6 italic tracking-tight">Your bag is awaiting <br/> a masterpiece</h2>
            <p className="text-stone-400 mb-12 font-light italic max-w-sm">The most exquisite Bandhani creations from Jetpur are ready to be claimed.</p>
            <Link href="/shop" className="bg-stone-900 text-white px-16 py-6 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold shadow-2xl hover:bg-red-900 transition-all active:scale-95">
              Explore Collections
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}