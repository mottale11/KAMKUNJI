

'use client'
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabase";
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/star-rating';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Minus, Plus, ShoppingCart, CheckCircle, Loader2 } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import type { Product, Category } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';


// A helper component for the WhatsApp button to avoid hydration issues with use-client
const WhatsAppButton = ({ productUrl, productName }: { productUrl: string, productName: string }) => {
    const whatsappNumber = "254111882253";
    const message = encodeURIComponent(`Hello! I'm interested in ordering this product: ${productName}. Product link: ${productUrl}`);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    const WhatsappIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
    )

    return (
        <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white">
                <WhatsappIcon />
                Order via WhatsApp
            </Button>
        </Link>
    );
};


export default function ProductPage({ params }: { params: { id: string } }) {
    const { addToCart } = useCart();
    const { toast } = useToast();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [productUrl, setProductUrl] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setProductUrl(`${window.location.protocol}//${window.location.host}/product/${params.id}`);

        const fetchData = async () => {
            setLoading(true);
            
            const { data: productData, error: productError } = await supabase
                .from('products')
                .select('*')
                .eq('id', params.id)
                .single();

            if (productError || !productData) {
                notFound();
                return;
            }
            
            setProduct(productData as Product);

            const { data: categoryData, error: categoryError } = await supabase
                .from('categories')
                .select('*')
                .eq('name', productData.category)
                .single();
            
            if (categoryData) {
                setCategory(categoryData as Category);
            }

            const { data: relatedData, error: relatedError } = await supabase
                .from('products')
                .select('*')
                .eq('category', productData.category)
                .neq('id', productData.id)
                .limit(4);
            
            if (relatedData) {
                setRelatedProducts(relatedData as Product[]);
            }

            setLoading(false);
        };

        fetchData();
    }, [params.id]);


  if (loading) {
      return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </main>
            <Footer />
        </div>
      )
  }
  
  if (!product) {
    return notFound();
  }
  
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.title} has been added to your cart.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 px-4">
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
              <p className="text-3xl font-bold text-primary">Ksh {product.price.toFixed(2)}</p>
              {hasDiscount && (
                <p className="text-xl text-muted-foreground line-through">Ksh {product.originalPrice!.toFixed(2)}</p>
              )}
            </div>
            
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            
            <Separator />

            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2 border rounded-md">
                        <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold w-8 text-center">{quantity}</span>
                        <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(q => Math.min(product.stock || 1, q + 1))}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button size="lg" className="w-full sm:w-auto flex-1 bg-primary hover:bg-primary/90" onClick={handleAddToCart} disabled={(product.stock || 0) === 0}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                    </Button>
                </div>
                 <WhatsAppButton productUrl={productUrl} productName={product.title} />
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

