
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { FlashDeals } from '@/components/home/flash-deals';
import { NewArrivals } from '@/components/home/new-arrivals';
import { Newsletter } from '@/components/home/newsletter';
import type { Product, Category } from '@/lib/types';

interface HomePageClientProps {
    categories: Category[];
    flashDeals: Product[];
    newArrivals: Product[];
}

export function HomePageClient({ categories, flashDeals, newArrivals }: HomePageClientProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCategories categories={categories} />
        <FlashDeals products={flashDeals} />
        <NewArrivals products={newArrivals} />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
