import { products } from "@/data/products"
import ProductDetail from "@/components/product/ProductDetail"
import RelatedProducts from "@/components/product/RelatedProducts"
import { notFound } from "next/navigation"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === Number(params.id))

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} />
      <RelatedProducts currentProductId={product.id} category={product.category} />
    </div>
  )
}
