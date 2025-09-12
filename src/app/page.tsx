
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { FlashDeals } from '@/components/home/flash-deals';
import { NewArrivals } from '@/components/home/new-arrivals';
import { Newsletter } from '@/components/home/newsletter';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 px-4">
        <HeroSection />
        <FeaturedCategories />
        <FlashDeals />
        <NewArrivals />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
