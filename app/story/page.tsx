"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown, ArrowRight, Quote, History, Users, Sparkles, TrendingUp, Sun, ChevronDown,
} from "lucide-react";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-800";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */
const CHAPTERS = [
  { id: "beginning", label: "Beginning" },
  { id: "growth", label: "Growth" },
  { id: "craft", label: "The craft" },
  { id: "today", label: "Today" },
  { id: "vow", label: "Our vow" },
  { id: "questions", label: "Questions" },
];

const MILESTONES = [
  {
    icon: History,
    when: "1990s",
    title: "A single vat of crimson dye",
    text: "A small family workshop in Jetpur begins making hand-tied Bandhani, with two artisans and a commitment to genuine Gaji Silk.",
  },
  {
    icon: TrendingUp,
    when: "The quality pivot",
    title: "Finer threads, narrower knots",
    text: "As others automated, we increased our thread counts and narrowed our “Bhindi” (knots). This obsession made our Bandhani iconic.",
  },
  {
    icon: Users,
    when: "The artisan network",
    title: "50+ women artisans in Jetpur",
    text: "We built a network of artisans with flexible work-from-home models, long before it was a trend.",
  },
  {
    icon: Sun,
    when: "By 2015",
    title: "The silent power behind boutiques",
    text: "Our Bandhani suits were being sold in high-end boutiques from London to New York.",
  },
  {
    icon: Sparkles,
    when: "Today",
    title: "Clothiva",
    text: "The digital home of our legacy, bringing traditional craftsmanship to the modern wardrobe.",
  },
];

// Describes how Bandhani is traditionally made. Edit to match your own workshop.
const CRAFT_STEPS = [
  { title: "Marking the pattern", text: "The design is printed or marked onto the cloth as a guide for the knots." },
  { title: "Tying every knot", text: "Artisans pinch tiny points of fabric and bind each with thread. A single piece can take thousands of ties." },
  { title: "Dyeing in stages", text: "The cloth is dyed, usually from lighter to darker colours. Tied points resist the dye and stay as the pattern." },
  { title: "Drying in the sun", text: "The cloth is dried naturally under the Gujarat sun, which helps set the colour." },
  { title: "Opening the knots", text: "The threads are removed and the cloth is opened up, revealing the pattern of tiny dots." },
];

const STATS = [
  { value: "30+", label: "Years of legacy" },
  { value: "10k+", label: "Happy clients" },
  { value: "50+", label: "Artisans" },
];

