"use client";
import React, { useState } from 'react';
import { 
  Store, 
  Truck, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  Save, 
  Globe, 
  Mail,
  Smartphone,
  Lock
} from 'lucide-react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');

  const menuItems = [
    { id: 'general', label: 'Store Profile', icon: <Store size={18} /> },
    { id: 'shipping', label: 'Shipping & Delivery', icon: <Truck size={18} /> },
    { id: 'payments', label: 'Payment Gateways', icon: <CreditCard size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div className="space-y-10 pb-20 max-w-6xl">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif text-stone-900 tracking-tight">Store <span className="italic font-light text-stone-500">Settings</span></h1>
          <p className="text-stone-500 text-[10px] mt-2 uppercase tracking-[0.2em] font-bold">Global Configuration for Clothiva</p>
        </div>
        <button className="bg-stone-900 text-white px-10 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-2 hover:bg-red-900 transition-all shadow-xl active:scale-95">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* --- LEFT NAVIGATION --- */}
        <aside className="lg:col-span-4">
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm p-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-medium transition-all ${
                  activeSection === item.id 
                  ? 'bg-red-50 text-red-900 shadow-inner' 
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <span className={activeSection === item.id ? 'text-red-900' : 'text-stone-300'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* --- RIGHT CONTENT PANEL --- */}
        <div className="lg:col-span-8">
          {activeSection === 'general' && <GeneralSettings />}
          {activeSection === 'shipping' && <ShippingSettings />}
          {activeSection === 'payments' && <PaymentSettings />}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function GeneralSettings() {
  return (
    <section className="bg-white border border-stone-200 rounded-3xl p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="border-b border-stone-100 pb-6 flex items-center gap-3 text-red-900">
        <Globe size={20} strokeWidth={1.5} />
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900">General Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Store Name</label>
          <input type="text" defaultValue="Clothiva (J K Creation)" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:bg-white focus:ring-4 ring-red-900/5 transition-all text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Support Email</label>
          <input type="email" defaultValue="care@clothiva.com" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:bg-white focus:ring-4 ring-red-900/5 transition-all text-sm" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Physical Address (Jetpur Store)</label>
          <textarea rows={3} defaultValue="Near Jayram Textile, Jetpur, Gujarat 360370" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:bg-white focus:ring-4 ring-red-900/5 transition-all text-sm resize-none" />
        </div>
      </div>
    </section>
  );
}

function ShippingSettings() {
  return (
    <section className="bg-white border border-stone-200 rounded-3xl p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="border-b border-stone-100 pb-6 flex items-center gap-3 text-red-900">
        <Truck size={20} strokeWidth={1.5} />
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900">Logistics & Zones</h3>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-6 bg-stone-50 rounded-2xl border border-stone-100">
          <div>
            <p className="text-sm font-bold text-stone-900 uppercase tracking-tighter">Standard Pan-India Shipping</p>
            <p className="text-xs text-stone-500 font-light">3-7 Business Days delivery window</p>
          </div>
          <span className="text-sm font-serif font-bold text-red-900">₹150.00</span>
        </div>
        <div className="flex items-center justify-between p-6 bg-stone-50 rounded-2xl border border-stone-100">
          <div>
            <p className="text-sm font-bold text-stone-900 uppercase tracking-tighter">Free Shipping Threshold</p>
            <p className="text-xs text-stone-500 font-light">Minimum order value for free delivery</p>
          </div>
          <span className="text-sm font-serif font-bold text-red-900">₹5,000.00</span>
        </div>
      </div>
    </section>
  );
}

function PaymentSettings() {
  return (
    <section className="bg-white border border-stone-200 rounded-3xl p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="border-b border-stone-100 pb-6 flex items-center gap-3 text-red-900">
        <Lock size={20} strokeWidth={1.5} />
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900">Secure Gateways</h3>
      </div>
      
      <div className="space-y-4">
        <div className="p-6 border border-stone-200 rounded-2xl flex items-center justify-between group hover:border-red-900/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold italic">R</div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-stone-900">Razorpay Integration</p>
              <p className="text-[10px] text-green-600 font-bold uppercase">Connected & Active</p>
            </div>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-red-900">Manage API</button>
        </div>
      </div>
    </section>
  );
}