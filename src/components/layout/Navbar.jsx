"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import { ShoppingBag, Search, Menu, X, User } from "lucide-react"

const Navbar = () => {
  const { itemCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-rose-600">
            Fashly
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-rose-600 transition-colors">
              Home
            </Link>
            <Link to="/catalog" className="text-gray-700 hover:text-rose-600 transition-colors">
              Catalog
            </Link>
            <Link to="/catalog?category=tops" className="text-gray-700 hover:text-rose-600 transition-colors">
              Tops
            </Link>
            <Link to="/catalog?category=bottoms" className="text-gray-700 hover:text-rose-600 transition-colors">
              Bottoms
            </Link>
            <Link to="/catalog?category=dresses" className="text-gray-700 hover:text-rose-600 transition-colors">
              Dresses
            </Link>
            <Link to="/catalog?category=outerwear" className="text-gray-700 hover:text-rose-600 transition-colors">
              Outerwear
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-700 hover:text-rose-600 transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} />
            </button>
            <Link to="/cart" className="text-gray-700 hover:text-rose-600 transition-colors relative">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link to="#" className="text-gray-700 hover:text-rose-600 transition-colors">
              <User size={20} />
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-600"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search size={18} />
            </button>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 py-4 border-t border-gray-200">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="block text-gray-700 hover:text-rose-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="block text-gray-700 hover:text-rose-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Catalog
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=tops"
                  className="block text-gray-700 hover:text-rose-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tops
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=bottoms"
                  className="block text-gray-700 hover:text-rose-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Bottoms
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=dresses"
                  className="block text-gray-700 hover:text-rose-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dresses
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=outerwear"
                  className="block text-gray-700 hover:text-rose-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Outerwear
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Navbar
