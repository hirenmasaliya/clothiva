"use client";
import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, ChevronRight, Lock, Shield } from 'lucide-react';
import Link from 'next/link';

const SECTIONS = [
  { id: "data-guardianship", title: "Data Guardianship", number: "01" },
  { id: "encrypted-payments", title: "Encrypted Payments", number: "02" },
  { id: "artisan-disclaimer", title: "Artisan Disclaimer", number: "03" },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const lastUpdated = "April 04, 2026";

  // Handle smooth scrolling
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Accounts for fixed headers/padding
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  // Optional: Intersection Observer to update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="bg-[#FAFAF9] min-h-screen pt-24 md:pt-40 pb-32 antialiased selection:bg-red-900 selection:text-white">
      
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        {/* --- HEADER --- */}
        <header className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-stone-200 pb-12">
          <div className="space-y-6">
            <nav className="text-[10px] uppercase tracking-[0.3em] text-stone-400 flex items-center gap-2 font-bold">
                <Link href="/" className="hover:text-red-900 transition-colors">Home</Link>
                <ChevronRight size={12} className="text-stone-300" />
                <span className="text-stone-900">Legal Vault</span>
            </nav>
            <h1 className="text-5xl md:text-7xl font-serif text-stone-900 tracking-tight leading-none">
                Privacy <span className="italic font-light text-stone-400">& Data</span>
            </h1>
          </div>
          <div className="text-left md:text-right bg-white px-6 py-4 rounded-2xl border border-stone-100 shadow-sm">
             <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-1">Last Revision</p>
             <p className="text-sm font-serif font-medium text-stone-900">{lastUpdated}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* --- SIDEBAR NAVIGATION --- */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-32 space-y-8">
              {/* Table of Contents */}
              <div className="bg-white border border-stone-200 p-8 rounded-3xl shadow-sm">
                  <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 mb-6 flex items-center gap-2">
                    <FileText size={16} className="text-red-900" />
                    Table of Protocols
                  </h4>
                  <ul className="space-y-4">
                      {SECTIONS.map((item) => (
                          <li key={item.id}>
                            <button 
                              onClick={() => scrollToSection(item.id)}
                              className={`flex items-center gap-4 text-left w-full transition-all duration-300 group ${
                                activeSection === item.id ? 'text-red-900 translate-x-2' : 'text-stone-500 hover:text-stone-900 hover:translate-x-1'
                              }`}
                            >
                                <span className={`text-[10px] font-mono transition-opacity ${activeSection === item.id ? 'opacity-100 font-bold' : 'opacity-40 group-hover:opacity-100'}`}>
                                  {item.number}
                                </span>
                                <span className={`text-[11px] uppercase tracking-widest font-bold ${activeSection === item.id ? 'text-red-900' : ''}`}>
                                  {item.title}
                                </span>
                            </button>
                          </li>
                      ))}
                  </ul>
              </div>
              
              {/* Trust Badge */}
              <div className="p-8 bg-stone-900 rounded-3xl text-white space-y-4 shadow-lg">
                  <Shield size={24} className="text-red-400" />
                  <p className="text-sm leading-relaxed font-serif italic text-stone-300">
                      "Your privacy is as meticulously guarded as our traditional dyeing secrets in Jetpur."
                  </p>
              </div>
            </div>
          </aside>

          {/* --- CONTENT --- */}
          <div className="lg:col-span-8 space-y-24 pb-20">
            
            <section id="data-guardianship" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-stone-300 font-serif italic text-3xl">{SECTIONS[0].number}.</span>
                  <h3 className="text-sm uppercase tracking-[0.3em] font-bold text-stone-900 border-b border-stone-200 pb-2 flex-1">
                    {SECTIONS[0].title}
                  </h3>
                </div>
                <div className="md:pl-12 space-y-6">
                    <p className="text-stone-600 font-light leading-relaxed text-lg">
                        At <strong className="font-semibold text-stone-900">Clothiva (J K Creation)</strong>, we collect personal identification such as your name, contact details, 
                        and shipping address solely for the purpose of fulfilling your handcrafted orders. We believe in data minimalism—only collecting what is strictly necessary to deliver our heritage pieces to your doorstep.
                    </p>
                    <div className="p-6 bg-white rounded-2xl border border-stone-200 flex items-start gap-5 shadow-sm mt-8">
                        <div className="p-2.5 bg-red-50 rounded-xl text-red-900 shrink-0">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-stone-900 mb-1">Infrastructure Security</p>
                          <p className="text-sm text-stone-500 leading-relaxed">
                              We utilize Google Firebase for high-encryption data management, ensuring your identity is locked behind enterprise-grade security protocols.
                          </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="encrypted-payments" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-stone-300 font-serif italic text-3xl">{SECTIONS[1].number}.</span>
                  <h3 className="text-sm uppercase tracking-[0.3em] font-bold text-stone-900 border-b border-stone-200 pb-2 flex-1">
                    {SECTIONS[1].title}
                  </h3>
                </div>
                <div className="md:pl-12 space-y-6">
                    <p className="text-stone-600 font-light leading-relaxed text-lg">
                        Your financial peace of mind is paramount to our operational ethos. <strong className="font-semibold text-stone-900">We do not store credit card or bank details on our servers.</strong> 
                    </p>
                    <p className="text-stone-500 leading-relaxed text-base">
                        All transactions are processed through encrypted, industry-leading payment gateways that comply with rigorous PCI DSS standards. Your financial data is tokenized immediately upon entry and is never accessible to or shared with J K Creation staff.
                    </p>
                </div>
            </section>

            <section id="artisan-disclaimer" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-stone-300 font-serif italic text-3xl">{SECTIONS[2].number}.</span>
                  <h3 className="text-sm uppercase tracking-[0.3em] font-bold text-stone-900 border-b border-stone-200 pb-2 flex-1">
                    {SECTIONS[2].title}
                  </h3>
                </div>
                <div className="md:pl-12 space-y-6">
                    <p className="text-stone-600 font-light leading-relaxed text-lg">
                        Each Bandhani piece is painstakingly hand-tied and hand-dyed by artisans in Jetpur. Minor irregularities in knot placement (Bhindi) or slight variations in color depth are the distinctive signatures of the human hand.
                    </p>
                    <div className="pl-6 border-l-2 border-red-900/20 py-2">
                      <p className="text-stone-500 leading-relaxed text-base">
                          By accessing our Vault and initiating a purchase, you acknowledge that these variations are not manufacturing defects, but proof of true artisanal authenticity. Furthermore, we guarantee that we do not share your specific purchase history or aesthetic preferences with third-party marketing agencies.
                      </p>
                    </div>
                </div>
            </section>

            {/* Footer Sign-off */}
            <footer className="pt-16 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6 mt-12">
                <div className="flex items-center gap-3 text-stone-400">
                    <Lock size={16} />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Official Protocol 2026</span>
                </div>
                <Link 
                  href="mailto:support@clothiva.com" 
                  className="bg-stone-900 text-white px-8 py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-red-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                    Contact Data Protection Officer
                </Link>
            </footer>

          </div>
        </div>
      </div>
    </main>
  );
}