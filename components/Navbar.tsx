"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Menu, X, Search, ChevronRight, ShieldCheck, ArrowUpRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Primary links stay in the bar. Policy pages move to the drawer / footer area.
const PRIMARY_LINKS = [
  { name: "Collections", href: "/shop" },
  { name: "Bulk orders", href: "/bulk-orders" },
  { name: "Our story", href: "/story" },
];
const POLICY_LINKS = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
];
// Edit these to match your real catalogue.
const POPULAR_SEARCHES = ["Bandhani saree", "Dupatta", "Dress material", "Silk", "Cotton"];

const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-900";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const drawerCloseRef = useRef<HTMLButtonElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);

  const isHomePage = pathname === "/";
  const isAdmin = pathname?.startsWith("/admin");
  const cartCount = (cart ?? []).reduce(
    (n: number, item: { quantity?: number }) => n + (item?.quantity ?? 1),
    0,
  );

  // Shrink / solidify on scroll (passive listener, runs once on mount too)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close any overlay when the route changes
  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Lock page scroll while an overlay is open
  useEffect(() => {
    const locked = isOpen || isSearchOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isSearchOpen]);

  // Escape closes overlays
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isSearchOpen) closeSearch();
      if (isOpen) closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isSearchOpen]);

  // Move focus into overlays when they open
  useEffect(() => {
    if (isSearchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [isSearchOpen]);
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => drawerCloseRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    searchButtonRef.current?.focus();
  }, []);
  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const runSearch = (term: string) => {
    const q = term.trim();
    if (!q) return;
    setIsSearchOpen(false);
    setQuery("");
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  if (isAdmin) return null;

  const isSolid = isScrolled || !isHomePage || isOpen;
  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  const barClasses = isSolid
    ? "bg-white/90 backdrop-blur-xl border-b border-stone-200/70 py-3 shadow-sm"
    : "bg-linear-to-b from-black/40 to-transparent py-6";
  const ink = isSolid ? "text-stone-900" : "text-white";
  const logoInk = isSolid ? "text-red-900" : "text-white";
  const subInk = isSolid ? "text-stone-500" : "text-white/75";

  const desktopLink = (link: { name: string; href: string }) => {
    const active = isActive(link.href);
    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={`relative py-2 text-sm font-medium tracking-wide transition-colors hover:text-red-900 ${ink} ${FOCUS}
          after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:bg-current
          after:transition-transform after:duration-300 ${
            active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
          }`}
      >
        {link.name}
      </Link>
    );
  };

  const iconBtn = `grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-black/5 hover:text-red-900 ${ink} ${FOCUS}`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-100 px-4 transition-[padding,background-color,box-shadow] duration-500 ${EASE} md:px-10 ${barClasses}`}
      >
        <nav
          aria-label="Main"
          className="mx-auto grid max-w-400 grid-cols-[1fr_auto_1fr] items-center gap-4"
        >
          {/* LEFT: menu button (mobile) / primary links (desktop) */}
          <div className="flex items-center">
            <button
              ref={menuButtonRef}
              type="button"
              className={`${iconBtn} -ml-2 lg:hidden`}
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              aria-expanded={isOpen}
              aria-controls="mobile-drawer"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
            <div className="hidden items-center gap-9 lg:flex">
              {PRIMARY_LINKS.map(desktopLink)}
            </div>
          </div>

          {/* CENTER: logo */}
          <Link href="/" aria-label="Clothiva, Jetpur Heritage – home" className={`flex flex-col items-center ${FOCUS}`}>
            <span
              className={`font-serif tracking-tight leading-none transition-all duration-500 ${logoInk} ${
                isSolid ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
              }`}
            >
              CLOTHIVA
            </span>
            <span
              className={`mt-1 text-[10px] font-semibold tracking-[0.3em] transition-all duration-500 ${subInk} ${
                isSolid ? "hidden md:block" : "block"
              }`}
            >
              JETPUR HERITAGE
            </span>
          </Link>

          {/* RIGHT: search + cart */}
          <div className="flex items-center justify-end gap-1">
            <button
              ref={searchButtonRef}
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className={`${iconBtn} lg:hidden`}
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            {/* Desktop: visible search affordance instead of a bare icon */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className={`hidden h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors hover:border-red-900 hover:text-red-900 lg:flex ${FOCUS} ${
                isSolid ? "border-stone-300 text-stone-500" : "border-white/40 text-white/85"
              }`}
              aria-label="Search"
            >
              <Search size={16} strokeWidth={1.5} />
              <span>Search</span>
            </button>

            <Link href="/cart" className={`${iconBtn} relative`} aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}>
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-red-900 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>

      {/* SEARCH OVERLAY */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search Clothiva"
        aria-hidden={!isSearchOpen}
        inert={!isSearchOpen}
        className={`fixed inset-0 z-200 flex flex-col bg-white px-6 transition-transform duration-500 ${EASE} motion-reduce:transition-none ${
          isSearchOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex justify-end pt-6 md:pt-10">
          <button
            type="button"
            onClick={closeSearch}
            className={`grid h-12 w-12 place-items-center rounded-full bg-stone-100 text-stone-600 transition-colors hover:text-red-900 ${FOCUS}`}
            aria-label="Close search"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mx-auto mt-[12vh] w-full max-w-3xl">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              runSearch(query);
            }}
          >
            <label htmlFor="site-search" className="mb-4 block text-sm text-stone-500">
              Search sarees, dupattas and fabrics
            </label>
            <div className="flex items-center gap-3 border-b-2 border-stone-200 transition-colors focus-within:border-red-900">
              <Search size={24} strokeWidth={1.5} className="shrink-0 text-stone-400" />
              <input
                id="site-search"
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try “red bandhani saree”"
                autoComplete="off"
                enterKeyHint="search"
                className="w-full bg-transparent py-5 font-serif text-2xl text-stone-900 outline-none placeholder:text-stone-300 md:text-4xl"
              />
              <button
                type="submit"
                disabled={!query.trim()}
                className={`shrink-0 rounded-full bg-red-900 px-6 py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-30 ${FOCUS}`}
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-10">
            <p className="mb-4 text-sm text-stone-500">Popular searches</p>
            <ul className="flex flex-wrap gap-3">
              {POPULAR_SEARCHES.map((term) => (
                <li key={term}>
                  <button
                    type="button"
                    onClick={() => runSearch(term)}
                    className={`rounded-full border border-stone-200 px-5 py-2.5 text-sm text-stone-700 transition-colors hover:border-red-900 hover:text-red-900 ${FOCUS}`}
                  >
                    {term}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed inset-0 z-300 ${isOpen ? "visible" : "invisible delay-500"}`}
      >
        <div
          className={`absolute inset-0 bg-stone-950/50 backdrop-blur-sm transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeDrawer}
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-white px-8 py-8 transition-transform duration-500 ${EASE} motion-reduce:transition-none ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-10 flex items-start justify-between">
            <div>
              <p className="font-serif text-3xl leading-none tracking-tight text-red-900">CLOTHIVA</p>
              <p className="mt-1.5 text-[10px] font-semibold tracking-[0.3em] text-stone-500">JETPUR HERITAGE</p>
            </div>
            <button
              ref={drawerCloseRef}
              type="button"
              onClick={closeDrawer}
              className={`grid h-11 w-11 place-items-center rounded-full bg-stone-100 text-stone-600 ${FOCUS}`}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <ul className="flex flex-col">
            {PRIMARY_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center justify-between border-b border-stone-100 py-5 ${FOCUS}`}
                  >
                    <span
                      className={`font-serif text-3xl transition-colors group-hover:text-red-900 ${
                        active ? "text-red-900" : "text-stone-900"
                      }`}
                    >
                      {link.name}
                    </span>
                    <ChevronRight size={20} className="text-stone-300 transition-colors group-hover:text-red-900" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <ul className="mt-6 flex gap-6">
            {POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`text-sm text-stone-500 underline-offset-4 hover:text-red-900 hover:underline ${FOCUS}`}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-5 pt-10">
            <Link
              href="/cart"
              className={`flex items-center justify-between rounded-2xl bg-red-900 px-6 py-4 text-white ${FOCUS}`}
            >
              <span className="flex items-center gap-3 text-sm font-semibold">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 ? `View cart (${cartCount})` : "Your cart is empty"}
              </span>
              <ArrowUpRight size={18} />
            </Link>

            <div className="flex items-center gap-4 rounded-2xl bg-stone-50 p-5">
              <ShieldCheck className="shrink-0 text-red-900/60" size={24} strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold text-stone-900">Artisan guarantee</p>
                <p className="text-xs text-stone-500">Authentic Jetpur Bandhani</p>
              </div>
            </div>

            <p className="text-xs text-stone-400">© 2026 J K Creation</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;