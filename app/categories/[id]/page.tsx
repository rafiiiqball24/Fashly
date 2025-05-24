"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { products, categories } from "@/lib/data/products"
import ProductCard from "@/components/product/ProductCard"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Filter } from "lucide-react"
import type { Product } from "@/types/product"

export default function CategoryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const categoryId = params && params.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState("name")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [showFilters, setShowFilters] = useState(false)

  const category = categories.find((cat) => cat.id === categoryId)
  const categoryProducts = products.filter((product) => product.category === categoryId)

  useEffect(() => {
    let filtered = [...categoryProducts]

    // Filter by colors
    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) => product.colors.some((color) => selectedColors.includes(color)))
    }

    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product) => product.sizes.some((size) => selectedSizes.includes(size)))
    }

    // Filter by price range
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return b.isNew ? 1 : -1
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }, [categoryProducts, selectedColors, selectedSizes, priceRange, sortBy])

  if (!category) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-gray-600">The category you're looking for doesn't exist.</p>
      </div>
    )
  }

  // Get unique colors and sizes from category products
  const availableColors = [...new Set(categoryProducts.flatMap((p) => p.colors))]
  const availableSizes = [...new Set(categoryProducts.flatMap((p) => p.sizes))]

  const handleColorChange = (color: string, checked: boolean) => {
    if (checked) {
      setSelectedColors([...selectedColors, color])
    } else {
      setSelectedColors(selectedColors.filter((c) => c !== color))
    }
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size])
    } else {
      setSelectedSizes(selectedSizes.filter((s) => s !== size))
    }
  }

  const clearFilters = () => {
    setSelectedColors([])
    setSelectedSizes([])
    setPriceRange([0, 1000000])
    setSortBy("name")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-600">{filteredProducts.length} products found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64">
          <div className="lg:hidden mb-4">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            {/* Sort */}
            <div>
              <h3 className="font-semibold mb-3">Sort By</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Colors */}
            <div>
              <h3 className="font-semibold mb-3">Colors</h3>
              <div className="space-y-2">
                {availableColors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={selectedColors.includes(color)}
                      onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
                    />
                    <Label htmlFor={`color-${color}`} className="text-sm capitalize">
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Sizes */}
            <div>
              <h3 className="font-semibold mb-3">Sizes</h3>
              <div className="space-y-2">
                {availableSizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={selectedSizes.includes(size)}
                      onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                    />
                    <Label htmlFor={`size-${size}`} className="text-sm">
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Clear Filters */}
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear All Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
