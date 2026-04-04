"use client";
import React from 'react';
import { 
  ArrowDown, Quote, History, Users, MapPin, 
  Sparkles, ShieldCheck, Heart, ScrollText, 
  Workflow, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function StoryPage() {
  return (
    <main className="bg-[#FCFAF8] min-h-screen antialiased selection:bg-red-900 selection:text-white">
      
      {/* --- HERO: THE PHILOSOPHY (PARALLAX) --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-fixed bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
          style={{ 
            backgroundImage: `linear-gradient(rgba(20,10,10,0.7), rgba(20,10,10,0.4)), url('https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=2000')` 
          }}
        />
        <div className="relative z-10 text-center text-white px-6 max-w-5xl animate-in fade-in zoom-in duration-1000">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-12 bg-red-500"></span>
            <span className="uppercase tracking-[0.6em] text-[10px] font-black text-red-400">J K Creation Legacy</span>
            <span className="h-px w-12 bg-red-500"></span>
          </div>
          <h1 className="text-6xl md:text-[120px] font-serif mb-10 leading-[0.85] tracking-tighter">
            Tying the <br /> <span className="italic font-light text-stone-400">Generations</span>
          </h1>
          <p className="text-lg md:text-2xl font-light text-stone-300 italic max-w-2xl mx-auto leading-relaxed">
            "We don't just dye fabric; we preserve the rhythm of Jetpur."
          </p>
          <div className="mt-20 animate-bounce">
            <ArrowDown className="mx-auto text-white/30" size={32} strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* --- THE MANIFESTO: J K CREATION IDENTITY --- */}
      <section className="py-40 px-6 max-w-5xl mx-auto text-center relative">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[150px] font-serif text-stone-100 -z-10 select-none">Heritage</div>
        <Quote className="text-red-900/10 mx-auto mb-12" size={80} strokeWidth={1} />
        <h2 className="text-3xl md:text-5xl font-serif text-stone-900 leading-tight italic font-light">
          "Clothiva, powered by <span className="text-red-900 font-bold not-italic">J K Creation</span>, exists for the woman who values the slow knot over the fast trend. In our workshop, every 'Bhindi' is a thumbprint of human patience."
        </h2>
        <div className="flex items-center justify-center gap-4 mt-16">
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-400">Authentic Bandhani</span>
            <CircleIcon size={4} />
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-400">Jetpur Origin</span>
        </div>
      </section>

      {/* --- THE THREE PILLARS --- */}
      <section className="py-32 px-6 bg-white border-y border-stone-100 rounded-[4rem] mx-4 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-24">
          <div className="space-y-8 group">
            <div className="w-16 h-16 rounded-3xl bg-stone-50 flex items-center justify-center group-hover:bg-red-900 group-hover:text-white transition-all duration-500 shadow-sm">
                <History size={28} strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-serif text-stone-900 italic">500 Years of Bandhej</h3>
            <p className="text-stone-500 text-sm leading-relaxed font-light">
              Originating in the royal courts of Gujarat, Bandhani is the oldest form of tie-dye in the world. 
              At Clothiva, we preserve the original 16th-century techniques passed down through J K Creation's lineage.
            </p>
          </div>
          <div className="space-y-8 group">
            <div className="w-16 h-16 rounded-3xl bg-stone-50 flex items-center justify-center group-hover:bg-red-900 group-hover:text-white transition-all duration-500 shadow-sm">
                <MapPin size={28} strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-serif text-stone-900 italic">The Pulse of Jetpur</h3>
            <p className="text-stone-500 text-sm leading-relaxed font-light">
              Jetpur is the epicenter of textile art. Our workshop near the Jayram Textile district utilizes 
              local mineral-rich water to achieve the vibrant, fast colors that define high-end Bandhni.
            </p>
          </div>
          <div className="space-y-8 group">
            <div className="w-16 h-16 rounded-3xl bg-stone-50 flex items-center justify-center group-hover:bg-red-900 group-hover:text-white transition-all duration-500 shadow-sm">
                <Users size={28} strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-serif text-stone-900 italic">Direct Artisan Care</h3>
            <p className="text-stone-500 text-sm leading-relaxed font-light">
              We sustain over 50 local families. By maintaining a direct connection with our artisans, 
              we ensure fair wages and keep the artisanal "Aura" alive in every single Gaji Silk suit.
            </p>
          </div>
        </div>
      </section>

      {/* --- THE ARTISANAL JOURNEY (TIMELINE STYLE) --- */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto space-y-40">
          {/* Step 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 border border-red-900/10 rounded-[3rem] -z-10 group-hover:inset-0 transition-all duration-700"></div>
              <img 
                src="https://images.unsplash.com/photo-1610030469668-935142b96de4?q=80&w=800" 
                className="w-full h-[650px] object-cover rounded-[2.5rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000" 
                alt="Tying knots"
              />
              <div className="absolute top-10 left-10 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-xl">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900">Stage I: The Bandhej</span>
              </div>
            </div>
            <div className="space-y-8">
              <ScrollText className="text-red-900/20" size={60} strokeWidth={1} />
              <h3 className="text-5xl md:text-7xl font-serif text-stone-900 tracking-tighter leading-none italic font-light">
                The Sacred <br/> <span className="italic text-stone-400">Knotting</span>
              </h3>
              <p className="text-stone-500 text-lg leading-relaxed font-light italic">
                A single Gaji Silk suit involves up to 15,000 tiny knots, tied by hand using a 'ring' or nails. 
                This process alone takes 10 to 15 days of meditative focus.
              </p>
              <div className="pt-8 border-t border-stone-100 flex items-center gap-4">
                 <CheckCircle2 className="text-red-900" size={18} />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-stone-900">Zero Machine Involvement</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="lg:order-2 relative group">
              <div className="absolute -inset-4 border border-red-900/10 rounded-[3rem] -z-10 group-hover:inset-0 transition-all duration-700"></div>
              <img 
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800" 
                className="w-full h-[650px] object-cover rounded-[2.5rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000" 
                alt="Natural Dyeing"
              />
              <div className="absolute top-10 right-10 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-xl">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900">Stage II: The Rangai</span>
              </div>
            </div>
            <div className="lg:order-1 space-y-8 lg:text-right">
              <Workflow className="text-red-900/20 ml-auto" size={60} strokeWidth={1} />
              <h3 className="text-5xl md:text-7xl font-serif text-stone-900 tracking-tighter leading-none italic font-light">
                The Alchemy <br/> <span className="italic text-stone-400">of Dye</span>
              </h3>
              <p className="text-stone-500 text-lg leading-relaxed font-light italic">
                Using 'Rai Bandhni' techniques, we dip the fabric into vat-dyes multiple times. 
                The mineral balance in Jetpur’s water is our secret ingredient for colors that never fade.
              </p>
              <div className="pt-8 border-t border-stone-100 flex items-center gap-4 justify-end">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-stone-900">Lab-Certified Fast Colors</span>
                 <CheckCircle2 className="text-red-900" size={18} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- J K CREATION PROMISE --- */}
      <section className="bg-stone-900 text-white py-40 px-6 text-center m-4 rounded-[4rem]">
        <div className="max-w-4xl mx-auto space-y-12">
          <Sparkles className="mx-auto text-red-500/40" size={48} strokeWidth={1} />
          <h2 className="text-5xl md:text-7xl font-serif tracking-tighter italic font-light">The J K Creation Vow</h2>
          <p className="text-stone-400 text-xl md:text-2xl font-light leading-relaxed italic">
            "Authenticity is our only currency. While the world moves toward digital printing, 
            we stay rooted in the 'Bhindi'. If you can't feel the knots, it isn't Clothiva."
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
            {['Pure Gaji Silk', 'Hand Tying', 'Jetpur Mineral Dye', 'No Middlemen'].map((item) => (
              <div key={item} className="border border-stone-800 py-6 rounded-2xl flex flex-col items-center gap-3 group hover:border-red-900 transition-colors">
                <ShieldCheck className="text-stone-700 group-hover:text-red-500 transition-colors" size={20} />
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-10">
            <Heart className="mx-auto text-red-900 animate-pulse" size={32} strokeWidth={1} />
            <h2 className="text-4xl font-serif text-stone-900 tracking-tighter">Support the Craft.</h2>
            <Link href="/shop" className="group inline-flex items-center gap-6 bg-red-950 text-white px-16 py-7 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold transition-all hover:bg-stone-900 shadow-2xl">
              Shop J K Creation Masterpieces
            </Link>
        </div>
      </section>
    </main>
  );
}

const CircleIcon = ({ size }: { size: number }) => (
    <div style={{ width: size, height: size }} className="rounded-full bg-red-900/40"></div>
)