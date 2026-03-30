"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

// Fonts to cycle through before returning to CS
const CYCLE_FONTS = [
  { family: "Sora", weight: 700 },
  { family: "Orbitron", weight: 700 },
  { family: "Exo 2", weight: 700 },
  { family: "Bebas Neue", weight: 400 },
  { family: "Audiowide", weight: 400 },
];

const CS_FONT = { family: "CounterStrike", weight: 400 };
const INITIAL_DELAY = 2000;
const LETTER_STAGGER = 900;
const FONT_INTERVAL = 3000;
const HOLD_DURATION = 2500;
const TRANSITION_OUT = 110;
const TRANSITION_IN = 220;

interface AnimatedLetterProps {
  letter: string;
  staggerOffset: number; // ms delay before this letter starts cycling
}

function AnimatedLetter({ letter, staggerOffset }: AnimatedLetterProps) {
  const [fontIndex, setFontIndex] = useState<number | null>(null); // null = CS font
  const [visible, setVisible] = useState(true);
  const mountedRef = useRef(true);

  const transition = useCallback(
    (nextFontIndex: number | null, onDone: () => void) => {
      if (!mountedRef.current) return;
      // Fade out
      setVisible(false);
      setTimeout(() => {
        if (!mountedRef.current) return;
        setFontIndex(nextFontIndex);
        setVisible(true);
        setTimeout(() => {
          if (mountedRef.current) onDone();
        }, TRANSITION_IN);
      }, TRANSITION_OUT);
    },
    []
  );

  useEffect(() => {
    mountedRef.current = true;

    let outerTimer: ReturnType<typeof setTimeout>;
    let cycleTimer: ReturnType<typeof setTimeout>;

    function runCycle() {
      let step = 0;

      function nextStep() {
        if (!mountedRef.current) return;

        if (step < CYCLE_FONTS.length) {
          // Cycle through each font
          transition(step, () => {
            step++;
            cycleTimer = setTimeout(nextStep, FONT_INTERVAL - TRANSITION_OUT - TRANSITION_IN);
          });
        } else {
          // Return to CS font, hold, then repeat
          transition(null, () => {
            cycleTimer = setTimeout(runCycle, HOLD_DURATION);
          });
        }
      }

      nextStep();
    }

    outerTimer = setTimeout(() => {
      if (!mountedRef.current) return;
      cycleTimer = setTimeout(runCycle, staggerOffset);
    }, INITIAL_DELAY);

    return () => {
      mountedRef.current = false;
      clearTimeout(outerTimer);
      clearTimeout(cycleTimer);
    };
  }, [staggerOffset, transition]);

  const currentFont = fontIndex !== null ? CYCLE_FONTS[fontIndex] : CS_FONT;

  return (
    <span
      style={{
        display: "inline-block",
        minWidth: "0.6em",
        fontFamily: `"${currentFont.family}", sans-serif`,
        fontWeight: currentFont.weight,
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(6px)",
        transform: visible ? "scale(1)" : "scale(0.88)",
        transition: visible
          ? `opacity ${TRANSITION_IN}ms ease, filter ${TRANSITION_IN}ms ease, transform ${TRANSITION_IN}ms ease`
          : `opacity ${TRANSITION_OUT}ms ease, filter ${TRANSITION_OUT}ms ease, transform ${TRANSITION_OUT}ms ease`,
      }}
    >
      {letter}
    </span>
  );
}

/**
 * HERO SECTION — Full screen cinematic intro.
 * Video plays once (no ping-pong) for performance.
 * "art" letters independently cycle through 5 fonts on a loop.
 */
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tl = gsap.timeline({ delay: 0.3 });

    gsap.fromTo(
      video,
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: "power2.inOut" }
    );

    tl.fromTo(
      headlineRef.current,
      { y: 60, opacity: 0, filter: "blur(10px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }
    ).fromTo(
      subtextRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );

    // Simple loop — no ping-pong
    const startPlayback = () => {
      video.play().catch(() => {});
    };

    if (video.readyState >= 3) {
      startPlayback();
    } else {
      video.addEventListener("canplay", startPlayback, { once: true });
    }

    return () => {
      tl.kill();
      video.removeEventListener("canplay", startPlayback);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ height: "100dvh" }}
    >
      <div className="absolute inset-0 bg-[#050505]" />

      <video
        ref={videoRef}
        muted
        playsInline
        loop
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        src="/video/hero-bg.mp4"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 md:via-[#050505]/60 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_70%)] z-[2]" />

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <h1
          ref={headlineRef}
          className="font-cs text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.9] opacity-0"
        >
          Technology is my medium
          <br />
          <span className="text-red-500 text-glow-red">
            So is{" "}
            <AnimatedLetter letter="a" staggerOffset={0} />
            <AnimatedLetter letter="r" staggerOffset={LETTER_STAGGER} />
            <AnimatedLetter letter="t" staggerOffset={LETTER_STAGGER * 2} />
          </span>
        </h1>

        <p
          ref={subtextRef}
          className="mt-6 md:mt-8 text-lg md:text-xl text-white/50 font-light tracking-wide opacity-0"
        >
          Full stack developer and AI consultant with a fine arts background
          <br className="hidden md:block" />
        </p>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-8 bg-gradient-to-b from-red-500 to-transparent"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
