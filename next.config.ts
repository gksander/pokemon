import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // experimental: {
  //   swcPlugins: [["@lingui/swc-plugin", {}]],
  // },
  // webpack: (config) => {
  //   config.module.rules.push({
  //     test: /\.po$/,
  //     use: {
  //       loader: "@lingui/loader",
  //     },
  //   });
  //   return config;
  // },
  // async headers() {
  //   return [
  //     {
  //       source: "/:path*",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "max-age=0, s-maxage=86400",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
