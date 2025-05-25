"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cartUtils } from "@/lib/cart-utils"
import type { CartItem } from "@/lib/cart-utils"
import { Trash2, Plus, Minus, ShoppingBag, Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Pastikan komponen hanya render di client-side
    setMounted(true)
    
    // Delay sedikit untuk memastikan cartUtils sudah tersedia
    const loadCart = () => {
      try {
        const items = cartUtils?.getCart() || []
        setCartItems(items)
      } catch (error) {
        console.error('Error loading cart:', error)
        setCartItems([])
      } finally {
        setIsLoading(false)
      }
    }

    // Load cart setelah komponen ter-mount
    loadCart()

    const handleCartUpdate = () => {
      try {
        const items = cartUtils?.getCart() || []
        setCartItems(items)
      } catch (error) {
        console.error('Error updating cart:', error)
        setCartItems([])
      }
    }

    // Event listener untuk update cart
    if (typeof window !== 'undefined') {
      window.addEventListener("cartUpdated", handleCartUpdate)
      return () => window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  // Loading state sebelum component mount
  if (!mounted || isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    )
  }

  // Safely calculate values dengan null checks
  const subtotal = cartUtils?.getTotalPrice() || 0
  const shippingCost = subtotal > 500000 ? 0 : 25000
  const total = subtotal + shippingCost
  const totalItems = cartUtils?.getTotalItems() || 0

  const handleQuantityChange = (id: number, color: string, size: string, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      cartUtils?.updateQuantity(id, color, size, newQuantity)
      const updatedItems = cartUtils?.getCart() || []
      setCartItems(updatedItems)
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const handleRemoveItem = (id: number, color: string, size: string) => {
    try {
      cartUtils?.removeFromCart(id, color, size)
      const updatedItems = cartUtils?.getCart() || []
      setCartItems(updatedItems)
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold mb-4">Keranjang Belanja Kosong</h1>
          <p className="text-gray-600 mb-8">Sepertinya Anda belum menambahkan produk apapun ke keranjang belanja.</p>
          <Link href="/">
            <Button className="bg-rose-600 hover:bg-rose-700">Mulai Berbelanja</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Keranjang Belanja</h1>
          <p className="text-gray-600">{totalItems} item dalam keranjang</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={`${item.id}-${item.color}-${item.size}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.name}</h3>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        Ukuran: {item.size}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Warna: {item.color}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-rose-600">{formatPrice(item.price)}</p>
                        <p className="text-sm text-gray-500">Total: {formatPrice(item.price * item.quantity)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.color, item.size, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.color, item.size, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveItem(item.id, item.color, item.size)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Continue Shopping */}
          <div className="pt-4">
            <Link href="/" className="text-rose-600 hover:text-rose-700 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Lanjutkan Berbelanja
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Ringkasan Pesanan</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} item)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ongkos Kirim</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? <span className="text-green-600">GRATIS</span> : formatPrice(shippingCost)}
                  </span>
                </div>

                {shippingCost === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-xs">🎉 Selamat! Anda mendapat gratis ongkir</p>
                  </div>
                )}

                {subtotal < 500000 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-700 text-xs">
                      💡 Belanja {formatPrice(500000 - subtotal)} lagi untuk gratis ongkir!
                    </p>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-rose-600">{formatPrice(total)}</span>
                </div>

                <Button
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3"
                  onClick={() => router.push("/checkout")}
                >
                  Lanjut ke Pembayaran
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    alert("Fitur simpan untuk nanti akan segera hadir!")
                  }}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Simpan untuk Nanti
                </Button>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[8px]">✓</span>
                  </div>
                  <span>Transaksi aman & terpercaya</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}