"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, SlidersHorizontal, ShoppingBag, Check, 
  PackageX, ChevronRight, Loader2, ListFilter,
  Circle
} from 'lucide-react';

/**
 * --- SUB-COMPONENT: PRODUCT CARD ---
 * Logic remains same, UI polished with slightly softer shadows.
 */
const ProductCard = ({ product, router }: { product: any, router: any }) => {
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    useEffect(() => {
        if (product.images && product.images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImgIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
            }, 3500);
            return () => clearInterval(interval);
        }
    }, [product.images]);

    return (
        <div className="group cursor-pointer flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700" onClick={() => router.push(`/shop/${product.id}`)}>
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[2rem] bg-stone-100 shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-red-900/5">
                <img
                    key={currentImgIndex}
                    src={product.images?.[currentImgIndex] || '/placeholder.jpg'}
                    alt={product.title}
                    className="h-full w-full object-cover object-top transition-all duration-1000 ease-in-out group-hover:scale-110"
                />
                
                {product.images?.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-full">
                        {product.images.map((_: any, idx: number) => (
                            <div key={idx} className={`w-1 h-1 rounded-full transition-all ${idx === currentImgIndex ? 'bg-white w-2' : 'bg-white/40'}`} />
                        ))}
                    </div>
                )}

                <div className="absolute inset-0 z-10 flex items-end bg-stone-900/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 p-6">
                    <button className="w-full bg-white/95 backdrop-blur py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-900 shadow-2xl rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        Explore Masterpiece
                    </button>
                </div>
            </div>

            <div className="mt-6 space-y-1.5 px-1">
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-red-900/60">{product.category}</span>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-stone-900 group-hover:text-red-900 transition-colors truncate">{product.title}</h3>
                <div className="flex items-baseline gap-3">
                    <span className="font-serif text-2xl font-bold text-stone-900">₹{Number(product.price).toLocaleString()}</span>
                    {product.comparePrice && <span className="text-stone-300 line-through text-xs italic">₹{Number(product.comparePrice).toLocaleString()}</span>}
                </div>
            </div>
        </div>
    );
};

