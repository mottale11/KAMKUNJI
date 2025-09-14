
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { supabase } from "@/lib/supabase";
import type { Product, Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryClient } from './category-client';

async function getCategoryData(id: string) {
    try {
        const categoryPromise = supabase
          .from('categories')
          .select('*')
          .eq('id', id)
          .single();

        const productsPromise = supabase
            .from('products')
            .select('*, categories(name)')
            .eq('category_id', id);

        const [{ data: categoryData, error: categoryError }, { data: productsData, error: productsError }] = await Promise.all([
            categoryPromise,
            productsPromise
        ]);

        if (categoryError) {
          console.error("Category fetch error:", categoryError);
        };
        if (productsError) {
          console.error("Products fetch error:", productsError);
        };
        
        return {
            category: (categoryData as Category) || null,
            products: (productsData as Product[]) || []
        }

      } catch (error) {
        console.error("Error fetching category data:", error);
        return { category: null, products: [] };
      }
}

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const { category, products } = await getCategoryData(params.id);

  if (!category) {
      notFound();
  }

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
                <BreadcrumbLink asChild>
                  <Link href="/categories">Categories</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category?.name || <Skeleton className="h-4 w-24" />}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="container pb-16 lg:pb-24">
          <h1 className="text-3xl font-bold font-headline mb-8">{category?.name}</h1>
          
          <CategoryClient products={products} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

