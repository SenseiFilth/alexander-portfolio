"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

interface Font { family: string; weight: number; }

const CS_FONT: Font = { family: "CounterStrike", weight: 400 };

// 4 local fonts — CS is the resting state only
const ALL_FONTS: Font[] = [
  { family: "CloisterBlack", weight: 400 }, // blackletter gothic
  { family: "Ryga", weight: 400 },          // geometric futurist
  { family: "PrimeDrips", weight: 400 },    // drip display
  { family: "RushZone", weight: 400 },      // bold impact display
];

const FONT_THROTTLE = 130;  // min ms between font changes while scrolling
const SCROLL_STOP = 250;    // ms of inactivity before returning to CS

// Pick 3 distinct fonts from the pool
function pick3(): [Font, Font, Font] {
  const pool = [...ALL_FONTS].sort(() => Math.random() - 0.5);
  return [pool[0], pool[1], pool[2]];
}

interface LetterProps {
  letter: string;
  font: Font;
  cycling: boolean;
}

function AnimatedLetter({ letter, font, cycling }: LetterProps) {
  return (
    // Outer: fixed-size inline-block. Bottom edge = line baseline (verticalAlign baseline).
    <span
      style={{
        display: "inline-block",
        width: "0.65em",
        height: "0.82em",
        position: "relative",
        verticalAlign: "baseline",
        overflow: "visible",
      }}
    >
      {/*
        Inner: absolutely positioned.
        CS font needs bottom:-0.2em because the text baseline sits ~0.2em
        above the span's bottom edge (descender space in the em square).
        Animation fonts don't need to be baseline-perfect — they're brief.
      */}
      <span
        style={{
          position: "absolute",
          bottom: font.family === "CounterStrike" ? "-0.2em" : "0",
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          lineHeight: 1,
          fontFamily: `"${font.family}", sans-serif`,
          fontWeight: font.weight,
          transition: cycling ? "none" : "font-family 0.25s ease, bottom 0.25s ease",
        }}
      >
        {letter}
      </span>
    </span>
  );
}

/**
 * HERO SECTION — Full screen cinematic intro.
 * "art" letters simultaneously decipher through 6 fonts (no duplicates),
 * then settle sequentially back to CS font.
 */
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [cycling, setCycling] = useState(false);
  const [fonts, setFonts] = useState<[Font, Font, Font]>([CS_FONT, CS_FONT, CS_FONT]);
  const cyclingRef = useRef(false);

  // Scroll-driven ART decipher — activates on any scroll/wheel input,
  // returns to CS font after the user stops scrolling.
  useEffect(() => {
    let mounted = true;
    let stopTimer: ReturnType<typeof setTimeout> | null = null;
    let lastChange = 0;

    function onScrollActivity() {
      if (!mounted) return;

      // Flip into cycling mode on first scroll event
      if (!cyclingRef.current) {
        cyclingRef.current = true;
        setCycling(true);
      }

      // Throttle font swaps so they read as a scramble, not a blur
      const now = Date.now();
      if (now - lastChange > FONT_THROTTLE) {
        setFonts(pick3());
        lastChange = now;
      }

      // Debounce: settle back to CS after scroll goes quiet
      if (stopTimer) clearTimeout(stopTimer);
      stopTimer = setTimeout(() => {
        if (!mounted) return;
        cyclingRef.current = false;
        setCycling(false);
        setFonts([CS_FONT, CS_FONT, CS_FONT]);
      }, SCROLL_STOP);
    }

    // wheel catches intent before the page moves; scroll catches actual movement
    window.addEventListener("scroll", onScrollActivity, { passive: true });
    window.addEventListener("wheel",  onScrollActivity, { passive: true });
    window.addEventListener("touchmove", onScrollActivity, { passive: true });

    return () => {
      mounted = false;
      window.removeEventListener("scroll", onScrollActivity);
      window.removeEventListener("wheel",  onScrollActivity);
      window.removeEventListener("touchmove", onScrollActivity);
      if (stopTimer) clearTimeout(stopTimer);
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
            <AnimatedLetter letter="a" font={fonts[0]} cycling={cycling} />
            <AnimatedLetter letter="r" font={fonts[1]} cycling={cycling} />
            <AnimatedLetter letter="t" font={fonts[2]} cycling={cycling} />
            <span
              className="hero-cursor"
              aria-hidden="true"
            />
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
