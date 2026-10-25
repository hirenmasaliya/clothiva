"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { db } from '@/lib/firebase'; // Ensure your firebase config is imported
import { ref, onValue, update } from 'firebase/database';
import { 
  Search, 
  Eye,
  EyeOff,
  Download,
  XCircle,
  RefreshCcw,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPayment, setFilterPayment] = useState('All');
  
  // New state for expanding rows
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // --- 1. LIVE DATA FETCHING FROM FIREBASE ---
  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersList = Object.keys(data).map(key => ({
          ...data[key],
          firebaseId: key 
        })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setOrders(ordersList);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  // --- 2. SEARCH & FILTER LOGIC ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.toLowerCase();
      const orderId = (order.paymentId || "").toLowerCase();
      
      const matchesSearch = 
        customerName.includes(searchTerm.toLowerCase()) ||
        orderId.includes(searchTerm.toLowerCase());
      
      const matchesPayment = filterPayment === 'All' || order.status === filterPayment;

      return matchesSearch && matchesPayment;
    });
  }, [searchTerm, filterPayment, orders]);

  // --- 3. UPDATE STATUS IN FIREBASE ---
  const handleUpdateStatus = async (firebaseId: string, newStatus: string) => {
    try {
      const orderRef = ref(db, `orders/${firebaseId}`);
      await update(orderRef, { deliveryStatus: newStatus });
    } catch (error) {
      alert("Failed to update status in the ledger.");
    }
  };

  // --- 4. CSV EXPORT ---
  const exportOrders = () => {
    const headers = "Order ID,Customer,Email,Total,Status,Date\n";
    const rows = filteredOrders.map(o => 
      `${o.paymentId},${o.customer?.firstName} ${o.customer?.lastName},${o.customer?.email},${o.amount || (o.breakdown && o.breakdown.total)},${o.deliveryStatus || 'Processing'},${o.createdAt}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Clothiva_Admin_Orders.csv`;
    a.click();
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-red-900/20 rounded-full blur-xl animate-pulse"></div>
        <RefreshCcw className="animate-spin text-stone-800 relative z-10" size={36} />
      </div>
      <p className="text-xs uppercase tracking-[0.3em] font-bold text-stone-500 animate-pulse">
        Syncing Atelier Ledger
      </p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-12">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-serif text-stone-900 tracking-tight">
            Order <span className="italic font-light text-stone-500">Fulfillment</span>
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-stone-500 text-[10px] uppercase tracking-[0.2em] font-bold">
              Live Records: {filteredOrders.length} Orders
            </p>
          </div>
        </div>
        <button 
          onClick={exportOrders}
          className="group flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-stone-800 hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
        >
          <Download size={16} className="group-hover:animate-bounce" /> 
          Export CSV
        </button>
      </div>

      {/* --- FILTER & SEARCH --- */}
      <div className="bg-white p-2 border border-stone-200 rounded-2xl flex flex-col lg:flex-row gap-2 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by customer name or Registry ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-transparent border-none text-sm outline-none placeholder:text-stone-400 focus:ring-0 transition-all text-stone-800 font-medium"
          />
        </div>
        <div className="flex bg-stone-100/50 p-1.5 rounded-xl border border-stone-100 w-full lg:w-auto overflow-x-auto">
          {['All', 'Confirmed', 'Paid'].map((status) => (
            <button 
              key={status}
              onClick={() => setFilterPayment(status)}
              className={`flex-1 lg:flex-none px-6 py-2.5 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all whitespace-nowrap ${
                filterPayment === status 
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200' 
                : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
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
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50/80 border-b border-stone-100 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Registry ID</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Items</th>
                <th className="px-6 py-5">Investment</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <React.Fragment key={order.firebaseId}>
                  {/* MAIN ROW */}
                  <tr className={`group transition-colors hover:bg-stone-50/50 ${expandedOrderId === order.firebaseId ? 'bg-stone-50/50' : ''}`}>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-stone-600 bg-stone-100 px-2 py-1 rounded-md">
                        #{order.paymentId?.slice(-8).toUpperCase()}
                      </span>
                      <p className="text-[10px] text-stone-400 mt-2 uppercase tracking-wider font-semibold">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-stone-900">{order.customer?.firstName} {order.customer?.lastName}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">{order.customer?.email}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex -space-x-2">
                        {order.items?.slice(0, 3).map((item: any, i: number) => (
                          <div key={i} className="w-9 h-11 rounded-md border-2 border-white bg-stone-100 overflow-hidden shadow-sm" title={item.title}>
                            <img src={item.img || item.images?.[0] || '/api/placeholder/40/40'} className="w-full h-full object-cover hover:scale-110 transition-transform" alt="item" />
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="w-9 h-11 rounded-md border-2 border-white bg-stone-800 text-white flex items-center justify-center text-[10px] font-bold z-10 shadow-sm">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-serif font-bold text-stone-900 whitespace-nowrap">
                      ₹{Number(order.amount || (order.breakdown && order.breakdown.total) || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-5">
                      <select 
                        value={order.deliveryStatus || 'Processing'}
                        onChange={(e) => handleUpdateStatus(order.firebaseId, e.target.value)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg border focus:ring-2 focus:ring-offset-1 focus:outline-none cursor-pointer transition-all ${
                          order.deliveryStatus === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200 focus:ring-green-500' :
                          order.deliveryStatus === 'Shipped' ? 'bg-orange-50 text-orange-700 border-orange-200 focus:ring-orange-500' :
                          order.deliveryStatus === 'Dyeing' ? 'bg-purple-50 text-purple-700 border-purple-200 focus:ring-purple-500' :
                          'bg-stone-100 text-stone-600 border-stone-200 focus:ring-stone-400'
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Dyeing">In Dyeing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => toggleExpand(order.firebaseId)}
                        className={`p-2 rounded-full transition-all ${expandedOrderId === order.firebaseId ? 'bg-stone-900 text-white shadow-md' : 'text-stone-400 hover:text-stone-900 hover:bg-stone-100'}`}
                        aria-label="View Details"
                      >
                        {expandedOrderId === order.firebaseId ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </td>
                  </tr>

                  {/* EXPANDED DETAILS ROW */}
                  {expandedOrderId === order.firebaseId && (
                    <tr className="bg-stone-50/50 border-b-2 border-stone-200">
                      <td colSpan={6} className="px-6 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
                          
                          {/* Shipping Details */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-2">Shipping Information</h3>
                            <div className="space-y-3 text-sm text-stone-600">
                              <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-stone-400 mt-0.5" />
                                <div>
                                  <p className="font-medium text-stone-900">{order.customer?.firstName} {order.customer?.lastName}</p>
                                  <p>{order.customer?.address || 'No address provided'}</p>
                                  <p>{order.customer?.city}, {order.customer?.state} {order.customer?.zipcode}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Mail size={16} className="text-stone-400" />
                                <p>{order.customer?.email}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Phone size={16} className="text-stone-400" />
                                <p>{order.customer?.phone || 'N/A'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Order Items Breakdown */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-2">Item Breakdown</h3>
                            <div className="max-h-48 overflow-y-auto pr-2 space-y-3">
                              {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 bg-white p-2 rounded-xl border border-stone-100 shadow-sm">
                                  <div className="w-12 h-16 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                                    <img src={item.img || item.images?.[0] || '/api/placeholder/48/64'} className="w-full h-full object-cover" alt={item.title} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-stone-900 truncate">{item.title}</p>
                                    <p className="text-[10px] text-stone-500 uppercase tracking-wider mt-1">Qty: {item.quantity || 1} • Size: {item.size || 'OS'}</p>
                                  </div>
                                  <div className="text-sm font-serif font-bold text-stone-900">
                                    ₹{Number(item.price).toLocaleString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )) : (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-50 mb-4">
                      <XCircle size={32} className="text-stone-300" />
                    </div>
                    <h3 className="text-lg font-serif text-stone-900 mb-1">No Orders Found</h3>
                    <p className="text-sm text-stone-500">Try adjusting your search or filters.</p>
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