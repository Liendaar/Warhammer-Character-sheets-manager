import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Warhammer-Character-sheets-manager',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
