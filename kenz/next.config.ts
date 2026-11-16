import type { NextConfig } from "next";

/** Les apps qui avaient une page `/projets/<slug>` et en ont une `/apps/<slug>` (voir content/apps.ts). */
const APP_SLUG_PATTERN = "oshii|wado|sago|croc|miru|zenko|escapades-libres";

const nextConfig: NextConfig = {
  /* React Compiler (stable dans Next 16) : mémoïsation automatique, plus de useMemo/useCallback défensifs. */
  reactCompiler: true,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 180, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
