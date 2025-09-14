
'use client';

import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";

interface CategoryClientProps {
    products: Product[];
}

export function CategoryClient({ products }: CategoryClientProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.length > 0 ? (
                products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))
            ) : (
                <p className="col-span-full text-center text-muted-foreground">No products found in this category.</p>
            )}
        </div>
    );
}
