import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      { source: '/mods/rav4', destination: '/guides/rav4-se-mods', permanent: false },
      { source: '/mods/sienna', destination: '/guides/sienna-mods', permanent: false },
      { source: '/mods/grand-highlander', destination: '/guides/grand-highlander-mods', permanent: false },
      { source: '/mods/land-cruiser', destination: '/guides/land-cruiser-mods', permanent: false },
      { source: '/mods/prius', destination: '/guides/prius-mods', permanent: false },
      { source: '/mods/prius-prime', destination: '/guides/prius-mods', permanent: false },
      { source: '/mods', destination: '/guides', permanent: false },
    ];
  },
};

export default nextConfig;
