import { categories } from "@/lib/data/products"
import CategoryPageClient from "./CategoryPageClient"

// This must be a server component to use generateStaticParams
export async function generateStaticParams() {
  return categories.map((category) => ({
    id: category.id,
  }))
}

interface CategoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params
  return <CategoryPageClient categoryId={id} />
}
