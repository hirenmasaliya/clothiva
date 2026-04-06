import Navbar from "@/components/Navbar";
import { Truck, RotateCcw, ShieldCheck, Ruler } from 'lucide-react';

export default function ProductDetail() {
  return (
    <main className="bg-white min-h-screen pt-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="grid grid-cols-2 gap-4 h-fit">
          <div className="col-span-2 aspect-3/4 bg-stone-100">
             <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-square bg-stone-100 border border-stone-200 cursor-pointer overflow-hidden">
             <img src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=400" className="w-full h-full object-cover hover:scale-110 transition-transform" />
          </div>
          <div className="aspect-square bg-stone-100 border border-stone-200 cursor-pointer overflow-hidden">
             <img src="https://images.unsplash.com/photo-1610030469668-935142b96de4?q=80&w=400" className="w-full h-full object-cover hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Product Info */}
        <div className="sticky top-32 h-fit">
          <span className="text-red-800 text-xs font-bold uppercase tracking-widest">Heritage Collection</span>
          <h1 className="text-4xl font-serif text-stone-900 mt-2 mb-4 text-balance">Hand-Knotted Royal Blue Gaji Silk Dress Material</h1>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-light text-stone-900">₹8,450.00</span>
            <span className="text-stone-400 line-through">₹11,000.00</span>
            <span className="bg-red-50 text-red-800 text-[10px] px-2 py-1 font-bold">23% OFF</span>
          </div>

          <p className="text-stone-600 leading-relaxed mb-8">
            This masterpiece features authentic 'Rai Bandhej' knots on premium Gaji Silk. 
            The intricate pattern takes 15 days of manual labor by our local Jetpur artisans. 
            Includes top, bottom, and a grand 2.5m dupatta.
          </p>

          <div className="space-y-4 mb-10">
            <button className="w-full bg-red-900 text-white py-5 text-sm uppercase tracking-[0.2em] font-bold hover:bg-stone-900 transition-colors">
              Add to Shopping Bag
            </button>
            <button className="w-full border border-stone-200 py-5 text-sm uppercase tracking-[0.2em] font-bold hover:bg-stone-50 transition-colors">
              Wishlist Item
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-y-6 pt-8 border-t border-stone-100">
            <div className="flex items-center gap-3 text-xs text-stone-500 uppercase tracking-wider">
              <Truck size={18} className="text-red-900" /> Free Pan-India Shipping
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-500 uppercase tracking-wider">
              <RotateCcw size={18} className="text-red-900" /> 7-Day Easy Exchange
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-500 uppercase tracking-wider">
              <ShieldCheck size={18} className="text-red-900" /> 100% Pure Fabric
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-500 uppercase tracking-wider">
              <Ruler size={18} className="text-red-900" /> Custom Stitching Available
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}