
import { notFound } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import type { Product, Category } from '@/lib/types';
import { ProductPageClient } from '@/components/product-page-client';

async function getProductData(id: string) {
    const { data: product, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single();

    if (error || !product) {
        return { product: null, category: null, relatedProducts: [] };
    }

    const { data: relatedProductsData } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('category_id', product.category_id)
        .neq('id', product.id)
        .limit(4);
    
    // The category is already included in the product fetch
    const category = product.categories as Category | null;

    return { 
        product: product as Product, 
        category: category, 
        relatedProducts: (relatedProductsData || []) as Product[]
    };
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
