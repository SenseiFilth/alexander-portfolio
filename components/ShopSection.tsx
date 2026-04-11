"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { products } from "@/lib/products";

gsap.registerPlugin(ScrollTrigger);

const TOTAL = products.length;

// ─────────────────────────────────────────────────────────────────────────────
// ShopSection
// Mobile: two completely independent touch systems
//   1. Swipe  — horizontal drag on the product stage (pinRef)
//   2. Seek   — long-press on dots → scrub bar → release to snap
// Desktop: GSAP scroll-pin drives activeIndex
// ─────────────────────────────────────────────────────────────────────────────
export default function ShopSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef     = useRef<HTMLDivElement>(null);
  const dotsAreaRef = useRef<HTMLDivElement>(null);
  const seekRailRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showBack,    setShowBack]    = useState(false);
  const [isMobile,   setIsMobile]    = useState(false);

  // Seek UI state (drives render only)
  const [isSeeking,    setIsSeeking]    = useState(false);
  const [seekFraction, setSeekFraction] = useState(0); // 0..1

  // ── Refs that must be synchronous (not stale in event handlers) ───────────
  const activeIndexRef   = useRef(0);   // mirrors activeIndex
  const seekActiveRef    = useRef(false);
  const pendingIndexRef  = useRef(0);   // target index during scrub
  const longPressTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef           = useRef<number | null>(null);
  const dotsStartX       = useRef(0);   // touch X when dots press began

  // Swipe refs
  const swipeStartX = useRef(0);
  const swipeStartY = useRef(0);
  const swipeLastX  = useRef(0);
  const swipeLastT  = useRef(0);
  const swipeVel    = useRef(0);        // px/ms
  const swipeDir    = useRef<"h" | "v" | null>(null);

  // Product flip (desktop hover)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep activeIndexRef in sync
  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);

  // ── Mobile detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Desktop: GSAP scroll-pin ──────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isMobile) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${TOTAL * 30}vh`,
        pin: pinRef.current,
        scrub: 0.5,
        onUpdate: (self) => {
          setActiveIndex(Math.min(Math.floor(self.progress * TOTAL), TOTAL - 1));
        },
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  // Reset flip when product changes
  useEffect(() => {
    setShowBack(false);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }, [activeIndex]);

  const handleHoverStart = useCallback(() => {
    hoverTimer.current = setTimeout(() => setShowBack(true), 3000);
  }, []);
  const handleHoverEnd = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setShowBack(false);
  }, []);
  const handleClick = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  // ══════════════════════════════════════════════════════════════════════════
  // SYSTEM 1 — SWIPE  (handlers live on pinRef)
  // Intent detection prevents vertical scroll from triggering swipe.
  // Velocity tracking gives momentum-like snap decisions.
  // Does nothing when seek is active.
  // ══════════════════════════════════════════════════════════════════════════
  const onSwipeStart = (e: React.TouchEvent) => {
    if (seekActiveRef.current) return;
    const t = e.touches[0];
    swipeStartX.current = t.clientX;
    swipeStartY.current = t.clientY;
    swipeLastX.current  = t.clientX;
    swipeLastT.current  = Date.now();
    swipeVel.current    = 0;
    swipeDir.current    = null;
  };

  const onSwipeMove = (e: React.TouchEvent) => {
    if (seekActiveRef.current) return;
    const t  = e.touches[0];
    const dx = t.clientX - swipeStartX.current;
    const dy = t.clientY - swipeStartY.current;

    // Resolve intent after 10px of movement in either axis
    if (!swipeDir.current && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      swipeDir.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
    }
    if (swipeDir.current !== "h") return; // let vertical pass through

    const now = Date.now();
    const dt  = now - swipeLastT.current;
    if (dt > 0) swipeVel.current = (t.clientX - swipeLastX.current) / dt;
    swipeLastX.current = t.clientX;
    swipeLastT.current = now;
  };

  const onSwipeEnd = (e: React.TouchEvent) => {
    if (seekActiveRef.current || swipeDir.current !== "h") {
      swipeDir.current = null;
      return;
    }
    const dx  = e.changedTouches[0].clientX - swipeStartX.current;
    const vel = swipeVel.current;

    if (dx < -40 || vel < -0.3) {
      setActiveIndex(i => Math.min(i + 1, TOTAL - 1));
    } else if (dx > 40 || vel > 0.3) {
      setActiveIndex(i => Math.max(i - 1, 0));
    }
    swipeDir.current = null;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // SYSTEM 2 — SEEK  (handlers live on dotsAreaRef)
  // stopPropagation prevents swipe system from co-firing.
  // Long-press → seek active → rAF scrub → release → snap.
  // ══════════════════════════════════════════════════════════════════════════

  /** Activate seek mode (called from setTimeout) */
  const activateSeek = useCallback(() => {
    seekActiveRef.current   = true;
    pendingIndexRef.current = activeIndexRef.current;
    const fraction = activeIndexRef.current / Math.max(1, TOTAL - 1);

    setIsSeeking(true);
    setSeekFraction(fraction);

    // Haptic pulse (12ms — subtle confirmation)
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      (navigator as Navigator & { vibrate: (n: number) => void }).vibrate(12);
    }
  }, []);

  /** Exit seek mode, snap to pendingIndexRef */
  const exitSeek = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    seekActiveRef.current = false;
    const snapped = Math.max(0, Math.min(TOTAL - 1, pendingIndexRef.current));
    setActiveIndex(snapped);
    setSeekFraction(snapped / Math.max(1, TOTAL - 1));
    setIsSeeking(false);
  }, []);

  const onDotsStart = (e: React.TouchEvent) => {
    e.stopPropagation(); // isolate from swipe system
    dotsStartX.current = e.touches[0].clientX;

    longPressTimer.current = setTimeout(activateSeek, 850);
  };

  const onDotsMove = (e: React.TouchEvent) => {
    e.stopPropagation();

    // Cancel long-press if finger drifts before activation
    if (!seekActiveRef.current) {
      if (longPressTimer.current && Math.abs(e.touches[0].clientX - dotsStartX.current) > 8) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      return;
    }

    // ── Seek scrub ──────────────────────────────────────────────────────────
    const tx = e.touches[0].clientX;

    // Map touch X onto rail bounds (rail ref preferred; fallback uses window)
    let fraction: number;
    const rail = seekRailRef.current;
    if (rail) {
      const r = rail.getBoundingClientRect();
      fraction = Math.max(0, Math.min(1, (tx - r.left) / r.width));
    } else {
      fraction = Math.max(0, Math.min(1, (tx - 32) / (window.innerWidth - 64)));
    }

    const rawIndex = fraction * (TOTAL - 1);
    const newIndex = Math.round(rawIndex);

    // rAF gate — no more than one update per frame
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      pendingIndexRef.current = newIndex;
      setSeekFraction(fraction);
      setActiveIndex(newIndex);
    });
  };

  const onDotsEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (seekActiveRef.current) exitSeek();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const product = products[activeIndex];

  return (
    <section ref={sectionRef} className="relative">
      <div style={{ height: isMobile ? "auto" : `${TOTAL * 30}vh` }}>
        <div
          ref={pinRef}
          className={`${isMobile ? "relative" : ""} w-full h-screen flex flex-col items-center justify-center overflow-hidden`}
          onTouchStart={isMobile ? onSwipeStart : undefined}
          onTouchMove={isMobile  ? onSwipeMove  : undefined}
          onTouchEnd={isMobile   ? onSwipeEnd   : undefined}
        >
          {/* ── Section header ───────────────────────────────────────────── */}
          <div className="absolute top-8 left-0 right-0 z-10 flex flex-col items-center">
            <h2 className="text-sm tracking-[0.4em] uppercase text-white/40 mb-2">My Shop</h2>
            <div className="w-12 h-[1px] bg-red-500/50" />
          </div>

          {/* ── Product stage ────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col items-center justify-center pt-20 pb-24 px-4">
            {/* Image */}
            <div className="flex-1 flex items-center justify-center min-h-0 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${product.id}-${showBack ? "back" : "front"}`}
                  initial={{ opacity: 0, scale: 0.85, rotateY: showBack ? -90 : 0 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative cursor-pointer group"
                  onMouseEnter={handleHoverStart}
                  onMouseLeave={handleHoverEnd}
                  onClick={() => handleClick(product.url)}
                  style={{ perspective: "1200px" }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-red-500/10 blur-[100px] rounded-full" />
                  </div>

                  <motion.div whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    <Image
                      src={showBack ? product.imageBack : product.imageFront}
                      alt={`${product.name} ${showBack ? "back" : "front"}`}
                      width={500}
                      height={600}
                      className="relative z-10 drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[50vh] w-auto object-contain"
                      priority={activeIndex < 2}
                      draggable={false}
                    />
                  </motion.div>

                  <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-60 transition-opacity duration-500 text-[10px] tracking-[0.3em] uppercase text-white/40 pointer-events-none whitespace-nowrap">
                    {showBack ? "viewing back" : "hold to flip"}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Product info */}
            <div className="mt-6 flex flex-col items-center z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center"
                >
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm tracking-[0.2em] uppercase text-red-500/80 mb-3">
                    {product.subtitle}
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-white/30 text-xs tracking-widest uppercase">{product.category}</span>
                    <span className="w-[1px] h-3 bg-white/10" />
                    <span className="text-white/50 text-sm font-medium">{product.price}</span>
                  </div>
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); handleClick(product.url); }}
                    className="mt-4 px-6 py-2.5 border border-red-500/40 text-red-500 text-xs tracking-[0.3em] uppercase hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Shop Now
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Desktop side dots ────────────────────────────────────────── */}
          {!isMobile && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
              {products.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIndex
                      ? "bg-red-500 scale-150 shadow-[0_0_8px_rgba(255,42,42,0.6)]"
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`View ${p.name}`}
                />
              ))}
            </div>
          )}

          {/* ── Desktop scroll hint ──────────────────────────────────────── */}
          {!isMobile && activeIndex === 0 && (
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] tracking-[0.4em] uppercase text-white/20">Scroll to browse</span>
                <motion.div
                  className="w-[1px] h-6 bg-white/10"
                  animate={{ scaleY: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              MOBILE — Dots + Seek bar
              Touch handlers isolated here via stopPropagation.
              AnimatePresence morphs between dot row and scrub rail.
          ══════════════════════════════════════════════════════════════ */}
          {isMobile && (
            <div
              ref={dotsAreaRef}
              className="absolute bottom-0 left-0 right-0 z-30 px-8 pb-6 pt-5 flex flex-col items-center"
              onTouchStart={onDotsStart}
              onTouchMove={onDotsMove}
              onTouchEnd={onDotsEnd}
            >
              <AnimatePresence mode="wait">

                {/* ── SEEK MODE ─────────────────────────────────────────── */}
                {isSeeking && (
                  <motion.div
                    key="seek"
                    initial={{ opacity: 0, y: 6, scaleX: 0.9 }}
                    animate={{ opacity: 1, y: 0, scaleX: 1 }}
                    exit={{ opacity: 0, y: 6, scaleX: 0.9 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex flex-col items-center gap-2"
                  >
                    {/* Product name label */}
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeIndex}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.12 }}
                        className="text-[10px] tracking-[0.4em] uppercase text-white/50 select-none"
                      >
                        {products[activeIndex].name}
                      </motion.p>
                    </AnimatePresence>

                    {/* Scrub rail */}
                    <div ref={seekRailRef} className="relative w-full flex items-center" style={{ height: 28 }}>
                      {/* Track background */}
                      <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
                        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{
                              width: `${seekFraction * 100}%`,
                              transition: "width 16ms linear",
                            }}
                          />
                        </div>
                      </div>

                      {/* Index tick marks */}
                      {products.map((_, i) => {
                        const pct = TOTAL > 1 ? (i / (TOTAL - 1)) * 100 : 0;
                        const isActive = i === activeIndex;
                        return (
                          <div
                            key={i}
                            className="absolute top-1/2 -translate-y-1/2 pointer-events-none rounded-full"
                            style={{
                              left:       `${pct}%`,
                              transform:  `translateX(-50%) translateY(-50%)`,
                              width:      isActive ? 3 : 2,
                              height:     isActive ? 8 : 5,
                              background: isActive
                                ? "rgba(220,38,38,0.9)"
                                : "rgba(255,255,255,0.25)",
                              transition: "background 80ms, height 80ms",
                            }}
                          />
                        );
                      })}

                      {/* Draggable thumb */}
                      <div
                        className="absolute top-1/2 pointer-events-none"
                        style={{
                          left:      `${seekFraction * 100}%`,
                          transform: "translateX(-50%) translateY(-50%)",
                          width:  14,
                          height: 14,
                          borderRadius: "50%",
                          background:  "#DC2626",
                          boxShadow:   "0 0 0 3px rgba(220,38,38,0.25), 0 0 14px rgba(220,38,38,0.7)",
                          transition:  "left 16ms linear",
                        }}
                      />
                    </div>

                    {/* Counter */}
                    <p className="text-[9px] tracking-[0.45em] uppercase text-white/25 select-none">
                      {activeIndex + 1} / {TOTAL}
                    </p>
                  </motion.div>
                )}

                {/* ── DEFAULT DOTS ──────────────────────────────────────── */}
                {!isSeeking && (
                  <motion.div
                    key="dots"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center gap-3"
                  >
                    {products.map((p, i) => {
                      const isActive = i === activeIndex;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setActiveIndex(i)}
                          aria-label={`View ${p.name}`}
                          style={{
                            width:      isActive ? 20 : 8,
                            height:     8,
                            borderRadius: 4,
                            background: isActive
                              ? "rgb(220,38,38)"
                              : "rgba(255,255,255,0.2)",
                            boxShadow: isActive
                              ? "0 0 8px rgba(220,38,38,0.55)"
                              : "none",
                            transition: "width 250ms cubic-bezier(0.16,1,0.3,1), background 250ms, box-shadow 250ms",
                            cursor: "pointer",
                            border: "none",
                            padding: 0,
                            flexShrink: 0,
                          }}
                        />
                      );
                    })}
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Hold-to-seek hint — only on first product, first session */}
              {!isSeeking && activeIndex === 0 && (
                <motion.p
                  className="mt-3 text-[9px] tracking-[0.4em] uppercase text-white/15 select-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5, duration: 1 }}
                >
                  hold dots to seek
                </motion.p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
