"use client";
import React, { useEffect, useState, useCallback } from 'react';
import {
  ArrowRight, Star, Globe, MapPin, Award, CheckCircle2, Sparkles,
  History, Fingerprint, Waves, Sun, ShieldCheck, Heart, Coffee, Anchor
} from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  count: number;
  price?: number;
  image?: string;
}

export default function Home() {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPopular = useCallback(async () => {
    try {
      const res = await fetch('/api/products/popular');
      const data = await res.json();
      if (data.success) {
        setPopularProducts(data.rankings.slice(0, 4));
      }
    } catch (error) {
      console.error("Error fetching popular products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopular();
  }, [fetchPopular]);

  return (
    <main className="bg-[#FFFDFB] min-h-screen antialiased selection:bg-red-900 selection:text-white font-sans">

      {/* --- HERO SECTION: THE PADHARO WELCOME --- */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-no-repeat bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(43,10,10,0.9) 100%), url('/images/Website_Banner.png')`
          }}
        />

        <div className="relative z-10 px-8 md:px-24 max-w-7xl w-full text-center md:text-left">
          <div className="inline-flex items-center gap-3 mb-6 bg-red-900/30 backdrop-blur-md px-4 py-2 rounded-full border border-red-500/30">
            <Sparkles size={14} className="text-yellow-500" />
            <span className="text-red-100 uppercase tracking-[0.3em] text-[10px] font-black">
              Padharo — A Piece of Gujarat Awaits You
            </span>
          </div>

          <h1 className="text-6xl md:text-[110px] font-serif text-white leading-[0.9] mb-8 tracking-tighter">
            Varse Chhe <br />
            <span className="italic font-light text-red-400">Rangon ni Mausam</span>
          </h1>

          <p className="text-lg md:text-2xl text-stone-300 font-light max-w-2xl mb-12 leading-relaxed italic">
            "The colors of Jetpur don't just sit on fabric; they live in our souls." Hand-dyed masterpieces that feel like home.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
            <Link href="/shop" className="group bg-red-700 text-white px-12 py-5 text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-4 hover:bg-yellow-600 rounded-full shadow-2xl">
              Explore Our Virasat <ArrowRight size={16} />
            </Link>
            <div className="flex items-center gap-3 text-white/80 px-6 py-4">
              <MapPin size={18} className="text-red-500" />
              <span className="text-xs font-medium tracking-widest uppercase italic">Born in Jetpur, Loved Globally</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 1: THE SOUL OF THE FABRIC (GUJARATI HEART) --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-b border-stone-100">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <Heart className="text-red-800" fill="currentColor" size={24} />
            </div>
            <h4 className="font-serif text-2xl text-stone-900">Ma No Prem</h4>
            <p className="text-sm text-stone-500 leading-relaxed">Like a mother's touch—gentle and pure. Every thread is woven with the same care she puts into her daily prayers.</p>
          </div>
          <div className="space-y-4 border-x border-stone-100 px-8">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto">
                <Sun className="text-yellow-700" size={24} />
            </div>
            <h4 className="font-serif text-2xl text-stone-900">Saurashtra’s Sun</h4>
            <p className="text-sm text-stone-500 leading-relaxed">Our fabrics are dried naturally under the golden Gujarat sun, locking in colors that stay vibrant for generations.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
                <Coffee className="text-orange-800" size={24} />
            </div>
            <h4 className="font-serif text-2xl text-stone-900">Asli Parampara</h4>
            <p className="text-sm text-stone-500 leading-relaxed">No mass machinery. Just slow, rhythmic artistry by hand, celebrating the authentic 'Knot' of Bandhani.</p>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: MATERIAL SCIENCE (SATIN COTTON) --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 order-2 md:order-1">
            <div className="flex items-center gap-4">
              <span className="bg-red-800 text-white px-3 py-1 text-[9px] font-black uppercase tracking-tighter rounded">Artisan Choice</span>
              <span className="text-[10px] uppercase tracking-widest font-black text-stone-400 tracking-[0.3em]">Pure Satin Cotton</span>
            </div>
            <h2 className="text-5xl font-serif text-stone-900 tracking-tighter">
              As Smooth as <br />
              <span className="italic text-red-800/60 font-medium">Morning Dew on the Narmada.</span>
            </h2>
            <p className="text-stone-600 leading-relaxed text-lg">
              Our **Satin Cotton** is the perfect blend of strength and softness. Woven with a four-over-one technique, it provides a royal luster on the outside while keeping the inside cool and breathable—perfect for our Indian weather.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-8 bg-[#fdf8f4] rounded-3xl border border-stone-100 shadow-sm">
                <Waves className="text-red-900 mb-3" size={20} />
                <h5 className="font-bold text-xs uppercase mb-2 text-stone-800">Sateen Glow</h5>
                <p className="text-[11px] text-stone-500 leading-relaxed">A subtle, natural shine that doesn't scream, but whispers elegance.</p>
              </div>
              <div className="p-8 bg-[#fdf8f4] rounded-3xl border border-stone-100 shadow-sm">
                <Sun className="text-red-900 mb-3" size={20} />
                <h5 className="font-bold text-xs uppercase mb-2 text-stone-800">Sweat-Free Elegance</h5>
                <p className="text-[11px] text-stone-500 leading-relaxed">100% Cotton base ensures you stay fresh from morning Puja to evening dinner.</p>
              </div>
            </div>
          </div>
          <div className="relative order-1 md:order-2">
            <div className="absolute -inset-4 border border-stone-200 rounded-[4rem] rotate-3 -z-10"></div>
            <img 
              src="https://5.imimg.com/data5/YE/AN/PT/SELLER-22984508/cotton-satin-fabric.jpg" 
              className="w-full aspect-[4/5] object-cover rounded-[3rem] shadow-2xl" 
              alt="Premium Satin Cotton" 
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-stone-50 hidden md:block">
              <p className="text-[24px] font-serif text-red-900 leading-none">80g</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mt-1">Per Meter Density</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: TRENDING (JETPUR RANKINGS) --- */}
      <section className="py-32 bg-stone-50 rounded-[4rem] mx-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-5xl font-serif text-stone-900 tracking-tighter italic">Vikasit Varsa</h2>
              <p className="text-xs text-red-800 uppercase tracking-[0.3em] font-bold mt-2">What Gujarat is wearing today</p>
            </div>
            <Link href="/shop" className="group flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold">
              View the Full Pittar <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {loading ? (
              [...Array(4)].map((_, i) => <div key={i} className="aspect-3/4 bg-stone-200 animate-pulse rounded-3xl" />)
            ) : popularProducts.map((item, idx) => (
              <div key={item.id} className="group">
                <div className="relative aspect-[3/4.5] rounded-[2.5rem] overflow-hidden mb-6 bg-white shadow-sm hover:shadow-2xl transition-all duration-500">
                  <div className="absolute top-5 left-5 z-20 bg-yellow-500 text-black text-[8px] font-black px-3 py-1.5 rounded-full tracking-widest">
                    #{idx + 1} MOST LOVED
                  </div>
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button className="w-full bg-white text-stone-900 py-4 text-[10px] font-bold uppercase rounded-2xl shadow-xl">Take it Home</button>
                  </div>
                </div>
                <h3 className="text-md font-serif text-stone-800">{item.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm font-bold text-red-950">₹{item.price}</p>
                  <span className="text-[9px] text-stone-400 font-bold uppercase">{item.count} Sold recently</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 4: THE MASTER ARTISANS --- */}
      <section className="py-32 bg-[#1a1512] text-white rounded-[4rem] mx-4 mb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <Award className="text-yellow-500" />
              <span className="text-[10px] uppercase tracking-widest font-black text-yellow-500/80">Karigari Heritage</span>
            </div>
            <h2 className="text-6xl font-serif tracking-tighter leading-tight">Meet the <br /><span className="italic text-stone-500 font-light">Sisters of Jetpur.</span></h2>
            <p className="text-stone-400 text-lg font-light leading-relaxed">
              Every single knot is tied by our local female artisans who have kept this 400-year-old tradition alive. This isn't a factory; it's a neighborhood coming together to weave magic.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                <CheckCircle2 className="text-yellow-500" size={18} />
                <p className="text-[11px] uppercase tracking-[0.2em] font-bold">100% Fair Wages paid directly</p>
              </div>
              <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                <CheckCircle2 className="text-yellow-500" size={18} />
                <p className="text-[11px] uppercase tracking-[0.2em] font-bold">Supporting Rural Education</p>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="absolute -top-10 -right-10 w-64 h-64 bg-red-900/20 blur-[100px] rounded-full"></div>
             <div className="grid grid-cols-2 gap-4">
                <img src="https://cdn.shopify.com/s/files/1/0902/3202/files/Bandhani-process_large.jpg?v=1533699306" className="w-full aspect-[4/5] object-cover rounded-3xl" />
                <img src="https://villagehaat.store/wp-content/uploads/2022/02/image.jpg.webp" className="w-full aspect-[4/5] object-cover rounded-3xl mt-12" />
             </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA: THE FAMILY LEGACY --- */}
      <section className="relative h-[80vh] flex items-center justify-center m-4 rounded-[4rem] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=2000')] bg-cover bg-fixed bg-center" />
        <div className="absolute inset-0 bg-red-950/80 backdrop-blur-md" />
        <div className="relative z-10 text-center text-white px-6">
          <h2 className="text-5xl md:text-8xl font-serif italic font-extralight mb-12">Carry Your Culture.</h2>
          <div className="flex flex-col items-center gap-8">
            <Link href="/shop" className="group bg-white text-black px-16 py-6 text-xs uppercase tracking-[0.4em] font-black hover:bg-yellow-500 hover:text-white transition-all rounded-full flex items-center gap-4">
              Explore the Pittar <ArrowRight size={18} />
            </Link>
            <div className="flex gap-12 mt-4 opacity-70">
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck size={20} className="text-yellow-500" />
                <span className="text-[9px] uppercase tracking-widest font-bold">Secure Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Globe size={20} className="text-yellow-500" />
                <span className="text-[9px] uppercase tracking-widest font-bold">Pan-India & Global</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="py-20 px-6 flex flex-col md:flex-row justify-between items-center gap-10 max-w-7xl mx-auto">
        <div className="space-y-2 text-center md:text-left">
            <p className="text-lg font-serif text-stone-800 italic">Clothiva Heritage</p>
            <p className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-bold">© 2026 Crafted with love in Jetpur, Gujarat</p>
        </div>
        <div className="flex gap-12">
          <Link href="#" className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold hover:text-red-900 transition-colors">Our Story</Link>
          <Link href="#" className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold hover:text-red-900 transition-colors">Artisan Care</Link>
          <Link href="#" className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold hover:text-red-900 transition-colors">Instagram</Link>
        </div>
      </div>

    </main>
  );
}