"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * CALL TO ACTION — Final section.
 * "Work With Me" scrolls back up to the contact cards section.
 * Footer has Musashi quote above trademark.
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

  const scrollToContact = () => {
    // IdentityReveal is the 2nd section (index 1) — scroll to its top
    // so the sticky contact cards are immediately visible and centered
    const sections = document.querySelectorAll("section");
    const contactSection = sections[1];
    if (contactSection) {
      const rect = contactSection.getBoundingClientRect();
      const targetY = window.scrollY + rect.top;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

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
        <h2 className="font-cs text-4xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
          Build Something That
          <br />
          <span className="text-red-500 text-glow-red">Stands Out</span>
        </h2>

        <p className="text-white/40 font-light mb-10 text-sm md:text-lg max-w-md mx-auto tracking-widest uppercase">
          Precision&nbsp;&nbsp;·&nbsp;&nbsp;Performance&nbsp;&nbsp;·&nbsp;&nbsp;Presence
        </p>

        <motion.button
          onClick={scrollToContact}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block px-10 py-4 bg-red-500 text-white font-bold text-lg rounded-full
                     animate-pulse-glow transition-all duration-300 cursor-pointer
                     hover:bg-red-600 hover:shadow-[0_0_40px_rgba(255,42,42,0.5)]"
        >
          Start Your Project
        </motion.button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center flex flex-col items-center gap-2">
        <p
          className="text-white/15 text-xs tracking-wider italic"
          style={{ fontStyle: "italic" }}
        >
          &ldquo;Inside, I am infinite.&rdquo; — Miyamoto Musashi
        </p>
        <p className="text-white/10 text-xs tracking-wider">
          &copy; {new Date().getFullYear()} Alexander McKinnon-Brown. All rights reserved.
        </p>
      </div>
    </section>
  );
}
