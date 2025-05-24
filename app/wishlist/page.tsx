"use client"

import Link from "next/link"
import { useWishlist } from "@/contexts/WishlistContext"
import { useCart } from "@/contexts/CartContext"
import { Heart, ShoppingBag, Trash2 } from "lucide-react"

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = (product: any) => {
    // Add with default size and color
    addToCart(product, 1, product.sizes[0], product.colors[0])
    removeFromWishlist(product.id)
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <Heart size={64} className="mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-gray-600 mb-8">Save items you love to your wishlist and shop them later.</p>
          <Link
            href="/catalog"
            className="inline-block bg-rose-600 text-white px-6 py-3 rounded-md hover:bg-rose-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Wishlist ({wishlist.length})</h1>
        <button onClick={clearWishlist} className="text-gray-600 hover:text-rose-600 transition-colors">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="group relative bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Product Image */}
            <Link href={`/product/${product.id}`} className="block overflow-hidden">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="h-[250px] w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Remove Button */}
            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <Trash2 size={16} className="text-gray-600" />
            </button>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-1">
                <Link href={`/product/${product.id}`}>{product.name}</Link>
              </h3>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <p className="font-bold text-gray-900 mb-3">{formatPrice(product.price)}</p>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-1 text-xs text-gray-500">({product.reviews})</span>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
