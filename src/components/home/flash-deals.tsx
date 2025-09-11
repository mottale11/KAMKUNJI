
'use client';
import { useState, useEffect } from 'react';
import { Zap } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductCard } from "@/components/product-card";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';


export function FlashDeals() {
    const [flashDeals, setFlashDeals] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchFlashDeals = async () => {
            try {
                const q = query(collection(db, "products"), where("isFlashDeal", "==", true), limit(8));
                const querySnapshot = await getDocs(q);
                const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
                setFlashDeals(productsData);
            } catch (error) {
                console.error("Error fetching flash deals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlashDeals();
    }, []);

    return (
        <section className="py-16 lg:py-24">
            <div className="container">
                <div className="flex items-center gap-4 mb-8">
                    <Zap className="h-8 w-8 text-accent" />
                    <h2 className="text-3xl font-headline font-bold">Flash Deals</h2>
                    <div className="hidden sm:flex items-center gap-2 ml-4 bg-destructive/10 text-destructive px-3 py-1 rounded-full">
                        <span className="font-mono text-sm">Ends in:</span>
                        <span className="font-mono font-bold text-sm">24:00:00</span>
                    </div>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {loading ? (
                             Array.from({ length: 4 }).map((_, index) => (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                                     <div className="space-y-2">
                                        <Skeleton className="h-[250px] w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </CarouselItem>
                            ))
                        ) : flashDeals.length > 0 ? (
                            flashDeals.map((product) => (
                                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                                    <ProductCard product={product} />
                                </CarouselItem>
                            ))
                         ) : (
                            <p>No flash deals available right now.</p>
                         )}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:flex" />
                    <CarouselNext className="hidden lg:flex" />
                </Carousel>
            </div>
        </section>
    )
}
