"use client";

import { useEffect, useRef } from "react";

/**
 * AmbientBackground — Dual-layer offset constellation loop.
 *
 * Two copies of the same video play simultaneously, offset by half the
 * loop duration (2.5 s). CSS keyframes crossfade between them in perfect
 * inverse phase so the visual restart of each layer is always hidden
 * behind the other layer's peak opacity. Result: infinite, seamless,
 * ambient motion with no visible loop boundary.
 *
 * Position: fixed, z-index: -1. Body background must be transparent for
 * this to show through non-hero sections. The Hero section covers it with
 * its own internal solid bg layer, keeping the hero visually isolated.
 */
export default function AmbientBackground() {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    if (!videoA || !videoB) return;

    // Half of the 5-second clip — B plays from the midpoint so its loop
    // boundary is offset from A's by exactly 2.5 s.
    const HALF_LOOP = 2.5;

    const startA = () => videoA.play().catch(() => {});
    const startB = () => {
      videoB.currentTime = HALF_LOOP;
      videoB.play().catch(() => {});
    };

    if (videoA.readyState >= 3) startA();
    else videoA.addEventListener("canplay", startA, { once: true });

    if (videoB.readyState >= 1) startB();
    else videoB.addEventListener("loadedmetadata", startB, { once: true });
  }, []);

  const sharedVideoStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    willChange: "opacity",
  };

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Layer A — starts at 0 s */}
      <video
        ref={videoARef}
        muted
        playsInline
        loop
        preload="auto"
        src="/video/constellation-bg.mp4"
        style={{
          ...sharedVideoStyle,
          animation: "ambientLayerA 5s ease-in-out infinite",
        }}
      />

      {/* Layer B — offset to 2.5 s via JS on mount */}
      <video
        ref={videoBRef}
        muted
        playsInline
        loop
        preload="auto"
        src="/video/constellation-bg.mp4"
        style={{
          ...sharedVideoStyle,
          animation: "ambientLayerB 5s ease-in-out infinite",
        }}
      />

      {/* Dark veil — preserves foreground legibility at all scroll depths */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(5,5,5,0.62)",
        }}
      />
    </div>
  );
}
