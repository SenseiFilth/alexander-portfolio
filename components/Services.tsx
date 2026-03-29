"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Website Design",
    description:
      "Interfaces built with a fine arts eye — not just functional, but considered. Every pixel has a reason.",
    icon: "◆",
    direction: { x: -100, y: 0 },
  },
  {
    title: "Website Development",
    description:
      "Fast, responsive, production-ready. Modern frameworks, clean code, shipped on time.",
    icon: "⬡",
    direction: { x: 0, y: 100 },
  },
  {
    title: "Full Stack Applications",
    description:
      "From schema to deployment—end-to-end software systems, architected and built for scale.",
    icon: "△",
    direction: { x: 100, y: 0 },
  },
  {
    title: "AI Consulting & Integration",
    description:
      "Production-grade AI integrations, grounded in how LLMs actually reason—and where they break.",
    icon: "◎",
    direction: { x: 0, y: -100 },
  },
];

/**
 * SERVICES — Interactive cards that animate in from different directions.
 */
export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Cards stagger from their unique directions
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const dir = services[i].direction;
        gsap.fromTo(
          card,
          { x: dir.x, y: dir.y, opacity: 0, scale: 0.9 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <h2
          ref={headingRef}
          className="text-3xl md:text-5xl font-black mb-16 opacity-0"
        >
          What I <span className="text-red-500">Build</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-card rounded-2xl p-8 md:p-10 cursor-default group opacity-0
                         transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(255,42,42,0.15)]
                         hover:border-red-500/20"
            >
              <div className="text-3xl mb-4 text-red-500/70 group-hover:text-red-500 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-red-500 transition-colors">
                {service.title}
              </h3>
              <p className="text-white/40 font-light leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
