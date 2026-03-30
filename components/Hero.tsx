"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

const CYCLE_FONTS = [
  { family: "Sora", weight: 700 },
  { family: "Orbitron", weight: 700 },
  { family: "Exo 2", weight: 700 },
  { family: "Bebas Neue", weight: 400 },
  { family: "Audiowide", weight: 400 },
];
const CS_FONT = { family: "CounterStrike", weight: 400 };

const INITIAL_DELAY = 2000;   // wait after load before first cycle
const CYCLE_DURATION = 2200;  // how long the rapid randomize phase lasts
const HOLD_DURATION = 3000;   // how long to rest on CS before next cycle
const TICK_MIN = 70;          // fastest tick (ms)
const TICK_MAX = 140;         // slowest tick (ms)

interface AnimatedLetterProps {
  letter: string;
  cycling: boolean;
}

function AnimatedLetter({ letter, cycling }: AnimatedLetterProps) {
  const [font, setFont] = useState(CS_FONT);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!cycling) {
      setFont(CS_FONT);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      if (!mountedRef.current) return;
      const idx = Math.floor(Math.random() * CYCLE_FONTS.length);
      setFont(CYCLE_FONTS[idx]);
      const delay = TICK_MIN + Math.random() * (TICK_MAX - TICK_MIN);
      timer = setTimeout(tick, delay);
    }

    tick();
    return () => clearTimeout(timer);
  }, [cycling]);

  return (
    <span
      style={{
        display: "inline-block",
        minWidth: "0.6em",
        fontFamily: `"${font.family}", sans-serif`,
        fontWeight: font.weight,
        transition: cycling ? "none" : "font-family 0.3s ease",
      }}
    >
      {letter}
    </span>
  );
}

/**
 * HERO SECTION — Full screen cinematic intro.
 * "art" letters simultaneously rapid-randomize fonts for a decipher effect.
 */
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cycling, setCycling] = useState(false);

  // ART decipher loop
  useEffect(() => {
    let outerTimer: ReturnType<typeof setTimeout>;
    let cycleTimer: ReturnType<typeof setTimeout>;
    let mounted = true;

    function runLoop() {
      if (!mounted) return;
      setCycling(true);
      cycleTimer = setTimeout(() => {
        if (!mounted) return;
        setCycling(false);
        cycleTimer = setTimeout(runLoop, HOLD_DURATION);
      }, CYCLE_DURATION);
    }

    outerTimer = setTimeout(runLoop, INITIAL_DELAY);

    return () => {
      mounted = false;
      clearTimeout(outerTimer);
      clearTimeout(cycleTimer);
    };
  }, []);

  // GSAP entrance + video
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

    const startPlayback = () => { video.play().catch(() => {}); };

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
            <AnimatedLetter letter="a" cycling={cycling} />
            <AnimatedLetter letter="r" cycling={cycling} />
            <AnimatedLetter letter="t" cycling={cycling} />
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
