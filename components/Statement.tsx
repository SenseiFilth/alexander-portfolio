"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";

/**
 * STATEMENT — Two-line bold impact statement with strong parallax.
 */
export default function Statement() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Scroll-driven parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Line 1 moves slower (feels anchored)
  const y1Raw = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y1 = useSpring(y1Raw, { stiffness: 60, damping: 18 });

  // Line 2 moves faster (floats up into place)
  const y2Raw = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useSpring(y2Raw, { stiffness: 55, damping: 16 });

  // Subtle scale based on scroll — feels like content "expanding" into view
  const scaleRaw = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.92, 1, 1, 0.95]);
  const scale = useSpring(scaleRaw, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
        else setIsVisible(false);
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const line1 = ["Vision", "built"];
  const line2 = ["Beautiful", "by", "design"];

  let wordIndex = 0;

  return (
    <section
      ref={sectionRef}
      className="relative pt-24 pb-12 md:py-20 flex items-center justify-center px-6 overflow-hidden"
    >
      {/* Subtle background scarlet bloom on scroll */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useTransform(
            scrollYProgress,
            [0.2, 0.5, 0.8],
            [
              "radial-gradient(ellipse at 50% 60%, rgba(220,38,38,0) 0%, transparent 70%)",
              "radial-gradient(ellipse at 50% 60%, rgba(220,38,38,0.06) 0%, transparent 70%)",
              "radial-gradient(ellipse at 50% 60%, rgba(220,38,38,0) 0%, transparent 70%)",
            ]
          ),
        }}
      />

      <div className="relative z-10 text-center max-w-5xl w-full" style={{ perspective: "1200px" }}>
        {/* Line 1 — white, slower parallax */}
        <motion.div style={{ y: y1, scale }}>
          <span className="font-cs block text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[1.05]">
            {line1.map((word) => {
              const i = wordIndex++;
              return (
                <span
                  key={`${word}-${i}`}
                  className="inline-block mr-[0.2em] transition-all duration-700 ease-out"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0px)" : "translateY(30px)",
                    filter: isVisible ? "blur(0px)" : "blur(6px)",
                    transitionDelay: `${i * 100}ms`,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </span>
        </motion.div>

        {/* Line 2 — red, faster parallax */}
        <motion.div style={{ y: y2, scale }}>
          <span className="font-cs block text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[1.05] text-red-500 text-glow-red">
            {line2.map((word) => {
              const i = wordIndex++;
              return (
                <span
                  key={`${word}-${i}`}
                  className="inline-block mr-[0.2em] transition-all duration-700 ease-out"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0px)" : "translateY(30px)",
                    filter: isVisible ? "blur(0px)" : "blur(6px)",
                    transitionDelay: `${i * 100}ms`,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
