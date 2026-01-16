import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  allowedDevOrigins: ["1272db0ed565.ngrok-free.app"],

};

module.exports = {
  allowedDevOrigins: ['1272db0ed565.ngrok-free.app', '*.1272db0ed565.ngrok-free.app'],
}

export default nextConfig;
