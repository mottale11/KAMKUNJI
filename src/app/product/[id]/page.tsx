
import { notFound } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import type { Product } from '@/lib/types';
import { ProductPageClient } from '@/components/product-page-client';

async function getProductData(id: string) {
    const { data: product, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single();

    if (error || !product) {
        console.error("Error fetching product:", id, error);
        return { product: null, relatedProducts: [] };
    }

    const { data: relatedProductsData } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('category_id', product.category_id)
        .neq('id', product.id)
        .limit(4);
    
    return { 
        product: product as Product,
        relatedProducts: (relatedProductsData || []) as Product[]
    };
}


export default async function ProductPage({ params }: { params: { id: string } }) {
    const { product, relatedProducts } = await getProductData(params.id);

    if (!product) {
        notFound();
    }

    return (
        <ProductPageClient 
            product={product} 
            relatedProducts={relatedProducts} 
        />
    );
}
