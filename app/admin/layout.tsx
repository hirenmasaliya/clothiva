"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, Loader2, Menu, X, ExternalLink,
} from "lucide-react";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800";

const NAV = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

// SECURITY NOTE: NEXT_PUBLIC_ variables are visible to anyone, and this check runs in the browser.
// It only controls what the interface shows. Protect your data with Firebase security rules
// (and server-side checks) that also verify the signed-in admin.
const ALLOWED_ADMINS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean); // an empty setting must never match anyone

const isActive = (href: string, pathname: string) =>
  href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);

const pageTitle = (pathname: string) => {
  const match = NAV.find((n) => isActive(n.href, pathname));
  if (match) return match.name;
  const last = pathname.split("/").filter(Boolean).pop() || "Admin";
  return last.charAt(0).toUpperCase() + last.slice(1);
};

/* ---------------- Sidebar content (shared by desktop + mobile drawer) ---------------- */
interface SidebarProps {
  pathname: string;
  user: User;
  onLogout: () => void;
  onNavigate?: () => void;
}

const SidebarContent = ({ pathname, user, onLogout, onNavigate }: SidebarProps) => (
  <div className="flex h-full flex-col">
    <div className="flex h-20 shrink-0 items-center border-b border-stone-100 px-6">
      <Link href="/admin" onClick={onNavigate} className={`flex flex-col ${FOCUS}`}>
        <span className="font-serif text-2xl font-bold leading-none tracking-tight text-red-900">CLOTHIVA</span>
        <span className="mt-1 text-xs text-stone-500">Admin portal</span>
      </Link>
    </div>

    <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-6">
      <ul className="space-y-1">
        {NAV.map(({ name, href, icon: Icon }) => {
          const active = isActive(href, pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm font-medium transition-colors ${FOCUS} ${
                  active ? "bg-red-900 text-white" : "text-stone-600 hover:bg-stone-100 hover:text-red-900"
                }`}
              >
                <Icon size={18} strokeWidth={1.75} />
                {name}
              </Link>
            </li>
          );
        })}
      </ul>

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-6 flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-red-900 ${FOCUS}`}
      >
        <ExternalLink size={18} strokeWidth={1.75} />
        View store
      </a>
    </nav>

    <div className="shrink-0 border-t border-stone-100 p-4">
      <p className="truncate px-4 pb-2 text-xs text-stone-500" title={user.email ?? undefined}>{user.email}</p>
      <button
        type="button"
        onClick={onLogout}
        className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-4 text-sm font-medium text-stone-600 transition-colors hover:bg-red-50 hover:text-red-900 ${FOCUS}`}
      >
        <LogOut size={18} strokeWidth={1.75} />
        Log out
      </button>
    </div>
  </div>
);

/* ---------------- Full-screen status ---------------- */
const Status = ({ text }: { text: string }) => (
  <div role="status" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50">
    <Loader2 className="animate-spin text-red-900 motion-reduce:animate-none" size={36} />
    <p className="text-sm text-stone-600">{text}</p>
  </div>
);

/* ---------------- Layout ---------------- */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [denied, setDenied] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname() || "/admin";
  const isLoginPage = pathname === "/admin/login";

  const menuRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // 1. Subscribe to auth once
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setAuthReady(true);
        return;
      }
      const email = currentUser.email?.toLowerCase();
      if (!email || !ALLOWED_ADMINS.includes(email)) {
        await signOut(auth);
        setUser(null);
        setDenied(true);
        setAuthReady(true);
        return;
      }
      setDenied(false);
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // 2. Redirect based on auth state and current page (always uses the latest pathname)
  useEffect(() => {
    if (!authReady) return;
    if (!user && !isLoginPage) router.replace(denied ? "/admin/login?error=unauthorized" : "/admin/login");
    if (user && isLoginPage) router.replace("/admin");
  }, [authReady, user, isLoginPage, denied, router]);

  // Close the drawer on navigation
  useEffect(() => setDrawerOpen(false), [pathname]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    menuRef.current?.focus();
  }, []);

  // Drawer: Escape to close, lock scroll, focus the close button
  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen, closeDrawer]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/admin/login");
  };

  if (!authReady) return <Status text="Checking your access…" />;
  if (isLoginPage && !user) return <>{children}</>;
  if (!user) return <Status text="Redirecting to sign in…" />;
  if (isLoginPage) return <Status text="Opening your dashboard…" />;

  const displayName = user.displayName || user.email || "Admin";
  const initial = displayName.trim().charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] font-sans text-stone-900 antialiased">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg"
      >
        Skip to content
      </a>

      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-stone-200 bg-white lg:block">
        <SidebarContent pathname={pathname} user={user} onLogout={handleLogout} />
      </aside>

      {/* MOBILE DRAWER */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Admin menu"
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
        className={`fixed inset-0 z-[60] lg:hidden ${drawerOpen ? "visible" : "invisible delay-300"}`}
      >
        <div
          onClick={closeDrawer}
          className={`absolute inset-0 bg-stone-950/50 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white shadow-2xl transition-transform duration-300 motion-reduce:transition-none ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Close menu"
            className={`absolute right-3 top-5 grid h-10 w-10 place-items-center rounded-full bg-stone-100 text-stone-700 ${FOCUS}`}
          >
            <X size={18} />
          </button>
          <SidebarContent pathname={pathname} user={user} onLogout={handleLogout} onNavigate={() => setDrawerOpen(false)} />
        </div>
      </div>

      {/* MAIN */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-stone-200 bg-white/85 px-4 backdrop-blur-md md:h-20 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              ref={menuRef}
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-stone-700 hover:bg-stone-100 lg:hidden ${FOCUS}`}
            >
              <Menu size={22} />
            </button>
            <h1 className="truncate font-serif text-xl text-stone-900 md:text-2xl">{pageTitle(pathname)}</h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden h-10 items-center gap-2 rounded-full border border-stone-300 px-4 text-sm font-medium text-stone-700 hover:border-red-800 hover:text-red-800 sm:inline-flex ${FOCUS}`}
            >
              View store <ExternalLink size={14} />
            </a>
            <div className="hidden text-right md:block">
              <p className="max-w-48 truncate text-sm font-semibold leading-tight text-stone-900">{displayName}</p>
              <p className="text-xs text-stone-500">Admin</p>
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-red-900 font-serif text-lg font-bold text-white">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
              ) : (
                initial
              )}
            </div>
          </div>
        </header>

        <main id="admin-main" tabIndex={-1} className="mx-auto w-full max-w-400 p-4 outline-none md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}