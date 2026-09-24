/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // In production (Vercel), vercel.json's rewrites route /api/* to the
  // Python function directly — this block does nothing there.
  //
  // In local dev, this proxies /api/* to a standalone uvicorn process
  // instead of relying on `vercel dev`'s Python/uv builder — avoids
  // Windows-specific python3/uv/Rust-compilation issues entirely.
  // Run `uvicorn api.index:app --reload --port 8000` alongside
  // `npm run dev` (plain `next dev`) for this to work.
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    return [
      { source: "/api/:path*", destination: "http://127.0.0.1:8000/api/:path*" },
    ];
  },
};

module.exports = nextConfig;
