"use client";
import React, { useState, useEffect } from 'react';

interface Product {
    sku: string;
    id: string;
    title: string;
    images: string[];
    description: string;
    category: string;
    price: number;
}

const BulkOrders = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(Array.isArray(data) ? data : data.products || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="bg-white min-h-screen pb-20 font-sans">
            {/* 1. Hero Section - Focus on the "Set" Concept */}
            <section className="py-24 px-6 border-b border-gray-50">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-[#B8860B] font-medium tracking-[0.4em] uppercase text-[10px] mb-4">
                        Clothiva Jetpur Manufacturing
                    </p>
                    <h1 className="text-4xl md:text-5xl font-light text-[#1A1A1A] mb-6 tracking-tight uppercase">
                        The <span className="font-semibold text-[#800000]">Master Bulk Set</span>
                    </h1>
                    <div className="w-16 h-px bg-[#B8860B] mx-auto mb-8"></div>
                    
                    <div className="max-w-2xl mx-auto bg-[#FAF9F6] border border-gray-100 p-6 rounded-sm">
                        <p className="text-[#1A1A1A] text-sm font-bold tracking-widest uppercase mb-2">One Unified Collection</p>
                        <p className="text-gray-500 text-xs leading-relaxed uppercase tracking-wider">
                            All products listed below are included in our signature 100-piece set. 
                            You receive a curated mix of all designs in 10 traditional Bandhani colors.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* 2. Unified Product Catalog */}
                    <div className="lg:col-span-8">
                        <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
                            <h2 className="text-sm font-bold text-[#1A1A1A] tracking-[0.3em] uppercase">
                                Included in this set ({products.length} Designs)
                            </h2>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 animate-pulse">
                                {[1, 2, 3].map((n) => (
                                    <div key={n} className="bg-gray-50 aspect-[3/4]"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
                                {products.map((item) => (
                                    <div key={item.id} className="group relative">
                                        <div className="relative aspect-[3/4] overflow-hidden bg-[#FBFBFA] grayscale-[30%] group-hover:grayscale-0 transition-all duration-700">
                                            <img
                                                src={item.images && item.images[0] ? item.images[0] : '/placeholder.jpg'}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2 text-center border-t border-gray-100">
                                                <p className="text-[9px] font-bold text-[#800000] tracking-widest uppercase">Part of Master Set</p>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <h3 className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider line-clamp-1">{item.title}</h3>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">{item.category}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 3. Inquiry & Payment Conditions */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-12 space-y-8">
                            
                            {/* Wholesale Terms Card */}
                            <div className="bg-[#1A1A1A] text-white p-8 rounded-sm shadow-xl">
                                <h2 className="text-xs font-bold tracking-[0.3em] uppercase mb-6 border-b border-white/10 pb-4 text-[#B8860B]">
                                    Payment & Terms
                                </h2>
                                <ul className="space-y-6">
                                    <li className="flex items-start gap-4">
                                        <span className="text-[#B8860B] font-bold text-lg">01</span>
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-widest">50% Advance Payment</p>
                                            <p className="text-[10px] text-gray-400 mt-1">Required to confirm the booking and start production.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="text-[#B8860B] font-bold text-lg">02</span>
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-widest">Balance Before Dispatch</p>
                                            <p className="text-[10px] text-gray-400 mt-1">Remaining 50% must be cleared after QC and before shipping.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="text-[#B8860B] font-bold text-lg">03</span>
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-widest">100 Pcs Master Set</p>
                                            <p className="text-[10px] text-gray-400 mt-1">Fixed set including 10 colors across all catalog designs.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Inquiry Form */}
                            <div className="bg-white border border-gray-100 p-8 shadow-sm">
                                <h3 className="text-xs font-bold text-[#1A1A1A] mb-8 tracking-[0.2em] uppercase">Book Your Lot</h3>
                                <form className="space-y-6">
                                    <input type="text" className="w-full border-b border-gray-200 py-2 outline-none text-xs uppercase tracking-widest focus:border-[#800000]" placeholder="Boutique Name" />
                                    <input type="tel" className="w-full border-b border-gray-200 py-2 outline-none text-xs uppercase tracking-widest focus:border-[#800000]" placeholder="WhatsApp Number" />
                                    <div className="py-2">
                                        <p className="text-[9px] text-gray-400 uppercase mb-2">Selected Package</p>
                                        <div className="bg-gray-50 p-3 text-[10px] font-bold text-[#800000] border-l-2 border-[#800000]">
                                            100 PCS MASTER COLLECTION SET
                                        </div>
                                    </div>
                                    <button className="w-full bg-[#1A1A1A] text-white py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#800000] transition-all">
                                        Request Invoice
                                    </button>
                                </form>
                                <p className="text-[9px] text-center text-gray-400 mt-6 italic">
                                    Prices are Ex-Factory Jetpur. GST extra as applicable.
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BulkOrders;