
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { FlashDealsServer } from '@/components/home/flash-deals-server';
import { NewArrivalsServer } from '@/components/home/new-arrivals-server';
import { Newsletter } from '@/components/home/newsletter';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCategories />
        <FlashDealsServer />
        <NewArrivalsServer />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
