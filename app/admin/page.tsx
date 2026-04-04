"use client";
import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function AdminDashboard() {
  // Mock Data - Connect to Firebase 'orders' and 'products' later
  const stats = [
    { label: "Total Revenue", value: "₹4,82,450", change: "+12.5%", isUp: true, icon: <CreditCard className="text-blue-600" /> },
    { label: "Active Orders", value: "24", change: "+4", isUp: true, icon: <ShoppingBag className="text-red-900" /> },
    { label: "New Customers", value: "142", change: "+18%", isUp: true, icon: <Users className="text-indigo-600" /> },
    { label: "Conversion Rate", value: "3.2%", change: "-0.4%", isUp: false, icon: <TrendingUp className="text-green-600" /> },
  ];

  const recentOrders = [
    { id: "#ORD-7742", customer: "Priya Sharma", items: "Gaji Silk Suit", amount: "₹6,800", status: "Processing" },
    { id: "#ORD-7741", customer: "Anjali Patel", items: "Cotton Bandhni (x2)", amount: "₹4,200", status: "Shipped" },
    { id: "#ORD-7740", customer: "Suresh Mehra", items: "Bridal Masterpiece", amount: "₹18,500", status: "Delivered" },
  ];

  return (
    <div className="space-y-10">
      {/* --- WELCOME HEADER --- */}
      <div>
        <h1 className="text-3xl font-serif text-stone-900">Good Afternoon, Hiren</h1>
        <p className="text-stone-500 text-sm mt-1">Here is what is happening with Clothiva today.</p>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 border border-stone-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-stone-50 rounded-lg">{stat.icon}</div>
              <div className={`flex items-center text-xs font-bold ${stat.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} 
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
            <h3 className="text-2xl font-serif text-stone-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- RECENT ORDERS TABLE --- */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-stone-100 flex justify-between items-center">
            <h3 className="font-serif text-lg text-stone-900">Recent Orders</h3>
            <button className="text-xs font-bold text-red-900 uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-stone-50 text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map((order, i) => (
                  <tr key={i} className="text-sm hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-stone-500">{order.id}</td>
                    <td className="px-6 py-4 font-medium text-stone-900">{order.customer}</td>
                    <td className="px-6 py-4 text-stone-600">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'Processing' ? 'bg-blue-50 text-blue-700' :
                        order.status === 'Shipped' ? 'bg-orange-50 text-orange-700' :
                        'bg-green-50 text-green-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-stone-100 rounded transition-colors">
                        <ChevronRight size={18} className="text-stone-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- ACTIVITY LOG / QUICK ACTIONS --- */}
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-serif text-lg text-stone-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-red-900 text-white py-3 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-stone-900 transition-all">
                Add New Product
              </button>
              <button className="w-full border border-stone-200 text-stone-700 py-3 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-stone-50 transition-all">
                Generate Sales Report
              </button>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Clock size={18} className="text-red-900" />
              <h3 className="font-serif text-lg text-stone-900">System Logs</h3>
            </div>
            <div className="space-y-6">
              {[
                { time: "2 min ago", msg: "Inventory updated for Gaji Silk Maroon" },
                { time: "1 hr ago", msg: "New customer registered from Ahmedabad" },
                { time: "4 hrs ago", msg: "Payment failed for Order #7738" },
              ].map((log, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-[2px] bg-stone-100 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-stone-300"></div>
                  </div>
                  <div>
                    <p className="text-xs text-stone-900 font-medium">{log.msg}</p>
                    <p className="text-[10px] text-stone-400 uppercase mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}