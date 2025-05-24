"use client"

import { useState, useEffect } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  color: string
  size: string
  quantity: number
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const loadCart = () => {
      try {
        if (typeof window !== "undefined") {
          const savedCart = localStorage.getItem("cart")
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart)
            if (Array.isArray(parsedCart)) {
              setCartItems(parsedCart)
            }
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error)
        setCartItems([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [])

  const saveCart = (items: CartItem[]) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(items))
      }
      setCartItems(items)
    } catch (error) {
      console.error("Error saving cart:", error)
    }
  }

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    console.log("useCart addToCart called with:", item)

    if (!isClient) {
      console.log("Not on client side, skipping addToCart")
      return
    }

    if (!item.id || !item.name || !item.price || !item.color || !item.size) {
      console.error("Invalid item data:", item)
      return
    }

    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.color === item.color && cartItem.size === item.size,
    )

    let updatedItems: CartItem[]

    if (existingItemIndex > -1) {
      console.log("Item exists, updating quantity")
      updatedItems = cartItems.map((cartItem, index) =>
        index === existingItemIndex ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
      )
    } else {
      console.log("New item, adding to cart")
      updatedItems = [...cartItems, { ...item, quantity: 1 }]
    }

    console.log("Updated cart items:", updatedItems)
    saveCart(updatedItems)
  }

  const removeFromCart = (id: number, color: string, size: string) => {
    if (!isClient) return

    const updatedItems = cartItems.filter((item) => !(item.id === id && item.color === color && item.size === size))
    saveCart(updatedItems)
  }

  const updateQuantity = (id: number, color: string, size: string, quantity: number) => {
    if (!isClient) return

    if (quantity <= 0) {
      removeFromCart(id, color, size)
      return
    }

    const updatedItems = cartItems.map((item) =>
      item.id === id && item.color === color && item.size === size ? { ...item, quantity } : item,
    )
    saveCart(updatedItems)
  }

  const clearCart = () => {
    if (!isClient) return
    saveCart([])
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return {
    cartItems: cartItems || [],
    isLoading,
    isClient,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  }
}
