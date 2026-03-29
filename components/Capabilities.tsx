"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const technologies = [
  { name: "React", category: "Frontend Systems" },
  { name: "Next.js", category: "Production Framework" },
  { name: "TypeScript", category: "Scalable Logic Layer" },
  { name: "Firebase", category: "Backend Infrastructure" },
  { name: "Node.js", category: "Runtime Environment" },
  { name: "Tailwind CSS", category: "UI System" },
  { name: "AI APIs", category: "Intelligence Layer" },
  { name: "LLM Integration", category: "Reasoning Systems" },
];

/**
 * CAPABILITIES / STACK — Horizontal scroll illusion with network-style nodes.
 * Technologies slide in from the right as the user scrolls.
 */
export default function Capabilities() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // Heading
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

      // Horizontal scroll effect — translate the track left on scroll
      const totalScroll = track.scrollWidth - window.innerWidth + 100;
      gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Node reveal animations
      nodesRef.current.forEach((node, i) => {
        if (!node) return;
        gsap.fromTo(
          node,
          { opacity: 0, scale: 0.8, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            delay: i * 0.05,
            scrollTrigger: {
              trigger: section,
              start: "top 40%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="h-screen flex flex-col justify-center">
        <h2
          ref={headingRef}
          className="text-3xl md:text-5xl font-black mb-16 px-6 md:px-20 opacity-0"
        >
          Technical <span className="text-red-500">Stack</span>
        </h2>

        <div ref={trackRef} className="flex items-center gap-8 px-6 md:px-20 will-change-transform">
          {technologies.map((tech, i) => (
            <div
              key={tech.name}
              ref={(el) => { nodesRef.current[i] = el; }}
              className="relative flex-shrink-0 group"
            >
              {/* Connection line to next node */}
              {i < technologies.length - 1 && (
                <div
                  className="absolute top-1/2 left-full w-8 h-[1px] bg-gradient-to-r from-red-500/40 to-transparent"
                  aria-hidden="true"
                />
              )}

              <div
                className="glass-card rounded-xl p-6 md:p-8 w-48 md:w-56 text-center
                           transition-all duration-300
                           hover:border-red-500/30 hover:shadow-[0_0_25px_rgba(255,42,42,0.15)]
                           cursor-default"
              >
                {/* Dot node */}
                <div className="w-3 h-3 rounded-full bg-red-500/60 mx-auto mb-4 group-hover:bg-red-500 group-hover:shadow-[0_0_12px_rgba(255,42,42,0.6)] transition-all" />

                <h3 className="text-lg md:text-xl font-bold mb-1 group-hover:text-red-500 transition-colors">
                  {tech.name}
                </h3>
                <p className="text-xs uppercase tracking-widest text-white/30">
                  {tech.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
