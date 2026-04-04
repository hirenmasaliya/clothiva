"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ShoppingBag, ChevronLeft, ShieldCheck, Truck, 
  RotateCcw, Loader2, Heart, Share2, Star, 
  Eye, Ruler, Scissors, Droplets 
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  
  // --- STATES ---
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(124); // Mock initial count

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/products');
        const allProducts = await response.json();
        const found = allProducts.find((p: any) => p.id === id);
        setProduct(found);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFAF8]">
      <Loader2 className="animate-spin text-red-900 mb-4" size={40} />
      <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold italic">Unveiling Masterpiece...</p>
    </div>
  );

  if (!product) return <div className="p-32 text-center font-serif italic text-stone-400">Masterpiece not found.</div>;

  return (
    <main className="bg-[#FCFAF8] min-h-screen pt-32 pb-32 antialiased selection:bg-red-900 selection:text-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* --- TOP BAR --- */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 hover:text-red-900 transition-all"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Collection
          </button>
          
          <div className="flex items-center gap-8">
             <div className="hidden md:flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-stone-400">
                <Eye size={14} /> 14 people viewing this right now
             </div>
             <div className="flex gap-4">
                <button className="p-3 rounded-full bg-white border border-stone-100 text-stone-400 hover:text-stone-900 transition-all shadow-sm">
                    <Share2 size={16} strokeWidth={1.5} />
                </button>
                <button 
                    onClick={toggleLike}
                    className={`p-3 rounded-full border transition-all shadow-sm flex items-center gap-2 px-5 ${isLiked ? 'bg-red-50 border-red-100 text-red-900' : 'bg-white border-stone-100 text-stone-400'}`}
                >
                    <Heart size={16} fill={isLiked ? "currentColor" : "none"} strokeWidth={1.5} />
                    <span className="text-[10px] font-bold">{likeCount}</span>
                </button>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* --- LEFT: GALLERY --- */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-stone-50 shadow-2xl border border-stone-100 group">
              <img 
                src={product.images?.[activeImg]} 
                className="w-full h-full object-cover object-top transition-transform duration-[3s] group-hover:scale-105" 
                alt={product.title} 
              />
            </div>

            <div className="flex justify-center gap-4 overflow-x-auto pb-4 no-scrollbar">
              {product.images?.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(i)}
                  className={`relative w-24 aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${activeImg === i ? 'border-red-900 scale-105 shadow-lg' : 'border-transparent opacity-50'}`}
                >
                   <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT: PRODUCT INFO --- */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            
            {/* Title & Rating */}
            <div className="space-y-4 pb-10 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <span className="bg-red-900 text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em]">
                    Artisan Peak
                </span>
                <div className="flex items-center gap-1 text-orange-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    <span className="text-[10px] font-bold text-stone-400 ml-2 uppercase tracking-widest">(4.9/5)</span>
                </div>
              </div>
              
              <h1 className="text-5xl xl:text-7xl font-serif text-stone-900 leading-[0.9] tracking-tighter italic font-light">
                {product.title}
              </h1>
              
              <div className="flex items-baseline gap-6 pt-4">
                <span className="font-serif text-4xl font-bold text-stone-900 tracking-tighter">
                  ₹{Number(product.price).toLocaleString()}
                </span>
                {product.comparePrice && (
                  <span className="text-stone-300 line-through italic font-light text-2xl">
                    ₹{Number(product.comparePrice).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Technical Specs Grid */}
            <div className="py-10 grid grid-cols-2 gap-8 border-b border-stone-100">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-stone-100 rounded-2xl text-stone-500"><Scissors size={18} strokeWidth={1.5}/></div>
                    <div>
                        <p className="text-[8px] uppercase tracking-widest font-black text-stone-400 mb-1">Fabrication</p>
                        <p className="text-[11px] font-bold text-stone-800 uppercase tracking-wider">{product.category}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-stone-100 rounded-2xl text-stone-500"><Droplets size={18} strokeWidth={1.5}/></div>
                    <div>
                        <p className="text-[8px] uppercase tracking-widest font-black text-stone-400 mb-1">Dyeing Process</p>
                        <p className="text-[11px] font-bold text-stone-800 uppercase tracking-wider">Natural Vat Dyes</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-stone-100 rounded-2xl text-stone-500"><Ruler size={18} strokeWidth={1.5}/></div>
                    <div>
                        <p className="text-[8px] uppercase tracking-widest font-black text-stone-400 mb-1">Length</p>
                        <p className="text-[11px] font-bold text-stone-800 uppercase tracking-wider">2.5m (Standard)</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-stone-100 rounded-2xl text-stone-500"><ShoppingBag size={18} strokeWidth={1.5}/></div>
                    <div>
                        <p className="text-[8px] uppercase tracking-widest font-black text-stone-400 mb-1">Availability</p>
                        <p className="text-[11px] font-bold text-green-700 uppercase tracking-wider">In Stock (Jetpur)</p>
                    </div>
                </div>
            </div>

            {/* Narrative */}
            <div className="py-10 space-y-4">
                 <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-300 italic underline underline-offset-8 decoration-red-900/20">The Artisan Story</h3>
                 <p className="text-stone-500 font-light italic leading-relaxed text-lg xl:text-xl">
                   {product.description || "A meticulously hand-knotted masterpiece from the heart of Gujarat, designed to celebrate the timeless beauty of traditional Bandhani craft."}
                 </p>
            </div>

            {/* Add to Cart */}
            <div className="space-y-8 pt-4">
              <button className="w-full bg-stone-900 text-white py-8 rounded-[2rem] text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-red-900 transition-all shadow-2xl shadow-stone-900/10 active:scale-95 flex items-center justify-center gap-4 group">
                <ShoppingBag size={16} /> 
                Add to My Collection
              </button>
              
              {/* Trust Badges */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 grid grid-cols-3 gap-6 shadow-sm">
                {[
                  { icon: <Truck size={20} />, label: "Express India" },
                  { icon: <ShieldCheck size={20} />, label: "Pure Silk" },
                  { icon: <RotateCcw size={20} />, label: "Returnable" }
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center text-center space-y-3">
                    <div className="text-red-900/30">{badge.icon}</div>
                    <span className="text-[8px] uppercase tracking-[0.2em] font-black text-stone-400">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}