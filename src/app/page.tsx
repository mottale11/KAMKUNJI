
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/lib/types';
import { HomePageClient } from './home-page-client';

async function getHomePageData() {
  try {
    const categoriesPromise = supabase.from('categories').select('*').limit(6);
    const flashDealsPromise = supabase.from('products').select('*, categories(name)').eq('is_flash_deal', true).order('created_at', { ascending: false }).limit(8);
    const newArrivalsPromise = supabase.from('products').select('*, categories(name)').eq('is_new_arrival', true).order('created_at', { ascending: false }).limit(8);
    
    const [
        { data: categories, error: catError }, 
        { data: flashDealsData, error: flashError }, 
        { data: newArrivalsData, error: arrivalsError }
    ] = await Promise.all([categoriesPromise, flashDealsPromise, newArrivalsPromise]);

    if (catError) console.error("Error fetching categories:", catError.message);
    if (flashError) console.error("Error fetching flash deals:", flashError.message);
    if (arrivalsError) console.error("Error fetching new arrivals:", arrivalsError.message);

    const safeCategories = categories || [];

    const processProducts = (products: any[] | null): Product[] => {
        return (products || []).map(p => ({
            ...p,
        }));
    };

    return {
      categories: safeCategories as Category[],
      flashDeals: processProducts(flashDealsData),
      newArrivals: processProducts(newArrivalsData),
    };

  } catch (error) {
    console.error("Error fetching home page data:", error);
    return {
      categories: [],
      flashDeals: [],
      newArrivals: [],
    };
  }
}


export default async function Home() {
  const { categories, flashDeals, newArrivals } = await getHomePageData();

  return (
    <HomePageClient 
        categories={categories} 
        flashDeals={flashDeals} 
        newArrivals={newArrivals} 
    />
  );
}
