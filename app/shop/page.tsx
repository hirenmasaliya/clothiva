"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, SlidersHorizontal, Check, 
  PackageX, ChevronRight, ListFilter,
  Sparkles, Heart, MapPin
} from 'lucide-react';

/**
 * --- SUB-COMPONENT: PRODUCT CARD ---
 * Enhanced with a "Heart" touch and softer presentation.
 */
const ProductCard = ({ product, router }: { product: any, router: any }) => {
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    useEffect(() => {
        if (product.images && product.images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImgIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
            }, 4000); // Slower, more graceful transition
            return () => clearInterval(interval);
        }
    }, [product.images]);

    return (
        <div 
            className="group cursor-pointer flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-1000" 
            onClick={() => router.push(`/shop/${product.id}`)}
        >
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[2.5rem] bg-stone-100 shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2">
                {/* Product Image */}
                <img
                    key={currentImgIndex}
                    src={product.images?.[currentImgIndex] || '/placeholder.jpg'}
                    alt={product.title}
                    className="h-full w-full object-cover object-top transition-all duration-1000 ease-in-out group-hover:scale-110"
                />
                
                {/* Craft Badge */}
                {/* <div className="absolute top-5 left-5 z-20">
                    <span className="bg-white/90 backdrop-blur-md text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full text-red-900 shadow-sm border border-red-50/50">
                        Hand-Knotted
                    </span>
                </div> */}

                {/* Image Navigation Dots */}
                {product.images?.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 px-3 py-1.5 bg-black/10 backdrop-blur-md rounded-full">
                        {product.images.map((_: any, idx: number) => (
                            <div key={idx} className={`w-1 h-1 rounded-full transition-all duration-500 ${idx === currentImgIndex ? 'bg-white w-4' : 'bg-white/40'}`} />
                        ))}
                    </div>
                )}

                <div className="absolute inset-0 z-10 flex items-center justify-center bg-red-950/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="bg-white text-stone-900 px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500">
                        View Heritage
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-2 px-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-red-800/60">{product.category}</span>
                    <div className="h-px w-4 bg-stone-200"></div>
                </div>
                <h3 className="text-base font-serif text-stone-800 group-hover:text-red-900 transition-colors leading-tight">
                    {product.title}
                </h3>
                <div className="flex items-center justify-center sm:justify-start gap-3">
                    <span className="font-serif text-xl text-stone-900">₹{Number(product.price).toLocaleString()}</span>
                    {product.comparePrice && <span className="text-stone-400 line-through text-xs italic">₹{Number(product.comparePrice).toLocaleString()}</span>}
                </div>
            </div>
        </div>
    );
};

