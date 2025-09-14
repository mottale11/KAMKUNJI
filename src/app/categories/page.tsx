
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { supabase } from "@/lib/supabase";
import type { Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

async function getCategories() {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*');

        if (error) throw error;
        return (data as Category[]) || [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}


export default async function CategoriesPage() {
  const categories = await getCategories();
  const loading = categories.length === 0;

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
                <BreadcrumbPage>Categories</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="container pb-16 lg:pb-24">
          <h1 className="text-3xl font-bold font-headline mb-8">All Categories</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {loading ? (
              Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="space-y-2">
                    <Skeleton className="h-[150px] w-full" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                </div>
              ))
            ) : (
              categories.map((category) => (
                  <Link key={category.id} href={`/category/${category.id}`} className="group block">
                      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                          <div className="aspect-square relative">
                              <Image
                                  src={category.image_url}
                                  alt={category.name}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                                  data-ai-hint={category.name}
                              />
                          </div>
                          <div className="p-4 bg-card">
                              <h3 className="font-semibold text-center truncate">{category.name}</h3>
                          </div>
                      </Card>
                  </Link>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
