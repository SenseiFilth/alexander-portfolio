"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { gsap } from "gsap";

interface Font { family: string; weight: number; }

const DEFAULT_FONT: Font = { family: "inherit", weight: 900 };

// 4 local fonts — default (inherit) is the resting state only
const ALL_FONTS: Font[] = [
  { family: "CloisterBlack", weight: 400 },
  { family: "Ryga",          weight: 400 },
  { family: "PrimeDrips",    weight: 400 },
  { family: "RushZone",      weight: 400 },
];

const FONT_THROTTLE = 130;
const SCROLL_STOP    = 250;

function pick3(): [Font, Font, Font] {
  const pool = [...ALL_FONTS].sort(() => Math.random() - 0.5);
  return [pool[0], pool[1], pool[2]];
}

interface LetterProps { letter: string; font: Font; cycling: boolean; }

function AnimatedLetter({ letter, font, cycling }: LetterProps) {
  return (
    <span style={{ display: "inline-block", width: "0.65em", textAlign: "center", overflow: "visible" }}>
      <span style={{
        fontFamily: font.family === "inherit" ? "inherit" : `"${font.family}", sans-serif`,
        fontWeight: font.weight,
        transition: cycling ? "none" : "font-family 0.3s ease",
      }}>
        {letter}
      </span>
    </span>
  );
}

export default function Hero() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const headlineRef   = useRef<HTMLHeadingElement>(null);
  const subtextRef    = useRef<HTMLParagraphElement>(null);
  const videoRef      = useRef<HTMLVideoElement>(null);
  const videoBgRef    = useRef<HTMLDivElement>(null);

  const [cycling, setCycling]   = useState(false);
  const [fonts,   setFonts]     = useState<[Font, Font, Font]>([DEFAULT_FONT, DEFAULT_FONT, DEFAULT_FONT]);
  const [isMobile, setIsMobile] = useState(false);
  const cyclingRef = useRef(false);

  // ── Mobile detection ────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Scroll-driven ART font scramble ─────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    let stopTimer: ReturnType<typeof setTimeout> | null = null;
    let lastChange = 0;

    function onScrollActivity() {
      if (!mounted) return;
      if (!cyclingRef.current) {
        cyclingRef.current = true;
        setCycling(true);
      }
      const now = Date.now();
      if (now - lastChange > FONT_THROTTLE) {
        setFonts(pick3());
        lastChange = now;
      }
      if (stopTimer) clearTimeout(stopTimer);
      stopTimer = setTimeout(() => {
        if (!mounted) return;
        cyclingRef.current = false;
        setCycling(false);
        setFonts([DEFAULT_FONT, DEFAULT_FONT, DEFAULT_FONT]);
      }, SCROLL_STOP);
    }

    window.addEventListener("scroll",    onScrollActivity, { passive: true });
    window.addEventListener("wheel",     onScrollActivity, { passive: true });
    window.addEventListener("touchmove", onScrollActivity, { passive: true });

    return () => {
      mounted = false;
      window.removeEventListener("scroll",    onScrollActivity);
      window.removeEventListener("wheel",     onScrollActivity);
      window.removeEventListener("touchmove", onScrollActivity);
      if (stopTimer) clearTimeout(stopTimer);
    };
  }, []);

  // ── GSAP entrance + video playback ──────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tl = gsap.timeline({ delay: 0.3 });

    gsap.fromTo(video, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.inOut" });

    tl.fromTo(headlineRef.current,
      { y: 60, opacity: 0, filter: "blur(10px)" },
      { y: 0,  opacity: 1, filter: "blur(0px)",  duration: 1.2, ease: "power3.out" }
    ).fromTo(subtextRef.current,
      { y: 30, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );

    const startPlayback = () => { video.play().catch(() => {}); };
    if (video.readyState >= 3) startPlayback();
    else video.addEventListener("canplay", startPlayback, { once: true });

    return () => {
      tl.kill();
      video.removeEventListener("canplay", startPlayback);
    };
  }, []);

  // ── Desktop ambient scale drift ─────────────────────────────────────────────
  useEffect(() => {
    if (isMobile || !videoBgRef.current) return;
    const drift = gsap.fromTo(
      videoBgRef.current,
      { scale: 1.0 },
      { scale: 1.06, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut" }
    );
    return () => { drift.kill(); };
  }, [isMobile]);

  // ── Mobile scroll-synced video transform ────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const rawScale    = useTransform(scrollYProgress, [0, 1], [1.08, 0.88]);
  const rawY        = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const rawOverlayY = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const videoScrollScale = useSpring(rawScale,    { stiffness: 35, damping: 22 });
  const videoScrollY     = useSpring(rawY,         { stiffness: 35, damping: 22 });
  const overlayScrollY   = useSpring(rawOverlayY,  { stiffness: 35, damping: 22 });

  return (
    <section
      ref={containerRef}
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ height: "100dvh" }}
    >
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Video layer — scroll-synced on mobile, ambient drift on desktop */}
      <motion.div
        ref={videoBgRef}
        className="absolute inset-0"
        style={isMobile ? { scale: videoScrollScale, y: videoScrollY } : undefined}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          src="/video/hero-bg.mp4"
        />
      </motion.div>

      {/* Gradient overlays — slight parallax offset on mobile for depth */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 md:via-[#050505]/60 to-transparent z-[1]"
        style={isMobile ? { y: overlayScrollY } : undefined}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_70%)] z-[2]" />

      {/* Hero copy */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <h1
          ref={headlineRef}
          className="font-zanie text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] opacity-0"
        >
          Technology is my medium
          <br />
          <span className="text-red-500 text-glow-red">
            So is{" "}
            <AnimatedLetter letter="a" font={fonts[0]} cycling={cycling} />
            <AnimatedLetter letter="r" font={fonts[1]} cycling={cycling} />
            <AnimatedLetter letter="t" font={fonts[2]} cycling={cycling} />
            <span className="hero-cursor" aria-hidden="true" />
          </span>
        </h1>

        <p
          ref={subtextRef}
          className="mt-6 md:mt-8 text-base md:text-lg text-white/40 font-light tracking-widest uppercase max-w-md mx-auto opacity-0"
        >
          Built Different{" "}
          <span style={{ fontFamily: "Inter, sans-serif" }}>—</span>
          {" "}By Design
        </p>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
        <motion.div
          className="w-[1px] h-8 bg-gradient-to-b from-red-500 to-transparent"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
