
import { notFound } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import type { Product, Category } from '@/lib/types';
import { ProductPageClient } from '@/components/product-page-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

async function getProductData(id: string) {
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !product) {
        return { product: null, category: null, relatedProducts: [] };
    }

    const categoryPromise = supabase
        .from('categories')
        .select('*')
        .eq('id', product.category_id)
        .single();

    const relatedProductsPromise = supabase
        .from('products')
        .select('*, categories(name)')
        .eq('category_id', product.category_id)
        .neq('id', product.id)
        .limit(4);
    
    const [
        { data: category },
        { data: relatedProductsData }
    ] = await Promise.all([categoryPromise, relatedProductsPromise]);

    const relatedProducts = (relatedProductsData || []).map(p => ({
      ...p,
      categoryName: (p.categories as unknown as Category)?.name || "Uncategorized",
    })) as Product[];

    return { product: product as Product, category: category as Category | null, relatedProducts };
}


export default async function ProductPage({ params }: { params: { id: string } }) {
    const { product, category, relatedProducts } = await getProductData(params.id);

    if (!product) {
        notFound();
    }

    return (
        <ProductPageClient 
            product={product} 
            category={category} 
            relatedProducts={relatedProducts} 
        />
    );
}

