import type { NextConfig } from "next";

// @ts-ignore
const withPWA = require("next-pwa");

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.scryfall\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "scryfall-api-cache",
        expiration: {
          maxEntries: 1000,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /^https:\/\/api\.tcgplayer\.com\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "tcgplayer-api-cache",
        expiration: {
          maxEntries: 500,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
      },
    },
  ],
})(nextConfig);
