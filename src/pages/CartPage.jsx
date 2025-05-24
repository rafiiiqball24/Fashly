"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return
    updateQuantity(item.id, item.size, item.color, newQuantity)
  }

  const handleRemoveItem = (item) => {
    removeFromCart(item.id, item.size, item.color)
  }

  const handleApplyCoupon = () => {
    if (couponCode.trim() === "") return
    // In a real app, you would validate the coupon code with an API
    setCouponApplied(true)
  }

  const subtotal = getCartTotal()
  const discount = couponApplied ? subtotal * 0.1 : 0 // 10% discount
  const total = subtotal - discount

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link
            to="/catalog"
            className="inline-block bg-rose-600 text-white px-6 py-3 rounded-md hover:bg-rose-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="hidden md:grid md:grid-cols-5 bg-gray-50 p-4 text-sm font-medium text-gray-600">
              <div className="col-span-2">Product</div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Total</div>
            </div>

            {cart.map((item, index) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className={`grid grid-cols-1 md:grid-cols-5 gap-4 p-4 items-center ${
                  index < cart.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                {/* Product Info */}
                <div className="md:col-span-2 flex gap-4">
                  <img
                    src={item.images[0] || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      <p>Size: {item.size}</p>
                      <p>Color: {item.color}</p>
                    </div>
                    <button
                      className="text-rose-600 text-sm flex items-center gap-1 mt-2 md:hidden"
                      onClick={() => handleRemoveItem(item)}
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="md:text-center">
                  <span className="md:hidden text-gray-600">Price: </span>
                  {formatPrice(item.price)}
                </div>

                {/* Quantity */}
                <div>
                  <div className="flex items-center">
                    <button
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md"
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      readOnly
                      className="w-10 h-8 text-center border-t border-b border-gray-300"
                    />
                    <button
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md"
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="md:hidden text-gray-600">Total: </span>
                  <div className="flex items-center gap-4">
                    {formatPrice(item.price * item.quantity)}
                    <button
                      className="text-gray-400 hover:text-rose-600 hidden md:block"
                      onClick={() => handleRemoveItem(item)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <Link to="/catalog" className="text-rose-600 hover:text-rose-700 flex items-center gap-2">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {couponApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Discount (10%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-600"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                  />
                  <button
                    className={`px-4 py-2 rounded-md ${
                      couponApplied ? "bg-gray-300 cursor-not-allowed" : "bg-gray-800 text-white hover:bg-gray-900"
                    }`}
                    onClick={handleApplyCoupon}
                    disabled={couponApplied}
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && <p className="text-green-600 text-sm mt-2">Coupon applied successfully!</p>}
              </div>

              <button
                className="w-full bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700 transition-colors"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
