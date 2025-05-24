"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { products } from "@/lib/data/products"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingBag } from "lucide-react"
import type { Product } from "@/types/product"

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  color: string
  size: string
  quantity: number
}

const addToCart = (item: Omit<CartItem, "quantity">): void => {
  if (typeof window === "undefined") return

  try {
    const cart = localStorage.getItem("cart")
    const cartItems: CartItem[] = cart ? JSON.parse(cart) : []

    const existingIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.color === item.color && cartItem.size === item.size,
    )

    if (existingIndex > -1) {
      cartItems[existingIndex].quantity += 1
    } else {
      cartItems.push({ ...item, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(cartItems))
    window.dispatchEvent(new CustomEvent("cartUpdated"))
  } catch (error) {
    console.error("Error adding to cart:", error)
  }
}

export default function ProductPage() {
  const params = useParams()
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState("")
  const [imageTransition, setImageTransition] = useState(false)

  useEffect(() => {
    if (id) {
      const foundProduct = products.find((p) => p.id.toString() === id)
      if (foundProduct) {
        setProduct(foundProduct)
        setSelectedColor(foundProduct.colors[0])
        setSelectedSize(foundProduct.sizes[0])
        setCurrentImage(foundProduct.images[0])
      }
    }
  }, [id])

  if (!product) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert("Silakan pilih warna dan ukuran terlebih dahulu!")
      return
    }

    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: currentImage,
        color: selectedColor,
        size: selectedSize,
      })

      alert(`${product.name} berhasil ditambahkan ke keranjang!`)
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Gagal menambahkan produk ke keranjang. Silakan coba lagi.")
    }
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    setImageTransition(true)

    setTimeout(() => {
      const colorIndex = product.colors.findIndex((c) => c === color)
      let imageIndex = 0

      // Map colors to specific images based on the new color names
      switch (color) {
        case "red":
        case "light-red":
          imageIndex = 0
          break
        case "white":
          imageIndex = 1 % product.images.length
          break
        case "black":
          imageIndex = 1 % product.images.length
          break
        case "blue":
        case "light-blue":
          imageIndex = 0 % product.images.length
          break
        case "pink":
          imageIndex = 1 % product.images.length
          break
        case "brown":
        case "light-brown":
          imageIndex = 0 % product.images.length
          break
        case "gray":
        case "silver misty":
          imageIndex = 1 % product.images.length
          break
        case "cream":
        case "beige":
          imageIndex = 0 % product.images.length
          break
        case "army":
          imageIndex = 0 % product.images.length
          break
        case "yellow":
          imageIndex = 0
          break
        case "green":
          imageIndex = 0
          break
        case "floral-blue":
          imageIndex = 0
          break
        default:
          imageIndex = colorIndex >= 0 ? colorIndex % product.images.length : 0
      }

      setCurrentImage(product.images[imageIndex])
      setImageTransition(false)
    }, 150)
  }

  const handleThumbnailClick = (image: string) => {
    setImageTransition(true)
    setTimeout(() => {
      setCurrentImage(image)
      setImageTransition(false)
    }, 150)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={currentImage || "/placeholder.svg"}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-300 ${
                imageTransition ? "opacity-70 scale-105" : "opacity-100 scale-100"
              }`}
              priority
            />
            <div className="absolute top-4 right-4">
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: getColorCode(selectedColor) }}
                title={`Current color: ${selectedColor}`}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative h-20 w-20 overflow-hidden rounded-md border transition-all duration-200 ${
                  currentImage === image ? "ring-2 ring-black scale-105" : "hover:scale-105"
                }`}
                onClick={() => handleThumbnailClick(image)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold mt-2">Rp {product.price.toLocaleString()}</p>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3">
              Color: <span className="font-normal text-gray-600 capitalize">{selectedColor}</span>
            </h3>
            <RadioGroup value={selectedColor} onValueChange={handleColorChange} className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                  <Label
                    htmlFor={`color-${color}`}
                    className={`h-10 w-10 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                      selectedColor === color
                        ? "ring-2 ring-black ring-offset-2 scale-110"
                        : "hover:ring-1 hover:ring-gray-300"
                    }`}
                    style={{ backgroundColor: getColorCode(color) }}
                  >
                    <span className="sr-only">{color}</span>
                    {selectedColor === color && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3">
              Size: <span className="font-normal text-gray-600">{selectedSize}</span>
            </h3>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                  <Label
                    htmlFor={`size-${size}`}
                    className={`h-10 w-10 rounded-md border cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                      selectedSize === size ? "bg-black text-white" : "bg-white text-black hover:bg-gray-50"
                    }`}
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-medium mb-3">Quantity</h3>
            <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="1" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(10)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add to Cart and Wishlist */}
          <div className="flex space-x-4">
            <Button className="flex-1 gap-2" onClick={handleAddToCart}>
              <ShoppingBag size={16} />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon">
              <Heart size={16} />
              <span className="sr-only">Add to Wishlist</span>
            </Button>
          </div>

          {/* Stock Information */}
          <div className="text-sm text-gray-600">
            {product.stock > 0 ? (
              <p className="text-green-600">In Stock ({product.stock} available)</p>
            ) : (
              <p className="text-red-600">Out of Stock</p>
            )}
          </div>

          {/* Product Tags */}
          <div className="flex space-x-2">
            {product.isNew && <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">New</span>}
            {product.isBestSeller && (
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Best Seller</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getColorCode(colorName: string): string {
  const colorMap: Record<string, string> = {
    // Basic colors
    black: "#000000",
    white: "#FFFFFF",
    navy: "#000080",
    blue: "#0000FF",
    "light-blue": "#ADD8E6",
    gray: "#808080",
    cream: "#FFFDD0",
    beige: "#F5F5DC",
    khaki: "#C3B091",
    olive: "#808000",
    maroon: "#800000",
    burgundy: "#800020",
    red: "#FF0000",
    "light-red": "#FF6B6B",
    pink: "#FFC0CB",
    yellow: "#FFFF00",
    green: "#008000",
    "forest-green": "#228B22",
    emerald: "#50C878",
    sage: "#BCB88A",
    camel: "#C19A6B",
    brown: "#A52A2A",
    "light-brown": "#D2B48C",
    terracotta: "#E2725B",
    "royal-blue": "#4169E1",
    "dusty-pink": "#D8A9A9",
    ivory: "#FFFFF0",
    ecru: "#C2B280",
    "powder-blue": "#B0E0E6",
    "silver misty": "#C0C0C0",
    army: "#4B5320",

    // Patterns
    "floral-blue": "#5D8AA8",
    "floral-pink": "#FFB6C1",
    "blue-stripe": "#4682B4",
    "black-stripe": "#36454F",
    "red-stripe": "#B22222",
    stripe: "#4682B4",
  }

  return colorMap[colorName] || "#CCCCCC"
}
