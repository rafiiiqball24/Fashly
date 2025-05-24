"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, ShoppingBag, Truck, RotateCcw, Shield, Star, ChevronRight } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import type { Product } from "@/types/product"

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  // Color name mapping for display
  const colorNames: Record<string, string> = {
    black: "Black",
    white: "White",
    blue: "Blue",
    navy: "Navy",
    red: "Red",
    beige: "Beige",
    gray: "Gray",
    maroon: "Maroon",
    cream: "Cream",
    olive: "Olive",
    khaki: "Khaki",
    "light-blue": "Light Blue",
    "floral-blue": "Floral Blue",
    "floral-pink": "Floral Pink",
  }

  // Color class mapping for display
  const colorClasses: Record<string, string> = {
    black: "bg-black",
    white: "bg-white border border-gray-300",
    blue: "bg-blue-600",
    navy: "bg-indigo-900",
    red: "bg-red-600",
    beige: "bg-amber-100",
    gray: "bg-gray-500",
    maroon: "bg-red-900",
    cream: "bg-amber-50 border border-gray-300",
    olive: "bg-olive-600",
    khaki: "bg-yellow-700",
    "light-blue": "bg-blue-300",
    "floral-blue": "bg-blue-400",
    "floral-pink": "bg-pink-400",
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleWishlistClick = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-rose-600">
          Home
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <Link href="/catalog" className="hover:text-rose-600">
          Catalog
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <Link href={`/catalog?category=${product.category}`} className="hover:text-rose-600">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 mt-4 md:mt-0">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`w-16 h-16 border rounded-md overflow-hidden ${
                    selectedImage === index ? "border-rose-600" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          <div className="flex flex-col h-full">
            {/* Product Details */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <p className="text-2xl font-bold mt-4">{formatPrice(product.price)}</p>

              <p className="text-gray-600 mt-4">{product.description}</p>

              {/* Color Selection */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <div className="flex items-center gap-2 mt-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-full ${colorClasses[color]} flex items-center justify-center ${
                        selectedColor === color ? "ring-2 ring-offset-2 ring-rose-600" : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                      title={colorNames[color]}
                    >
                      {selectedColor === color && (
                        <span
                          className={`text-xs ${["white", "cream", "beige"].includes(color) ? "text-black" : "text-white"}`}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-1">Selected: {colorNames[selectedColor]}</p>
              </div>

              {/* Size Selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <a href="#" className="text-sm text-rose-600 hover:text-rose-700">
                    Size Guide
                  </a>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`py-2 border rounded-md text-center ${
                        selectedSize === size
                          ? "bg-rose-600 text-white border-rose-600"
                          : "border-gray-300 hover:border-rose-600"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                <div className="flex items-center mt-2">
                  <button
                    className="w-10 h-10 border border-gray-300 rounded-l-md flex items-center justify-center"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-16 h-10 text-center border-t border-b border-gray-300"
                  />
                  <button
                    className="w-10 h-10 border border-gray-300 rounded-r-md flex items-center justify-center"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2 ${
                    addedToCart ? "bg-green-600 text-white" : "bg-rose-600 text-white hover:bg-rose-700"
                  }`}
                >
                  <ShoppingBag size={20} />
                  {addedToCart ? "Added to Cart!" : "Add to Cart"}
                </button>
                <button
                  onClick={handleWishlistClick}
                  className={`flex-1 py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2 ${
                    inWishlist ? "bg-rose-600 text-white" : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Heart size={20} className={inWishlist ? "fill-current" : ""} />
                  {inWishlist ? "In Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Truck size={20} className="text-gray-600" />
                  <div>
                    <h4 className="font-medium">Free Shipping</h4>
                    <p className="text-sm text-gray-600">On orders over Rp 500.000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw size={20} className="text-gray-600" />
                  <div>
                    <h4 className="font-medium">Easy Returns</h4>
                    <p className="text-sm text-gray-600">30 day return policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-gray-600" />
                  <div>
                    <h4 className="font-medium">Secure Payments</h4>
                    <p className="text-sm text-gray-600">Protected by encryption</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
