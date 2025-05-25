/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   esmExternals: 'loose'
  // },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  // Skip static generation untuk halaman yang bermasalah
  // exportPathMap: async function () {
  //   return {
  //     '/': { page: '/' },
  //     // Skip halaman yang error saat build
  //     // '/CartPage': { page: '/CartPage' },
  //     // '/CatalogPage': { page: '/CatalogPage' },
  //   }
  // }
}

module.exports = nextConfig