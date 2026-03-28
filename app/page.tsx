"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/Hero";
import IdentityReveal from "@/components/IdentityReveal";
import Services from "@/components/Services";
import Capabilities from "@/components/Capabilities";
import ExperienceStory from "@/components/ExperienceStory";
import Statement from "@/components/Statement";
import CallToAction from "@/components/CallToAction";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    // Refresh ScrollTrigger after all components mount
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => {
      clearTimeout(timeout);
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <main>
      <Hero />
      <IdentityReveal />
      <Services />
      <Capabilities />
      <ExperienceStory />
      <Statement />
      <CallToAction />
    </main>
  );
}
