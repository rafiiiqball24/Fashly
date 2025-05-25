// import { Link } from "react-router-dom"
import { Heart } from "lucide-react"

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const ProductCard = ({ product }) => {
  return (
    <div className="group relative">
      {/* Product Image */}
      {/* Ganti dengan <a> atau Next.js <Link> jika migrasi ke Next.js */}
      <a href={`/product/${product.id}`} className="block overflow-hidden rounded-lg bg-gray-100">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="h-[300px] w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <span className="bg-rose-600 text-white text-xs px-2 py-1 rounded">New</span>}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded">Best Seller</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full opacity-70 hover:opacity-100 transition-opacity">
          <Heart size={18} className="text-gray-800" />
        </button>
      </a>

      {/* Product Info */}
      <div className="mt-4 flex flex-col">
        <h3 className="text-sm font-medium text-gray-700">
          {/* Ganti dengan <a> atau Next.js <Link> jika migrasi ke Next.js */}
          <a href={`/product/${product.id}`}>{product.name}</a>
        </h3>
        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        <p className="mt-1 font-medium text-gray-900">{formatPrice(product.price)}</p>

        {/* Rating */}
        <div className="mt-1 flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400"
                    : i < product.rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-1 text-xs text-gray-500">({product.reviews})</span>
        </div>
      </div>

      {/* Quick Add Button - Appears on Hover */}
      <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity pb-4">
        <Link
          to={`/product/${product.id}`}
          className="mx-2 block bg-rose-600 text-white text-center py-2 rounded-md hover:bg-rose-700 transition-colors"
        >
          View Product
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
