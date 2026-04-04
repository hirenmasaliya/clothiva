"use client";
import React, { useState } from 'react';
import { Scale, ChevronRight, Gavel, Box, RotateCcw, AlertCircle, Sparkles, BookOpenText } from 'lucide-react';
import Link from 'next/link';

const TermSection = ({ number, title, id, children }: { number: string, title: string, id: string, children: React.ReactNode }) => (
  <section id={id} className="group animate-in fade-in slide-in-from-bottom-8 duration-1000 scroll-mt-40">
    <div className="flex items-center gap-6 mb-12 border-b border-stone-100 pb-4">
      <span className="text-5xl font-serif italic text-red-900/10 group-hover:text-red-900/50 transition-colors duration-700">{number}.</span>
      <h3 className="text-xs uppercase tracking-[0.5em] font-black text-stone-900 flex-1">{title}</h3>
    </div>
    <div className="pl-0 md:pl-24 space-y-8 text-stone-500 font-light italic leading-relaxed text-xl xl:text-2xl">
      {children}
    </div>
  </section>
);

export default function TermsPage() {
  const effectiveDate = "April 04, 2026";
  const [activeSection, setActiveSection] = useState('discrepancy');

  const toc = [
    { id: 'discrepancy', name: 'Artisanal Variance' },
    { id: 'investment', name: 'Pricing & Investment' },
    { id: 'confirmation', name: 'Order Acceptance' },
    { id: 'ip', name: 'Intellectual Property' },
  ];

  return (
    <main className="bg-[#FCFAF8] min-h-screen pt-32 md:pt-48 pb-40 antialiased selection:bg-red-900 selection:text-white relative">
      
      {/* Decorative Background Text (Parallax feel) */}
      <div className="absolute top-20 left-10 text-[15vw] font-serif text-stone-100/70 -z-10 pointer-events-none select-none uppercase tracking-tighter italic opacity-50">
        Protocol
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* --- HEADER (Clean & Luxury) --- */}
        <header className="mb-32 border-b border-stone-200 pb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-6">
            <nav className="text-[10px] uppercase tracking-[0.5em] text-stone-400 flex items-center gap-3 font-black">
                <Link href="/" className="hover:text-red-900 transition-colors">Home</Link>
                <ChevronRight size={10} className="text-stone-200" />
                <span className="text-stone-900 italic underline decoration-red-900/20 underline-offset-8">Artisanal protocols</span>
            </nav>
            <h1 className="text-7xl md:text-[120px] font-serif text-stone-900 tracking-tighter leading-[0.85] animate-in fade-in slide-in-from-left-10 duration-1000">
                The <span className="italic font-light text-stone-400">Vault Rules</span>
            </h1>
          </div>
          <div className="md:text-right border-l md:border-l-0 md:border-r-2 border-red-900/10 px-8 py-2 bg-white/50 backdrop-blur-sm rounded-r-xl">
             <p className="text-[9px] uppercase tracking-[0.4em] font-black text-stone-300 mb-2">Effective From</p>
             <p className="text-base font-serif italic text-stone-900">{effectiveDate}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 xl:gap-32">
          
          {/* --- LEFT: SIDEBAR (STICKY Table of Contents) --- */}
          <aside className="lg:col-span-4 space-y-12 h-fit sticky top-40 hidden lg:block">
            <div className="p-10 bg-white border border-stone-100 rounded-[3rem] shadow-2xl shadow-stone-200/30 space-y-10">
                <div className="flex items-center gap-3 border-b border-stone-50 pb-6">
                    <BookOpenText className="text-red-900/40" size={20} />
                    <h4 className="text-[11px] uppercase tracking-[0.4em] font-black text-stone-900 flex-1">Index of Rules</h4>
                </div>
                <ul className="space-y-6">
                    {toc.map((item, i) => (
                        <li key={item.id} className="group flex items-center gap-4 cursor-pointer" onClick={() => setActiveSection(item.id)}>
                            <a href={`#${item.id}`} className="flex items-center gap-4 w-full">
                                <span className={`text-[10px] font-mono transition-opacity ${activeSection === item.id ? 'text-red-900 opacity-100' : 'text-stone-300 opacity-50 group-hover:opacity-100'}`}>
                                    0{i+1}
                                </span>
                                <span className={`text-[11px] uppercase tracking-widest font-bold transition-colors ${activeSection === item.id ? 'text-stone-900' : 'text-stone-400 group-hover:text-red-900'}`}>
                                    {item.name}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="p-10 bg-red-900 rounded-[2.5rem] text-white space-y-5 shadow-2xl shadow-red-900/20 group">
                <Sparkles className="text-white/40 group-hover:rotate-12 transition-transform" size={24} strokeWidth={1} />
                <p className="text-sm leading-relaxed font-light italic text-red-50">
                    "These rules ensure that the spirit of Jetpur remains pure in every thread we dye."
                </p>
            </div>
          </aside>

          {/* --- RIGHT: THE TERMS (Enhanced Spacing & Motion) --- */}
          <div className="lg:col-span-8 space-y-40">
            
            <TermSection number="01" title="Artisanal Discrepancy" id="discrepancy">
                <p>
                  Every masterpiece in our collection is hand-tied and hand-dyed by artisans in Jetpur. 
                  Because of this human process, small variations in color depth, knot placement (Bhindi), 
                  and fabric texture are not defects. 
                </p>
                <div className="bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-[2.5rem] border border-stone-100 flex items-start gap-6 shadow-sm">
                    <AlertCircle className="text-red-900 shrink-0 mt-1" size={22} strokeWidth={1.5} />
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-red-950">Notice on Authenticity</p>
                        <p className="text-sm uppercase tracking-widest font-bold text-red-900 leading-relaxed">
                            We do not accept returns based on "minor shade variations" or "knot placement." These are the definitive signatures of the organic vat-dyeing processes.
                        </p>
                    </div>
                </div>
            </TermSection>

            <TermSection number="02" title="Investment & Pricing" id="investment">
                <p>
                  All prices listed are in Indian Rupees (INR). As a premium provider, J K Creation 
                  reserves the right to adjust pricing based on raw Gaji Silk market fluctuations. 
                </p>
                <p className="text-stone-400 text-lg border-l-2 border-stone-100 pl-8 font-light italic">
                  Confirmed orders will always be honored at the original investment price at the time of purchase. 
                  Customs duties for international shipments remain the responsibility of the client.
                </p>
            </TermSection>

            <TermSection number="03" title="Order Acceptance" id="confirmation">
                <p>
                  Submission of an order via our digital interface constitutes an "offer" to purchase. 
                  Clothiva (J K Creation) reserves the right to decline any order if the raw fabric 
                  fails our rigorous quality inspection prior to dyeing. 
                </p>
                <p className="text-stone-400 text-lg font-light">Your investment will be fully refunded in such rare cases.</p>
            </TermSection>

            <TermSection number="04" title="Intellectual Property" id="ip">
                <p>
                  All imagery of the Jetpur workshop, artisan profiles, and product designs remain 
                  the exclusive intellectual property of J K Creation. Reproduction, imitation, 
                  or unauthorized commercial use is strictly prohibited.
                </p>
            </TermSection>

            {/* --- CLOSING --- */}
            <footer className="pt-24 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-5 bg-white p-4 pr-8 rounded-full border border-stone-50 shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center font-serif italic text-2xl text-stone-300 shadow-inner">
                        JK
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-900">J K Creation Legacy</p>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-bold">Jetpur, Gujarat • Est. 2026</p>
                    </div>
                </div>
                <Link href="/contact" className="group bg-stone-900 text-white px-20 py-7 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-red-900 transition-all shadow-2xl active:scale-95 flex items-center gap-3">
                    Discuss Protocols <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </footer>

          </div>
        </div>
      </div>
    </main>
  );
}