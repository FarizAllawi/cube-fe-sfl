/** @type {import('next').NextConfig} */

const withPlugins = require('next-compose-plugins')
const withReactSvg = require('next-react-svg')
require("dotenv").config();
const path = require('path')

const nextConfig = {
  reactStrictMode: false,
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
  reactStrictMode:true,
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