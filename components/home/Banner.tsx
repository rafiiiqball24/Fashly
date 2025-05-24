import Link from "next/link"

export default function Banner() {
  return (
    <div className="relative bg-gray-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-rose-600/90 to-gray-900/70"
          style={{ mixBlendMode: "multiply" }}
        ></div>
        <img
          src="/produk/banner.png"
          alt="Fashion Banner"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">New Season Arrivals</h1>
          <p className="text-lg md:text-xl mb-8">
            Discover the latest trends and styles for your wardrobe. Express yourself with our new collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/catalog"
              className="bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors text-center"
            >
              Shop Now
            </Link>
            <Link
              href="/catalog"
              className="bg-transparent border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white/10 transition-colors text-center"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
