
'use client'
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Category } from '@/lib/types';
import { supabase } from "@/lib/supabase";
import { Skeleton } from '../ui/skeleton';

export function FeaturedCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .select('*')
                    .limit(6);
                
                if (error) throw error;
                if (data) setCategories(data as Category[]);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);


    return (
        <section className="py-16 lg:py-24 bg-card">
            <div className="container">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <h2 className="text-3xl font-headline font-bold">Shop by Category</h2>
                    <Link href="/categories" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mt-2 sm:mt-0">
                        <span>View All</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                             <div key={index} className="space-y-2">
                                <Skeleton className="h-[150px] w-full" />
                                <Skeleton className="h-4 w-2/3 mx-auto" />
                            </div>
                        ))
                    ) : categories.length > 0 ? (
                        categories.map((category) => (
                            <Link key={category.id} href={`/category/${category.name.toLowerCase()}`} className="group block">
                                <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                    <div className="aspect-square relative">
                                        <Image
                                            src={category.image_url}
                                            alt={category.name}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                                        />
                                    </div>
                                    <div className="p-3 bg-background">
                                        <h3 className="font-semibold text-center text-sm truncate">{category.name}</h3>
                                    </div>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <p className="col-span-full text-muted-foreground text-center">No categories found.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
