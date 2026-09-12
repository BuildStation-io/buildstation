import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  async redirects() {
    return [
      {
        source: "/oss",
        destination: "/projects",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
