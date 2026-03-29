"use client";

import { useRef, useEffect, useState } from "react";

/**
 * STATEMENT — Tighter, punchier 3-line bold statement.
 * Uses IntersectionObserver for reliable post-pin reveal.
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

  const lines: { words: string[]; red: boolean }[] = [
    { words: ["Vision,", "built."], red: false },
    { words: ["Developer.", "Designer.", "Strategist."], red: false },
    { words: ["Fast.", "Intelligent.", "Beautiful", "by", "design."], red: true },
  ];

  let wordIndex = 0;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6"
    >
      <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-center leading-tight max-w-5xl">
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.words.map((word) => {
              const i = wordIndex++;
              return (
                <span
                  key={`${word}-${i}`}
                  className={`inline-block mr-[0.25em] transition-all duration-700 ease-out${
                    line.red ? " text-red-500 text-glow-red" : ""
                  }`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0px)" : "translateY(30px)",
                    filter: isVisible ? "blur(0px)" : "blur(6px)",
                    transitionDelay: `${i * 90}ms`,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </span>
        ))}
      </h2>
    </section>
  );
}
