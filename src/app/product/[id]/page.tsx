import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { mockProducts, mockCategories } from '@/lib/mock-data';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/star-rating';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Minus, Plus, ShoppingCart, CheckCircle } from 'lucide-react';
import { ProductCard } from '@/components/product-card';

export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id,
  }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const category = mockCategories.find((c) => c.name === product.category);
  const relatedProducts = mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {category ? (
                   <BreadcrumbLink asChild>
                    <Link href={`/category/${category.id}`}>{category.name}</Link>
                   </BreadcrumbLink>
                ) : (
                    <span>{product.category}</span>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="container grid md:grid-cols-2 gap-12 items-start">
          <div className="relative aspect-square md:aspect-[4/3]">
             <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              data-ai-hint={product.imageHint}
            />
            {hasDiscount && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                    -{discountPercentage}%
                </Badge>
            )}
          </div>

          <div className="space-y-6">
            <div>
                <h1 className="text-3xl lg:text-4xl font-bold font-headline">{product.title}</h1>
                <p className="text-muted-foreground mt-2">{product.category}</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <StarRating rating={product.rating} size={20} />
                    <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                {product.stock && product.stock > 0 ? (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>In Stock ({product.stock})</span>
                    </div>
                ) : (
                    <div className="text-sm text-destructive">Out of Stock</div>
                )}
            </div>

            <div className="flex items-baseline gap-2 font-headline">
              <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
              {hasDiscount && (
                <p className="text-xl text-muted-foreground line-through">${product.originalPrice!.toFixed(2)}</p>
              )}
            </div>
            
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            
            <Separator />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 border rounded-md">
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-bold w-8 text-center">1</span>
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <Button size="lg" className="w-full sm:w-auto flex-1 bg-primary hover:bg-primary/90">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                </Button>
            </div>
          </div>
        </div>

        <section className="py-16 lg:py-24">
            <div className="container">
                 <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {relatedProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
