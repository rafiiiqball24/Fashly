import { products, categories } from "@/lib/data/products";
import CategoryClient from "./CategoryClient";

export async function generateStaticParams() {
  return categories.map((cat) => ({
    id: cat.id,
  }));
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  // Await the params Promise
  const resolvedParams = await params
  const categoryId = resolvedParams.id

  const category = categories.find((cat) => cat.id === categoryId);
  const categoryProducts = products.filter((product) => product.category === categoryId);

  if (!category) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-gray-600">The category you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <CategoryClient category={category} products={categoryProducts} />
  );
}