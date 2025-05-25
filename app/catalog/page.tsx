"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

interface Product {
  id: number
  title: string
  price: number
  category: string
  description: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

// Komponen terpisah yang menggunakan useSearchParams
function CatalogContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<string>("")
  const [search, setSearch] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const categoryFromURL = searchParams?.get("category") || ""
    const searchFromURL = searchParams?.get("search") || ""

    setCategory(categoryFromURL)
    setSearch(searchFromURL)

    const fetchProducts = async () => {
      try {
        setLoading(true)
        let url = "https://fakestoreapi.com/products"
        
        if (categoryFromURL) {
          url = `https://fakestoreapi.com/products/category/${categoryFromURL}`
        }

        const response = await fetch(url)
        const data: Product[] = await response.json()

        let filteredProducts = data
        if (searchFromURL) {
          filteredProducts = data.filter((product) => 
            product.title.toLowerCase().includes(searchFromURL.toLowerCase())
          )
        }

        setProducts(filteredProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams, mounted])

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Catalog Page</h1>
      
      {category && (
        <p className="text-lg mb-2">
          <span className="font-semibold">Category:</span> {category}
        </p>
      )}
      
      {search && (
        <p className="text-lg mb-6">
          <span className="font-semibold">Search:</span> {search}
        </p>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-48 object-contain mb-4"
                  />
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-green-600">
                      ${product.price}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm text-gray-600">
                        {product.rating.rate} ({product.rating.count})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Komponen utama dengan Suspense wrapper
const CatalogPage = () => {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  )
}

export default CatalogPage