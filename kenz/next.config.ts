import type { NextConfig } from "next";

/** Les apps qui avaient une page `/projets/<slug>` et en ont une `/apps/<slug>` (voir content/apps.ts). */
const APP_SLUG_PATTERN = "oshii|wado|sago|croc|miru|zenko|escapades-libres";

const nextConfig: NextConfig = {
  /* React Compiler (stable dans Next 16) : mémoïsation automatique, plus de useMemo/useCallback défensifs. */
  reactCompiler: true,

  /* Ancien code (styled-components, framer-motion) : gardé jusqu'au nettoyage final de la refonte V6. */
  compiler: {
    styledComponents: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 180, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      // Ancien code, retiré au nettoyage final.
      { protocol: "https", hostname: "images.unsplash.com" },
      // Drapeaux du sélecteur de langue (API libre, sans clé).
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },

  /* Les anciennes adresses mènent à leur équivalent V6 (308, permanentes). */
  async redirects() {
    return [
      { source: `/projets/:slug(${APP_SLUG_PATTERN})`, destination: "/apps/:slug", permanent: true },
      { source: "/projets/:path*", destination: "/", permanent: true },
      { source: "/destination/:path*", destination: "/createur/voyage", permanent: true },
    ];
  },
};

export default nextConfig;
