/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // Ignore the src directory during build
    config.module.rules.push({
      test: /\.jsx?$/,
      include: /src\//,
      use: 'ignore-loader'
    })
    return config
  }
}

export default nextConfig
