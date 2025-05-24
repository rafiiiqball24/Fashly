import Link from "next/link"
import { products } from "@/data/products"

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function RelatedProducts({
  currentProductId,
  category,
}: {
  currentProductId: number
  category: string
}) {
  // Get related products from the same category
  const relatedProducts = products.filter((p) => p.id !== currentProductId && p.category === category).slice(0, 4)

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <div key={product.id} className="group relative">
            <Link href={`/product/${product.id}`} className="block overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="h-[200px] w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700">
                <Link href={`/product/${product.id}`}>{product.name}</Link>
              </h3>
              <p className="mt-1 font-medium text-gray-900">{formatPrice(product.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
