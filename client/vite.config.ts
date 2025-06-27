import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        svgr({
            svgrOptions: {
                icon: true,
                exportType: "named",
                namedExport: "ReactComponent"
            }
        }),
        VitePWA({
            registerType: "autoUpdate",
            injectRegister: "auto",
            includeAssets: [
                "corpman_lightmode.png",
                "corpman_darkmode.png",
                "favicon.png",
                "splashscreens/splash-640x1136.png",
                "splashscreens/splash-750x1334.png",
                "splashscreens/splash-828x1792.png",
                "splashscreens/splash-1125x2436.png",
                "splashscreens/splash-1242x2208.png",
                "splashscreens/splash-1242x2688.png",
                "splashscreens/splash-1536x2048.png",
                "splashscreens/splash-1668x2224.png",
                "splashscreens/splash-1668x2388.png",
                "splashscreens/splash-2048x2732.png"
            ],
            manifest: {
                name: "CorpMan",
                short_name: "CorpMan",
                start_url: ".",
                display: "standalone",
                background_color: "#ffffff",
                theme_color: "#0f172a",
                description: "CorpMan - Corporate Management App",
                icons: [
                    {
                        src: "/corpman_lightmode.png",
                        sizes: "512x512",
                        type: "image/png"
                    },
                    {
                        src: "/corpman_darkmode.png",
                        sizes: "192x192",
                        type: "image/png"
                    }
                ],
                screenshots: [
                    {
                        src: "/splashscreens/splash-640x1136.png",
                        sizes: "640x1136",
                        type: "image/png"
                    },
                    {
                        src: "/splashscreens/splash-750x1334.png",
                        sizes: "750x1334",
                        type: "image/png"
                    },
                    {
                        src: "/splashscreens/splash-828x1792.png",
                        sizes: "828x1792",
                        type: "image/png"
                    },
                    {
                        src: "/splashscreens/splash-1125x2436.png",
                        sizes: "1125x2436",
                        type: "image/png"
                    },
                    {
                        src: "/splashscreens/splash-1242x2208.png",
                        sizes: "1242x2208",
                        type: "image/png"
                    },
                    {
                        src: "/splashscreens/splash-1242x2688.png",
                        sizes: "1242x2688",
                        type: "image/png"
                    },
                    {
                        src: "/splashscreens/splash-1536x2048.png",
                        sizes: "1536x2048",
                        type: "image/png"
                    },
                    {
                        src: "/splashscreens/splash-1668x2224.png",
                        sizes: "1668x2224",
                        type: "image/png"
                    },
                    {
                        src: "/splashscreens/splash-1668x2388.png",
                        sizes: "1668x2388",
                        type: "image/png"
                    },
                    {
                        src: "/splashscreens/splash-2048x2732.png",
                        sizes: "2048x2732",
                        type: "image/png"
                    }
                ]
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts",
                            expiration: {
                                maxEntries: 30,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "jsdelivr-cdn",
                            expiration: {
                                maxEntries: 30,
                                maxAgeSeconds: 60 * 60 * 24 * 365
                            }
                        }
                    }
                ],
                skipWaiting: true,
                clientsClaim: true
            },
            devOptions: {
                enabled: true
            }
        })
    ]
});
