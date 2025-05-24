"use client"

import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { products } from "../data/products"
import { Heart, ShoppingBag, Truck, RotateCcw, Shield, Star, ChevronRight } from "lucide-react"

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const ProductDetailPage = () => {
  const { id } = useParams()
  const { addToCart } = useCart()

  // Find product by ID
  const product = products.find((p) => p.id === Number.parseInt(id))

  // State for selected options (moved to top level)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(() => (product ? product.colors[0] : ""))
  const [selectedSize, setSelectedSize] = useState(() => (product ? product.sizes[0] : ""))
  const [quantity, setQuantity] = useState(1)

  // If product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/catalog"
          className="inline-block bg-rose-600 text-white px-6 py-3 rounded-md hover:bg-rose-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor)
    // Show success message or redirect to cart
  }

  // Color name mapping for display
  const colorNames = {
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
  const colorClasses = {
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-rose-600">
          Home
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <Link to="/catalog" className="hover:text-rose-600">
          Catalog
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <Link to={`/catalog?category=${product.category}`} className="hover:text-rose-600">
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
                  className="flex-1 bg-rose-600 text-white py-3 px-6 rounded-md hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>
                <button className="flex-1 border border-gray-300 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Heart size={20} />
                  Add to Wishlist
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

      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button className="py-4 px-6 border-b-2 border-rose-600 text-rose-600 font-medium">Description</button>
            <button className="py-4 px-6 text-gray-500 hover:text-gray-700">Reviews ({product.reviews})</button>
            <button className="py-4 px-6 text-gray-500 hover:text-gray-700">Shipping & Returns</button>
          </nav>
        </div>

        <div className="py-6">
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl
            aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl
            aliquam nisl, eget aliquam nisl nisl sit amet nisl.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed
            euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
          </p>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter((p) => p.id !== product.id && p.category === product.category)
            .slice(0, 4)
            .map((relatedProduct) => (
              <div key={relatedProduct.id} className="group relative">
                <Link to={`/product/${relatedProduct.id}`} className="block overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={relatedProduct.images[0] || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    className="h-[200px] w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    <Link to={`/product/${relatedProduct.id}`}>{relatedProduct.name}</Link>
                  </h3>
                  <p className="mt-1 font-medium text-gray-900">{formatPrice(relatedProduct.price)}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
