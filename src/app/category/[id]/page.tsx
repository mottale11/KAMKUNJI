
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ProductCard } from '@/components/product-card';
import { supabase } from "@/lib/supabase";
import { Product, Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryPage({ params }: { params: { id: string } }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // Fetch category details
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('id', params.id)
          .single();

        if (categoryError || !categoryData) {
          notFound();
          return;
        }
        
        setCategory(categoryData as Category);

        // Fetch products for this category
        const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('category', categoryData.name);
        
        if (productsError) throw productsError;

        setProducts(productsData as Product[]);

      } catch (error) {
        console.error("Error fetching category data:", error);
        // Optionally, handle error state
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [params.id]);

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
                <BreadcrumbPage>{loading ? <Skeleton className="h-4 w-24" /> : category?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="container pb-16 lg:pb-24">
          {loading ? (
             <Skeleton className="h-8 w-1/3 mb-8" />
          ) : (
             <h1 className="text-3xl font-bold font-headline mb-8">{category?.name}</h1>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                        <Skeleton className="h-[250px] w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))
            ) : products.length > 0 ? (
                products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))
            ) : (
                <p>No products found in this category.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
