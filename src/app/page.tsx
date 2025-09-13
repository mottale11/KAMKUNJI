
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { FlashDeals } from '@/components/home/flash-deals';
import { NewArrivals } from '@/components/home/new-arrivals';
import { Newsletter } from '@/components/home/newsletter';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/lib/types';

async function getFlashDeals() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_flash_deal', true)
            .order('created_at', { ascending: false })
            .limit(8);

        if (error) {
          console.error("Error fetching flash deals:", error);
          return [];
        };
        return data as Product[];
    } catch (error) {
        console.error("Error fetching flash deals:", error);
        return [];
    }
}

async function getNewArrivals() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_new_arrival', true)
            .order('created_at', { ascending: false })
            .limit(8);

        if (error) {
          console.error("Error fetching new arrivals:", error);
          return [];
        }
        return data as Product[];
    } catch (error) {
        console.error("Error fetching new arrivals:", error);
        return [];
    }
}

async function getCategories() {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .limit(6);
        
        if (error) {
            console.error("Error fetching categories:", error);
            return [];
        };
        return data as Category[];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export default async function Home() {
  const flashDeals = await getFlashDeals();
  const newArrivals = await getNewArrivals();
  const categories = await getCategories();

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
