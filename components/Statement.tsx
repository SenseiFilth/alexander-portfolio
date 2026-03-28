"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * STATEMENT — Full screen bold impact text with dramatic slow fade-in.
 */
export default function Statement() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    const ctx = gsap.context(() => {
      // Split the text into words for staggered reveal
      const words = text.querySelectorAll(".statement-word");

      gsap.fromTo(
        words,
        { opacity: 0, y: 30, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const line1 = ["Bringing", "your", "vision", "to", "life."];
  const line2 = ["Part", "developer.", "Part", "designer."];
  const line3 = ["Part", "strategist."];
  const line4Highlight = ["I", "build", "things", "that", "are", "fast,", "intelligent,"];
  const line5Highlight = ["and", "actually", "look", "good."];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6"
    >
      <h2
        ref={textRef}
        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-center leading-tight max-w-5xl"
      >
        {line1.map((word) => (
          <span key={word} className="statement-word inline-block mr-[0.3em] opacity-0">
            {word}
          </span>
        ))}
        <br className="hidden sm:block" />
        {line2.map((word, i) => (
          <span key={`${word}-${i}`} className="statement-word inline-block mr-[0.3em] opacity-0">
            {word}
          </span>
        ))}
        {line3.map((word, i) => (
          <span key={`${word}-${i}`} className="statement-word inline-block mr-[0.3em] opacity-0">
            {word}
          </span>
        ))}
        <br className="hidden sm:block" />
        {line4Highlight.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="statement-word inline-block mr-[0.3em] text-red-500 text-glow-red opacity-0"
          >
            {word}
          </span>
        ))}
        <br className="hidden sm:block" />
        {line5Highlight.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="statement-word inline-block mr-[0.3em] text-red-500 text-glow-red opacity-0"
          >
            {word}
          </span>
        ))}
      </h2>
    </section>
  );
}
