// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   // Trigger restart for Keystatic fix 2
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.mithilalegacy.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['mithilawasi.com', 'www.mithilawasi.com']
    }
  },
  webpack: (config: any, { isServer, nextRuntime }: any) => {
    // Specifically target the Edge runtime where we want to exclude big Node libraries
    if (nextRuntime === 'edge') {
      config.resolve.alias = {
        ...config.resolve.alias,
        'firebase-admin': false,
        'nodemailer': false,
        '@aws-sdk/client-s3': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;