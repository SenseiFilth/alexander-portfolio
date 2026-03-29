"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  {
    era: "Fine Arts Education",
    insight: "Where I learned to see.",
    description:
      "Rooted in years of artistic practice, this foundation translates into interfaces defined by precision, hierarchy, and aesthetic control.",
  },
  {
    era: "Full Stack Development",
    insight: "Where I learned to build.",
    description:
      "Built on modern web architecture—frontend, backend, APIs, databases, and deployment—delivering cohesive, scalable applications from end to end.",
  },
  {
    era: "Live Event Production",
    insight: "Where I learned to think in systems.",
    description:
      "Years as a union stagehand and electronics director running live events where a bad decision at the wrong moment is immediate and visible. That environment built an instinct for precision, real-time problem solving, and systems that can't afford to fail.",
  },
  {
    era: "AI Evaluation & Consulting (2024–Present)",
    insight: "Where I learned how AI actually works.",
    description:
      "Hands-on LLM evaluation built a ground-level understanding of how models reason, fail, and adapt—informing integrations that are stable, intentional, and production-ready.",
  },
];

/**
 * EXPERIENCE STORY — Timeline-style vertical reveal with scroll animations.
 */
export default function ExperienceStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
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

      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        const isLeft = i % 2 === 0;
        gsap.fromTo(
          item,
          {
            x: isLeft ? -60 : 60,
            opacity: 0,
            filter: "blur(4px)",
          },
          {
            x: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
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
      <div className="max-w-5xl mx-auto">
        <h2
          ref={headingRef}
          className="text-3xl md:text-5xl font-black mb-20 text-center opacity-0"
        >
          The <span className="text-red-500">Path</span>
        </h2>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="timeline-line" aria-hidden="true" />

          <div className="space-y-24">
            {timeline.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={step.era}
                  ref={(el) => { itemsRef.current[i] = el; }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 opacity-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content card */}
                  <div
                    className={`w-full md:w-[45%] glass-card rounded-xl p-8 ${
                      isLeft ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-red-500/60 mb-2">
                      {step.era}
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold mb-3">
                      {step.insight}
                    </h3>
                    <p className="text-white/40 font-light leading-relaxed text-sm md:text-base">
                      {step.description}
                    </p>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex w-[10%] justify-center">
                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_rgba(255,42,42,0.5)]" />
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block w-[45%]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
