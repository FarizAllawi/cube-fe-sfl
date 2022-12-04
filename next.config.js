/** @type {import('next').NextConfig} */

const withPlugins = require('next-compose-plugins')
const withReactSvg = require('next-react-svg')
require("dotenv").config();
const path = require('path')

const nextConfig = {
  reactStrictMode: false,
//   async headers() {
//     return [
//       {
//         // matching all API routes
//         source: `${process.env.NEXT_PUBLIC_KCH_OFFICE_SERVICE}/api/:path*`,
//         headers: [
//           { key: "Access-Control-Allow-Credentials", value: "true" },
//           { key: "Access-Control-Allow-Origin", value: "*" },
//           { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
//           { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
//         ]
//       },
//       {
//         // matching all API routes
//         source: `${process.env.NEXT_PUBLIC_ECA_SERVICE}/api/:path*`,
//         headers: [
//           { key: "Access-Control-Allow-Credentials", value: "true" },
//           { key: "Access-Control-Allow-Origin", value: "*" },
//           { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
//           { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
//         ]
//       },
//     ]
//   }
// ,
  async rewrites() {
    return [
      {
        source: `/api`,
        destination: `${process.env.NEXT_PUBLIC_API_STORAGE}/files/upload`,
      },
      {
        source: `/api/getFile/:path*`,
        destination: `${process.env.NEXT_PUBLIC_API_STORAGE}/files/get?filePath=:path*`,
      },
      {
        source: `/api/deleteFile/:path*`,
        destination: `${process.env.NEXT_PUBLIC_API_STORAGE}/files/delete?filePath=:path*`,
      },
    ]
  },
  images: {
    dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  swcMinify: true,
}

module.exports = async (phase) => withPlugins(
  [withReactSvg({ 
    include: path.resolve(__dirname, "./public/images/svg/"),
    webpack(config,options){
      config.resolve = config.resolve || {};
      return config
    }, 
})], nextConfig)(phase, { undefined });