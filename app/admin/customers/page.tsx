"use client";
import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Star,
  ShoppingBag
} from 'lucide-react';

const MOCK_CUSTOMERS = [
  { id: "CUS-001", name: "Priya Sharma", email: "priya.s@example.com", phone: "+91 98250 12345", location: "Mumbai", orders: 5, spent: 32400, status: "VIP" },
  { id: "CUS-002", name: "Anjali Patel", email: "anjali.p@gmail.com", phone: "+91 99040 54321", location: "Ahmedabad", orders: 2, spent: 8400, status: "Active" },
  { id: "CUS-003", name: "Suresh Mehra", email: "suresh.mehra@outlook.com", phone: "+91 98790 67890", location: "Delhi", orders: 1, spent: 18500, status: "New" },
  { id: "CUS-004", name: "Megha Rao", email: "megha.rao@yahoo.com", phone: "+91 94260 11223", location: "Bangalore", orders: 8, spent: 54200, status: "VIP" },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif text-stone-900 tracking-tight">Customer <span className="italic font-light text-stone-500">Directory</span></h1>
          <p className="text-stone-500 text-[10px] mt-2 uppercase tracking-[0.2em] font-bold">Managing {MOCK_CUSTOMERS.length} Registered Patrons</p>
        </div>
        <button className="bg-stone-900 text-white px-8 py-3 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-red-900 transition-all shadow-xl active:scale-95">
          <UserPlus size={16} /> Add Customer
        </button>
      </div>

      {/* --- FILTERS --- */}
      <div className="bg-white p-4 border border-stone-200 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-stone-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-red-900/10 transition-all"
          />
        </div>
        <select className="px-4 py-3 bg-stone-50 border-none rounded-xl text-xs font-bold uppercase tracking-widest text-stone-500 outline-none cursor-pointer">
          <option>All Segments</option>
          <option>VIP Patrons</option>
          <option>New Registered</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* --- CUSTOMER TABLE --- */}
      <div className="bg-white border border-stone-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50/50 border-b border-stone-100 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
              <tr>
                <th className="px-8 py-5">Customer Profile</th>
                <th className="px-8 py-5">Contact Details</th>
                <th className="px-8 py-5">Location</th>
                <th className="px-8 py-5">History</th>
                <th className="px-8 py-5">Segment</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {MOCK_CUSTOMERS.map((customer) => (
                <tr key={customer.id} className="group hover:bg-stone-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-900 font-serif font-bold italic border border-red-100">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">{customer.name}</p>
                        <p className="text-[9px] text-stone-400 font-mono">{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-stone-600">
                      <Mail size={12} className="text-stone-300" /> {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-600">
                      <Phone size={12} className="text-stone-300" /> {customer.phone}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs text-stone-600 uppercase tracking-tighter">
                      <MapPin size={12} className="text-red-900/30" /> {customer.location}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-serif font-bold text-stone-900">₹{customer.spent.toLocaleString()}</span>
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest flex items-center gap-1 font-bold">
                        <ShoppingBag size={10} /> {customer.orders} Orders
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                      customer.status === 'VIP' ? 'bg-red-900 text-white shadow-sm' : 
                      customer.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' : 
                      'bg-stone-100 text-stone-500'
                    }`}>
                      {customer.status === 'VIP' && <Star size={8} className="inline mr-1 fill-white" />}
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-stone-300 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION --- */}
        <div className="px-8 py-6 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Showing {MOCK_CUSTOMERS.length} Artisanal Supporters</p>
          <div className="flex gap-2">
            <button className="p-2 border border-stone-200 rounded-xl hover:bg-white disabled:opacity-30" disabled><ChevronLeft size={16}/></button>
            <button className="p-2 border border-stone-200 rounded-xl hover:bg-white"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}