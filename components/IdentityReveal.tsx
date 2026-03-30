"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Brand scarlet ────────────────────────────────────────────────────────────
const SCARLET = "#9B1C1C";
const SCARLET_BRIGHT = "#DC2626";
const SCARLET_RGB = "155,28,28";

// ─── Card data ────────────────────────────────────────────────────────────────
const CARDS = [
  {
    label: "Email",
    value: "brown.alexander\n10133@gmail.com",
    href: "mailto:brown.alexander10133@gmail.com",
    bg: "/contact-bg/card-1.png",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "704-726-6470",
    href: "tel:+17047266470",
    bg: "/contact-bg/card-2.png",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 2.18H6a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z" />
      </svg>
    ),
  },
  {
    label: "Upwork",
    value: "Hire Me",
    href: "https://www.upwork.com/freelancers/~012c48ad6ef84c61fc",
    bg: "/contact-bg/card-3.png",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.543-2.546V3.492H0v7.112c0 2.917 2.37 5.295 5.281 5.295 2.913 0 5.283-2.378 5.283-5.295v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3.001-2.439-5.439-5.439-5.439z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "Connect",
    href: "https://www.linkedin.com/in/alexander-mckinnon-brown-937146124/",
    bg: "/contact-bg/card-4.png",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

// ─── Card: entrance wrapper (CSS) + inner motion.a (parallax y only) ──────────
function ContactCard({
  card,
  index,
  scrollYProgress,
  isVisible,
}: {
  card: (typeof CARDS)[0];
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  isVisible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  // Scroll-driven parallax — each card at a slightly different depth
  const parallaxRange = 30 + index * 8;
  const rawY = useTransform(
    scrollYProgress,
    [0, 0.4, 0.7, 1],
    [parallaxRange, 0, 0, -parallaxRange * 0.3]
  );
  const y = useSpring(rawY, { stiffness: 80, damping: 22 });

  return (
    // ── Entrance wrapper ─────────────────────────────────────────────────────
    // Always in the DOM so the grid height is always reserved → name never jumps.
    // CSS transition slides cards up from below when isVisible fires.
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0px)" : "translateY(72px)",
        transition: "opacity 0.65s ease, transform 0.7s cubic-bezier(0.22, 1.2, 0.36, 1)",
        transitionDelay: `${index * 0.11}s`,
      }}
    >
      {/* ── Inner motion.a — scroll parallax y only ─────────────────────── */}
      <motion.a
        href={card.href}
        target={card.href.startsWith("http") ? "_blank" : undefined}
        rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          y,
          aspectRatio: "9 / 16",
          clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
          cursor: "pointer",
          textDecoration: "none",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
        whileTap={{ scale: 0.97 }}
        className="select-none group"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
          style={{
            backgroundImage: `url(${card.bg})`,
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.92) 100%)",
          }}
        />

        {/* Scarlet top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10 transition-all duration-500"
          style={{
            background: `linear-gradient(to right, transparent, ${SCARLET_BRIGHT}, transparent)`,
            boxShadow: hovered
              ? `0 0 16px 3px rgba(${SCARLET_RGB},0.8)`
              : `0 0 8px 1px rgba(${SCARLET_RGB},0.4)`,
          }}
        />

        {/* Scarlet edge glow on hover */}
        <div
          className="absolute inset-0 z-10 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 30px rgba(${SCARLET_RGB},${hovered ? "0.15" : "0"})`,
          }}
        />

        {/* Light sweep on hover */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          initial={false}
          animate={hovered ? { x: "160%" } : { x: "-100%" }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: "50%",
            background:
              "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.06) 50%, transparent 80%)",
          }}
        />

        {/* Content */}
        <div className="relative z-20 flex flex-col h-full px-6 py-6 justify-between">
          {/* Icon */}
          <div className="flex-1 flex items-center justify-center">
            <div
              className="flex items-center justify-center rounded-xl w-16 h-16 transition-transform duration-300"
              style={{
                color: "white",
                background: `rgba(${SCARLET_RGB},0.2)`,
                border: `1px solid rgba(${SCARLET_RGB},0.4)`,
                transform: hovered ? "scale(1.12)" : "scale(1)",
                boxShadow: hovered
                  ? `0 0 20px rgba(${SCARLET_RGB},0.5)`
                  : `0 0 8px rgba(${SCARLET_RGB},0.2)`,
              }}
            >
              {card.icon}
            </div>
          </div>

          {/* Label + Value */}
          <div className="flex flex-col gap-1">
            <p
              className="text-[9px] font-semibold tracking-[0.4em] uppercase"
              style={{ color: SCARLET_BRIGHT }}
            >
              {card.label}
            </p>
            <p
              className="text-[11px] font-bold leading-snug text-white whitespace-pre-line"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
            >
              {card.value}
            </p>
          </div>
        </div>
      </motion.a>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function IdentityReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const [contactVisible, setContactVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "end 10%"],
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Parallax bg depth text
      gsap.fromTo(
        bgTextRef.current,
        { y: 100, opacity: 0 },
        {
          y: -50,
          opacity: 0.03,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        }
      );

      // Name + title entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        nameRef.current,
        { y: 80, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }
      ).fromTo(
        titleRef.current,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: "power2.out" },
        "-=0.3"
      );
    }, section);

    // IntersectionObserver triggers card slide-in (not conditional rendering)
    const contact = contactRef.current;
    if (contact) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setContactVisible(true); },
        { threshold: 0.05 }
      );
      obs.observe(contact);
      return () => { ctx.revert(); obs.disconnect(); };
    }

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#050505]"
      style={{ minHeight: "120vh" }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 min-h-screen flex items-center justify-center overflow-hidden py-24"
      >
        {/* Depth text */}
        <div
          ref={bgTextRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span className="text-[12vw] font-black text-white/5 whitespace-nowrap">
            McKINNON-BROWN
          </span>
        </div>

        <div className="relative z-10 text-center px-6 w-full max-w-4xl mx-auto">
          {/* Name */}
          <h2
            ref={nameRef}
            className="font-cs text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight opacity-0"
          >
            Alexander
            <br />
            <span className="text-red-500 whitespace-nowrap">
              McKinnon<span style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>-</span>Brown
              <motion.span
                className="inline-block ml-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: "steps(1)",
                  delay: 0.15 + 3 * 0.13 + 0.6,
                }}
                style={{ color: "#DC2626" }}
                aria-hidden="true"
              >|</motion.span>
            </span>
          </h2>

          {/* Title */}
          <p
            ref={titleRef}
            className="mt-6 text-base md:text-lg text-white/40 font-light tracking-widest uppercase opacity-0"
          >
            Creative Technologist{" "}
            <span className="text-red-500/60">·</span> Full Stack Developer{" "}
            <span className="text-red-500/60">·</span> AI Consultant
          </p>

          {/* Contact cards — always in DOM to prevent layout shift */}
          <div
            ref={contactRef}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-1 max-w-2xl mx-auto"
          >
            {CARDS.map((card, i) => (
              <ContactCard
                key={card.label}
                card={card}
                index={i}
                scrollYProgress={scrollYProgress}
                isVisible={contactVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
