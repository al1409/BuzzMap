import type { Metadata } from "next";
import "./globals.css";
import "./progression.css";
import "./avatar.css";
import "./hair.css";
import "./single-avatar.css";
import "./welcome.css";
import "./cta.css";
import "./identity.css";
import "./level-one.css";
import "./level-flag.css";
import "./flag-enhance.css";
import "./email-demo.css";
import "./finish-sequence.css";
import "./gt-theme.css";
import "./yellow-jacket-celebration.css";
import "./cap.css";
import "./arrival.css";
import "./map-yellow-jacket.css";
import "./academic-takeoff.css";
import "./layout-fixes.css";
import "./resume-level.css";
import "./drawer-overlap-fix.css";
import "./copilot.css";
import "./copilot-functional.css";
import "./simple-walking.css";
import "./ultra-simple-walk.css";
import "./illustrated-campus-map.css";
import "./copilot-tour.css";
import "./final-ready.css";
import "./pretty-polish.css";

export const metadata: Metadata = {
  title: "Buzz Map | Georgia Tech",
  description: "Your personalized map to Georgia Tech onboarding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
