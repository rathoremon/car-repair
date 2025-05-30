import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: "autoUpdate",
    //   includeAssets: [
    //     "favicon.svg",
    //     "robots.txt",
    //     "apple-touch-icon.png",
    //     "pwa-192x192.png",
    //     "pwa-512x512.png",
    //   ],
    //   manifest: {
    //     name: "Trasure",
    //     short_name: "Trasure",
    //     description: "Let Travel Be A Treasure",
    //     theme_color: "#1e293b", // MUI primary.main
    //     background_color: "#ffffff", // MUI background.default
    //     display: "standalone",
    //     devOptions: { enabled: true },
    //     start_url: "/",
    //     icons: [
    //       {
    //         src: "/pwa-192x192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/pwa-512x512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //     ],
    //   },
    //   workbox: {
    //     globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
    //     runtimeCaching: [
    //       // App shell: aggressive cache-first
    //       {
    //         urlPattern: ({ request }) =>
    //           request.destination === "document" ||
    //           request.destination === "script" ||
    //           request.destination === "style",
    //         handler: "CacheFirst",
    //         options: {
    //           cacheName: "app-shell-assets",
    //           expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
    //         },
    //       },
    //       // API: network-first with fallback
    //       {
    //         urlPattern: /^https:\/\/your-api-domain\.com\/api\//,
    //         handler: "NetworkFirst",
    //         options: {
    //           cacheName: "api-cache",
    //           networkTimeoutSeconds: 5,
    //           expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
    //           cacheableResponse: { statuses: [0, 200] },
    //         },
    //       },
    //     ],
    //   },
    //   devOptions: { enabled: true },
    // }),
  ],
});
