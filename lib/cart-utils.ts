"use client"

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  color: string
  size: string
  quantity: number
}

export const cartUtils = {
  getCart: (): CartItem[] => {
    if (typeof window === "undefined") return []
    try {
      const cart = localStorage.getItem("cart")
      return cart ? JSON.parse(cart) : []
    } catch {
      return []
    }
  },

  saveCart: (items: CartItem[]): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem("cart", JSON.stringify(items))
      // Dispatch custom event untuk update cart button
      window.dispatchEvent(new CustomEvent("cartUpdated"))
    } catch (error) {
      console.error("Error saving cart:", error)
    }
  },

  addToCart: (item: Omit<CartItem, "quantity">): void => {
    const cart = cartUtils.getCart()
    const existingIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.color === item.color && cartItem.size === item.size,
    )

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1
    } else {
      cart.push({ ...item, quantity: 1 })
    }

    cartUtils.saveCart(cart)
  },

  removeFromCart: (id: number, color: string, size: string): void => {
    const cart = cartUtils.getCart()
    const updatedCart = cart.filter((item) => !(item.id === id && item.color === color && item.size === size))
    cartUtils.saveCart(updatedCart)
  },

  updateQuantity: (id: number, color: string, size: string, quantity: number): void => {
    if (quantity <= 0) {
      cartUtils.removeFromCart(id, color, size)
      return
    }

    const cart = cartUtils.getCart()
    const updatedCart = cart.map((item) =>
      item.id === id && item.color === color && item.size === size ? { ...item, quantity } : item,
    )
    cartUtils.saveCart(updatedCart)
  },

  getTotalItems: (): number => {
    const cart = cartUtils.getCart()
    return cart.reduce((total, item) => total + item.quantity, 0)
  },

  getTotalPrice: (): number => {
    const cart = cartUtils.getCart()
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  },

  clearCart: (): void => {
    cartUtils.saveCart([])
  },
}
