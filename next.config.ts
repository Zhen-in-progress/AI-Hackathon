/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  env: {
    API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    API_KEY: process.env.NEXT_PUBLIC_API_KEY,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