export default function ShopPage() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
    const [maxPrice, setMaxPrice] = useState(25000);
    const [sortBy, setSortBy] = useState('newest');

    const categories = ["Gaji Silk (Premium)", "Cotton Bandhni", "Pure Georgette", "Modal Silk"];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = products.filter(p => Number(p.price) <= maxPrice);
        if (selectedFabrics.length > 0) result = result.filter(p => selectedFabrics.includes(p.category));
        if (sortBy === 'price-low') result.sort((a, b) => Number(a.price) - Number(b.price));
        if (sortBy === 'price-high') result.sort((a, b) => Number(b.price) - Number(a.price));
        if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return result;
    }, [selectedFabrics, maxPrice, sortBy, products]);

    const toggleFabric = (fabric: string) => {
        setSelectedFabrics(prev => prev.includes(fabric) ? prev.filter(f => f !== fabric) : [...prev, fabric]);
    };

    return (
        <main className="bg-[#FFFDFB] min-h-screen pt-32 md:pt-48 antialiased selection:bg-red-900 selection:text-white">
            
            {/* --- HERO HEADER: TOUCH OF HEART --- */}
            <header className="px-6 md:px-12 max-w-[1600px] mx-auto mb-20 text-center">
                <nav className="text-[9px] uppercase tracking-[0.4em] text-stone-400 flex items-center justify-center gap-2 font-bold mb-6">
                    <a href="/" className="hover:text-red-900">The Beginning</a>
                    <ChevronRight size={10} />
                    <span className="text-stone-900">The Collection</span>
                </nav>
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-stone-900 tracking-tighter">
                        The <span className="italic font-light text-stone-400">Virasat</span>
                    </h1>
                    <p className="text-stone-500 font-light italic max-w-lg mx-auto text-sm md:text-base">
                        "Curated from the heart of Jetpur. Every knot tells a story of 10,000 ties and 14 days of sun-curing."
                    </p>
                </div>

                {/* Active Filter Chips */}
                <div className="flex flex-wrap gap-2 justify-center mt-10">
                    {selectedFabrics.map(fab => (
                        <button key={fab} onClick={() => toggleFabric(fab)} className="px-4 py-2 bg-red-50 border border-red-100 rounded-full text-[9px] font-black uppercase tracking-widest text-red-900 flex items-center gap-2 hover:bg-red-100 transition-colors shadow-sm">
                            {fab} <X size={10} />
                        </button>
                    ))}
                </div>
            </header>

            <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16">
                
                {/* --- SIDEBAR: HERITAGE FILTERS --- */}
                <aside className="hidden lg:block w-72 shrink-0 space-y-12 sticky top-38 h-fit">
                    <div className="space-y-10">
                        <div className="flex items-center gap-3 text-stone-900">
                            <ListFilter size={18} className="text-red-900" />
                            <h3 className="text-[11px] uppercase tracking-[0.3em] font-black">Refine Collection</h3>
                        </div>

                        {/* Fabric Category */}
                        <div className="space-y-6">
                            <h4 className="text-[9px] uppercase tracking-widest font-black text-stone-400 border-b border-stone-100 pb-2">The Fabric</h4>
                            <div className="flex flex-col gap-5">
                                {categories.map(cat => (
                                    <label key={cat} className="flex items-center group cursor-pointer">
                                        <div onClick={() => toggleFabric(cat)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedFabrics.includes(cat) ? 'bg-red-900 border-red-900' : 'border-stone-200 group-hover:border-stone-400'}`}>
                                            {selectedFabrics.includes(cat) && <Check size={12} className="text-white" />}
                                        </div>
                                        <span className={`ml-4 text-[10px] uppercase tracking-[0.15em] font-bold transition-colors ${selectedFabrics.includes(cat) ? 'text-red-900' : 'text-stone-400 group-hover:text-stone-900'}`}>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-6">
                            <h4 className="text-[9px] uppercase tracking-widest font-black text-stone-400 border-b border-stone-100 pb-2">Investment</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[10px] font-bold text-stone-400 uppercase">Up To</span>
                                    <span className="font-serif text-xl text-stone-900">₹{maxPrice.toLocaleString()}</span>
                                </div>
                                <input type="range" min="500" max="25000" step="500" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full accent-red-900 h-1 bg-stone-200 rounded-full appearance-none cursor-pointer" />
                            </div>
                        </div>

                        {/* Sort By */}
                        <div className="space-y-6">
                            <h4 className="text-[9px] uppercase tracking-widest font-black text-stone-400 border-b border-stone-100 pb-2">Ordering</h4>
                            <div className="flex flex-col gap-2">
                                {[
                                    { id: 'newest', label: 'Fresh From Workshop' },
                                    { id: 'price-low', label: 'Modest Prices First' },
                                    { id: 'price-high', label: 'Most Premium First' }
                                ].map(opt => (
                                    <button key={opt.id} onClick={() => setSortBy(opt.id)} className={`text-left text-[10px] uppercase tracking-widest font-bold py-2 transition-all ${sortBy === opt.id ? 'text-red-900 translate-x-2' : 'text-stone-400 hover:text-stone-600'}`}>
                                        {sortBy === opt.id && '— '} {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* --- MOBILE REFINEMENT BUTTON --- */}
                <div className="lg:hidden fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full px-6 max-w-sm">
                    <button onClick={() => setMobileFilterOpen(true)} className="w-full flex items-center justify-center gap-4 bg-red-950 text-white py-5 px-8 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold shadow-2xl backdrop-blur-md bg-opacity-95">
                        <SlidersHorizontal size={14} /> Refine Collection
                    </button>
                </div>

                {/* --- PRODUCT GRID --- */}
                <div className="flex-1 pb-40">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="space-y-6 animate-pulse">
                                    <div className="aspect-[2/3] bg-stone-100 rounded-[2.5rem]" />
                                    <div className="h-4 bg-stone-100 w-3/4 mx-auto rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-20">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} router={router} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-40 text-center border border-stone-100 rounded-[4rem] bg-white flex flex-col items-center px-6">
                            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-8">
                                <PackageX size={32} className="text-stone-300" strokeWidth={1} />
                            </div>
                            <h3 className="text-2xl font-serif text-stone-900 italic mb-2">A Rare Selection</h3>
                            <p className="text-stone-400 text-sm font-light max-w-xs leading-relaxed">We couldn't find a piece that matches those specific criteria. Try adjusting your search.</p>
                            <button onClick={() => { setSelectedFabrics([]); setMaxPrice(25000); }} className="mt-8 text-[10px] font-black uppercase tracking-widest text-red-900 border-b-2 border-red-900/10 pb-1 hover:border-red-900 transition-all">Show All Heritage</button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MOBILE DRAWER (SOULFUL) --- */}
            <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-700 ${isMobileFilterOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="absolute inset-0 bg-red-950/20 backdrop-blur-md" onClick={() => setMobileFilterOpen(false)} />
                <div className={`absolute right-0 top-0 bottom-0 w-full sm:w-[400px] bg-[#FFFDFB] shadow-2xl flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    
                    <div className="p-10 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-16">
                            <div>
                                <h2 className="text-4xl font-serif text-stone-900">Refine</h2>
                                <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mt-1">Fine tune your Virasat</p>
                            </div>
                            <button onClick={() => setMobileFilterOpen(false)} className="w-12 h-12 bg-stone-50 flex items-center justify-center rounded-full text-stone-900"><X size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-12 pr-2 custom-scrollbar">
                            <div className="space-y-6">
                                <h4 className="text-[10px] uppercase tracking-widest font-black text-red-900 flex items-center gap-2">
                                    <Sparkles size={12} /> The Fabric
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {categories.map(c => (
                                        <button key={c} onClick={() => toggleFabric(c)} className={`px-6 py-5 text-left text-[11px] uppercase tracking-widest font-bold rounded-2xl border-2 transition-all ${selectedFabrics.includes(c) ? 'bg-red-950 text-white border-red-950 shadow-xl' : 'border-stone-100 text-stone-500'}`}>{c}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-[10px] uppercase tracking-widest font-black text-red-900 flex items-center gap-2">
                                    <MapPin size={12} /> Investment
                                </h4>
                                <div className="p-6 bg-stone-50 rounded-3xl">
                                    <p className="text-2xl font-serif text-stone-900 mb-4">₹{maxPrice.toLocaleString()}</p>
                                    <input type="range" min="500" max="25000" step="500" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full accent-red-900" />
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-red-950 text-white py-6 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-black mt-10 shadow-2xl" onClick={() => setMobileFilterOpen(false)}>Apply Selection</button>
                    </div>
                </div>
            </div>
            
            {/* Footer Subtle Note */}
            <footer className="py-20 text-center px-6">
                <div className="h-px w-20 bg-stone-200 mx-auto mb-8"></div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-stone-300 font-bold">Jetpur Heritage • J K Creation Legacy</p>
            </footer>
        </main>
    );
}