// 📁 next.config.js (ESM format)
import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    transpilePackages: ["@stellar/stellar-sdk"]
};

export default nextConfig;
