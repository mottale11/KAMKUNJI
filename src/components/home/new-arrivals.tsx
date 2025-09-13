
'use client'
import { useState, useEffect } from 'react';
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export function NewArrivals() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getNewArrivals = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_new_arrival', true)
                    .order('created_at', { ascending: false })
                    .limit(8);

                if (error) {
                    console.error("Error fetching new arrivals:", error);
                } else {
                    setProducts(data as Product[]);
                }
            } catch (error) {
                console.error("Error fetching new arrivals:", error);
            } finally {
                setLoading(false);
            }
        };

        getNewArrivals();
    }, []);

    return (
        <section className="py-16 lg:py-24 bg-card">
            <div className="container">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <h2 className="text-3xl font-headline font-bold">New Arrivals</h2>
                    <Link href="/new-arrivals" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mt-2 sm:mt-0">
                        <span>View All</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                        <p className="col-span-full text-center text-muted-foreground">No new arrivals found.</p>
                    )}
                </div>
            </div>
        </section>
    )
}
