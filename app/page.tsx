import Banner from "@/components/home/Banner"
import CategorySection from "@/components/home/CategorySection"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import Newsletter from "@/components/home/Newsletter"

export default function HomePage() {
  return (
    <main>
      <Banner />
      <CategorySection />
      <FeaturedProducts />
      <Newsletter />
    </main>
  )
}
