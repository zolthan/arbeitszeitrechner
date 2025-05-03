import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from 'path';

export default defineConfig({
    resolve: {
        alias: [
            {find: '@', replacement: path.resolve(__dirname, 'src')}
        ]
    },
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.svg", "favicon.ico", "apple-touch-icon.png"],
            manifest: {
                name: "Arbeitszeit-Rechner",
                short_name: "AZ-Rechner",
                description: "Arbeitszeit-Feierabendrechner mit Pausenlogik",
                theme_color: "#ffffff",
                background_color: "#ffffff",
                display: "standalone",
                scope: "/",
                start_url: "/",
                icons: [
                    {
                    "src": "/web-app-manifest-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png",
                    "purpose": "maskable"    
                    },
                    {
                    "src": "/web-app-manifest-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png",
                    "purpose": "maskable"
                    }
                ]
            }
        })
    ]
});