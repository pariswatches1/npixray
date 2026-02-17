import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep better-sqlite3 external for local migration scripts
  serverExternalPackages: ["better-sqlite3"],
  // Increase timeout for static page generation (many pages)
  staticPageGenerationTimeout: 600,
};

export default nextConfig;
