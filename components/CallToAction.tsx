"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * CALL TO ACTION — Final section.
 * Heading / subtitle / button each move at slightly different parallax speeds
 * for a loose, floating feel — gentler than the Statement section.
 */
export default function CallToAction() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Scroll-driven parallax scoped to this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Heading — anchored, moves least
  const y1Raw = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const y1 = useSpring(y1Raw, { stiffness: 70, damping: 20 });

  // Subtitle — middle speed
  const y2Raw = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const y2 = useSpring(y2Raw, { stiffness: 65, damping: 20 });

  // Button — trails behind most, creates the "loose" feel
  const y3Raw = useTransform(scrollYProgress, [0, 1], [42, -42]);
  const y3 = useSpring(y3Raw, { stiffness: 55, damping: 18 });

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
        className="text-center"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1s ease-out",
        }}
      >
        {/* Heading */}
        <motion.div style={{ y: y1 }}>
          <h2 className="font-cs text-4xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
            Build Something That
            <br />
            <span className="text-red-500 text-glow-red">Stands Out</span>
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.div style={{ y: y2 }}>
          <p className="text-white/40 font-light mb-10 text-sm md:text-lg max-w-md mx-auto tracking-widest uppercase">
            Precision&nbsp;&nbsp;·&nbsp;&nbsp;Performance&nbsp;&nbsp;·&nbsp;&nbsp;Presence
          </p>
        </motion.div>

        {/* Button — most movement, feels like it floats */}
        <motion.div style={{ y: y3 }}>
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
        </motion.div>
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
          &copy; {new Date().getFullYear()} Alexander McKinnon Brown. All rights reserved.
        </p>
      </div>
    </section>
  );
}
