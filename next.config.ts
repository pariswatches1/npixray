import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 is a native C++ addon — must not be bundled by webpack
  serverExternalPackages: ["better-sqlite3"],
  // Increase timeout for pages that query the 939MB SQLite database at build time
  staticPageGenerationTimeout: 300,
};

export default nextConfig;
