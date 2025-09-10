import type { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/star-rating';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/product/${product.id}`} className="block">
        <CardContent className="p-0">
          <div className="aspect-[4/3] relative">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              data-ai-hint={product.imageHint}
            />
            {hasDiscount && (
              <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
          <div className="p-4 space-y-2">
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h3 className="font-semibold text-base h-12 leading-tight line-clamp-2">{product.title}</h3>
            <div className="flex items-center gap-2">
                <StarRating rating={product.rating} size={14} />
                <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
            <div className="flex items-baseline gap-2 font-headline">
              <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
              {hasDiscount && (
                <p className="text-sm text-muted-foreground line-through">${product.originalPrice!.toFixed(2)}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
      <div className="p-4 pt-0">
        <Button className="w-full" variant="outline">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
