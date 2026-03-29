"use client";

import { useRef, useEffect, useState } from "react";

/**
 * STATEMENT — Two-line bold impact statement.
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
    { words: ["Vision", "built."], red: false },
    { words: ["Beautiful", "by", "design."], red: true },
  ];

  let wordIndex = 0;

  return (
    <section
      ref={sectionRef}
      className="relative py-40 flex items-center justify-center px-6"
    >
      <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-center leading-[1.05] max-w-5xl">
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.words.map((word) => {
              const i = wordIndex++;
              return (
                <span
                  key={`${word}-${i}`}
                  className={`inline-block mr-[0.2em] transition-all duration-700 ease-out${
                    line.red ? " text-red-500 text-glow-red" : ""
                  }`}
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
        ))}
      </h2>
    </section>
  );
}
