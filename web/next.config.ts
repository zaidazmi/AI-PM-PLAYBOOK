import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Pin the workspace root to this `web/` directory. Without this, Next detects
  // a stray package-lock.json in the user's home folder and infers ~/ as the
  // root, causing Turbopack to watch the entire home tree (runaway memory / OOM
  // in `next dev`). This only scopes the bundler's module resolution and file
  // watching — runtime fs reads of ../ markdown in content.ts are unaffected.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
