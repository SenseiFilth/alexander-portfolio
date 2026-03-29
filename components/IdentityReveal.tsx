"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const contactLinks = [
  {
    label: "Email",
    value: "brown.alexander10133@gmail.com",
    href: "mailto:brown.alexander10133@gmail.com",
    icon: "✉",
  },
  {
    label: "Phone",
    value: "704-726-6470",
    href: "tel:+17047266470",
    icon: "☎",
  },
  {
    label: "Upwork",
    value: "Hire Me",
    href: "https://www.upwork.com/freelancers/~012c48ad6ef84c61fc",
    icon: "▲",
  },
  {
    label: "LinkedIn",
    value: "Connect",
    href: "https://www.linkedin.com/in/alexander-mckinnon-brown-937146124/",
    icon: "◼",
  },
];

/**
 * IDENTITY REVEAL — Name, title, and contact info with parallax depth.
 */
export default function IdentityReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);

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
          end: "center center",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        nameRef.current,
        { y: 80, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power3.out" }
      )
        .fromTo(
          titleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.3"
        )
        .fromTo(
          contactRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-32"
    >
      {/* Parallax background text for depth */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="text-[12vw] font-black text-white/5 whitespace-nowrap">
          McKINNON-BROWN
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6">
        <h2
          ref={nameRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight opacity-0"
        >
          Alexander
          <br />
          <span className="text-red-500">McKinnon-Brown</span>
        </h2>

        <p
          ref={titleRef}
          className="mt-6 text-base md:text-lg lg:text-xl text-white/40 font-light tracking-widest uppercase opacity-0"
        >
          Creative Technologist{" "}
          <span className="text-red-500/60">·</span> Full Stack Developer{" "}
          <span className="text-red-500/60">·</span> AI Consultant
        </p>

        {/* Contact links */}
        <div
          ref={contactRef}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 md:gap-6 opacity-0"
        >
          {contactLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-lg
                         text-white/50 hover:text-white hover:border-red-500/30
                         hover:shadow-[0_0_20px_rgba(255,42,42,0.15)]
                         transition-all duration-300 text-sm"
            >
              <span className="text-red-500/70 text-xs">{link.icon}</span>
              <span className="hidden sm:inline text-white/30 text-xs tracking-wider uppercase">
                {link.label}
              </span>
              <span className="font-medium text-xs md:text-sm">{link.value}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
