"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCARLET = "#DC2626";
const SCARLET_RGB = "220,38,38";

const technologies = [
  { name: "React", category: "Frontend Systems" },
  { name: "Next.js", category: "Production Framework" },
  { name: "TypeScript", category: "Scalable Logic Layer" },
  { name: "Firebase", category: "Backend Infrastructure" },
  { name: "Node.js", category: "Runtime Environment" },
  { name: "Tailwind CSS", category: "UI System" },
  { name: "AI APIs", category: "Intelligence Layer" },
  { name: "LLM Integration", category: "Reasoning Systems" },
];

function TechCard({ tech, index }: { tech: (typeof technologies)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex-shrink-0 cursor-default"
      style={{
        width: "180px",
        clipPath: "polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)",
      }}
    >
      {/* Card shell */}
      <div
        className="absolute inset-0 transition-all duration-400"
        style={{
          background: hovered
            ? "linear-gradient(160deg, rgba(220,38,38,0.1) 0%, rgba(0,0,0,0.85) 100%)"
            : "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.7) 100%)",
          border: `1px solid rgba(${SCARLET_RGB},${hovered ? "0.35" : "0.1"})`,
        }}
      />

      {/* Top accent bar */}
      <div
        className="absolute top-0 left-[12%] right-[12%] h-[1.5px] transition-all duration-500"
        style={{
          background: `linear-gradient(to right, transparent, ${SCARLET}, transparent)`,
          boxShadow: hovered ? `0 0 12px 2px rgba(${SCARLET_RGB},0.7)` : `0 0 5px rgba(${SCARLET_RGB},0.3)`,
          opacity: hovered ? 1 : 0.45,
        }}
      />

      {/* Inner glow on hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 30px rgba(${SCARLET_RGB},${hovered ? "0.1" : "0"})`,
        }}
      />

      {/* Light sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={false}
        animate={hovered ? { x: "160%" } : { x: "-100%" }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: "50%",
          background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.05) 50%, transparent 80%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-7 py-7 text-center">
        <div
          className="w-2.5 h-2.5 rounded-full mx-auto mb-4 transition-all duration-300"
          style={{
            background: SCARLET,
            boxShadow: hovered ? `0 0 14px rgba(${SCARLET_RGB},0.8)` : `0 0 6px rgba(${SCARLET_RGB},0.4)`,
            transform: hovered ? "scale(1.4)" : "scale(1)",
          }}
        />
        <h3
          className="text-base font-bold mb-1 transition-colors duration-300"
          style={{ color: hovered ? "white" : "rgba(255,255,255,0.85)" }}
        >
          {tech.name}
        </h3>
        <p className="text-[10px] uppercase tracking-widest text-white/30">
          {tech.category}
        </p>
      </div>
    </motion.div>
  );
}

export default function Capabilities() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef  = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // ── Mobile detection ─────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Desktop: GSAP pin + scroll-driven horizontal drag ────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track || isMobile) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      const totalScroll = track.scrollWidth - window.innerWidth + 100;
      gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  // ── Mobile: heading fade-in via IntersectionObserver ────────────────────────
  useEffect(() => {
    if (!isMobile) return;
    const heading = headingRef.current;
    if (!heading) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          heading.style.opacity = "1";
          heading.style.transform = "translateY(0)";
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(heading);
    return () => obs.disconnect();
  }, [isMobile]);

  // ── Mobile: touch swipe on the track ────────────────────────────────────────
  useEffect(() => {
    if (!isMobile) return;
    const track = trackRef.current;
    if (!track) return;

    let startX = 0;
    let startScrollLeft = 0;
    let isDragging = false;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startScrollLeft = track.scrollLeft;
      isDragging = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const dx = startX - e.touches[0].clientX;
      track.scrollLeft = startScrollLeft + dx;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove",  onTouchMove,  { passive: true });
    track.addEventListener("touchend",   onTouchEnd,   { passive: true });

    return () => {
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove",  onTouchMove);
      track.removeEventListener("touchend",   onTouchEnd);
    };
  }, [isMobile]);

  // ── MOBILE RENDER ─────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section ref={sectionRef} className="relative py-20 overflow-hidden">
        <h2
          ref={headingRef}
          className="font-aquire text-3xl font-black mb-10 px-6 text-center"
          style={{
            opacity: 0,
            transform: "translateY(40px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          Technical <span className="text-red-500">Stack</span>
        </h2>

        {/* Horizontally scrollable + swipeable track */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            paddingLeft: "24px",
            paddingRight: "24px",
            overflowX: "auto",
            overflowY: "hidden",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="[&::-webkit-scrollbar]:hidden"
        >
          {technologies.map((tech, i) => (
            <div
              key={tech.name}
              className="relative flex-shrink-0 flex items-center"
              style={{ scrollSnapAlign: "start" }}
            >
              <TechCard tech={tech} index={i} />
              {i < technologies.length - 1 && (
                <div
                  className="w-6 h-[1px] flex-shrink-0"
                  style={{
                    background: `linear-gradient(to right, rgba(${SCARLET_RGB},0.4), transparent)`,
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>

        {/* Swipe hint */}
        <p className="text-center text-white/20 text-[10px] tracking-widest uppercase mt-6">
          Swipe to explore
        </p>
      </section>
    );
  }

  // ── DESKTOP RENDER ────────────────────────────────────────────────────────────
  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="h-screen flex flex-col justify-center">
        <h2
          ref={headingRef}
          className="font-aquire text-3xl md:text-5xl font-black mb-16 px-6 md:px-20 opacity-0 text-center"
        >
          Technical <span className="text-red-500">Stack</span>
        </h2>

        <div
          ref={trackRef}
          className="flex items-center gap-2 px-6 md:px-20 will-change-transform"
        >
          {technologies.map((tech, i) => (
            <div key={tech.name} className="relative flex-shrink-0 flex items-center">
              <TechCard tech={tech} index={i} />
              {i < technologies.length - 1 && (
                <div
                  className="w-6 h-[1px] flex-shrink-0"
                  style={{
                    background: `linear-gradient(to right, rgba(${SCARLET_RGB},0.4), transparent)`,
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
