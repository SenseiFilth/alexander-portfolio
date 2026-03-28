"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect if a media query matches.
 * Used to simplify animations on mobile.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/** Convenience: true when viewport <= 768px */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}
