import type { MetadataRoute } from "next";

const description =
  "Mobile-first hypertrophy workout planner and progress tracker";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#eeebe3",
    description,
    display: "standalone",
    icons: [
      {
        sizes: "192x192",
        src: "/icons/icon-192.png",
        type: "image/png",
      },
      {
        sizes: "512x512",
        src: "/icons/icon-512.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/icons/maskable-512.png",
        type: "image/png",
      },
    ],
    name: "Setwise",
    orientation: "portrait",
    scope: "/",
    short_name: "Setwise",
    start_url: "/today",
    theme_color: "#173b32",
  };
}
