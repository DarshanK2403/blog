/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig = {
  allowedDevOrigins: ["http://192.168.0.160:3000"],

  images: {
    domains: ["res.cloudinary.com"], // ✅ For next/image support if needed
  },

  async rewrites() {
    return [
      {
        source: "/img/:slug*",
        destination: "/api/img/:slug*", // ✅ Rewrites short URLs to Cloudinary proxy route
      },
    ];
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
