
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { FlashDeals } from "@/components/home/flash-deals";
import { NewArrivals } from "@/components/home/new-arrivals";
import { Newsletter } from '@/components/home/newsletter';
import { supabase } from '@/lib/supabase';
import type { Category, Product } from '@/lib/types';

async function getHomePageData() {
  try {
    const categoriesPromise = supabase.from('categories').select('*').limit(6);
    
    const flashDealsPromise = supabase
      .from('products')
      .select('*, categories(name)')
      .eq('is_flash_deal', true)
      .order('created_at', { ascending: false })
      .limit(8);
      
    const newArrivalsPromise = supabase
      .from('products')
      .select('*, categories(name)')
      .eq('is_new_arrival', true)
      .order('created_at', { ascending: false })
      .limit(8);

    const [
      { data: categories, error: catError }, 
      { data: flashDeals, error: fdError }, 
      { data: newArrivals, error: naError }
    ] = await Promise.all([
      categoriesPromise,
      flashDealsPromise,
      newArrivalsPromise
    ]);

    if (catError) throw catError;
    if (fdError) throw fdError;
    if (naError) throw naError;

    return {
      categories: (categories || []) as Category[],
      flashDeals: (flashDeals || []) as Product[],
      newArrivals: (newArrivals || []) as Product[],
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return { categories: [], flashDeals: [], newArrivals: [] };
  }
}

export default async function Home() {
  const { categories, flashDeals, newArrivals } = await getHomePageData();

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
