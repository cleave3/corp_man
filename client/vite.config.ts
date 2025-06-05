import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
// import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    //   build: {
    //     chunkSizeWarningLimit: 1000,
    //     minify: true,
    //     rollupOptions: {
    //         output: {
    //             manualChunks(id) {
    //                 if ((id as any)?.includes("node_modules")) {
    //                     return id.toString().split("node_modules/")?.[1]?.split("/")?.[0]?.toString();
    //                 }
    //             }
    //         }
    //     },
    //     sourcemap: false
    // },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
        // VitePWA({
        //     registerType: "autoUpdate",
        //     injectRegister: "auto",
        //     includeAssets: ["logo.png", "favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
        //     manifest: {
        //         name: "DeliveryLinkNG",
        //         short_name: "DeliveryLinkNG",
        //         description:
        //             "An open delivery management platform for customers and businesses. DeliveryLink is the best order fulfillment platform in Nigeria.",
        //         icons: [
        //             {
        //                 src: "/manifest-icon-192.maskable.png",
        //                 sizes: "192x192",
        //                 type: "image/png",
        //             },
        //             {
        //                 src: "/manifest-icon-512.maskable.png",
        //                 sizes: "512x512",
        //                 type: "image/png",
        //                 purpose: "any",
        //             },
        //             {
        //                 src: "/manifest-icon-512.maskable.png",
        //                 sizes: "512x512",
        //                 type: "image/png",
        //                 purpose: "maskable",
        //             },
        //         ],

        //         theme_color: "#3f3f95",
        //         background_color: "#fff",
        //         display: "standalone",
        //         scope: "/",
        //         start_url: "/",
        //         orientation: "portrait",
        //     },

        //     workbox: {
        //         globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        //     },
        // }),
  ],
});
