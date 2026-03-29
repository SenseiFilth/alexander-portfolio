"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { products } from "@/lib/products";

gsap.registerPlugin(ScrollTrigger);

/** Inline SVG paint splat — white, used as backdrop behind products */
function PaintSplat({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 800"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill="white" fillOpacity="0.08">
        {/* Main splat body */}
        <ellipse cx="400" cy="400" rx="320" ry="280" />
        {/* Drips and splashes */}
        <ellipse cx="200" cy="300" rx="80" ry="60" transform="rotate(-15 200 300)" />
        <ellipse cx="600" cy="280" rx="90" ry="55" transform="rotate(20 600 280)" />
        <ellipse cx="300" cy="580" rx="70" ry="45" transform="rotate(-10 300 580)" />
        <ellipse cx="520" cy="560" rx="85" ry="50" transform="rotate(12 520 560)" />
        <ellipse cx="150" cy="430" rx="55" ry="35" transform="rotate(-25 150 430)" />
        <ellipse cx="660" cy="420" rx="65" ry="40" transform="rotate(18 660 420)" />
        {/* Small droplets */}
        <circle cx="120" cy="250" r="20" />
        <circle cx="680" cy="220" r="18" />
        <circle cx="250" cy="650" r="15" />
        <circle cx="560" cy="640" r="22" />
        <circle cx="100" cy="500" r="12" />
        <circle cx="700" cy="500" r="16" />
        {/* Finger drips */}
        <ellipse cx="350" cy="680" rx="15" ry="40" />
        <ellipse cx="450" cy="690" rx="12" ry="35" />
        <ellipse cx="250" cy="160" rx="14" ry="30" transform="rotate(15 250 160)" />
        <ellipse cx="550" cy="150" rx="16" ry="28" transform="rotate(-12 550 150)" />
      </g>
    </svg>
  );
}

export default function ShopSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isMobile) return;

    const totalProducts = products.length;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalProducts * 100}vh`,
        pin: pinRef.current,
        scrub: 0.5,
        onUpdate: (self) => {
          const newIndex = Math.min(
            Math.floor(self.progress * totalProducts),
            totalProducts - 1
          );
          setActiveIndex(newIndex);
        },
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  useEffect(() => {
    setShowBack(false);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  }, [activeIndex]);

  const handleHoverStart = useCallback(() => {
    hoverTimerRef.current = setTimeout(() => setShowBack(true), 3000);
  }, []);

  const handleHoverEnd = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setShowBack(false);
  }, []);

  const handleClick = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < products.length - 1) {
        setActiveIndex((i) => i + 1);
      } else if (diff < 0 && activeIndex > 0) {
        setActiveIndex((i) => i - 1);
      }
    }
  };

  const product = products[activeIndex];

  return (
    <section ref={sectionRef} className="relative bg-[#050505]">
      <div
        style={{ height: isMobile ? "auto" : `${products.length * 100}vh` }}
      >
        <div
          ref={pinRef}
          className={`${
            isMobile ? "relative" : ""
          } w-full h-screen flex flex-col items-center justify-center overflow-hidden`}
          onTouchStart={isMobile ? handleTouchStart : undefined}
          onTouchEnd={isMobile ? handleTouchEnd : undefined}
        >
          {/* Section header */}
          <div className="absolute top-8 left-0 right-0 z-10 flex flex-col items-center">
            <h2 className="text-sm tracking-[0.4em] uppercase text-white/40 mb-2">
              FiLTH Customs
            </h2>
            <div className="w-12 h-[1px] bg-red-500/50" />
          </div>

          {/* Progress indicator */}
          <div className="absolute top-8 right-8 z-10 flex items-baseline gap-1">
            <span className="text-4xl font-black text-white tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-sm text-white/30 font-light">
              / {String(products.length).padStart(2, "0")}
            </span>
          </div>

          {/* Product + info */}
          <div className="flex-1 flex flex-col items-center justify-center pt-20 pb-24 px-4">
            {/* Product image with paint splat */}
            <div className="flex-1 flex items-center justify-center min-h-0 relative">
              {/* Paint splat behind product */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <PaintSplat className="w-[120%] h-[120%] max-w-[600px] max-h-[600px]" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${product.id}-${showBack ? "back" : "front"}`}
                  initial={{ opacity: 0, scale: 0.85, rotateY: showBack ? -90 : 0 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative cursor-pointer group"
                  onMouseEnter={handleHoverStart}
                  onMouseLeave={handleHoverEnd}
                  onClick={() => handleClick(product.url)}
                  style={{ perspective: "1200px" }}
                >
                  {/* Red glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-red-500/10 blur-[100px] rounded-full" />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
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
                    <span className="text-white/30 text-xs tracking-widest uppercase">
                      {product.category}
                    </span>
                    <span className="w-[1px] h-3 bg-white/10" />
                    <span className="text-white/50 text-sm font-medium">
                      {product.price}
                    </span>
                  </div>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(product.url);
                    }}
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

          {/* Side dots — desktop */}
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

          {/* Mobile dots */}
          {isMobile && (
            <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2">
              {products.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIndex
                      ? "bg-red-500 scale-150"
                      : "bg-white/20"
                  }`}
                  aria-label={`View ${p.name}`}
                />
              ))}
            </div>
          )}

          {/* Store link */}
          <div className="absolute bottom-8 left-8 z-10">
            <a
              href="https://filth-customs.creator-spring.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.3em] uppercase text-white/20 hover:text-red-500/60 transition-colors duration-300"
            >
              View Full Store →
            </a>
          </div>

          {/* Scroll hint — desktop */}
          {!isMobile && activeIndex === 0 && (
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] tracking-[0.4em] uppercase text-white/20">
                  Scroll to browse
                </span>
                <motion.div
                  className="w-[1px] h-6 bg-white/10"
                  animate={{ scaleY: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