const FAQS = [
  {
    q: "What is Bandhani?",
    a: "Bandhani is a tie-and-dye technique from Gujarat and Rajasthan. Small points of cloth are tied tightly with thread before dyeing, so the tied areas keep their original colour and form patterns of dots.",
  },
  {
    q: "How can I tell if a piece is hand-tied?",
    a: "Look closely at the dots. In hand-tied Bandhani they are slightly irregular and the fabric puckers where it was knotted. Printed imitations look perfectly uniform and flat.",
  },
  {
    q: "How should I care for my Bandhani?",
    a: "We recommend dry cleaning, especially for the first few washes. Keep it away from long direct sunlight and store it folded in a cotton cloth.",
  },
  {
    q: "Do you deliver outside Gujarat?",
    a: "Yes. We deliver across India and internationally. Delivery is free on orders of ₹3,000 or more within the order checkout.",
  },
  {
    q: "Can I place a bulk or custom order?",
    a: "Yes. Boutiques and families ordering in quantity can reach us through our bulk orders page.",
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function StoryPage() {
  const [progress, setProgress] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const [active, setActive] = useState<string>("");

  // Reading progress + show chapter nav once the hero is passed
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
      setShowNav(window.scrollY > window.innerHeight * 0.6);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Highlight the current chapter
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    CHAPTERS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FCFAF8] antialiased selection:bg-red-900 selection:text-white">
      {/* Reading progress */}
      <div aria-hidden className="fixed inset-x-0 top-0 z-110 h-0.5 bg-transparent">
        <div className="h-full bg-red-700 transition-[width] duration-150 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
      </div>

      {/* Chapter nav (desktop) */}
      <nav
        aria-label="Story chapters"
        className={`fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 rounded-full border border-stone-200 bg-white/90 p-1.5 shadow-lg backdrop-blur-md transition-all duration-300 md:block ${
          showNav ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ul className="flex items-center gap-1">
          {CHAPTERS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                tabIndex={showNav ? 0 : -1}
                className={`block rounded-full px-4 py-2 text-sm font-medium transition-colors ${FOCUS} ${
                  active === id ? "bg-red-900 text-white" : "text-stone-600 hover:text-red-900"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <section aria-labelledby="story-title" className="relative flex min-h-svh items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(43,10,10,0.78), rgba(20,10,10,0.45)), url('https://cdn.shopify.com/s/files/1/0513/2350/2743/files/Craft_Page_Bandhani_01.jpg?v=1708525343')`,
          }}
        />
        <div className="relative z-10 max-w-5xl px-6 pb-24 pt-32 text-center text-white motion-safe:animate-in motion-safe:fade-in motion-safe:duration-1000">
          <p className="mb-6 text-base font-medium text-red-200">The J K Creation story</p>
          <h1 id="story-title" className="mb-8 font-serif text-5xl leading-[1] tracking-tight sm:text-7xl md:text-8xl lg:text-[110px]">
            Legacy of <br />
            <span className="font-light italic text-stone-200">the first knot</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-light italic leading-relaxed text-stone-200 md:text-2xl">
            “Before it was a brand, it was a promise made in the dusty lanes of Jetpur.”
          </p>
          <a
            href="#beginning"
            className={`mt-14 inline-flex flex-col items-center gap-2 text-sm text-white/80 hover:text-white ${FOCUS}`}
          >
            Read our story
            <ArrowDown size={22} strokeWidth={1.25} />
          </a>
        </div>
      </section>

      {/* BEGINNING */}
      <section id="beginning" aria-labelledby="beginning-title" className="mx-auto grid max-w-7xl scroll-mt-24 items-center gap-12 px-6 py-20 md:py-32 lg:grid-cols-2 lg:gap-24">
        <div className="order-2 space-y-6 lg:order-1">
          <p className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-900">
            <History size={14} /> 1990s · The humble vat
          </p>
          <h2 id="beginning-title" className="font-serif text-4xl leading-tight tracking-tight text-stone-900 md:text-5xl">
            It started with a single <span className="italic text-stone-500">vat of crimson dye.</span>
          </h2>
          <div className="max-w-xl space-y-5 text-lg leading-relaxed text-stone-700">
            <p>
              J K Creation wasn’t born in a boardroom. It was born in a small family workshop in Jetpur, where our founder
              saw hand-tied Bandhani fading in favour of cheap screen prints.
            </p>
            <p>
              With two artisans and a commitment to <strong className="font-semibold text-stone-900">genuine Gaji Silk</strong>, we
              began making small batches of Bandhej for families who refused to compromise.
            </p>
          </div>
        </div>
        <figure className="order-1 lg:order-2">
          <img
            src="https://villagehaat.store/wp-content/uploads/2022/02/image.jpg.webp"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl grayscale"
            alt="Hand-tied Bandhani cloth with fine dotted patterns"
          />
        </figure>
      </section>

      {/* GROWTH TIMELINE */}
      <section id="growth" aria-labelledby="growth-title" className="mx-3 scroll-mt-24 rounded-[2rem] border border-stone-200/60 bg-stone-100/60 py-20 md:mx-4 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 id="growth-title" className="mb-14 text-center font-serif text-4xl tracking-tight text-stone-900 md:text-5xl">
            How we grew
          </h2>
          <ol className="relative space-y-10 border-l-2 border-red-900/20 pl-8 md:pl-12">
            {MILESTONES.map(({ icon: Icon, when, title, text }) => (
              <li key={title} className="relative">
                <span className="absolute -left-[2.9rem] top-0 grid h-10 w-10 place-items-center rounded-full border-2 border-red-900/20 bg-white text-red-900 md:-left-[4.1rem] md:h-12 md:w-12">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <p className="mb-1 text-sm font-semibold text-red-800">{when}</p>
                <h3 className="mb-2 font-serif text-2xl text-stone-900">{title}</h3>
                <p className="text-base leading-relaxed text-stone-700">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CRAFT */}
      <section id="craft" aria-labelledby="craft-title" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 md:py-32">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="space-y-6 lg:sticky lg:top-32 lg:col-span-5">
            <h2 id="craft-title" className="font-serif text-4xl leading-tight tracking-tight text-stone-900 md:text-5xl">
              How a piece of Bandhani is made
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-stone-700">
              Every piece moves through the same slow steps. There are no shortcuts, which is why each one is a little different.
            </p>
            <img
              src="https://cdn.shopify.com/s/files/1/0902/3202/files/Bandhani-process_large.jpg?v=1533699306"
              loading="lazy"
              alt="An artisan tying small knots into Bandhani cloth"
              className="hidden aspect-[4/3] w-full rounded-3xl object-cover shadow-lg lg:block"
            />
          </div>
          <ol className="space-y-4 lg:col-span-7">
            {CRAFT_STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-5 rounded-2xl border border-stone-200 bg-white p-6">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-900 font-serif text-lg text-white">{i + 1}</span>
                <div>
                  <h3 className="mb-1 font-serif text-xl text-stone-900">{s.title}</h3>
                  <p className="text-base leading-relaxed text-stone-700">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TODAY */}
      <section id="today" aria-labelledby="today-title" className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-20 md:pb-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="space-y-6">
            <Sparkles className="text-red-900" size={36} strokeWidth={1.5} />
            <h2 id="today-title" className="font-serif text-4xl leading-tight tracking-tight text-stone-900 md:text-5xl">
              From workshop <br /> to worldwide.
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-stone-700">
              <strong className="font-semibold text-stone-900">Clothiva</strong> is the digital heart of our legacy. We bridge the gap
              between traditional craftsmanship and the modern wardrobe.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link href="/shop" className={`inline-flex h-13 items-center justify-center gap-2 rounded-full bg-red-900 px-8 text-base font-semibold text-white hover:bg-red-800 ${FOCUS}`}>
                Shop the collection <ArrowRight size={18} />
              </Link>
              <Link href="/bulk-orders" className={`inline-flex h-13 items-center justify-center rounded-full border border-stone-300 px-8 text-base font-semibold text-stone-800 hover:border-red-800 hover:text-red-800 ${FOCUS}`}>
                Bulk orders
              </Link>
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-3 md:gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-stone-200 bg-white p-5 text-center md:p-8">
                <dd className="font-serif text-3xl text-red-900 md:text-5xl">{s.value}</dd>
                <dt className="mt-2 text-sm text-stone-600">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* VOW */}
      <section id="vow" aria-labelledby="vow-title" className="relative mx-3 scroll-mt-24 overflow-hidden rounded-[2rem] bg-[#1a1512] px-6 py-24 text-center text-white md:mx-4 md:py-36">
        <div aria-hidden className="absolute right-0 top-0 h-64 w-64 bg-red-900/15 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-4xl space-y-8">
          <Quote className="mx-auto text-red-400/40" size={52} strokeWidth={1} />
          <h2 id="vow-title" className="font-serif text-4xl font-light italic tracking-tight md:text-6xl">The J K vow</h2>
          <blockquote className="mx-auto max-w-3xl text-xl font-light italic leading-relaxed text-stone-300 md:text-2xl">
            “We will never replace the human hand with a machine. We will never replace Gaji Silk with synthetic polyester. We will
            never forget the Jetpur water that gave us our start.”
          </blockquote>
          <p className="text-base text-stone-400">Founded on faith, grown on quality</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="questions" aria-labelledby="faq-title" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-20 md:py-32">
        <h2 id="faq-title" className="mb-10 text-center font-serif text-4xl tracking-tight text-stone-900">
          Questions we often hear
        </h2>
        <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group">
              <summary className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-lg font-medium text-stone-900 marker:hidden hover:text-red-800 [&::-webkit-details-marker]:hidden ${FOCUS}`}>
                {q}
                <ChevronDown size={20} className="shrink-0 text-stone-500 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
              </summary>
              <p className="px-6 pb-6 text-base leading-relaxed text-stone-700">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="cta-title" className="px-6 pb-32 text-center md:pb-40">
        <div className="mx-auto max-w-2xl space-y-8">
          <h2 id="cta-title" className="font-serif text-3xl tracking-tight text-stone-900 md:text-5xl">
            Be a part of our next chapter.
          </h2>
          <Link href="/shop" className={`group inline-flex h-14 items-center gap-3 rounded-full bg-red-950 px-10 text-base font-semibold text-white shadow-xl transition-colors hover:bg-stone-900 ${FOCUS}`}>
            Shop the collection
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </Link>
        </div>
      </section>
    </main>
  );
}