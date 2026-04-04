"use client";
import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Edit3,
    Trash2,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Loader2,
    PackageX
} from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // --- 1. FETCH DATA FROM API ---
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // --- 2. SEARCH FILTERING ---
    const filteredProducts = products.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* --- PAGE HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-serif text-stone-900 tracking-tight">Inventory</h1>
                    <p className="text-stone-500 text-[10px] uppercase tracking-[0.2em] font-bold mt-2">
                        Managing {products.length} Masterpieces
                    </p>
                </div>
                <Link href="/admin/products/add">
                    <button className="bg-red-900 text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-stone-950 transition-all shadow-xl shadow-red-900/20 active:scale-95">
                        <Plus size={16} /> Add New Product
                    </button>
                </Link>
            </div>

            {/* --- FILTERS BAR --- */}
            <div className="bg-white p-4 border border-stone-200 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title or fabric..."
                        className="w-full pl-12 pr-4 py-3 bg-stone-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-red-900/10 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select className="flex-1 md:flex-none px-6 py-3 border border-stone-100 rounded-xl text-[10px] uppercase tracking-widest font-bold text-stone-500 outline-none bg-stone-50">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Out of Stock</option>
                    </select>
                </div>
            </div>

            {/* --- PRODUCTS TABLE --- */}
            <div className="bg-white border border-stone-200 rounded-[2rem] shadow-sm overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50/50 border-b border-stone-100 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
                            <tr>
                                <th className="px-8 py-5">Product Details</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5">Price</th>
                                <th className="px-8 py-5">Stock</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {loading ? (
                                // --- LOADING SKELETONS ---
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-6 flex items-center gap-4">
                                            <div className="w-14 h-14 bg-stone-100 rounded-xl" />
                                            <div className="space-y-2">
                                                <div className="w-32 h-3 bg-stone-100 rounded" />
                                                <div className="w-20 h-2 bg-stone-50 rounded" />
                                            </div>
                                        </td>
                                        <td colSpan={5} className="px-8 py-6"><div className="w-full h-4 bg-stone-50 rounded" /></td>
                                    </tr>
                                ))
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="group hover:bg-stone-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-stone-100 overflow-hidden border border-stone-100 shadow-inner">
                                                    <img 
                                                        src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-stone-900 text-sm tracking-tight">{product.title}</p>
                                                    <p className="text-[9px] text-stone-400 font-mono mt-1 uppercase tracking-tighter">SKU: {product.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">{product.category}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-serif font-bold text-stone-900">₹{Number(product.price).toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-[10px] font-bold uppercase tracking-tight ${Number(product.stock) === 0 ? 'text-red-500' : 'text-stone-600'}`}>
                                                    {product.stock} Units
                                                </span>
                                                <div className="w-16 h-1 bg-stone-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${Number(product.stock) > 5 ? 'bg-red-900' : 'bg-orange-400'}`}
                                                        style={{ width: `${Math.min((Number(product.stock) / 20) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm ${
                                                Number(product.stock) > 0 ? 'bg-stone-900 text-white' : 'bg-red-50 text-red-900 border border-red-100'
                                            }`}>
                                                {Number(product.stock) > 0 ? 'Live' : 'Sold Out'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <Link href={`/admin/products/${product.id}`} className="p-2.5 bg-white border border-stone-100 rounded-xl text-stone-400 hover:text-red-900 hover:shadow-md transition-all">
                                                    <Edit3 size={16} />
                                                </Link>
                                                <button className="p-2.5 bg-white border border-stone-100 rounded-xl text-stone-400 hover:text-red-600 hover:shadow-md transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                // --- EMPTY STATE ---
                                <tr>
                                    <td colSpan={6} className="py-32 text-center">
                                        <div className="flex flex-col items-center text-stone-300">
                                            <PackageX size={48} strokeWidth={1} className="mb-4" />
                                            <p className="text-sm italic font-light">No masterpieces found in your vault.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- PAGINATION --- */}
                <div className="px-8 py-6 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">Inventory View 1.0</p>
                    <div className="flex gap-2">
                        <button className="p-2.5 border border-stone-200 rounded-xl hover:bg-white disabled:opacity-30" disabled>
                            <ChevronLeft size={16} />
                        </button>
                        <button className="p-2.5 border border-stone-200 rounded-xl hover:bg-white">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}