"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * HERO SECTION — Full screen cinematic intro with scroll-synced video.
 *
 * SMOOTH SCROLL-SYNCED VIDEO:
 * The hidden <video> element is the frame source. A <canvas> renders the
 * current frame, which avoids the browser's choppy keyframe-seeking when
 * setting video.currentTime directly on a visible <video>.
 *
 * How it works:
 *   1. GSAP ScrollTrigger maps scroll position → target time (scrub: 1)
 *   2. A rAF loop lerps the actual seek time toward the target (smoothing)
 *   3. video.currentTime is set to the lerped value
 *   4. requestVideoFrameCallback (or rAF fallback) paints the decoded frame
 *      onto a <canvas> at native resolution — this is what the user sees
 *
 * The lerp (linear interpolation) smoothing is the key to eliminating choppiness.
 * Instead of jumping directly to the scroll-mapped time, the actual seek time
 * glides toward it at ~10% per frame, creating fluid motion even between keyframes.
 *
 * Video: /public/video/hero-bg.mp4
 */
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mutable state for the rAF render loop (avoids re-renders)
  const scrollVideoState = useRef({
    targetTime: 0,    // where scroll says we should be
    currentTime: 0,   // where we're actually seeking (lerped)
    duration: 0,
    rafId: 0,
    ready: false,
  });

  /**
   * Paint the current video frame onto the canvas.
   * Called via requestVideoFrameCallback or rAF fallback.
   */
  const paintFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match canvas internal resolution to video dimensions for crisp output
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }, []);

  /**
   * Core render loop: lerp toward target time, seek video, paint canvas.
   * Runs every frame via requestAnimationFrame.
   */
  const renderLoop = useCallback(() => {
    const state = scrollVideoState.current;
    const video = videoRef.current;

    if (video && state.ready && state.duration > 0) {
      // Lerp: glide current time toward target (0.1 = ~10% per frame = very smooth)
      const lerpFactor = 0.1;
      const diff = state.targetTime - state.currentTime;

      // Only seek if the difference is meaningful (> 1ms)
      if (Math.abs(diff) > 0.001) {
        state.currentTime += diff * lerpFactor;

        // Clamp to valid range
        state.currentTime = Math.max(0, Math.min(state.duration, state.currentTime));

        video.currentTime = state.currentTime;
      }

      paintFrame();
    }

    state.rafId = requestAnimationFrame(renderLoop);
  }, [paintFrame]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!video || !canvas || !container) return;

    // Intro text animations (non-scroll, play once on load)
    const tl = gsap.timeline({ delay: 0.3 });

    gsap.fromTo(
      canvas,
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

    // --- SCROLL-SYNCED VIDEO SETUP ---

    const setupScrollVideo = () => {
      const duration = video.duration;
      if (!duration || !isFinite(duration)) return;

      video.pause();
      video.currentTime = 0;

      const state = scrollVideoState.current;
      state.duration = duration;
      state.targetTime = 0;
      state.currentTime = 0;
      state.ready = true;

      // Paint the first frame immediately
      paintFrame();

      // GSAP ScrollTrigger sets the TARGET time — the rAF loop lerps toward it
      gsap.to(state, {
        targetTime: duration,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Start the render loop
      state.rafId = requestAnimationFrame(renderLoop);
    };

    if (video.readyState >= 1) {
      setupScrollVideo();
    } else {
      video.addEventListener("loadedmetadata", setupScrollVideo, { once: true });
    }

    return () => {
      tl.kill();
      cancelAnimationFrame(scrollVideoState.current.rafId);
      scrollVideoState.current.ready = false;
      video.removeEventListener("loadedmetadata", setupScrollVideo);
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
    };
  }, [paintFrame, renderLoop]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Black base — visible while video loads */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Hidden video element — frame source only, never displayed */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="hidden"
        src="/video/hero-bg.mp4"
      />

      {/* Canvas renders the scroll-synced video frames — this is what the user sees */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        aria-hidden="true"
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
