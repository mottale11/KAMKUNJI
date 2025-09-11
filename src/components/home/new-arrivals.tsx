import { mockProducts } from "@/lib/mock-data";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NewArrivals() {
    const newArrivals = mockProducts.slice(0, 8);

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
                    {newArrivals.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
