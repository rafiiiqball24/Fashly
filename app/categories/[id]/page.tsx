import { categories } from "@/lib/data/products"
import CategoryPageClient from "@/app/categories/[id]/CategoryPageClient"

// This must be a server component to use generateStaticParams
export async function generateStaticParams() {
  return categories.map((category) => ({
    id: category.id,
  }))
}

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryPageClient categoryId={params.id} />
}
