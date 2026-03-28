"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Reusable hook for GSAP ScrollTrigger animations.
 * Returns a ref to attach to the trigger element.
 */
export function useScrollAnimation<T extends HTMLElement>(
  animationFn: (el: T, tl: gsap.core.Timeline) => void,
  triggerOptions?: ScrollTrigger.Vars
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        ...triggerOptions,
      },
    });

    animationFn(el, tl);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, []);

  return ref;
}

/**
 * Hook to set up GSAP smooth scroll and global ScrollTrigger config.
 */
export function useGSAPSetup() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Refresh on resize
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ScrollTrigger.killAll();
    };
  }, []);
}
