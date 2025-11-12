import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  output: 'standalone', 
  images: {
    domains: [
      'picsum.photos', 
      'fakestoreapi.com',
      'loremflickr.com',
      'source.unsplash.com',
    ],
  },
};

export default withFlowbiteReact(nextConfig);