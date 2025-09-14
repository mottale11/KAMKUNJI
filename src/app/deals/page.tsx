
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import { DealsClient } from './deals-client';

async function fetchDeals() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_flash_deal', true)
    .order('created_at', { ascending: false })
    .limit(12);
  
  if (error) {
    console.error("Error fetching deals:", error);
    return [];
  }
  return data as Product[];
}

export default async function DealsPage() {
  const deals = await fetchDeals();

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
          <DealsClient deals={deals} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
