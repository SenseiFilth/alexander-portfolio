"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const UPWORK_URL =
  "https://www.upwork.com/services/product/design-dynamic-personal-website-interactive-animated-high-end-design-2038279724912340969?ref=project_share&tier=1";

const tiers = [
  {
    name: "Starter",
    price: "$250+",
    label: "Launch-Ready Website",
    description:
      "A polished 1–3 page website for personal brands, portfolios, freelancers, or simple business presence.",
    includes: [
      "1–3 responsive pages",
      "Clean modern layout",
      "Mobile optimization",
      "Basic scroll animations",
      "Contact section or CTA",
      "Portfolio/social links",
      "Deployed live to Vercel"
    ],
    bestFor: "Personal websites, resumes, simple service pages",
  },
  {
    name: "Standard",
    price: "$500+",
    label: "Custom Interactive Website",
    description:
      "A more dynamic website with stronger branding, interactive sections, motion design, and a smoother user experience.",
    featured: true,
    includes: [
      "Up to 5 custom sections/pages",
      "Custom visual direction",
      "Interactive UI sections",
      "Advanced animations",
      "Responsive mobile/tablet/desktop design",
      "Contact form or booking link integration",
      "Basic SEO setup",
      "Live deployment"
    ],
    bestFor: "Startups, creators, consultants, service businesses",
  },
  {
    name: "Advanced",
    price: "$1,000+",
    label: "Premium Web Experience",
    description:
      "A high-end cinematic website built around custom branding, premium motion, strategic UX, and conversion-focused presentation.",
    includes: [
      "Custom homepage and core pages",
      "Premium motion/scroll interactions",
      "Brand direction and visual system",
      "Conversion-focused layout",
      "CMS, blog, or project gallery setup",
      "Advanced forms or integrations",
      "Performance optimization",
      "Deployment and handoff support"
    ],
    bestFor: "Premium brands, product launches, portfolios, agencies",
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
      <div className="max-w-6xl mx-auto">
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
          <h2 className="font-aquire text-3xl md:text-5xl font-black">
            <span className="block md:inline">Want a site </span>
            <span className="block md:inline text-red-500 text-glow-red">like this?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`relative glass-card rounded-2xl p-8 text-center cursor-pointer
                         transition-all duration-700 ease-out group flex flex-col
                         ${
                           tier.featured
                             ? "border-red-500/30 shadow-[0_0_30px_rgba(255,42,42,0.1)] md:scale-105"
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
              <p className="text-white/40 text-sm font-light leading-relaxed mb-6">
                {tier.description}
              </p>

              {/* What's Included */}
              <div className="text-left mb-6 flex-grow">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3">
                  What's Included
                </p>
                <ul className="space-y-2">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-white/30">
                      <span className="text-red-500 mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best For */}
              <div className="text-left mb-6 py-4 border-t border-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                  Best For
                </p>
                <p className="text-sm text-white/40 italic">{tier.bestFor}</p>
              </div>

              <div className="px-4 py-2 border border-white/10 rounded-lg text-white/40 text-xs tracking-[0.2em] uppercase group-hover:border-red-500/40 group-hover:text-red-500 transition-all duration-300">
                Reserve on Upwork
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
