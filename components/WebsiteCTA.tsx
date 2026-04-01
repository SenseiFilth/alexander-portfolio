"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const UPWORK_URL =
  "https://www.upwork.com/services/product/design-dynamic-personal-website-interactive-animated-high-end-design-2038279724912340969?ref=project_share&tier=1";

const tiers = [
  {
    name: "Starter",
    price: "$150",
    label: "Clean Personal Website",
    description: "Modern website with animations and responsive design",
  },
  {
    name: "Standard",
    price: "$350",
    label: "Interactive Dynamic Website",
    description: "Animated website with interactive sections and smooth UX",
    featured: true,
  },
  {
    name: "Advanced",
    price: "$750",
    label: "High-End Cinematic Website",
    description: "Premium animated portfolio with custom interactions and branding",
  },
];

export default function WebsiteCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
        else setIsVisible(false);
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <div
          className="text-center mb-16 transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0px)" : "translateY(40px)",
          }}
        >
          <p className="text-xs tracking-[0.4em] uppercase text-red-500/60 mb-4">
            Reserve a Custom Website
          </p>
          <h2 className="font-cs text-3xl md:text-5xl font-black">
            Want a site <span className="text-red-500 text-glow-red">like this?</span>
          </h2>
          <p className="mt-4 text-white/40 font-light max-w-lg mx-auto text-base md:text-lg tracking-widest uppercase">
            Craft your premium digital experience today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`relative glass-card rounded-2xl p-8 text-center cursor-pointer
                         transition-all duration-700 ease-out group
                         ${
                           tier.featured
                             ? "border-red-500/30 shadow-[0_0_30px_rgba(255,42,42,0.1)]"
                             : "hover:border-red-500/20 hover:shadow-[0_0_20px_rgba(255,42,42,0.1)]"
                         }`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0px)" : "translateY(50px)",
                transitionDelay: `${200 + i * 150}ms`,
              }}
              onClick={() => window.open(UPWORK_URL, "_blank", "noopener,noreferrer")}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-500 text-white text-[10px] tracking-[0.3em] uppercase rounded-full">
                  Popular
                </div>
              )}

              <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-2">
                {tier.name}
              </p>
              <p className="text-4xl font-black text-white mb-1">{tier.price}</p>
              <p className="text-sm font-semibold text-red-500/80 mb-3">
                {tier.label}
              </p>
              <p className="text-white/30 text-sm font-light leading-relaxed">
                {tier.description}
              </p>

              <div className="mt-6 px-4 py-2 border border-white/10 rounded-lg text-white/40 text-xs tracking-[0.2em] uppercase group-hover:border-red-500/40 group-hover:text-red-500 transition-all duration-300">
                Reserve on Upwork
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
