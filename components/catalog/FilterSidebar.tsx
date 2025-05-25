"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { categories } from "@/lib/data/products"

interface FilterSidebarProps {
  filters: {
    category: string
    subcategory: string
    priceRange: number[]
    colors: string[]
    sizes: string[]
    sort: string
  }
  onFilterChange: (filters: any) => void
}

// Define the expanded sections type
type ExpandedSections = {
  category: boolean
  price: boolean
  color: boolean
  size: boolean
}

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    category: true,
    price: true,
    color: true,
    size: true,
  })

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      category,
      subcategory: "", // Reset subcategory when category changes
    })
  }

  const handleSubcategoryChange = (subcategory: string) => {
    onFilterChange({ subcategory })
  }

  const handlePriceChange = (min: number, max: number) => {
    onFilterChange({ priceRange: [min, max] })
  }

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color]

    onFilterChange({ colors: newColors })
  }

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size) ? filters.sizes.filter((s) => s !== size) : [...filters.sizes, size]

    onFilterChange({ sizes: newSizes })
  }

  // Get current category object
  const currentCategory = categories.find((cat) => cat.id === filters.category)

  // Color mapping for display
  const colorMap: Record<string, string> = {
    black: "bg-black",
    white: "bg-white border border-gray-300",
    blue: "bg-blue-600",
    navy: "bg-indigo-900",
    red: "bg-red-600",
    beige: "bg-amber-100",
    gray: "bg-gray-500",
    maroon: "bg-red-900",
    cream: "bg-amber-50 border border-gray-300",
    olive: "bg-olive-600",
    khaki: "bg-yellow-700",
    "light-blue": "bg-blue-300",
    "floral-blue": "bg-blue-400",
    "floral-pink": "bg-pink-400",
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full font-medium mb-2"
          onClick={() => toggleSection("category")}
        >
          Categories
          {expandedSections.category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSections.category && (
          <div className="space-y-2 mt-2">
            <div
              className={`cursor-pointer hover:text-rose-600 ${!filters.category ? "text-rose-600 font-medium" : ""}`}
              onClick={() => handleCategoryChange("")}
            >
              All Products
            </div>

            {categories.map((category) => (
              <div key={category.id}>
                <div
                  className={`cursor-pointer hover:text-rose-600 ${filters.category === category.id ? "text-rose-600 font-medium" : ""}`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </div>

                {filters.category === category.id && (
                  <div className="ml-4 mt-2 space-y-1">
                    {category.subcategories.map((sub) => (
                      <div
                        key={sub}
                        className={`text-sm cursor-pointer hover:text-rose-600 ${filters.subcategory === sub ? "text-rose-600 font-medium" : ""}`}
                        onClick={() => handleSubcategoryChange(sub)}
                      >
                        {sub.charAt(0).toUpperCase() + sub.slice(1)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full font-medium mb-2"
          onClick={() => toggleSection("price")}
        >
          Price Range
          {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSections.price && (
          <div className="space-y-2 mt-2">
            <div
              className={`cursor-pointer hover:text-rose-600 ${filters.priceRange[1] === 300000 ? "text-rose-600 font-medium" : ""}`}
              onClick={() => handlePriceChange(0, 300000)}
            >
              Under Rp 300.000
            </div>
            <div
              className={`cursor-pointer hover:text-rose-600 ${filters.priceRange[0] === 300000 && filters.priceRange[1] === 500000 ? "text-rose-600 font-medium" : ""}`}
              onClick={() => handlePriceChange(300000, 500000)}
            >
              Rp 300.000 - Rp 500.000
            </div>
            <div
              className={`cursor-pointer hover:text-rose-600 ${filters.priceRange[0] === 500000 ? "text-rose-600 font-medium" : ""}`}
              onClick={() => handlePriceChange(500000, 1000000)}
            >
              Over Rp 500.000
            </div>
          </div>
        )}
      </div>

      {/* Colors */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full font-medium mb-2"
          onClick={() => toggleSection("color")}
        >
          Colors
          {expandedSections.color ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSections.color && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.keys(colorMap).map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full ${colorMap[color]} flex items-center justify-center ${filters.colors.includes(color) ? "ring-2 ring-offset-2 ring-rose-600" : ""}`}
                onClick={() => handleColorToggle(color)}
                title={color.charAt(0).toUpperCase() + color.slice(1)}
              >
                {filters.colors.includes(color) && (
                  <span
                    className={`text-xs ${["white", "cream", "beige"].includes(color) ? "text-black" : "text-white"}`}
                  >
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sizes */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full font-medium mb-2"
          onClick={() => toggleSection("size")}
        >
          Sizes
          {expandedSections.size ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSections.size && (
          <div className="flex flex-wrap gap-2 mt-2">
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                className={`w-10 h-10 border rounded-md flex items-center justify-center ${
                  filters.sizes.includes(size)
                    ? "bg-rose-600 text-white border-rose-600"
                    : "border-gray-300 hover:border-rose-600"
                }`}
                onClick={() => handleSizeToggle(size)}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
        onClick={() =>
          onFilterChange({
            category: "",
            subcategory: "",
            priceRange: [0, 1000000],
            colors: [],
            sizes: [],
          })
        }
      >
        Clear All Filters
      </button>
    </div>
  )
}