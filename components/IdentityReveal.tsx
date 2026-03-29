"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ContactCard {
  label: string;
  value: string;
  href: string;
  accent: string;
  glowColor: string;
  borderColor: string;
  icon: React.ReactNode;
}

function EmailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 2.18H6a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z" />
    </svg>
  );
}

function UpworkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.543-2.546V3.492H0v7.112c0 2.917 2.37 5.295 5.281 5.295 2.913 0 5.283-2.378 5.283-5.295v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3.001-2.439-5.439-5.439-5.439z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/** 3D tilt card using mouse position */
function TiltCard({ card, index }: { card: ContactCard; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.a
      ref={cardRef}
      href={card.href}
      target={card.href.startsWith("http") ? "_blank" : undefined}
      rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className="relative block rounded-2xl p-6 cursor-pointer group no-underline"
    >
      {/* Glass background */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-500"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      />

      {/* Animated gradient border on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          padding: "1px",
          background: `linear-gradient(135deg, ${card.borderColor}, transparent 60%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-xl"
        style={{ background: card.glowColor }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{ color: card.accent, background: `${card.accent}15` }}
        >
          {card.icon}
        </div>

        {/* Label */}
        <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 font-medium">
          {card.label}
        </p>

        {/* Value */}
        <p
          className="text-sm font-bold leading-snug transition-colors duration-300"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          {card.value}
        </p>
      </div>
    </motion.a>
  );
}

/**
 * IDENTITY REVEAL — Name, title, and premium contact cards.
 */
export default function IdentityReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const [contactVisible, setContactVisible] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);

  const contactCards: ContactCard[] = [
    {
      label: "Email",
      value: "brown.alexander10133@gmail.com",
      href: "mailto:brown.alexander10133@gmail.com",
      accent: "#60a5fa",
      glowColor: "radial-gradient(circle at 50% 100%, rgba(96,165,250,0.08) 0%, transparent 70%)",
      borderColor: "rgba(96,165,250,0.5)",
      icon: <EmailIcon />,
    },
    {
      label: "Phone",
      value: "704-726-6470",
      href: "tel:+17047266470",
      accent: "#4ade80",
      glowColor: "radial-gradient(circle at 50% 100%, rgba(74,222,128,0.08) 0%, transparent 70%)",
      borderColor: "rgba(74,222,128,0.5)",
      icon: <PhoneIcon />,
    },
    {
      label: "Upwork",
      value: "Hire Me →",
      href: "https://www.upwork.com/freelancers/~012c48ad6ef84c61fc",
      accent: "#6fda44",
      glowColor: "radial-gradient(circle at 50% 100%, rgba(111,218,68,0.08) 0%, transparent 70%)",
      borderColor: "rgba(111,218,68,0.5)",
      icon: <UpworkIcon />,
    },
    {
      label: "LinkedIn",
      value: "Connect →",
      href: "https://www.linkedin.com/in/alexander-mckinnon-brown-937146124/",
      accent: "#0ea5e9",
      glowColor: "radial-gradient(circle at 50% 100%, rgba(14,165,233,0.08) 0%, transparent 70%)",
      borderColor: "rgba(14,165,233,0.5)",
      icon: <LinkedInIcon />,
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        nameRef.current,
        { y: 80, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power3.out" }
      ).fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.3"
      );
    }, section);

    // Contact cards visibility via IntersectionObserver
    const contact = contactRef.current;
    if (contact) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setContactVisible(true); },
        { threshold: 0.1 }
      );
      obs.observe(contact);
      return () => { ctx.revert(); obs.disconnect(); };
    }

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-32"
    >
      {/* Parallax depth text */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="text-[12vw] font-black text-white/5 whitespace-nowrap">
          McKINNON-BROWN
        </span>
      </div>

      <div className="relative z-10 text-center px-6 w-full max-w-3xl mx-auto">
        {/* Name */}
        <h2
          ref={nameRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight opacity-0"
        >
          Alexander
          <br />
          <span className="text-red-500">McKinnon-Brown</span>
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

        {/* Contact cards grid */}
        <div
          ref={contactRef}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          style={{ perspective: "1000px" }}
        >
          {contactVisible &&
            contactCards.map((card, i) => (
              <TiltCard key={card.label} card={card} index={i} />
            ))}
        </div>
      </div>
    </section>
  );
}
