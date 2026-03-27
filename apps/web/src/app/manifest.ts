import type { MetadataRoute } from "next";
import { runtimeConfig } from "../lib/runtime-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/app",
    name: runtimeConfig.appName,
    short_name: runtimeConfig.appShortName,
    description: runtimeConfig.appDescription,
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4efe4",
    theme_color: "#0f7668",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/icons/maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    shortcuts: [
      {
        name: "Open app shell",
        short_name: "App",
        description: "Jump directly into the installed workspace shell.",
        url: "/app"
      },
      {
        name: "System health",
        short_name: "Health",
        description: "Open the health module card in the app shell.",
        url: "/app#system-health"
      }
    ]
  };
}
