import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  output: 'standalone', 
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos',},
      { protocol: 'https', hostname: 'fakestoreapi.com'},
      { protocol: 'https', hostname: 'loremflickr.com'},
      { protocol: 'https', hostname: 'source.unsplash.com'},
    ],
  },
};

export default withFlowbiteReact(nextConfig);