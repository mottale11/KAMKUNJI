
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { FlashDeals } from '@/components/home/flash-deals';
import { NewArrivals } from '@/components/home/new-arrivals';
import { Newsletter } from '@/components/home/newsletter';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/lib/types';

async function getHomePageData() {
  try {
    const categoriesPromise = supabase.from('categories').select('*').limit(6);
    const flashDealsPromise = supabase.from('products').select('*').eq('is_flash_deal', true).order('created_at', { ascending: false }).limit(8);
    const newArrivalsPromise = supabase.from('products').select('*').eq('is_new_arrival', true).order('created_at', { ascending: false }).limit(8);

    const [{ data: categories, error: catError }, { data: flashDeals, error: dealsError }, { data: newArrivals, error: arrivalsError }] = await Promise.all([
      categoriesPromise,
      flashDealsPromise,
      newArrivalsPromise
    ]);

    if (catError) console.error('Error fetching categories:', catError.message);
    if (dealsError) console.error('Error fetching flash deals:', dealsError.message);
    if (arrivalsError) console.error('Error fetching new arrivals:', arrivalsError.message);
    
    // Create a map of category IDs to names for easy lookup
    const categoryMap = new Map<string, string>();
    if (categories) {
        for (const category of categories) {
            categoryMap.set(category.id, category.name);
        }
    }
    
    const addCategoryNameToProducts = (products: Product[] | null) => {
        if (!products) return [];
        return products.map(p => ({
            ...p,
            categoryName: p.category_id ? categoryMap.get(p.category_id) || 'Uncategorized' : 'Uncategorized'
        }));
    };

    return {
      categories: (categories || []) as Category[],
      flashDeals: addCategoryNameToProducts(flashDeals),
      newArrivals: addCategoryNameToProducts(newArrivals),
    };

  } catch (error) {
    console.error('Failed to fetch home page data:', error);
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
