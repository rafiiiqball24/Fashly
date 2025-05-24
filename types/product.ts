export interface Product {
  id: number
  name: string
  price: number
  description: string
  images: string[]
  category: string
  subcategory: string
  colors: string[]
  sizes: string[]
  stock: number
  rating: number
  reviews: number
  isNew: boolean
  isBestSeller: boolean
}

export interface Category {
  id: string
  name: string
  image: string
  subcategories: string[]
}
