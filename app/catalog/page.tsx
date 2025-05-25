"use client"

import { useEffect, useState } from "react"
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

const CatalogPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<string>("")
  const [search, setSearch] = useState<string>("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const categoryFromURL = searchParams?.get("category") || ""
    const searchFromURL = searchParams?.get("search") || ""

    setCategory(categoryFromURL)
    setSearch(searchFromURL)

    const fetchProducts = async () => {
      let url = "https://fakestoreapi.com/products"
      if (categoryFromURL) {
        url = `https://fakestoreapi.com/products/category/${categoryFromURL}`
      }

      const response = await fetch(url)
      const data: Product[] = await response.json()

      let filteredProducts = data
      if (searchFromURL) {
        filteredProducts = data.filter((product) => product.title.toLowerCase().includes(searchFromURL.toLowerCase()))
      }

      setProducts(filteredProducts)
    }

    fetchProducts()
  }, [searchParams])

  return (
    <div>
      <h1>Catalog Page</h1>
      <p>Category: {category}</p>
      <p>Search: {search}</p>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.title} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CatalogPage
