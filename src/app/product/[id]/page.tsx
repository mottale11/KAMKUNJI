
import { notFound } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import type { Product, Category } from '@/lib/types';
import { ProductPageClient } from '@/components/product-page-client';

async function getProductData(productId: string) {
    const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

    if (productError || !productData) {
        return { product: null, category: null, relatedProducts: [] };
    }

    const product = productData as Product;
    let category: Category | null = null;
    let relatedProducts: Product[] = [];

    if (product.category_id) {
        const { data: categoryData } = await supabase
            .from('categories')
            .select('*')
            .eq('id', product.category_id)
            .single();
        category = categoryData as Category | null;

        const { data: relatedData } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', product.category_id)
            .neq('id', product.id)
            .limit(4);
        if (relatedData) {
            relatedProducts = relatedData as Product[];
        }
    }

    return { product, category, relatedProducts };
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

