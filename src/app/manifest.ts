import { MetadataRoute } from "next";

export default function Manifest(): MetadataRoute.Manifest {
  return {
    name: "Sander's Pokedex",
    short_name: "Pokedex",
    description: "Grant and Luca's Pokedex",
    start_url: "/",
    display: "standalone",
    background_color: "#eaeaea",
    theme_color: "#eaeaea",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

export const dynamic = "force-static";
