"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

/**
 * HERO SECTION — Full screen cinematic intro.
 *
 * VIDEO PLAYBACK — PING-PONG:
 * Plays forward normally. When it reaches the end, it reverses frame-by-frame
 * back to the start using requestAnimationFrame + currentTime decrement.
 * When it reaches the start, it plays forward again. Seamless breathing loop.
 *
 * Video: /public/video/hero-bg.mp4
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

    // Fade video in
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

    // --- PING-PONG PLAYBACK ---

    let rafId = 0;
    let prevTimestamp = 0;
    let isReversing = false;
    let disposed = false;

    // Start forward playback
    const playForward = () => {
      if (disposed) return;
      isReversing = false;
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    // Reverse via rAF: decrement currentTime each frame at 1x speed
    const reverseStep = (timestamp: number) => {
      if (disposed || !isReversing) return;

      if (prevTimestamp === 0) prevTimestamp = timestamp;
      const delta = (timestamp - prevTimestamp) / 1000;
      prevTimestamp = timestamp;

      const newTime = video.currentTime - delta;

      if (newTime <= 0) {
        // Reached start — switch to forward
        video.currentTime = 0;
        playForward();
        return;
      }

      video.currentTime = newTime;
      rafId = requestAnimationFrame(reverseStep);
    };

    // When forward playback reaches the end
    const onEnded = () => {
      if (disposed) return;
      isReversing = true;
      video.pause();
      prevTimestamp = 0;
      rafId = requestAnimationFrame(reverseStep);
    };

    video.addEventListener("ended", onEnded);

    // Kick off initial forward play once video is ready
    const startPlayback = () => {
      if (disposed) return;
      playForward();
    };

    if (video.readyState >= 3) {
      startPlayback();
    } else {
      video.addEventListener("canplay", startPlayback, { once: true });
    }

    return () => {
      disposed = true;
      tl.kill();
      cancelAnimationFrame(rafId);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("canplay", startPlayback);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Black base — visible while video loads */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* === HERO BACKGROUND VIDEO === */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        src="/video/hero-bg.mp4"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-[1]" />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_70%)] z-[2]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <h1
          ref={headlineRef}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.9] opacity-0"
        >
          I Build Systems
          <br />
          <span className="text-red-500 text-glow-red">That Think.</span>
        </h1>

        <p
          ref={subtextRef}
          className="mt-6 md:mt-8 text-lg md:text-xl text-white/50 font-light tracking-wide opacity-0"
        >
          Web. Software. AI. Engineered for impact.
        </p>
      </div>

      {/* Scroll indicator */}
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
