"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { 
  Upload, Save, ChevronRight, Info, Type, 
  IndianRupee, Layers, Image as ImageIcon, Trash2, Loader2, X 
} from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    comparePrice: '',
    stock: '',
    sku: '',
    category: 'Gaji Silk (Premium)',
    isFeatured: false
  });

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // --- CLOUDINARY UPLOAD HANDLER ---
  const handleUploadSuccess = (result: any) => {
    // IMPORTANT: Cloudinary returns the URL in result.info.secure_url
    if (result?.event === "success") {
      const url = result.info.secure_url;
      console.log("Upload Success! URL:", url);
      setImageUrls(prev => [...prev, url]);
    }
  };

  const removeImage = (urlToRemove: string) => {
    setImageUrls(prev => prev.filter(url => url !== urlToRemove));
  };

  // --- SUBMIT TO API ---
  const handlePublish = async () => {
    if (!formData.title || !formData.price) {
      alert("Please provide at least a Title and Price.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrls: imageUrls
        }),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        const err = await response.json();
        alert(`Error: ${err.error}`);
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert("Something went wrong while publishing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20 max-w-350 mx-auto">
      
      {/* --- STICKY HEADER --- */}
      <div className="sticky top-20 z-30 bg-stone-50/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-stone-200/50 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
            <Link href="/admin/products" className="hover:text-red-900 transition-colors">Inventory</Link>
            <ChevronRight size={12} />
            <span className="text-stone-900">New Creation</span>
          </nav>
          <h1 className="text-3xl font-serif text-stone-900 tracking-tight">Create <span className="italic font-light text-stone-500">Masterpiece</span></h1>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="px-6 py-3 text-stone-400 hover:text-stone-900 text-xs uppercase tracking-widest font-bold transition-all">Discard</button>
          <button 
            onClick={handlePublish}
            disabled={loading}
            className="bg-red-900 text-white px-10 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-2 hover:bg-stone-950 transition-all shadow-xl shadow-red-900/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {loading ? "Publishing..." : "Publish to Store"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- LEFT COLUMN: DETAILS --- */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-stone-100 bg-stone-50/50 flex items-center gap-3">
              <Type size={18} className="text-red-900" />
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900">General Details</h3>
            </div>
            <div className="p-8 space-y-8">
              <div className="group space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 group-focus-within:text-red-900 transition-colors">Product Title</label>
                <input name="title" value={formData.title} onChange={handleChange} type="text" placeholder="e.g. Royal Maroon Rai Bandhej Suit" className="w-full text-xl font-serif p-0 bg-transparent border-b border-stone-200 focus:border-red-900 outline-none transition-all pb-2 text-stone-900" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Artisan Story (Description)</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={6} placeholder="Describe the knotting process..." className="w-full p-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-4 ring-red-900/5 focus:bg-white transition-all text-stone-600 italic font-light"></textarea>
              </div>
            </div>
          </section>

          <section className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-stone-100 bg-stone-50/50 flex items-center gap-3">
              <IndianRupee size={18} className="text-red-900" />
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900">Pricing & Stock</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Selling Price</label>
                <input name="price" value={formData.price} onChange={handleChange} type="number" placeholder="0.00" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-red-900/30 transition-all text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Stock Quantity</label>
                <input name="stock" value={formData.stock} onChange={handleChange} type="number" placeholder="0" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-red-900/30 transition-all text-sm" />
              </div>
            </div>
          </section>
        </div>

        {/* --- RIGHT COLUMN: MEDIA & CATEGORY --- */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Cloudinary Gallery */}
          <section className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-stone-100 bg-stone-50/50 flex items-center gap-3">
              <ImageIcon size={18} className="text-red-900" />
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900">Gallery</h3>
            </div>
            <div className="p-6 space-y-4">
              <CldUploadWidget 
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} 
                onSuccess={handleUploadSuccess}
              >
                {({ open }) => (
                  <button 
                    type="button"
                    onClick={() => open()}
                    className="w-full border-2 border-dashed border-stone-100 rounded-2xl py-8 flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-all group"
                  >
                    <Upload className="text-stone-300 group-hover:text-red-900 mb-2" size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Upload Photos</span>
                  </button>
                )}
              </CldUploadWidget>

              {/* IMAGE PREVIEW GRID */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {imageUrls.map((url, i) => (
                  <div key={i} className="aspect-3/4 rounded-2xl bg-stone-100 relative group overflow-hidden border border-stone-200 shadow-sm">
                    <img 
                      src={url} 
                      alt={`Product view ${i + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                    <button 
                      onClick={() => removeImage(url)} 
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-red-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-900 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Classification */}
          <section className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Fabric Base</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none text-sm font-medium">
                <option>Sartin Cotton</option>
                <option>Cotton Bandhni</option>
                <option>Pure Georgette</option>
              </select>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input name="isFeatured" type="checkbox" checked={formData.isFeatured} onChange={handleChange} className="sr-only peer" />
                <div className="w-10 h-5 bg-stone-200 rounded-full peer peer-checked:bg-red-900 transition-colors"></div>
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></div>
              </div>
              <span className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Feature on Home</span>
            </label>
          </section>
        </div>
      </div>
    </div>
  );
}