"use client"

import { useEffect, useState } from "react"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  color: string
  size: string
  quantity: number
}

const getCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return []
  try {
    const cart = localStorage.getItem("cart")
    return cart ? JSON.parse(cart) : []
  } catch {
    return []
  }
}

const getTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export function CartButton() {
  const [totalItems, setTotalItems] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const items = getCartFromStorage()
    setTotalItems(getTotalItems(items))

    const handleCartUpdate = () => {
      const updatedItems = getCartFromStorage()
      setTotalItems(getTotalItems(updatedItems))
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  if (!mounted) {
    return (
      <Link href="/cart">
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          <span className="sr-only">Shopping cart</span>
        </Button>
      </Link>
    )
  }

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingBag className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {totalItems > 99 ? "99+" : totalItems}
          </Badge>
        )}
        <span className="sr-only">Shopping cart</span>
      </Button>
    </Link>
  )
}
