"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ShoppingBag, ChevronLeft, ShieldCheck, Truck,
  RotateCcw, Loader2, Heart, Share2, Star,
  Eye, Ruler, Scissors, Droplets, Sparkles,
  Info, Languages, MapPin
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/products');
        const allProducts = await response.json();
        const found = allProducts.find((p: any) => p.id === id);
        setProduct(found);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDFB]">
      <Loader2 className="animate-spin text-red-900 mb-4" size={40} />
      <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold italic">Opening the Pitara...</p>
    </div>
  );

  if (!product) return <div className="p-32 text-center font-serif italic text-stone-400">This masterpiece has found its home already.</div>;

  return (
    <main className="bg-[#FFFDFB] min-h-screen pt-24 md:pt-32 pb-32 antialiased selection:bg-red-900 selection:text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* --- BREADCRUMB & SOULFUL NAV --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black text-stone-400 hover:text-red-900 transition-all"
          >
            <ChevronLeft size={14} />
            Back to Virasat
          </button>
          
          <div className="flex items-center gap-4 bg-red-50/50 px-6 py-2 rounded-full border border-red-100/50">
             <MapPin size={12} className="text-red-800" />
             <span className="text-[9px] uppercase tracking-[0.2em] font-black text-red-900">Directly from the Vats of Jetpur, Gujarat</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">

          {/* --- LEFT: GALLERY (The Canvas) --- */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-3/4 rounded-[2.5rem] overflow-hidden bg-stone-100 shadow-2xl group">
              <img
                src={product.images?.[activeImg]}
                className="w-full h-full object-cover object-top transition-transform duration-[5s] group-hover:scale-110"
                alt={product.title}
              />
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                 <Sparkles size={16} className="text-yellow-600" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-stone-800">Genuine Hand-Knotted Bandhej</p>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto py-4 no-scrollbar">
              {product.images?.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-20 md:w-28 aspect-3/4 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${activeImg === i ? 'border-red-900 scale-105 shadow-xl' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT: THE STORY (The Heart) --- */}
          <div className="lg:col-span-5 flex flex-col">

            {/* Title & Cultural Hook */}
            <div className="space-y-4 pb-10 border-b border-stone-100">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black text-red-800 italic">Asli Parampara</p>
                  <h1 className="text-5xl xl:text-7xl font-serif text-stone-900 leading-[0.9] tracking-tighter italic">
                    {product.title}
                  </h1>
                </div>
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-4 rounded-full border transition-all ${isLiked ? 'bg-red-50 border-red-200 text-red-900' : 'bg-white border-stone-100 text-stone-300'}`}
                >
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="flex items-baseline gap-6 pt-4">
                <span className="font-serif text-4xl font-bold text-stone-900">
                  ₹{Number(product.price).toLocaleString()}
                </span>
                {product.comparePrice && (
                  <span className="text-stone-300 line-through italic text-xl">
                    ₹{Number(product.comparePrice).toLocaleString()}
                  </span>
                )}
                <span className="ml-auto text-[10px] font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                  Ready to Ship
                </span>
              </div>
            </div>

            {/* The "Why This?" Section */}
            <div className="py-10 grid grid-cols-2 gap-y-10 gap-x-6 border-b border-stone-50">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 rounded-2xl text-red-900"><Scissors size={18} /></div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest font-black text-stone-400 mb-1">Weave</p>
                  <p className="text-[11px] font-bold text-stone-800 uppercase">{product.category}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 rounded-2xl text-red-900"><Droplets size={18} /></div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest font-black text-stone-400 mb-1">Color Soul</p>
                  <p className="text-[11px] font-bold text-stone-800 uppercase">Organic Indigo/Kesar</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 rounded-2xl text-red-900"><Languages size={18} /></div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest font-black text-stone-400 mb-1">Artisan Language</p>
                  <p className="text-[11px] font-bold text-stone-800 uppercase">Kutch-Jetpur Roots</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 rounded-2xl text-red-900"><Ruler size={18} /></div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest font-black text-stone-400 mb-1">Suit Set</p>
                  <p className="text-[11px] font-bold text-stone-800 uppercase">Full 2.5m Panna</p>
                </div>
              </div>
            </div>

            {/* Heartfelt Narrative */}
            <div className="py-10 space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-300 italic">Ma No Prem, Artisan No Sangat</h3>
              <p className="text-stone-600 font-light italic leading-relaxed text-lg xl:text-xl">
                "Like the morning dew on Saurashtra's fields, this piece is soft, pure, and rare. Every knot was tied by hands that carry the songs of Gujarat."
              </p>
            </div>

            {/* Dadi's Wisdom / Care Card */}
            <div className="mb-10 p-6 bg-stone-900 rounded-[2rem] text-white flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-full text-yellow-500"><Info size={20} /></div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Dadi's Wisdom</p>
                    <p className="text-xs italic">"Dry clean only, beta. This gold deserves to last forever."</p>
                  </div>
               </div>
            </div>

            {/* Action Area */}
            <div className="space-y-8">
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-red-950 text-white py-8 rounded-[2.5rem] text-xs font-black uppercase tracking-[0.5em] hover:bg-stone-900 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 group"
              >
                <ShoppingBag size={18} />
                Padharo — Bring it Home
              </button>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: <Truck size={20} />, label: "Pan India Delivery" },
                  { icon: <ShieldCheck size={20} />, label: "Asli Gaji Silk" },
                  { icon: <RotateCcw size={20} />, label: "Heritage Trust" }
                ].map((badge, i) => (
                  <div key={i} className="bg-white border border-stone-100 p-6 rounded-3xl flex flex-col items-center text-center space-y-3">
                    <div className="text-red-900/40">{badge.icon}</div>
                    <span className="text-[8px] uppercase tracking-[0.2em] font-black text-stone-400">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex items-center justify-center gap-4 text-stone-400">
               <div className="flex -space-x-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-stone-200"></div>
                  ))}
               </div>
               <p className="text-[10px] font-bold uppercase tracking-widest">Loved by 400+ Bandhani families</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}