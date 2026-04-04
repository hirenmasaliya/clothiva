"use client";
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Eye, 
  Clock, 
  MoreHorizontal,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const INITIAL_ORDERS = [
  { id: "ORD-7742", customer: "Priya Sharma", date: "Apr 04, 2026", items: 1, total: 6800, payment: "Paid", status: "Processing" },
  { id: "ORD-7741", customer: "Anjali Patel", date: "Apr 03, 2026", items: 2, total: 4200, payment: "Paid", status: "Shipped" },
  { id: "ORD-7740", customer: "Suresh Mehra", date: "Apr 03, 2026", items: 1, total: 18500, payment: "Pending", status: "Awaiting Payment" },
  { id: "ORD-7739", customer: "Megha Rao", date: "Apr 02, 2026", items: 1, total: 5500, payment: "Paid", status: "Delivered" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPayment, setFilterPayment] = useState('All');

  // --- 1. SEARCH & FILTER LOGIC ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPayment = filterPayment === 'All' || order.payment === filterPayment;

      return matchesSearch && matchesPayment;
    });
  }, [searchTerm, filterPayment, orders]);

  // --- 2. UPDATE STATUS FUNCTION ---
  const updateStatus = (id: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
    // In a real app, you'd trigger a Firebase update here:
    // update(ref(db, `orders/${id}`), { status: newStatus });
  };

  // --- 3. CSV EXPORT LOGIC ---
  const exportOrders = () => {
    const headers = "Order ID,Customer,Date,Total,Status\n";
    const rows = filteredOrders.map(o => `${o.id},${o.customer},${o.date},${o.total},${o.status}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Clothiva_Orders_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif text-stone-900 tracking-tight underline decoration-red-900/20 underline-offset-8">
            Order <span className="italic font-light text-stone-500">Fulfillment</span>
          </h1>
          <p className="text-stone-500 text-[10px] mt-4 uppercase tracking-[0.2em] font-bold">
            Live Overview: {filteredOrders.length} Results Found
          </p>
        </div>
        <button 
          onClick={exportOrders}
          className="flex items-center gap-2 px-6 py-3 border border-stone-200 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-stone-900 hover:text-white transition-all active:scale-95"
        >
          <Download size={16} /> Export Data
        </button>
      </div>

      {/* --- FILTER & SEARCH BAR --- */}
      <div className="bg-white p-4 border border-stone-200 rounded-2xl flex flex-col lg:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
          <input 
            type="text" 
            placeholder="Search customer or Order ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-stone-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-red-900/10 transition-all placeholder:text-stone-300"
          />
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <div className="flex bg-stone-50 p-1 rounded-xl border border-stone-100">
            {['All', 'Paid', 'Pending'].map((status) => (
              <button 
                key={status}
                onClick={() => setFilterPayment(status)}
                className={`px-5 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${
                  filterPayment === status ? 'bg-white text-red-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- ORDERS TABLE --- */}
      <div className="bg-white border border-stone-200 rounded-3xl shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50/50 border-b border-stone-100 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
              <tr>
                <th className="px-8 py-5">Order Reference</th>
                <th className="px-8 py-5">Placement Date</th>
                <th className="px-8 py-5">Recipient</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Lifecycle</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-stone-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <span className="font-mono text-xs font-bold text-stone-900">{order.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-stone-500 text-xs font-light italic">
                      <Clock size={12} /> {order.date}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-stone-900">{order.customer}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${order.payment === 'Paid' ? 'bg-green-500' : 'bg-orange-400 animate-pulse'}`}></div>
                      <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">{order.payment}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-serif font-bold text-stone-900">₹{order.total.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`text-[9px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg border-none outline-none cursor-pointer shadow-sm transition-all ${
                        order.status === 'Delivered' ? 'bg-stone-900 text-white' :
                        order.status === 'Shipped' ? 'bg-orange-500 text-white' :
                        order.status === 'Processing' ? 'bg-blue-600 text-white' :
                        'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <option value="Awaiting Payment">Awaiting Payment</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2.5 bg-white border border-stone-100 rounded-xl text-stone-400 hover:text-red-900 hover:shadow-md transition-all">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center text-stone-300">
                      <XCircle size={48} strokeWidth={1} className="mb-4" />
                      <p className="text-sm italic font-light">No records match your current filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}