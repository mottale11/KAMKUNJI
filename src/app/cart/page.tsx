'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const cartItems = [
    { product: mockProducts[0], quantity: 1 },
    { product: mockProducts[2], quantity: 1 },
    { product: mockProducts[4], quantity: 2 },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 8000 ? 0 : 220; // Example shipping for Nairobi county
  const total = subtotal + shipping;
  
  const handleCheckoutClick = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to proceed to checkout.",
        variant: "destructive",
      });
      router.push('/login');
    } else {
      router.push('/checkout');
    }
  };


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
                <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="container pb-16 lg:pb-24">
            <h1 className="text-3xl font-bold font-headline mb-8">Your Cart</h1>
            {cartItems.length > 0 ? (
                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <Card key={item.product.id} className="overflow-hidden">
                                <CardContent className="p-4 flex gap-4 items-center">
                                    <div className="relative w-24 h-24 rounded-md overflow-hidden">
                                        <Image src={item.product.imageUrl} alt={item.product.title} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <Link href={`/product/${item.product.id}`} className="font-semibold hover:underline">{item.product.title}</Link>
                                        <p className="text-sm text-muted-foreground">{item.product.category}</p>
                                        <p className="text-lg font-bold text-primary mt-1">Ksh {item.product.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 border rounded-md">
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><Minus className="h-4 w-4" /></Button>
                                        <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><Plus className="h-4 w-4" /></Button>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6 space-y-6">
                                <h2 className="text-2xl font-bold">Order Summary</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-medium">Ksh {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="font-medium">{shipping > 0 ? `Ksh ${shipping.toFixed(2)}` : 'Free'}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>Ksh {total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <Button onClick={handleCheckoutClick} size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                         <Card className="mt-4">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">Apply Discount Code</h3>
                                <form className="flex gap-2">
                                    <Input placeholder="Enter coupon" />
                                    <Button variant="outline">Apply</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 border-dashed border-2 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <Button asChild>
                        <Link href="/">Continue Shopping</Link>
                    </Button>
                </div>
            )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
