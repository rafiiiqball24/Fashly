import Link from "next/link"
import { products } from "@/lib/data/products"
import ProductCard from "@/components/product/ProductCard"

export default function FeaturedProducts() {
  // Get featured products (bestsellers)
  const featuredProducts = products.filter((product) => product.isBestSeller).slice(0, 4)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Best Sellers</h2>
          <Link href="/catalog" className="text-rose-600 hover:text-rose-700 font-medium mt-4 md:mt-0">
            View All Products →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
