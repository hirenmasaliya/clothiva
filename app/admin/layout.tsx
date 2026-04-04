"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Loader2,
  Bell,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const isLoginPage = pathname === "/admin/login";

      if (!currentUser) {
        if (!isLoginPage) {
          router.replace("/admin/login");
        }
        setLoading(false);
        return;
      }

      const envEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
      const allowedAdmins = envEmails
        .split(",")
        .map((email) => email.trim().toLowerCase());

      if (!allowedAdmins.includes(currentUser.email?.toLowerCase() || "")) {
        await signOut(auth);
        router.replace("/admin/login");
        setLoading(false);
        return;
      }

      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-red-900 mb-4" size={40} />
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">Authenticating...</p>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] text-stone-900 antialiased font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r border-stone-200 bg-white lg:flex z-50">
        <div className="flex h-24 items-center border-b border-stone-100 px-8">
          <Link href="/admin" className="flex flex-col group">
            <span className="font-serif text-2xl font-bold tracking-tighter text-red-900 uppercase leading-none transition-transform group-hover:scale-105">
              Clothiva
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-stone-400 mt-1">Admin Portal</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-10 space-y-2">
          {[
            { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
            { name: "Products", href: "/admin/products", icon: <Package size={18} strokeWidth={1.5} /> },
            { name: "Orders", href: "/admin/orders", icon: <ShoppingBag size={18} strokeWidth={1.5} /> },
            { name: "Customers", href: "/admin/customers", icon: <Users size={18} strokeWidth={1.5} /> },
            { name: "Settings", href: "/admin/settings", icon: <Settings size={18} strokeWidth={1.5} /> },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 ${
                pathname === item.href
                  ? "bg-red-900 text-white shadow-lg shadow-red-900/20 translate-x-2"
                  : "text-stone-500 hover:bg-stone-50 hover:text-red-900"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-stone-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 px-4 py-4 text-xs uppercase tracking-widest font-bold text-stone-400 hover:bg-red-50 hover:text-red-900 rounded-xl transition-colors group"
          >
            <LogOut size={18} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Header Bar */}
        <header className="sticky top-0 z-40 h-20 flex items-center justify-between px-10 border-b border-stone-100 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Internal <span className="text-stone-200">/</span> 
            <span className="text-stone-900 underline decoration-red-900/30 underline-offset-8 decoration-2">Control Center</span>
          </div>

          <div className="flex items-center gap-8">
            <button className="relative text-stone-400 hover:text-stone-900 transition-colors">
              <Bell size={20} strokeWidth={1.5} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-800 ring-2 ring-white"></span>
            </button>
            
            <div className="h-10 w-px bg-stone-100"></div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-stone-900 uppercase tracking-tighter leading-none mb-1">
                  {user?.displayName}
                </p>
                <p className="text-[9px] text-stone-400 uppercase tracking-widest font-medium">Super Admin</p>
              </div>
              <div className="h-11 w-11 rounded-full border-2 border-white shadow-md bg-red-900 flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                    <img src={user.photoURL} alt="pfp" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-white font-serif italic text-lg font-bold">H</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="p-10 max-w-400 mx-auto w-full">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}