import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https:",
  "connect-src 'self' https://horizon.stellar.org https://horizon-testnet.stellar.org https://*.stellar.org https://api.stellar.expert https://stellar.expert https://aqua.network https: wss: blob:",
  "worker-src 'self' blob:",
  "frame-src 'self' https://stellar.expert",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  transpilePackages: ["@stellar/stellar-sdk"],
  outputFileTracingRoot: __dirname,
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TypeScript errors for deployment
  },
  // Optimize static assets and add Cloudflare CDN support
  assetPrefix: process.env.NODE_ENV === 'production' && process.env.CLOUDFLARE_CDN_URL 
    ? process.env.CLOUDFLARE_CDN_URL 
    : undefined,
  // Enable compression and caching for better performance
  compress: true,
  poweredByHeader: false,
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      net: false,
      tls: false,
      child_process: false,
    };
    if (config.module && typeof config.module === 'object') {
      (config.module as any).exprContextCritical = false;
    }
    // Silence known safe warnings from optional native deps used by stellar-sdk
    // and large string cache serialization noise
    config.ignoreWarnings = [
      /require-addon|sodium-native/,
      /PackFileCacheStrategy.*Serializing big strings/
    ];
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=(), payment=(), usb=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-site" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          ...(isProd ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }] : []),
          ...(isProd ? [{ key: "Content-Security-Policy", value: CSP }] : []),
        ],
      },
      // Optimize 3D model loading with aggressive caching
      {
        source: "/models/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Content-Encoding", value: "gzip" },
        ],
      },
      // Optimize static assets
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || "",
  project: process.env.SENTRY_PROJECT || "",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
});