import { products } from "@/lib/data/products";
import ProductClient from "./ProductClient";

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  // Await the params Promise
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const product = products.find((p) => p.id.toString() === id);

  if (!product) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  return <ProductClient product={product} />;
}