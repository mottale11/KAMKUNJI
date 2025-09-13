
'use client'
import type { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/star-rating';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
}

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const hasDiscount = !!product.original_price && product.original_price > product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
      <Link href={`/product/${product.id}`} className="block flex flex-col flex-grow">
        <CardContent className="p-0 flex flex-col flex-grow">
          <div className="aspect-[4/3] relative">
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              data-ai-hint={product.image_hint}
            />
            {hasDiscount && (
              <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
          <div className="p-4 space-y-2 flex flex-col flex-grow">
            <p className="text-sm text-muted-foreground">{categoryName || 'Uncategorized'}</p>
            <h3 className="font-semibold text-base h-12 leading-tight line-clamp-2">{product.title}</h3>
            <div className="flex items-center gap-2">
                <StarRating rating={product.rating || 0} size={14} />
                <span className="text-xs text-muted-foreground">({product.review_count})</span>
            </div>
            <div className="flex items-baseline gap-2 font-headline mt-auto pt-2">
              <p className="text-lg font-bold text-primary">Ksh {product.price.toFixed(2)}</p>
              {hasDiscount && product.original_price && (
                <p className="text-sm text-muted-foreground line-through">Ksh {product.original_price.toFixed(2)}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
      <div className="p-4 pt-0">
        <Button className="w-full" variant="outline" onClick={handleAddToCart} disabled={(product.stock || 0) === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
