import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
}

export function StarRating({ rating, maxRating = 5, size = 16, className }: StarRatingProps) {
  const roundedRating = Math.round(rating);
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[...Array(maxRating)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "stroke-1",
            i < roundedRating ? 'text-accent fill-accent' : 'text-muted-foreground/30 fill-muted'
          )}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}
