/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  staticPageGenerationTimeout: 180,
};

module.exports = nextConfig;
