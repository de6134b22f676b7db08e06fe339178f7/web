import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` emits HTML/CSS/JS to `out/`.
  output: "export",
  // Default next/image loader needs a server; serve images as-is.
  images: {
    unoptimized: true,
  },
  // Inline the (small) route CSS into <head>: removes the render-blocking stylesheet round trip on first visit.
  experimental: {
    inlineCss: true,
  },
};

export default nextConfig;
