import type { Metadata } from "next";
import "./globals.css";
import Noise from "@/components/motion/noise";

export const metadata: Metadata = {
  title: "Terminal Portfolio | Your Name",
  description:
    "A terminal-inspired portfolio showcasing my development skills and projects",
  keywords:
    "portfolio, developer, terminal, web development, TypeScript, Next.js",
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Terminal Portfolio | Your Name",
    description:
      "A terminal-inspired portfolio showcasing my development skills and projects",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terminal Portfolio | Your Name",
    description:
      "A terminal-inspired portfolio showcasing my development skills and projects",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="relative bg-muted">
        {children}
        <Noise
          patternSize={150}
          patternScaleX={5}
          patternScaleY={5}
          patternRefreshInterval={5}
          patternAlpha={5}
        />
      </body>
    </html>
  );
}
