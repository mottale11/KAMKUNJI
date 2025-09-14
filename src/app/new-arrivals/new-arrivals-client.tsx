
'use client';
import { ProductCard } from '@/components/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';

interface NewArrivalsClientProps {
  newArrivals: Product[];
}

export function NewArrivalsClient({ newArrivals }: NewArrivalsClientProps) {
  const loading = newArrivals.length === 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
       {loading ? (
        Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-2">
              <Skeleton className="h-[250px] w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
          </div>
        ))
      ) : newArrivals.length > 0 ? (
        newArrivals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p className="col-span-full text-center text-muted-foreground">There are no new arrivals at the moment. Please check back later!</p>
      )}
    </div>
  );
}
