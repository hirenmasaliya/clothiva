"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Search, Heart, ChevronRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
    const pathname = usePathname();
    const { cart } = useCart();
    
    const isHomePage = pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isSolid = isScrolled || !isHomePage || isOpen;

    const navBg = isSolid
        ? 'bg-white/90 backdrop-blur-xl border-b border-stone-100 py-4 shadow-sm'
        : 'bg-transparent py-8';

    const textColor = isSolid ? 'text-stone-900' : 'text-white';
    const logoColor = isSolid ? 'text-red-900' : 'text-white';
    const accentColor = isSolid ? 'text-stone-400' : 'text-white/60';

    // Updated Navigation Links
    const navLinks = [
        { name: 'Collections', href: '/shop' },
        { name: 'Bulk Orders', href: '/bulk-orders' },
        { name: 'Our Story', href: '/story' },
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
    ];

    if (pathname.startsWith("/admin")) return null;

    return (
        <>
            <nav className={`fixed w-full z-[100] transition-all duration-700 ease-in-out px-6 md:px-12 ${navBg}`}>
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">

                    {/* --- LEFT NAVIGATION --- */}
                    <div className="flex-1 hidden lg:flex items-center space-x-10">
                        {navLinks.slice(0, 2).map((link) => (
                            <Link key={link.name} href={link.href} className={`text-[10px] uppercase tracking-[0.4em] font-bold hover:text-red-900 transition-colors ${textColor}`}>
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <button className="lg:hidden p-2 -ml-2" onClick={() => setIsOpen(true)}>
                        <Menu size={20} className={textColor} />
                    </button>

                    {/* --- CENTER LOGO --- */}
                    <Link href="/" className="flex flex-col items-center group flex-1">
                        <h1 className={`text-2xl md:text-4xl font-serif tracking-tighter transition-all duration-500 ${logoColor}`}>
                            CLOTHIVA
                            {/* JK */}
                        </h1>
                        <span className={`text-[8px] uppercase tracking-[0.5em] font-black -mt-1 transition-all duration-500 ${accentColor}`}>
                            Jetpur Heritage
                            {/* Creation */}
                        </span>
                    </Link>

                    {/* --- RIGHT NAVIGATION & ICONS --- */}
                    <div className="flex-1 flex items-center justify-end space-x-6 md:space-x-8">
                        <div className="hidden lg:flex items-center space-x-10 mr-8 border-r border-stone-200 pr-8">
                            {navLinks.slice(2).map((link) => (
                                <Link key={link.name} href={link.href} className={`text-[10px] uppercase tracking-[0.4em] font-bold hover:text-red-900 transition-colors ${textColor}`}>
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className={`flex items-center space-x-5 ${textColor}`}>
                            <button onClick={() => setIsSearchOpen(true)} className="hover:text-red-900 transition-colors">
                                <Search size={18} strokeWidth={1.5} />
                            </button>
                            
                            <Link href="/cart" className="relative group p-2">
                                <ShoppingBag size={18} strokeWidth={1.5} className="group-hover:text-red-900 transition-colors" />
                                {cart?.length > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-900 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold animate-in zoom-in duration-300">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- SEARCH OVERLAY --- */}
            <div className={`fixed inset-0 z-[200] bg-white transition-all duration-700 flex flex-col items-center justify-center px-6 ${isSearchOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <button onClick={() => setIsSearchOpen(false)} className="absolute top-10 right-10 p-4 bg-stone-50 rounded-full text-stone-400 hover:text-red-900 transition-all">
                    <X size={24} />
                </button>
                <div className="w-full max-w-4xl space-y-8">
                    <p className="text-[10px] uppercase tracking-[0.5em] font-black text-stone-300 text-center italic">Searching the Clothiva Archive</p>
                    <input 
                        type="text" 
                        placeholder="ENTER STYLE OR FABRIC..." 
                        className="w-full bg-transparent border-b-2 border-stone-100 py-6 text-2xl md:text-5xl font-serif text-stone-900 outline-none focus:border-red-900 transition-all text-center uppercase tracking-tighter" 
                        autoFocus
                    />
                </div>
            </div>

            {/* --- MOBILE DRAWER --- */}
            <div className={`fixed inset-0 z-[300] transition-all duration-700 ${isOpen ? 'visible' : 'invisible'}`}>
                <div className={`absolute inset-0 bg-stone-950/40 backdrop-blur-sm transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)} />
                <div className={`absolute left-0 top-0 bottom-0 w-[85%] bg-white p-12 flex flex-col transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex justify-between items-center mb-16">
                        <div className="space-y-1">
                            <h2 className="font-serif text-3xl text-red-900 tracking-tighter leading-none">CLOTHIVA</h2>
                            <p className="text-[8px] uppercase tracking-widest font-bold text-stone-400">J K Creation</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-3 bg-stone-50 rounded-full text-stone-400">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col space-y-8">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="group flex items-center justify-between border-b border-stone-50 pb-4">
                                <span className="text-3xl font-serif text-stone-900 group-hover:text-red-900 transition-colors italic font-light">{link.name}</span>
                                <ChevronRight size={20} className="text-stone-200 group-hover:text-red-900 transition-all" />
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto space-y-8">
                        <div className="flex items-center gap-4 bg-stone-50 p-6 rounded-3xl">
                            <ShieldCheck className="text-red-900/40" size={24} strokeWidth={1.5} />
                            <div>
                                <p className="text-[9px] uppercase tracking-widest font-black text-stone-900">Artisan Guarantee</p>
                                <p className="text-[9px] text-stone-400 font-medium">Authentic Jetpur Bandhani</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-2">
                            <p className="text-[8px] uppercase tracking-widest font-bold text-stone-300">© 2026 J K Creation</p>
                            <div className="flex gap-4">
                                <Heart size={16} className="text-stone-200" />
                                <ShoppingBag size={16} className="text-stone-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;