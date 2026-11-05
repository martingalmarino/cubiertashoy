import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "cubiertashoy.vercel.app" }],
        destination: "https://www.precioneumaticos.com.ar/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
