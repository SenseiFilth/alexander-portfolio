"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * IDENTITY REVEAL — Name and title fade in with parallax depth on scroll.
 */
export default function IdentityReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Background parallax text (depth layer)
      gsap.fromTo(
        bgTextRef.current,
        { y: 100, opacity: 0 },
        {
          y: -50,
          opacity: 0.03,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        }
      );

      // Name reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "center center",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        nameRef.current,
        { y: 80, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power3.out" }
      ).fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.3"
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-32"
    >
      {/* Parallax background text for depth */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="text-[12vw] font-black text-white/5 whitespace-nowrap">
          McKINNON-BROWN
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6">
        <h2
          ref={nameRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight opacity-0"
        >
          Alexander
          <br />
          <span className="text-red-500">McKinnon-Brown</span>
        </h2>

        <p
          ref={titleRef}
          className="mt-6 text-base md:text-lg lg:text-xl text-white/40 font-light tracking-widest uppercase opacity-0"
        >
          Creative Technologist{" "}
          <span className="text-red-500/60">·</span> Full Stack Developer{" "}
          <span className="text-red-500/60">·</span> AI Consultant
        </p>
      </div>
    </section>
  );
}
