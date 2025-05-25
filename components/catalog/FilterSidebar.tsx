"use client"

import type React from "react"
import { useState } from "react"

interface FilterSidebarProps {
  categories: string[]
  colors: string[]
  sizes: string[]
  minPrice: number
  maxPrice: number
  onFilterChange: (filters: any) => void // Replace 'any' with a more specific type if possible
}

type SectionKey = "category" | "price" | "color" | "size"

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  colors,
  sizes,
  minPrice,
  maxPrice,
  onFilterChange,
}) => {
  const [expandedSections, setExpandedSections] = useState<{
    [key in SectionKey]: boolean
  }>({
    category: true,
    price: false,
    color: false,
    size: false,
  })

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: minPrice,
    max: maxPrice,
  })

  const toggleSection = (section: SectionKey) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  const handlePriceChange = (newPriceRange: { min: number; max: number }) => {
    setPriceRange(newPriceRange)
  }

  const applyFilters = () => {
    const filters = {
      categories: selectedCategories,
      colors: selectedColors,
      sizes: selectedSizes,
      priceRange: priceRange,
    }
    onFilterChange(filters)
  }

  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>

      <div className="filter-section">
        <div className="filter-header" onClick={() => toggleSection("category")}>
          Category {expandedSections.category ? "-" : "+"}
        </div>
        {expandedSections.category && (
          <div className="filter-options">
            {categories.map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-section">
        <div className="filter-header" onClick={() => toggleSection("price")}>
          Price {expandedSections.price ? "-" : "+"}
        </div>
        {expandedSections.price && (
          <div className="filter-options">
            {/* Price range input or slider can be added here */}
            <label>
              Min:
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => handlePriceChange({ ...priceRange, min: Number(e.target.value) })}
              />
            </label>
            <label>
              Max:
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => handlePriceChange({ ...priceRange, max: Number(e.target.value) })}
              />
            </label>
          </div>
        )}
      </div>

      <div className="filter-section">
        <div className="filter-header" onClick={() => toggleSection("color")}>
          Color {expandedSections.color ? "-" : "+"}
        </div>
        {expandedSections.color && (
          <div className="filter-options">
            {colors.map((color) => (
              <label key={color}>
                <input
                  type="checkbox"
                  value={color}
                  checked={selectedColors.includes(color)}
                  onChange={() => handleColorChange(color)}
                />
                {color}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-section">
        <div className="filter-header" onClick={() => toggleSection("size")}>
          Size {expandedSections.size ? "-" : "+"}
        </div>
        {expandedSections.size && (
          <div className="filter-options">
            {sizes.map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  value={size}
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
                {size}
              </label>
            ))}
          </div>
        )}
      </div>

      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  )
}

export default FilterSidebar
