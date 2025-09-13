'use client'
import { useState, useEffect } from 'react';
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export function NewArrivals({ products }: { products: Product[] }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(products && products.length > 0) {
            setLoading(false);
        } else {
             const timer = setTimeout(() => setLoading(false), 1000); // Wait 1s
             return () => clearTimeout(timer);
        }
    }, [products]);


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
                        <p>No new arrivals found.</p>
                    )}
                </div>
            </div>
        </section>
    )
}
