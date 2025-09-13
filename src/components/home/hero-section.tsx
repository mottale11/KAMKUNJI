
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
    const heroImage = PlaceHolderImages.find(p => p.id === 'hero-main') || { image_url: 'https://picsum.photos/seed/hero/1920/1080', imageHint: 'fast delivery' };

    return (
        <section className="relative h-[60vh] md:h-[70vh] w-full text-white">
            <Image 
                src={heroImage.image_url}
                alt="E-commerce hero banner"
                fill
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"/>
            <div className="relative h-full flex flex-col justify-end items-start container pb-16 md:pb-24">
                <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-lg max-w-3xl">
                    Incredible Deals, Delivered to You
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl text-white/90 drop-shadow-md">
                    Discover the latest trends in electronics, fashion, and home goods. Quality products at prices you'll love.
                </p>
                <Link href="/deals" className="mt-8">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                        Shop Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </section>
    )
}
