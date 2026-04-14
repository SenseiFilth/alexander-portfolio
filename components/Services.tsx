"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCARLET = "#DC2626";
const SCARLET_RGB = "220,38,38";

const services = [
  {
    title: "Website Design",
    description:
      "Interfaces built with a fine arts eye — not just functional, but considered. Every pixel has a reason.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    title: "Website Development",
    description:
      "Fast, responsive, production-ready. Modern frameworks, clean code, shipped on time.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: "Full Stack Applications",
    description:
      "From schema to deployment—end-to-end software systems, architected and built for scale.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
      </svg>
    ),
  },
  {
    title: "AI Consulting & Integration",
    description:
      "Production-grade AI integrations, grounded in how LLMs actually reason—and where they break.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
        <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
        <circle cx="12" cy="14" r="2" />
      </svg>
    ),
  },
];

function ServiceCard({
  service,
  index,
  sectionProgress,
}: {
  service: (typeof services)[0];
  index: number;
  sectionProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const [hovered, setHovered] = useState(false);

  // Staggered parallax — each card moves at slightly different speed
  const yRange = 40 + index * 8;
  const rawY = useTransform(sectionProgress, [0, 0.5, 1], [yRange, 0, -yRange * 0.3]);
  const y = useSpring(rawY, { stiffness: 70, damping: 18 });

  const entryStart = 0.05 + index * 0.08;
  const opacity = useTransform(sectionProgress, [entryStart, entryStart + 0.25, 0.85, 1], [0, 1, 1, 0.85]);
  const scale = useTransform(sectionProgress, [entryStart, entryStart + 0.25], [0.92, 1]);
  const smoothScale = useSpring(scale, { stiffness: 80, damping: 18 });

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        y,
        opacity,
        scale: smoothScale,
        clipPath: "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 250, damping: 22 }}
      className="group"
    >
      {/* Card shell */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: hovered
            ? "linear-gradient(145deg, rgba(220,38,38,0.08) 0%, rgba(0,0,0,0.85) 100%)"
            : "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.7) 100%)",
          border: `1px solid rgba(${SCARLET_RGB},${hovered ? "0.3" : "0.08"})`,
        }}
      />

      {/* Scarlet top accent */}
      <div
        className="absolute top-0 left-[8%] right-[8%] h-[1.5px] transition-all duration-500"
        style={{
          background: `linear-gradient(to right, transparent, ${SCARLET}, transparent)`,
          boxShadow: hovered ? `0 0 14px 2px rgba(${SCARLET_RGB},0.6)` : `0 0 6px 1px rgba(${SCARLET_RGB},0.25)`,
          opacity: hovered ? 1 : 0.5,
        }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 40px rgba(${SCARLET_RGB},${hovered ? "0.12" : "0"})`,
        }}
      />

      {/* Light sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={false}
        animate={hovered ? { x: "160%" } : { x: "-100%" }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: "50%",
          background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.04) 50%, transparent 80%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 md:p-10">
        {/* Icon — centered in the visible parallelogram area */}
        <div className="flex justify-center mb-6">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              color: "white",
              background: `rgba(${SCARLET_RGB},${hovered ? "0.2" : "0.1"})`,
              border: `1px solid rgba(${SCARLET_RGB},${hovered ? "0.4" : "0.2"})`,
              boxShadow: hovered ? `0 0 20px rgba(${SCARLET_RGB},0.3)` : "none",
              transform: hovered ? "scale(1.08)" : "scale(1)",
            }}
          >
            {service.icon}
          </div>
        </div>

        <h3
          className="text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 text-center"
          style={{ color: hovered ? "white" : "rgba(255,255,255,0.9)" }}
        >
          {service.title}
        </h3>

        <p className="text-white/40 font-light leading-relaxed text-sm md:text-base text-center">
          {service.description}
        </p>

        {/* Bottom accent line */}
        <div
          className="mt-6 h-[1px] mx-auto transition-all duration-500"
          style={{
            background: `linear-gradient(to right, transparent, rgba(${SCARLET_RGB},${hovered ? "0.6" : "0.2"}), transparent)`,
            width: hovered ? "60%" : "30%",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "end 10%"],
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

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
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <h2 ref={headingRef} className="font-aquire text-3xl md:text-5xl font-black mb-16 opacity-0 text-center">
          What I <span className="text-red-500">Build</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          {services.map((service, i) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={i}
              sectionProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
