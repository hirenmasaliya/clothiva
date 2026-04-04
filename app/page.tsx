"use client";
import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, Star, ShieldCheck, Globe, Droplets, Scissors, 
  MapPin, Play, Quote, Award, Sparkles, 
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [scrollNav, setScrollNav] = useState(false);

  // Change nav style on scroll
  useEffect(() => {
    const handleScroll = () => setScrollNav(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-[#FCFAF8] min-h-screen antialiased selection:bg-red-900 selection:text-white">
      
      {/* --- HERO SECTION: CINEMATIC EXPERIENCE --- */}
      <section className="relative h-screen flex items-center justify-start overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-fixed bg-center transition-transform duration-[20s] hover:scale-105"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(20,10,10,0.85) 20%, rgba(20,10,10,0.2) 100%), url('/images/Website Banner.png')`
          }}
        />

        <div className="relative z-10 px-8 md:px-24 max-w-5xl animate-in fade-in slide-in-from-left-10 duration-1000">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-[1px] w-16 bg-red-500"></span>
            <span className="text-red-400 uppercase tracking-[0.6em] text-[9px] font-black">
              Pure Gaji Silk Masterpieces
            </span>
          </div>
          <h1 className="text-7xl md:text-[120px] font-serif text-white leading-[0.85] mb-10 tracking-tighter">
            The Art of <br />
            <span className="italic font-light text-stone-400">Patience</span>
          </h1>
          <p className="text-lg md:text-2xl text-stone-300 font-light max-w-2xl mb-14 leading-relaxed italic">
            "In a world of fast fashion, we choose the slow knot." Hand-dyed heritage 
            from the legendary workshops of Jetpur.
          </p>
          <div className="flex flex-col sm:flex-row gap-8">
            <Link href="/shop" className="group bg-red-900 hover:bg-white text-white hover:text-red-900 px-16 py-6 text-[10px] uppercase tracking-[0.4em] font-bold transition-all text-center flex items-center justify-center gap-4 shadow-2xl shadow-red-900/20">
              The Collection <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <button className="flex items-center justify-center gap-4 text-white hover:text-red-400 transition-colors py-6 text-[10px] uppercase tracking-[0.4em] font-bold">
               <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md">
                <Play size={14} fill="currentColor" />
               </div>
               Watch The Craft
            </button>
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce">
            <span className="text-[8px] uppercase tracking-[0.5em] text-white/40 font-bold rotate-90 mb-8">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent"></div>
        </div>
      </section>

      {/* --- STATS: ARTISAN TRANSPARENCY --- */}
      <section className="bg-stone-900 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
                { val: "10k+", label: "Knots per Suit" },
                { val: "40+", label: "Master Artisans" },
                { val: "25+", label: "Global Destinations" },
                { val: "100%", label: "Natural Fast Colors" }
            ].map((stat, i) => (
                <div key={i} className="space-y-2">
                    <p className="text-3xl font-serif text-white">{stat.val}</p>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-stone-500 font-bold">{stat.label}</p>
                </div>
            ))}
        </div>
      </section>

      {/* --- HERITAGE SECTION: THE JETPUR LEGACY --- */}
      <section className="py-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-t-[10rem] rounded-b-2xl shadow-2xl group">
                <img
                src="https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800"
                alt="Artisanal Dyeing"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                />
            </div>
            {/* Overlay Badge */}
            <div className="absolute -bottom-10 -left-10 bg-white p-12 shadow-2xl rounded-2xl z-20 border border-stone-50">
               <MapPin className="text-red-900 mb-4" size={24} />
               <h4 className="font-serif text-2xl mb-1">Jetpur Hub</h4>
               <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">The Dyeing Capital of Gujarat</p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="inline-block px-4 py-1 border border-red-900/20 rounded-full text-[9px] uppercase tracking-widest font-black text-red-900">
                The Heritage Story
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-stone-900 leading-tight tracking-tighter">
              Crafted over <br /> <span className="italic font-light text-stone-400">Fourteen Sunsets</span>
            </h2>
            <p className="text-stone-500 leading-relaxed text-xl font-light italic">
              "Every dot (Bhindi) on a Clothiva suit represents a second of deep concentration. 
              Our master artisans in Jetpur don't use machines; they use soul."
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-3">
                    <Sparkles className="text-red-900" size={20} />
                    <h5 className="font-bold text-xs uppercase tracking-widest text-stone-900">Premium Gaji</h5>
                    <p className="text-[11px] text-stone-400 leading-relaxed uppercase tracking-tighter font-medium">The heaviest silk base for ultimate drape.</p>
                </div>
                <div className="space-y-3">
                    <Award className="text-red-900" size={20} />
                    <h5 className="font-bold text-xs uppercase tracking-widest text-stone-900">Lab-Certified</h5>
                    <p className="text-[11px] text-stone-400 leading-relaxed uppercase tracking-tighter font-medium">Eco-friendly fast colors that never bleed.</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CATEGORY BENTO: THE VAULT --- */}
      <section className="py-32 px-6 bg-[#1A1A1A] text-white overflow-hidden rounded-[4rem] mx-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl font-serif tracking-tighter">Inside the <br/><span className="italic font-light text-stone-500">Vault</span></h2>
                <p className="text-stone-500 uppercase tracking-[0.3em] text-[10px] font-bold">Curated for the Connoisseur</p>
            </div>
            <Link href="/shop" className="text-[10px] uppercase tracking-widest font-bold border-b border-white/20 pb-2 hover:text-red-400 transition-colors">
                View Entire Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[1000px] md:h-[800px]">
            <Link href="/shop?cat=gaji" className="md:col-span-8 group relative overflow-hidden rounded-3xl border border-white/5">
                <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-12">
                    <h3 className="text-4xl font-serif text-white mb-2">The Gaji Silk Edit</h3>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-6">Our Signature Heavy Silk Collection</p>
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <ArrowRight size={20} />
                    </div>
                </div>
            </Link>
            <Link href="/shop?cat=bridal" className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-white/5">
                <img src="https://images.unsplash.com/photo-1590736962086-51f7b0982390?q=80&w=1200" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-12">
                    <h3 className="text-2xl font-serif text-white mb-1">Bridal Couture</h3>
                    <span className="text-[8px] uppercase tracking-widest text-red-500 font-black">Limited Edition</span>
                </div>
            </Link>
            <Link href="/shop?cat=cotton" className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-white/5">
                <img src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white font-serif text-xl border-b border-white/20 pb-2">Daily Cotton</h3>
                </div>
            </Link>
            <Link href="/shop?cat=dupattas" className="md:col-span-8 group relative overflow-hidden rounded-3xl border border-white/5">
                <img src="https://images.unsplash.com/photo-1610030469668-935142b96de4?q=80&w=1200" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white font-serif text-3xl tracking-tighter uppercase">Artisanal Dupattas</h3>
                </div>
            </Link>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS: THE CLOTHIVA CIRCLE --- */}
      <section className="py-40 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <Quote className="mx-auto text-red-100 mb-10" size={60} strokeWidth={1} />
            <div className="space-y-12">
                <div className="animate-in fade-in duration-1000">
                    <p className="text-3xl md:text-4xl font-serif text-stone-900 leading-tight mb-8">
                        "The Gaji Silk has a weight and shine I’ve never seen before. You can feel the thousands of knots with your fingers. Truly a masterpiece from Jetpur."
                    </p>
                    <div className="flex flex-col items-center">
                        <div className="flex gap-1 text-orange-400 mb-4">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <h5 className="text-[10px] uppercase tracking-[0.4em] font-black">Meera K. • Mumbai</h5>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- INSTAGRAM: LIVE FROM JETPUR --- */}
      <section className="py-20 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    {/* <Instagram size={20} className="text-red-900" /> */}
                    <span className="text-[10px] uppercase tracking-widest font-black text-stone-400">@Clothiva.Official</span>
                </div>
                <Link href="#" className="text-[9px] uppercase tracking-widest font-bold underline underline-offset-4 decoration-red-900/20">Follow Artisan Stories</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className="aspect-square bg-stone-100 overflow-hidden rounded-2xl relative group">
                        <div className="absolute inset-0 bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                        <div className="w-full h-full bg-stone-200"></div> {/* Placeholder for IG images */}
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- FINAL CTA: LUXURY BANNER --- */}
      <section className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden m-4 rounded-[4rem]">
        <div
          className="absolute inset-0 bg-cover bg-fixed bg-center"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=2000')` }}
        />
        <div className="relative z-10 text-center px-6 space-y-10">
          <h2 className="text-6xl md:text-9xl font-serif tracking-tighter italic font-light opacity-80">Wear the Legacy.</h2>
          <div className="flex flex-col items-center gap-6">
            <Link href="/shop" className="bg-white text-black px-20 py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-red-900 hover:text-white transition-all shadow-2xl">
                Shop the Masterpieces
            </Link>
            <p className="text-[9px] uppercase tracking-[0.5em] text-white/50 font-bold">Safe Payments • Worldwide Shipping • Ethical Craft</p>
          </div>
        </div>
      </section>
    </main>
  );
}