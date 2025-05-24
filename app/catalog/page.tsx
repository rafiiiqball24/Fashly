"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ProductGrid from "@/components/catalog/ProductGrid"
import FilterSidebar from "@/components/catalog/FilterSidebar"
import { products } from "@/data/products"
import { Filter, X } from "lucide-react"

export default function CatalogPage() {
  const searchParams = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [showFilters, setShowFilters] = useState(false)

  // Get filter values from URL
  const categoryParam = searchParams.get("category")
  const searchParam = searchParams.get("search")

  // Filter states
  const [filters, setFilters] = useState({
    category: categoryParam || "",
    subcategory: "",
    priceRange: [0, 1000000],
    colors: [] as string[],
    sizes: [] as string[],
    sort: "newest",
  })

  // Apply filters
  useEffect(() => {
    let result = [...products]

    // Category filter
    if (filters.category) {
      result = result.filter((product) => product.category === filters.category)
    }

    // Subcategory filter
    if (filters.subcategory) {
      result = result.filter((product) => product.subcategory === filters.subcategory)
    }

    // Price range filter
    result = result.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Colors filter
    if (filters.colors.length > 0) {
      result = result.filter((product) => product.colors.some((color) => filters.colors.includes(color)))
    }

    // Sizes filter
    if (filters.sizes.length > 0) {
      result = result.filter((product) => product.sizes.some((size) => filters.sizes.includes(size)))
    }

    // Search filter
    if (searchParam) {
      const searchLower = searchParam.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower),
      )
    }

    // Sorting
    switch (filters.sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
      default:
        result.sort((a, b) => b.id - a.id)
        break
    }

    setFilteredProducts(result)
  }, [filters, searchParam])

  // Update category filter when URL changes
  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }))
    }
  }, [categoryParam])

  // Update filters
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters })
  }

  const getPageTitle = () => {
    if (searchParam) {
      return `Search results for "${searchParam}"`
    }
    if (filters.category) {
      return filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
    }
    return "All Products"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <X size={18} /> : <Filter size={18} />}
            {showFilters ? "Close" : "Filters"}
          </button>
        </div>

        {/* Filter Sidebar - Mobile */}
        <div
          className={`md:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 transform ${showFilters ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X size={24} />
              </button>
            </div>
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* Filter Sidebar - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <h1 className="text-2xl font-bold mb-6">{getPageTitle()}</h1>
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">{filteredProducts.length} products</p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-600">
                Sort by:
              </label>
              <select
                id="sort"
                className="border border-gray-300 rounded-md p-2 text-sm"
                value={filters.sort}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found matching your criteria.</p>
              <button
                className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
                onClick={() =>
                  handleFilterChange({
                    category: "",
                    subcategory: "",
                    priceRange: [0, 1000000],
                    colors: [],
                    sizes: [],
                  })
                }
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
