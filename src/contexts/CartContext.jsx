"use client"

import { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    const storedCart = localStorage.getItem("fashlyCart")
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart)
      setCart(parsedCart)
      setItemCount(parsedCart.reduce((total, item) => total + item.quantity, 0))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("fashlyCart", JSON.stringify(cart))
    setItemCount(cart.reduce((total, item) => total + item.quantity, 0))
  }, [cart])

  const addToCart = (product, quantity = 1, selectedSize, selectedColor) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === selectedSize && item.color === selectedColor,
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
            size: selectedSize,
            color: selectedColor,
          },
        ]
      }
    })
  }

  const removeFromCart = (itemId, size, color) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === itemId && item.size === size && item.color === color)),
    )
  }

  const updateQuantity = (itemId, size, color, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === itemId && item.size === size && item.color === color) {
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
