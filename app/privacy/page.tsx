"use client";
import React from 'react';
import { ShieldCheck, Scale, FileText, ChevronRight, Lock, Eye, ScrollText } from 'lucide-react';
import Link from 'next/link';

const SectionHeader = ({ number, title }: { number: string, title: string }) => (
  <div className="flex items-center gap-4 mb-8 group">
    <span className="text-red-900 font-serif italic text-2xl opacity-40 group-hover:opacity-100 transition-opacity">
      {number}.
    </span>
    <h3 className="text-xs uppercase tracking-[0.4em] font-black text-stone-900 border-b border-stone-100 pb-2 flex-1">
      {title}
    </h3>
  </div>
);

export default function PrivacyPage() {
  const lastUpdated = "April 04, 2026";

  return (
    <main className="bg-[#FCFAF8] min-h-screen pt-32 md:pt-48 pb-32 antialiased selection:bg-red-900 selection:text-white relative overflow-hidden">
      
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none select-none hidden lg:block">
        <ScrollText size={600} strokeWidth={0.5} />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* --- HEADER --- */}
        <header className="mb-24 border-b border-stone-200 pb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <nav className="text-[10px] uppercase tracking-[0.4em] text-stone-400 flex items-center gap-3 font-bold">
                <Link href="/" className="hover:text-red-900 transition-colors">Home</Link>
                <ChevronRight size={10} className="text-stone-300" />
                <span className="text-stone-900 italic underline decoration-red-900/20 underline-offset-4">Legal Vault</span>
            </nav>
            <h1 className="text-6xl md:text-8xl font-serif text-stone-900 tracking-tighter leading-none">
                Privacy <span className="italic font-light text-stone-500">& Data</span>
            </h1>
          </div>
          <div className="text-right">
             <p className="text-[9px] uppercase tracking-[0.3em] font-black text-stone-300 mb-1">Last Revision</p>
             <p className="text-sm font-serif italic text-stone-900">{lastUpdated}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-32">
          
          {/* --- SIDEBAR NAVIGATION (Sticky) --- */}
          <aside className="lg:col-span-4 space-y-12 h-fit sticky top-40 hidden lg:block">
            <div className="bg-white border border-stone-100 p-10 rounded-[3rem] shadow-xl shadow-stone-200/30">
                <h4 className="text-[11px] uppercase tracking-[0.4em] font-black text-stone-900 mb-8">Table of Protocols</h4>
                <ul className="space-y-6">
                    {['Data Guardianship', 'Encrypted Payments', 'Artisan Disclaimer', 'Global Compliance'].map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-stone-400 hover:text-red-900 cursor-pointer transition-colors group">
                            <span className="text-[10px] font-mono opacity-30 group-hover:opacity-100">0{i+1}</span>
                            <span className="text-[10px] uppercase tracking-widest font-bold">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="px-10 py-8 bg-red-900 rounded-[2.5rem] text-white space-y-4 shadow-2xl shadow-red-900/20">
                <Lock size={20} className="opacity-50" />
                <p className="text-xs leading-relaxed font-light italic">
                    "Your privacy is as meticulously guarded as our dyeing secrets in Jetpur."
                </p>
            </div>
          </aside>

          {/* --- CONTENT --- */}
          <div className="lg:col-span-7 space-y-20 pb-20">
            
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <SectionHeader number="01" title="Data Guardianship" />
                <div className="pl-0 md:pl-12 space-y-6">
                    <p className="text-stone-500 font-light italic leading-relaxed text-xl xl:text-2xl">
                        At Clothiva (J K Creation), we collect personal identification such as your name, contact details, 
                        and shipping address solely for the purpose of fulfilling your handcrafted orders. 
                    </p>
                    <div className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100 flex items-start gap-6">
                        <div className="p-3 bg-white rounded-xl shadow-sm text-red-900">
                            <ShieldCheck size={20} />
                        </div>
                        <p className="text-xs text-stone-400 leading-relaxed uppercase tracking-wider font-bold">
                            Infrastructure: We utilize Google Firebase for high-encryption data management, ensuring your identity is locked behind enterprise-grade security.
                        </p>
                    </div>
                </div>
            </section>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <SectionHeader number="02" title="Encrypted Payments" />
                <div className="pl-0 md:pl-12 space-y-6">
                    <p className="text-stone-500 font-light italic leading-relaxed text-xl xl:text-2xl">
                        Your financial peace of mind is paramount. We do not store credit card or bank details on our servers. 
                    </p>
                    <p className="text-stone-400 font-light text-lg leading-relaxed italic">
                        All transactions are processed through encrypted, industry-leading payment gateways that comply with PCI DSS standards. Your data is tokenized and never shared with J K Creation staff.
                    </p>
                </div>
            </section>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <SectionHeader number="03" title="Artisan Disclaimer" />
                <div className="pl-0 md:pl-12 space-y-6">
                    <p className="text-stone-500 font-light italic leading-relaxed text-xl xl:text-2xl">
                        Each Bandhani piece is hand-tied and hand-dyed in Jetpur. Minor irregularities in knot placement (Bhindi) or color depth are signatures of the human hand.
                    </p>
                    <p className="text-stone-400 font-light text-lg leading-relaxed italic border-l-2 border-red-900/10 pl-8">
                        By accessing our Vault, you acknowledge that these variations are not manufacturing defects but proof of authenticity. We do not share your purchase history with third-party marketing agencies.
                    </p>
                </div>
            </section>

            {/* Footer Sign-off */}
            <footer className="pt-20 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4 text-stone-300">
                    <FileText size={20} />
                    <span className="text-[9px] uppercase tracking-[0.4em] font-black">Official Protocol 2026</span>
                </div>
                <Link href="mailto:support@clothiva.com" className="bg-stone-900 text-white px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-red-900 transition-all shadow-xl">
                    Contact Data Protection Officer
                </Link>
            </footer>

          </div>
        </div>
      </div>
    </main>
  );
}