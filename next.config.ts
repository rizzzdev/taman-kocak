import { envConfig } from "@/shared/configs/envConfig";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: envConfig.apiUrl! + "/:path*",
      },
      {
        source: "/image/:path*",
        destination: envConfig.imageHostingUrl + "/:path*",
      },
    ];
  },
};

export default nextConfig;
