"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { db } from '@/lib/firebase'; // Ensure your firebase config is imported
import { ref, onValue, update } from 'firebase/database';
import { 
  Search, 
  Eye, 
  Clock, 
  Download,
  XCircle,
  PackageCheck,
  RefreshCcw
} from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPayment, setFilterPayment] = useState('All');

  // --- 1. LIVE DATA FETCHING FROM FIREBASE ---
  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    
    // Listen for real-time changes
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert Firebase object to Array and sort by newest first
        const ordersList = Object.keys(data).map(key => ({
          ...data[key],
          firebaseId: key // Keep the unique key for updates
        })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setOrders(ordersList);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // --- 2. SEARCH & FILTER LOGIC ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const customerName = `${order.customer?.firstName} ${order.customer?.lastName}`.toLowerCase();
      const orderId = (order.paymentId || "").toLowerCase();
      
      const matchesSearch = 
        customerName.includes(searchTerm.toLowerCase()) ||
        orderId.includes(searchTerm.toLowerCase());
      
      // Checking status from your 'status' field (Paid/Confirmed)
      const matchesPayment = filterPayment === 'All' || order.status === filterPayment;

      return matchesSearch && matchesPayment;
    });
  }, [searchTerm, filterPayment, orders]);

  // --- 3. UPDATE STATUS IN FIREBASE ---
  const handleUpdateStatus = async (firebaseId: string, newStatus: string) => {
    try {
      const orderRef = ref(db, `orders/${firebaseId}`);
      await update(orderRef, { deliveryStatus: newStatus });
      // The onValue listener will automatically update the UI
    } catch (error) {
      alert("Failed to update status in the ledger.");
    }
  };

  // --- 4. CSV EXPORT ---
  const exportOrders = () => {
    const headers = "Order ID,Customer,Email,Total,Status,Date\n";
    const rows = filteredOrders.map(o => 
      `${o.paymentId},${o.customer?.firstName} ${o.customer?.lastName},${o.customer?.email},${o.amount},${o.deliveryStatus || 'Processing'},${o.createdAt}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Clothiva_Admin_Orders.csv`;
    a.click();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <RefreshCcw className="animate-spin text-stone-300" size={32} />
      <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Syncing with Atelier Ledger...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif text-stone-900 tracking-tight underline decoration-red-900/20 underline-offset-8">
            Order <span className="italic font-light text-stone-500">Fulfillment</span>
          </h1>
          <p className="text-stone-500 text-[10px] mt-4 uppercase tracking-[0.2em] font-bold">
            Live Records: {filteredOrders.length} Orders Found
          </p>
        </div>
        <button 
          onClick={exportOrders}
          className="flex items-center gap-2 px-6 py-3 border border-stone-200 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-stone-900 hover:text-white transition-all active:scale-95"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* --- FILTER & SEARCH --- */}
      <div className="bg-white p-4 border border-stone-200 rounded-2xl flex flex-col lg:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or Payment ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-stone-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-red-900/10 transition-all"
          />
        </div>
        <div className="flex bg-stone-50 p-1 rounded-xl border border-stone-100">
          {['All', 'Confirmed', 'Paid'].map((status) => (
            <button 
              key={status}
              onClick={() => setFilterPayment(status)}
              className={`px-5 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${
                filterPayment === status ? 'bg-white text-red-900 shadow-sm' : 'text-stone-400'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white border border-stone-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50/50 border-b border-stone-100 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
              <tr>
                <th className="px-8 py-5">Registry ID</th>
                <th className="px-8 py-5">Customer Details</th>
                <th className="px-8 py-5">Items</th>
                <th className="px-8 py-5">Investment</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.firebaseId} className="group hover:bg-stone-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <span className="font-mono text-[10px] font-bold text-stone-400">#{order.paymentId?.slice(-8).toUpperCase()}</span>
                    <p className="text-[10px] text-stone-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-stone-900">{order.customer?.firstName} {order.customer?.lastName}</p>
                    <p className="text-[10px] text-stone-400">{order.customer?.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex -space-x-2">
                      {order.items?.map((item: any, i: number) => (
                        <div key={i} className="w-8 h-10 rounded border border-white bg-stone-100 overflow-hidden shadow-sm" title={item.title}>
                          <img src={item.img || item.images[0]} className="w-full h-full object-cover" alt="" />
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="w-8 h-10 rounded bg-stone-900 text-white flex items-center justify-center text-[8px] font-bold">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-serif font-bold text-stone-900">
                    ₹{Number(order.amount || order.breakdown.total).toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={order.deliveryStatus || 'Processing'}
                      onChange={(e) => handleUpdateStatus(order.firebaseId, e.target.value)}
                      className={`text-[9px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg border-none outline-none cursor-pointer transition-all ${
                        order.deliveryStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.deliveryStatus === 'Shipped' ? 'bg-orange-100 text-orange-700' :
                        'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Dyeing">In Dyeing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-stone-400 hover:text-red-900 transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-stone-300 italic font-light">
                    <XCircle size={40} className="mx-auto mb-4 opacity-20" />
                    No orders found in the ledger.
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