import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Use project directory as root to avoid multiple-lockfile warning
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;


