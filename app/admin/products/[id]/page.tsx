"use client";
import React, { useState, useEffect, use } from 'react'; // Import 'use' for params
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { 
  Save, ChevronRight, Type, IndianRupee, 
  Image as ImageIcon, Trash2, Eye, 
  Loader2, CheckCircle2 
} from 'lucide-react';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Unwrap the params using React.use()
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: 'Gaji Silk (Premium)'
  });

  // 2. Fetch Existing Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        setFormData(data);
        setImageUrls(data.images || []);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, images: imageUrls }),
      });
      if (res.ok) {
        router.push('/admin/products');
        router.refresh(); // Refresh data on inventory page
      }
    } catch (err) {
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-stone-50">
      <Loader2 className="animate-spin text-red-900" size={32} />
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-[1400px] mx-auto animate-in fade-in duration-700 p-6">
      
      {/* --- STICKY HEADER --- */}
      <div className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md py-4 -mx-6 px-6 border-b border-stone-200/50 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
              <Link href="/admin/products" className="hover:text-red-900 transition-colors">Inventory</Link>
              <ChevronRight size={12} />
              <span className="text-stone-900 uppercase">Edit Masterpiece</span>
            </nav>
            <h1 className="text-3xl font-serif text-stone-900 tracking-tight">
              Update <span className="italic font-light text-stone-500">{formData.title || "Creation"}</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link href={`/shop/${productId}`} target="_blank" className="p-3 text-stone-400 hover:text-red-900 transition-all">
              <Eye size={20} strokeWidth={1.5} />
            </Link>
            <div className="h-8 w-[1px] bg-stone-200 mx-2"></div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-stone-900 text-white px-10 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-2 hover:bg-red-900 transition-all shadow-xl disabled:opacity-50 active:scale-95"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white border border-stone-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-stone-100 bg-stone-50/50 flex items-center gap-3">
              <Type size={18} className="text-red-900" />
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900">Product Details</h3>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="group space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Product Title</label>
                <input 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text" 
                  className="w-full text-xl font-serif p-0 bg-transparent border-b border-stone-200 focus:border-red-900 outline-none transition-all pb-2 text-stone-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Artisan Story</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full p-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:bg-white focus:ring-4 ring-red-900/5 transition-all text-stone-600 leading-relaxed font-light italic"
                ></textarea>
              </div>
            </div>
          </section>

          <section className="bg-white border border-stone-200 rounded-[2.5rem] overflow-hidden shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Selling Price (₹)</label>
              <input 
                name="price"
                value={formData.price}
                onChange={handleChange}
                type="number" 
                className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:bg-white focus:border-red-900/30 transition-all text-sm font-bold" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Stock in Hand</label>
              <input 
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                type="number" 
                className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:bg-white focus:border-red-900/30 transition-all text-sm font-bold" 
              />
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white border border-stone-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-stone-100 bg-stone-50/50 flex items-center gap-3">
              <ImageIcon size={18} className="text-red-900" />
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900">Media Gallery</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {imageUrls.map((url, i) => (
                    <div key={i} className="aspect-[3/4] rounded-xl bg-stone-100 relative group overflow-hidden border border-stone-100 shadow-sm">
                        <img src={url} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              onClick={() => setImageUrls(prev => prev.filter(u => u !== url))}
                              className="p-2 bg-white rounded-full text-red-900 hover:scale-110 transition-transform shadow-lg"
                            >
                              <Trash2 size={14}/>
                            </button>
                        </div>
                    </div>
                ))}
              </div>
              
              <CldUploadWidget 
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(res: any) => setImageUrls(prev => [...prev, res.info.secure_url])}
              >
                {({ open }) => (
                  <button 
                    type="button"
                    onClick={() => open()}
                    className="w-full border-2 border-dashed border-stone-200 rounded-2xl p-6 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:border-red-900 hover:text-red-900 transition-all"
                  >
                    + Upload New View
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </section>

          <section className="bg-white border border-stone-200 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Fabric Classification</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none text-sm font-bold appearance-none"
              >
                <option>Gaji Silk (Premium)</option>
                <option>Cotton Bandhni</option>
                <option>Pure Georgette</option>
              </select>
            </div>
            <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-2xl border border-green-100">
               <CheckCircle2 size={16} />
               <p className="text-[10px] font-bold uppercase tracking-tight">Active on Storefront</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}