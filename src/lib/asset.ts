// Under a basePath deploy (GitHub Pages) images are served from /<repo>/assets.
// next/image only rewrites its own optimizer URLs, and the Pages build runs
// unoptimized, so public-folder paths are prefixed here instead.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return BASE + path;
}
