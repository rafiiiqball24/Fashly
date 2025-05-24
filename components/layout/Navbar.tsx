"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, Search, Menu, X, User, Heart, Settings, LogOut } from "lucide-react"
import { useCart } from "@/contexts/CartContext"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { itemCount } = useCart()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  const handleCategoryClick = (category: string) => {
    router.push(`/catalog?category=${category}`)
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-rose-600">
            Fashly
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-rose-600 transition-colors">
              Home
            </Link>
            <Link href="/catalog" className="text-gray-700 hover:text-rose-600 transition-colors">
              Catalog
            </Link>
            <button
              onClick={() => handleCategoryClick("tops")}
              className="text-gray-700 hover:text-rose-600 transition-colors"
            >
              Tops
            </button>
            <button
              onClick={() => handleCategoryClick("bottoms")}
              className="text-gray-700 hover:text-rose-600 transition-colors"
            >
              Bottoms
            </button>
            <button
              onClick={() => handleCategoryClick("dresses")}
              className="text-gray-700 hover:text-rose-600 transition-colors"
            >
              Dresses
            </button>
            <button
              onClick={() => handleCategoryClick("outerwear")}
              className="text-gray-700 hover:text-rose-600 transition-colors"
            >
              Outerwear
            </button>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-700 hover:text-rose-600 transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} />
            </button>
            <Link href="/cart" className="text-gray-700 hover:text-rose-600 transition-colors relative">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className="text-gray-700 hover:text-rose-600 transition-colors"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <User size={20} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    My Account
                  </Link>
                  <Link
                    href="/wishlist"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Heart size={16} className="mr-2" />
                    Wishlist
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings size={16} className="mr-2" />
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="mt-4 relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-600"
              autoFocus
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search size={18} />
            </button>
          </form>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 py-4 border-t border-gray-200">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="block text-gray-700 hover:text-rose-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="block text-gray-700 hover:text-rose-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Catalog
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick("tops")}
                  className="block text-gray-700 hover:text-rose-600 transition-colors"
                >
                  Tops
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick("bottoms")}
                  className="block text-gray-700 hover:text-rose-600 transition-colors"
                >
                  Bottoms
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick("dresses")}
                  className="block text-gray-700 hover:text-rose-600 transition-colors"
                >
                  Dresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick("outerwear")}
                  className="block text-gray-700 hover:text-rose-600 transition-colors"
                >
                  Outerwear
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
