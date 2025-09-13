
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Loader2, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { initiateMpesaPayment } from '@/ai/flows/mpesa-payment';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';


const shippingOptions = {
    'nairobi-cbd': 70,
    'nairobi-county': 220,
    'other-counties': 310
};

const MpesaLogo = () => (
    <svg width="25" height="18" viewBox="0 0 25 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
        <path d="M18.544 17.22L16.03 13.112L12.484 17.22H10.036L14.788 10.844L11.8 6.4H14.44L16.42 9.536L18.412 6.4H20.932L17.92 10.844L22.696 17.22H20.044L16.42 12.02L18.544 17.22Z" fill="white"/>
        <path d="M3.4 6.4V17.22H0V6.4H3.4Z" fill="white"/>
        <path d="M9.1 6.4V17.22H5.7V6.4H9.1Z" fill="white"/>
    </svg>
)

export default function CheckoutPage() {
    const [shippingOption, setShippingOption] = useState('nairobi-county');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [county, setCounty] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) return;
        setName(user.user_metadata.full_name || '');
    }, [user])


    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shippingFee = subtotal > 8000 ? 0 : shippingOptions[shippingOption as keyof typeof shippingOptions];
    const total = subtotal + shippingFee;

    const handlePayment = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Not Logged In', description: 'Please log in to place an order.' });
            return;
        }
        if (!phone || !/^(07|01)\d{8}$/.test(phone) || !name || !address || !city || !county) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please fill out all shipping and contact details.',
            });
            return;
        }

        setIsProcessing(true);
        toast({
            title: 'Processing Payment...',
            description: 'Sending payment request to your phone.',
        });

        try {
            // In a real app, you'd wait for a callback from your payment provider.
            // Here, we'll simulate a successful payment and create the order.
            const result = await initiateMpesaPayment({ phone, amount: 1 }); // Use 1 KES for testing
            if (result.success) {
                toast({
                    title: 'Payment Request Sent',
                    description: 'Please check your phone to complete the payment. Order will be created upon confirmation.',
                });

                // Simulate waiting for payment confirmation
                setTimeout(async () => {
                    try {
                        const orderData = {
                            customer: {
                                name: user.user_metadata.full_name || name,
                                email: user.email,
                            },
                            date: new Date().toISOString(),
                            status: 'Pending',
                            total: total,
                            items: cart.map(item => ({
                                productId: item.product.id,
                                quantity: item.quantity,
                                price: item.product.price, // store price at time of purchase
                                title: item.product.title,
                            })),
                            deliveryInfo: {
                                name,
                                phone,
                                address,
                                city,
                                county,
                            },
                        };

                        const { error } = await supabase.from('orders').insert(orderData);

                        if (error) throw error;
                        
                        toast({
                            title: 'Order Placed!',
                            description: 'Your order has been successfully placed.',
                        });

                        clearCart();
                        router.push('/account/orders');

                    } catch(e: any) {
                         toast({
                            variant: 'destructive',
                            title: 'Order Creation Failed',
                            description: e.message || 'We could not save your order. Please contact support.',
                        });
                    } finally {
                        setIsProcessing(false);
                    }
                }, 8000); // Simulate 8 second wait for M-Pesa pin

            } else {
                toast({
                    variant: 'destructive',
                    title: 'Payment Failed',
                    description: result.message || 'An unknown error occurred.',
                });
                setIsProcessing(false);
            }
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not connect to the payment service. Please try again.',
            });
            setIsProcessing(false);
        }
    };


    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 px-4">
                <div className="container py-8">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/cart">Cart</Link></BreadcrumbLink></BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem><BreadcrumbPage>Checkout</BreadcrumbPage></BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="container pb-16 lg:pb-24">
                    <h1 className="text-3xl font-bold font-headline mb-8">Checkout</h1>
                    {cart.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        <div className="lg:col-span-2 space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Shipping Address</CardTitle>
                                    <CardDescription>Enter your shipping details below. The shipping fee will be calculated based on your address.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="grid sm:grid-cols-2 gap-4">
                                        <Input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
                                        <Input 
                                            type="tel" 
                                            placeholder="Phone (e.g. 0712345678)" 
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                    <Input placeholder="Address (e.g. Street, Building, Floor)" value={address} onChange={e => setAddress(e.target.value)} />
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Input placeholder="City / Town" value={city} onChange={e => setCity(e.target.value)} />
                                        <Input placeholder="County" value={county} onChange={e => setCounty(e.target.value)} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Shipping Method</CardTitle>
                                    <CardDescription>Select your shipping region to see the fee.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup value={shippingOption} onValueChange={setShippingOption} className="space-y-2">
                                        <Label htmlFor="nairobi-cbd" className="flex items-center justify-between p-4 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                            <div className="flex items-center gap-4">
                                                <RadioGroupItem value="nairobi-cbd" id="nairobi-cbd" />
                                                <span>Around Nairobi CBD</span>
                                            </div>
                                            <span className="font-bold">Ksh 70</span>
                                        </Label>
                                        <Label htmlFor="nairobi-county" className="flex items-center justify-between p-4 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                             <div className="flex items-center gap-4">
                                                <RadioGroupItem value="nairobi-county" id="nairobi-county" />
                                                <span>Around Nairobi County</span>
                                            </div>
                                            <span className="font-bold">Ksh 220</span>
                                        </Label>
                                        <Label htmlFor="other-counties" className="flex items-center justify-between p-4 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                             <div className="flex items-center gap-4">
                                                <RadioGroupItem value="other-counties" id="other-counties" />
                                                <span>Other Counties</span>
                                            </div>
                                            <span className="font-bold">Ksh 310</span>
                                        </Label>
                                    </RadioGroup>
                                    <p className="text-sm text-muted-foreground mt-4">Free shipping on orders over Ksh 8,000.</p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1 space-y-6 sticky top-24">
                           <Card>
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2 text-sm">
                                    {cart.map(item => (
                                        <div key={item.product.id} className="flex items-center gap-4">
                                             <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                                <Image src={item.product.imageUrl} alt={item.product.title} fill className="object-cover" />
                                             </div>
                                             <div className="flex-1">
                                                <p className="font-medium line-clamp-1">{item.product.title}</p>
                                                <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                             </div>
                                             <p className="font-medium">Ksh {(item.product.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <div className="flex justify-between"><span>Subtotal</span><span className="font-medium">Ksh {subtotal.toFixed(2)}</span></div>
                                        <div className="flex justify-between"><span>Shipping</span><span className="font-medium">{shippingFee > 0 ? `Ksh ${shippingFee.toFixed(2)}` : 'Free'}</span></div>
                                        <Separator />
                                        <div className="flex justify-between text-lg font-bold"><span>Total</span><span>Ksh {total.toFixed(2)}</span></div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Button size="lg" className="w-full bg-green-600 hover:bg-green-700" onClick={handlePayment} disabled={isProcessing}>
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                    <MpesaLogo />
                                    Pay with M-Pesa (Ksh {total.toFixed(2)})
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                    ) : (
                         <div className="text-center py-16 border-dashed border-2 rounded-lg flex flex-col items-center">
                            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                            <p className="text-muted-foreground mb-6">You need to add items to your cart before you can checkout.</p>
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
