/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "affstoragesbx.blob.core.windows.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nonameesbaff.blob.core.windows.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
