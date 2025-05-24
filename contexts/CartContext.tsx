"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Product } from "@/types/product"

interface CartItem extends Product {
  quantity: number
  selectedSize: string
  selectedColor: string
}

interface CartContextType {
  cart: CartItem[]
  itemCount: number
  addToCart: (product: Product, quantity: number, selectedSize: string, selectedColor: string) => void
  removeFromCart: (itemId: number, size: string, color: string) => void
  updateQuantity: (itemId: number, size: string, color: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    const storedCart = localStorage.getItem("fashlyCart")
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart)
      setCart(parsedCart)
      setItemCount(parsedCart.reduce((total: number, item: CartItem) => total + item.quantity, 0))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("fashlyCart", JSON.stringify(cart))
    setItemCount(cart.reduce((total, item) => total + item.quantity, 0))
  }, [cart])

  const addToCart = (product: Product, quantity = 1, selectedSize: string, selectedColor: string) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor,
      )

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += quantity
        return updatedCart
      } else {
        return [
          ...prevCart,
          {
            ...product,
            quantity,
            selectedSize,
            selectedColor,
          },
        ]
      }
    })
  }

  const removeFromCart = (itemId: number, size: string, color: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === itemId && item.selectedSize === size && item.selectedColor === color)),
    )
  }

  const updateQuantity = (itemId: number, size: string, color: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === itemId && item.selectedSize === size && item.selectedColor === color) {
          return { ...item, quantity }
        }
        return item
      }),
    )
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem("fashlyCart")
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
