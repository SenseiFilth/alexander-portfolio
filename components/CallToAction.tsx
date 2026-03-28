"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * CALL TO ACTION — Final section with pulsing glow button.
 */
export default function CallToAction() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6"
    >
      <div ref={contentRef} className="text-center opacity-0">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
          Ready to build something
          <br />
          <span className="text-red-500 text-glow-red">worth showing?</span>
        </h2>

        <p className="text-white/40 font-light mb-10 text-lg max-w-md mx-auto">
          I&apos;m available for projects and consulting. Let&apos;s talk.
        </p>

        <motion.a
          href="mailto:brown.alexander10133@gmail.com"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block px-10 py-4 bg-red-500 text-white font-bold text-lg rounded-full
                     animate-pulse-glow transition-all duration-300
                     hover:bg-red-600 hover:shadow-[0_0_40px_rgba(255,42,42,0.5)]"
        >
          Work With Me
        </motion.a>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-white/10 text-xs tracking-wider">
          &copy; {new Date().getFullYear()} Alexander McKinnon-Brown. All rights
          reserved.
        </p>
      </div>
    </section>
  );
}
