"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * CALL TO ACTION — Final section with pulsing glow button.
 * Uses IntersectionObserver for reliable reveal after pinned sections.
 */
export default function CallToAction() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
        else setIsVisible(false);
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6"
    >
      <div
        className="text-center transition-all duration-1000 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0px)" : "translateY(40px)",
        }}
      >
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
