import { Zap } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductCard } from "@/components/product-card";
import { mockFlashDeals } from "@/lib/mock-data";

export function FlashDeals() {
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
                        {mockFlashDeals.map((product) => (
                            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                                <ProductCard product={product} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:flex" />
                    <CarouselNext className="hidden lg:flex" />
                </Carousel>
            </div>
        </section>
    )
}
