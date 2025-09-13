

'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Order, Product } from "@/lib/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, User, Mail, Phone, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface OrderDetailsDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
    title: string;
    image_url?: string;
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchProductDetails = async () => {
            if (!order || !order.items) return;

            setLoading(true);
            try {
                const itemsWithDetails = await Promise.all(
                    order.items.map(async (item) => {
                        const { data: productData, error } = await supabase
                            .from('products')
                            .select('image_url')
                            .eq('id', item.productId)
                            .single();
                        
                        return {
                            ...item,
                            image_url: productData?.image_url || 'https://placehold.co/100x100'
                        };
                    })
                );
                setOrderItems(itemsWithDetails);
            } catch (error) {
                console.error("Error fetching product details for order:", error);
                 setOrderItems(order.items.map(item => ({...item, image_url: 'https://placehold.co/100x100'})));
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchProductDetails();
        }
    }, [order, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        Order #{String(order.id).slice(0, 7)} - {new Date(order.created_at).toLocaleDateString()}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6">
                     {loading ? (
                         <div className="flex items-center justify-center py-10">
                             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                         </div>
                     ) : (
                        <div>
                            <h3 className="font-semibold mb-2">Items</h3>
                            <div className="space-y-3">
                                {orderItems.map(item => (
                                    <div key={item.productId} className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                                            <Image src={item.image_url || ''} alt={item.title} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">Ksh {(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-4" />
                            <div className="flex justify-end items-center">
                                <span className="text-lg font-bold">Total: Ksh {order.total.toFixed(2)}</span>
                            </div>
                        </div>
                     )}
                     <Separator />
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                             <h3 className="font-semibold mb-2 flex items-center gap-2"><User className="h-4 w-4" /> Customer Details</h3>
                             <p className="text-sm">{order.customer.name}</p>
                             <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                <Mail className="h-3 w-3" />
                                {order.customer.email}
                            </p>
                             {order.delivery_info?.phone && (
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                    <Phone className="h-3 w-3" />
                                    {order.delivery_info.phone}
                                </p>
                             )}
                        </div>
                        {order.delivery_info && (
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><MapPin className="h-4 w-4" /> Shipping Address</h3>
                                <address className="text-sm not-italic text-muted-foreground">
                                    {order.delivery_info.name}<br />
                                    {order.delivery_info.address}<br />
                                    {order.delivery_info.city}, {order.delivery_info.county}
                                </address>
                            </div>
                        )}
                    </div>
                     <Separator />
                     <div>
                        <h3 className="font-semibold mb-2">Order Status</h3>
                        <Badge
                            variant="outline"
                            className={cn("text-base", {
                                "text-green-600 border-green-600 bg-green-50": order.status === "Delivered",
                                "text-blue-600 border-blue-600 bg-blue-50": order.status === "Shipped",
                                "text-yellow-600 border-yellow-600 bg-yellow-50": order.status === "Pending",
                                "text-red-600 border-red-600 bg-red-50": order.status === "Canceled",
                            })}
                        >
                            {order.status}
                        </Badge>
                     </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
