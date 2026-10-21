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
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images.amazon.com',
      },
      {
        protocol: 'https',
        hostname: '**.convertus.com',
      },
      {
        protocol: 'https',
        hostname: 'media.toyota.ca',
      },
      {
        protocol: 'https',
        hostname: '**.dealerprocess.ca',
      },
      {
        protocol: 'https',
        hostname: 'prod.pictures.autoscout24.net',
      },
      {
        protocol: 'https',
        hostname: '**.convertus.rocks',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/mods/rav4', destination: '/guides/rav4-se-mods', permanent: false },
      { source: '/mods/sienna', destination: '/guides/sienna-mods', permanent: false },
      { source: '/mods/grand-highlander', destination: '/guides/grand-highlander-mods', permanent: false },
      { source: '/mods/land-cruiser', destination: '/guides/land-cruiser-mods', permanent: false },
      { source: '/mods/prius', destination: '/guides/prius-mods', permanent: false },
      { source: '/mods/prius-prime', destination: '/guides/prius-mods', permanent: false },
      { source: '/mods/corolla', destination: '/guides/corolla-mods', permanent: false },
      { source: '/mods/corolla-cross', destination: '/guides/corolla-mods', permanent: false },
      { source: '/mods/sequoia', destination: '/guides/sequoia-mods', permanent: false },
      { source: '/mods', destination: '/guides', permanent: false },
      { source: '/estimator', destination: '/#estimator', permanent: false },
    ];
  },
};

export default nextConfig;
