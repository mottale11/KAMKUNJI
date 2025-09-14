'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { FlashDealsServer } from '@/components/home/flash-deals-server';
import { NewArrivalsServer } from '@/components/home/new-arrivals-server';
import { Newsletter } from '@/components/home/newsletter';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/lib/types';
import { useState, useEffect } from 'react';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    async function getCategories() {
      try {
        const { data, error } = await supabase.from('categories').select('*').limit(6);
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    }
    getCategories();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCategories categories={categories} />
        <FlashDealsServer />
        <NewArrivalsServer />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
