"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { products } from "../data/products"
import ProductCard from "../components/product/ProductCard"
import FilterSidebar from "../components/catalog/FilterSidebar"
import { Filter, X } from "lucide-react"

const CatalogPage = () => {
  const [searchParams] = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // Get filter values from URL
  const categoryParam = searchParams.get("category")
  const subcategoryParam = searchParams.get("subcategory")
  const searchParam = searchParams.get("search")
  const filterParam = searchParams.get("filter")

  // Filter states
  const [filters, setFilters] = useState({
    category: categoryParam || "",
    subcategory: subcategoryParam || "",
    priceRange: [0, 1000000],
    colors: [],
    sizes: [],
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
          product.name.toLowerCase().includes(searchLower) || product.description.toLowerCase().includes(searchLower),
      )
    }

    // Special filters
    if (filterParam === "new") {
      result = result.filter((product) => product.isNew)
    } else if (filterParam === "bestseller") {
      result = result.filter((product) => product.isBestSeller)
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
        // Assuming newer products have higher IDs
        result.sort((a, b) => b.id - a.id)
        break
    }

    setFilteredProducts(result)
  }, [filters, searchParam, filterParam])

  // Update filters
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            {filters.category ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1) : "All Products"}
          </h1>
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
          <h1 className="text-2xl font-bold mb-6">
            {filters.category ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1) : "All Products"}
          </h1>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
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

export default CatalogPage
