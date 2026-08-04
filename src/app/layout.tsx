import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: { default: "CaseProof — Evidence before release", template: "%s · CaseProof" },
  description: "A deterministic delivery control plane for safety-critical product work.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a href="#main-content" className="skip-link">Skip to content</a><Shell><div id="main-content">{children}</div></Shell></body></html>;
}
