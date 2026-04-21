import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EnviroAgent — Your AI That Modifies Your World to Make You Win",
  description: "Set long-term commitments. EnviroAgent deploys dedicated AI agents that reshape your environment to make your goals inevitable.",
  keywords: "AI agents, goal tracking, personal AI, commitment, environment, productivity",
  authors: [{ name: "EnviroAgent" }],
  openGraph: {
    title: "EnviroAgent — Your AI That Modifies Your World to Make You Win",
    description: "Set long-term commitments. EnviroAgent deploys dedicated AI agents that reshape your environment to make your goals inevitable.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-screen antialiased" style={{ fontFamily: "var(--font-inter, sans-serif)" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
