/** @type {import('next').NextConfig} */

const withPlugins = require('next-compose-plugins')
const withReactSvg = require('next-react-svg')
require("dotenv").config();
const path = require('path')

const nextConfig = {
  reactStrictMode: false,
  // async rewrites() {
  //   return [
  //     {
  //       source: `/api`,
  //       destination: `${process.env.NEXT_PUBLIC_API_STORAGE}/files/upload`,
  //     },
  //   ]
  // },
  
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