import type { Metadata } from "next";
import "./globals.css";
import AmbientBackground from "@/components/AmbientBackground";

export const metadata: Metadata = {
  title: "Alexander McKinnon-Brown | Developer & AI Consultant",
  description:
    "Full Stack Developer, AI Consultant, and Systems Designer. I build systems that think.",
  keywords: [
    "developer",
    "AI consultant",
    "full stack",
    "web development",
    "systems design",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Fixed constellation ambient loop — sits behind all sections.
            Hero covers it with its own internal bg-[#050505] layer. */}
        <AmbientBackground />
        {/* Animated noise/grain overlay */}
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
