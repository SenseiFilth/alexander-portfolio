"use client";

import { useRef, useEffect, useState } from "react";

/**
 * STATEMENT — Full screen bold impact text with staggered reveal on scroll into view.
 * Uses IntersectionObserver instead of GSAP ScrollTrigger for reliability after pinned sections.
 */
export default function Statement() {
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

  const line1 = ["Bringing", "your", "vision", "to", "life."];
  const line2 = ["Part", "developer.", "Part", "designer."];
  const line3 = ["Part", "strategist."];
  const line4Highlight = ["I", "build", "things", "that", "are", "fast,", "intelligent,"];
  const line5Highlight = ["and", "actually", "look", "good."];

  let wordIndex = 0;

  const renderWord = (word: string, highlight: boolean) => {
    const i = wordIndex++;
    return (
      <span
        key={`${word}-${i}`}
        className={`inline-block mr-[0.3em] transition-all duration-700 ease-out ${
          highlight ? "text-red-500 text-glow-red" : ""
        }`}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0px)" : "translateY(30px)",
          filter: isVisible ? "blur(0px)" : "blur(6px)",
          transitionDelay: `${i * 80}ms`,
        }}
      >
        {word}
      </span>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6"
    >
      <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-center leading-tight max-w-5xl">
        {line1.map((w) => renderWord(w, false))}
        <br className="hidden sm:block" />
        {line2.map((w) => renderWord(w, false))}
        {line3.map((w) => renderWord(w, false))}
        <br className="hidden sm:block" />
        {line4Highlight.map((w) => renderWord(w, true))}
        <br className="hidden sm:block" />
        {line5Highlight.map((w) => renderWord(w, true))}
      </h2>
    </section>
  );
}
