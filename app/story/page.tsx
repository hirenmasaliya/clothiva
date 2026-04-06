"use client";
import React from 'react';
import { 
  ArrowDown, Quote, History, Users, MapPin, 
  Sparkles, ShieldCheck, Heart, TrendingUp, Sun
} from 'lucide-react';
import Link from 'next/link';

export default function StoryPage() {
  return (
    <main className="bg-[#FCFAF8] min-h-screen antialiased selection:bg-red-900 selection:text-white overflow-x-hidden">
      
      {/* --- HERO: THE PHILOSOPHY --- */}
      <section className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-fixed bg-cover bg-center transition-transform duration-[15s] scale-110 md:scale-100 hover:scale-110"
          style={{ 
            backgroundImage: `linear-gradient(rgba(43,10,10,0.8), rgba(20,10,10,0.3)), 
            url('https://cdn.shopify.com/s/files/1/0513/2350/2743/files/Craft_Page_Bandhani_01.jpg?v=1708525343')` 
          }}
        />
        <div className="relative z-10 text-center text-white px-6 max-w-5xl animate-in fade-in zoom-in duration-1000">
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8">
            <span className="h-px w-8 md:w-12 bg-red-500"></span>
            <span className="uppercase tracking-[0.4em] md:tracking-[0.6em] text-[8px] md:text-[10px] font-black text-red-400">
              The J K Creation Saga
            </span>
            <span className="h-px w-8 md:w-12 bg-red-500"></span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-[100px] lg:text-[120px] font-serif mb-6 md:mb-10 leading-[0.9] tracking-tighter">
            Legacy of <br /> <span className="italic font-light text-stone-300">The First Knot</span>
          </h1>
          <p className="text-base md:text-xl lg:text-2xl font-light text-stone-300 italic max-w-2xl mx-auto leading-relaxed px-4">
            "Before it was a brand, it was a promise made in the dusty lanes of Jetpur."
          </p>
          <div className="mt-12 md:mt-20 animate-bounce hidden sm:block">
            <ArrowDown className="mx-auto text-white/30" size={32} strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* --- THE GENESIS: HOW IT STARTED --- */}
      <section className="py-20 md:py-40 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
        <div className="space-y-6 md:space-y-8 order-2 lg:order-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 bg-red-50 px-4 py-2 rounded-full border border-red-100">
            <History size={14} className="text-red-900" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-red-900">1990s: The Humble Vat</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 leading-tight tracking-tighter">
            It started with a single <span className="italic text-stone-400">Vat of Crimson Dye.</span>
          </h2>
          <p className="text-stone-500 text-base md:text-lg leading-relaxed font-light">
            J K Creation wasn't born in a boardroom. It was born in a small family workshop in Jetpur, where our founder saw the decline of hand-tied Bandhani in favor of cheap screen prints. 
            <br /><br />
            With just two artisans and a commitment to <strong>Genuine Gaji Silk</strong>, J K Creation began producing small batches of Bandhej for families who refused to compromise.
          </p>
        </div>
        <div className="relative order-1 lg:order-2 px-4 md:px-0">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-red-900/5 rounded-full blur-3xl"></div>
          <img 
            src="https://villagehaat.store/wp-content/uploads/2022/02/image.jpg.webp" 
            className="rounded-[2rem] md:rounded-[3rem] shadow-2xl grayscale w-full object-cover aspect-[4/3] md:aspect-auto" 
            alt="Original Workshop"
          />
        </div>
      </section>

      {/* --- THE TURNING POINT: GROWTH & SUCCESS --- */}
      <section className="py-20 bg-stone-100/50 rounded-[2.5rem] md:rounded-[4rem] mx-4 overflow-hidden border border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            <div className="space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto sm:mx-0">
                <TrendingUp className="text-red-900" size={24} />
              </div>
              <h4 className="text-xl md:text-2xl font-serif">The Quality Pivot</h4>
              <p className="text-stone-500 text-sm font-light leading-relaxed">
                As others automated, we increased our thread counts and narrowed our "Bhindi" (knots). This obsession made our Bandhani iconic.
              </p>
            </div>
            <div className="space-y-4 text-center sm:text-left border-t sm:border-t-0 sm:border-l border-stone-200 pt-12 sm:pt-0 sm:pl-8 lg:pl-16">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto sm:mx-0">
                <Users className="text-red-900" size={24} />
              </div>
              <h4 className="text-xl md:text-2xl font-serif">The Artisan Network</h4>
              <p className="text-stone-500 text-sm font-light leading-relaxed">
                We built a network of 50+ female artisans in Jetpur, providing flexible work-from-home models long before it was a trend.
              </p>
            </div>
            <div className="space-y-4 text-center lg:text-left border-t lg:border-t-0 lg:border-l border-stone-200 pt-12 lg:pt-0 lg:pl-16 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto lg:mx-0">
                <Sun className="text-red-900" size={24} />
              </div>
              <h4 className="text-xl md:text-2xl font-serif">Global Recognition</h4>
              <p className="text-stone-500 text-sm font-light leading-relaxed">
                By 2015, we became the "silent power" behind high-end Bandhani suits seen in boutiques from London to New York.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CLOTHIVA: THE DIGITAL EVOLUTION --- */}
      <section className="py-20 md:py-40 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className="relative group">
             <div className="absolute inset-0 bg-red-900/10 rounded-[2rem] md:rounded-[3rem] rotate-3 transition-transform group-hover:rotate-0"></div>
             <img 
              src="https://cdn.shopify.com/s/files/1/0902/3202/files/Bandhani-process_large.jpg?v=1533699306" 
              className="relative rounded-[2rem] md:rounded-[3rem] shadow-xl w-full z-10" 
              alt="Artisan at work"
            />
          </div>
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <Sparkles className="text-red-900 mx-auto lg:mx-0" size={40} />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 leading-tight tracking-tighter italic">
              From Workshop <br/> to Worldwide.
            </h2>
            <p className="text-stone-500 text-base md:text-lg leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
              <strong>Clothiva</strong> is the digital heart of our legacy. We bridge the gap between traditional craftsmanship and the modern wardrobe.
            </p>
            
            {/* Stats Grid - Glassmorphism touch */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {[
                { label: 'Legacy', value: '30+' },
                { label: 'Clients', value: '10k+' },
                { label: 'Artisans', value: '50+' }
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-stone-200 p-4 rounded-2xl shadow-sm">
                  <p className="text-xl md:text-3xl font-serif text-red-900">{stat.value}</p>
                  <p className="text-[8px] md:text-[9px] uppercase font-black tracking-widest text-stone-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- THE J K CREATION VOW --- */}
      <section className="bg-[#1a1512] text-white py-24 md:py-40 px-6 text-center m-4 rounded-[2.5rem] md:rounded-[4rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/10 blur-[120px]"></div>
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 relative z-10">
          <Quote className="mx-auto text-red-500/20" size={60} strokeWidth={1} />
          <h2 className="text-4xl md:text-7xl font-serif tracking-tighter italic font-light">The J K Vow</h2>
          <p className="text-stone-400 text-lg md:text-2xl font-light leading-relaxed italic px-2">
            "We will never replace the human hand with a machine. We will never replace Gaji Silk with synthetic polyester. We will never forget the Jetpur water that gave us our start."
          </p>
          <div className="pt-8 md:pt-12 flex justify-center items-center gap-4 md:gap-6">
             <div className="h-px w-12 md:w-20 bg-stone-800"></div>
             <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-black text-stone-500">
               Founded on Faith, Grown on Quality
             </p>
             <div className="h-px w-12 md:w-20 bg-stone-800"></div>
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 md:py-40 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8 md:space-y-10">
            <Heart className="mx-auto text-red-900 animate-pulse" size={32} strokeWidth={1} />
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 tracking-tighter px-4">
              Be a part of our next chapter.
            </h2>
            <Link href="/shop" className="group inline-flex items-center gap-4 md:gap-6 bg-red-950 text-white px-10 md:px-16 py-5 md:py-7 rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold transition-all hover:bg-stone-900 shadow-xl hover:shadow-2xl">
              Shop Masterpieces <ArrowDown size={16} className="-rotate-90 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
      </section>
    </main>
  );
}