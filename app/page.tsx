"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/Hero";
import IdentityReveal from "@/components/IdentityReveal";
import Services from "@/components/Services";
import Capabilities from "@/components/Capabilities";
import ExperienceStory from "@/components/ExperienceStory";
import ShopSection from "@/components/ShopSection";
import Statement from "@/components/Statement";
import WebsiteCTA from "@/components/WebsiteCTA";
import CallToAction from "@/components/CallToAction";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    // Multiple refreshes to handle pinned section position recalculation
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 100);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 500);
    const t3 = setTimeout(() => ScrollTrigger.refresh(), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
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
      <ShopSection />
      <Statement />
      <WebsiteCTA />
      <CallToAction />
    </main>
  );
}