export default function ShopPage() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // --- FILTER STATES ---
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
        <main className="bg-[#FAF9F6] min-h-screen pt-32 md:pt-40 antialiased selection:bg-red-900 selection:text-white">
            
            {/* --- HEADER --- */}
            <header className="px-6 md:px-12 max-w-[1600px] mx-auto mb-12">
                <div className="border-b border-stone-200 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-4">
                        <nav className="text-[9px] uppercase tracking-[0.4em] text-stone-400 flex items-center gap-2 font-bold">
                            <a href="/" className="hover:text-red-900">Home</a>
                            <ChevronRight size={10} />
                            <span className="text-stone-900 underline decoration-red-900/20 underline-offset-4">Collections</span>
                        </nav>
                        <h1 className="text-5xl md:text-7xl font-serif text-stone-900 tracking-tighter">
                            The <span className="italic font-light text-stone-500">Vault</span>
                        </h1>
                    </div>
                    
                    {/* Active Filters Display */}
                    <div className="flex flex-wrap gap-2 md:max-w-md justify-end">
                        {selectedFabrics.map(fab => (
                            <button key={fab} onClick={() => toggleFabric(fab)} className="px-3 py-1.5 bg-white border border-stone-100 rounded-full text-[9px] font-bold uppercase tracking-widest text-red-900 flex items-center gap-2 hover:bg-red-50 transition-colors shadow-sm">
                                {fab} <X size={10} />
                            </button>
                        ))}
                        {selectedFabrics.length > 0 && (
                            <button onClick={() => setSelectedFabrics([])} className="text-[9px] uppercase tracking-widest font-black text-stone-300 hover:text-red-900 transition-colors ml-2">Clear All</button>
                        )}
                    </div>
                </div>
            </header>

            <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-12">
                
                {/* --- DESKTOP SIDEBAR FILTER (IMPROVED UI) --- */}
                <aside className="hidden lg:block w-72 shrink-0 space-y-12 sticky top-40 h-fit">
                    <div className="space-y-8">
                        <div className="flex items-center gap-2 text-stone-900">
                            <ListFilter size={16} />
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-black">Filter By</h3>
                        </div>

                        {/* Fabric Category */}
                        <div className="space-y-5">
                            <h4 className="text-[9px] uppercase tracking-widest font-bold text-stone-400">Fabric Type</h4>
                            <div className="flex flex-col gap-4">
                                {categories.map(cat => (
                                    <label key={cat} className="flex items-center group cursor-pointer">
                                        <div onClick={() => toggleFabric(cat)} className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${selectedFabrics.includes(cat) ? 'bg-red-900 border-red-900' : 'border-stone-200 group-hover:border-stone-400'}`}>
                                            {selectedFabrics.includes(cat) && <Check size={10} className="text-white" />}
                                        </div>
                                        <span className={`ml-3 text-[10px] uppercase tracking-widest font-bold transition-colors ${selectedFabrics.includes(cat) ? 'text-red-900' : 'text-stone-400 group-hover:text-stone-900'}`}>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-5 pt-4">
                            <div className="flex justify-between items-end">
                                <h4 className="text-[9px] uppercase tracking-widest font-bold text-stone-400">Price Limit</h4>
                                <span className="font-serif text-lg text-stone-900">₹{maxPrice.toLocaleString()}</span>
                            </div>
                            <input type="range" min="500" max="25000" step="500" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full accent-red-900 h-1 bg-stone-200 rounded-full appearance-none cursor-pointer" />
                        </div>

                        {/* Sort By */}
                        <div className="space-y-5 pt-4">
                            <h4 className="text-[9px] uppercase tracking-widest font-bold text-stone-400">Sort Orders</h4>
                            <div className="flex flex-col gap-2">
                                {[
                                    { id: 'newest', label: 'Latest Arrivals' },
                                    { id: 'price-low', label: 'Price: Low to High' },
                                    { id: 'price-high', label: 'Price: High to Low' }
                                ].map(opt => (
                                    <button key={opt.id} onClick={() => setSortBy(opt.id)} className={`text-left text-[10px] uppercase tracking-widest font-bold py-2 border-b border-transparent transition-all ${sortBy === opt.id ? 'text-red-900 border-red-900/20' : 'text-stone-400 hover:text-stone-600'}`}>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* --- MOBILE TRIGGER --- */}
                <button onClick={() => setMobileFilterOpen(true)} className="lg:hidden flex items-center justify-center gap-3 bg-stone-900 text-white py-4 px-8 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-xl">
                    <SlidersHorizontal size={14} /> Refine & Sort
                </button>

                {/* --- PRODUCT GRID --- */}
                <div className="flex-1 pb-32">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="space-y-6 animate-pulse">
                                    <div className="aspect-[2/3] bg-stone-200 rounded-[2rem]" />
                                    <div className="h-4 bg-stone-200 w-3/4 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} router={router} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-40 text-center border-2 border-dashed border-stone-200 rounded-[3rem] flex flex-col items-center">
                            <PackageX size={64} className="text-stone-200 mb-8" strokeWidth={1} />
                            <p className="text-stone-400 italic text-lg font-light">No masterpieces match your criteria.</p>
                            <button onClick={() => { setSelectedFabrics([]); setMaxPrice(25000); }} className="mt-8 px-10 py-4 bg-stone-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Clear Filters</button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MOBILE DRAWER (REFINED) --- */}
            <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-700 ${isMobileFilterOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
                <div className={`absolute right-0 top-0 bottom-0 w-[85%] bg-white p-10 shadow-2xl flex flex-col transition-transform duration-700 ease-out rounded-l-[3rem] ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex justify-between items-center mb-12 border-b border-stone-100 pb-6">
                        <h2 className="text-4xl font-serif text-stone-900 italic">Refine</h2>
                        <button onClick={() => setMobileFilterOpen(false)} className="p-3 bg-stone-50 rounded-full"><X size={20} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-10 pr-2">
                        {/* Mobile Categories */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] uppercase tracking-widest font-black text-red-900">Fabrics</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {categories.map(c => (
                                    <button key={c} onClick={() => toggleFabric(c)} className={`px-5 py-4 text-left text-[10px] uppercase tracking-widest font-bold rounded-2xl border transition-all ${selectedFabrics.includes(c) ? 'bg-red-900 text-white border-red-900 shadow-lg shadow-red-900/20' : 'border-stone-100 text-stone-500'}`}>{c}</button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Price */}
                        <div className="space-y-6 pt-4">
                            <h4 className="text-[10px] uppercase tracking-widest font-black text-red-900">Price: ₹{maxPrice}</h4>
                            <input type="range" min="500" max="25000" step="500" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full accent-red-900" />
                        </div>
                    </div>

                    <button className="w-full bg-stone-900 text-white py-6 rounded-2xl text-[10px] uppercase tracking-widest font-bold mt-10" onClick={() => setMobileFilterOpen(false)}>Apply Selection</button>
                </div>
            </div>
        </main>
    );
}