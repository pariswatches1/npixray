import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 is a native C++ addon — must not be bundled by webpack
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
