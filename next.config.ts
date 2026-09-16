import type { NextConfig } from "next";

// GitHub Pages serves static files from a subpath, so the Pages build is a
// static export with the repo name as basePath. Any other target (Vercel,
// a Node server) uses the default server build with the /api/orders route.
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.PAGES_BASE_PATH ?? "/cco-ecommerce";

const nextConfig: NextConfig = isPages
  ? {
      output: "export",
      basePath,
      assetPrefix: basePath,
      images: { unoptimized: true },
      trailingSlash: true,
    }
  : {};

export default nextConfig;
