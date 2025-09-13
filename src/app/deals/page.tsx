'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ProductCard } from '@/components/product-card';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

async function fetchDeals() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_flash_deal', true)
    .order('created_at', { ascending: false })
    .limit(12);
  
  if (error) {
    console.error("Error fetching deals:", error);
    return [];
  }
  return data as Product[];
}


export default function DealsPage() {
  const [deals, setDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDeals = async () => {
      setLoading(true);
      const fetchedDeals = await fetchDeals();
      setDeals(fetchedDeals);
      setLoading(false);
    };

    getDeals();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 px-4">
        <div className="container py-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Deals</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="container pb-16 lg:pb-24">
          <h1 className="text-3xl font-bold font-headline mb-8">Best Deals</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2">
                    <Skeleton className="h-[250px] w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : deals.length > 0 ? (
              deals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">No deals available at the moment. Please check back later!</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
