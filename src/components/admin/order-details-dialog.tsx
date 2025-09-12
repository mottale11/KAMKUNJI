
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Order, Product } from "@/lib/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, User, Mail, Phone, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface OrderDetailsDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OrderProduct extends Product {
    quantity: number;
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
    const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchProducts = async () => {
            if (!order || !order.items) return;

            setLoading(true);
            try {
                const productIds = order.items.map(item => item.productId);
                if (productIds.length === 0) {
                     setOrderProducts([]);
                     setLoading(false);
                     return;
                }

                const productsQuery = query(collection(db, "products"), where("__name__", "in", productIds));
                const productsSnapshot = await getDocs(productsQuery);
                const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

                const productsWithQuantity = order.items.map(item => {
                    const product = productsData.find(p => p.id === item.productId);
                    return product ? { ...product, quantity: item.quantity } : null;
                }).filter((p): p is OrderProduct => p !== null);

                setOrderProducts(productsWithQuantity);
            } catch (error) {
                console.error("Error fetching product details for order:", error);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchProducts();
        }
    }, [order, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        Order #{order.id.slice(0, 7)} - {new Date(order.date).toLocaleDateString()}
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
                                {orderProducts.map(product => (
                                    <div key={product.id} className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                                            <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">{product.title}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                                        </div>
                                        <p className="font-medium">Ksh {(product.price * product.quantity).toFixed(2)}</p>
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
                             {order.deliveryInfo?.phone && (
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                    <Phone className="h-3 w-3" />
                                    {order.deliveryInfo.phone}
                                </p>
                             )}
                        </div>
                        {order.deliveryInfo && (
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><MapPin className="h-4 w-4" /> Shipping Address</h3>
                                <address className="text-sm not-italic text-muted-foreground">
                                    {order.deliveryInfo.name}<br />
                                    {order.deliveryInfo.address}<br />
                                    {order.deliveryInfo.city}, {order.deliveryInfo.county}
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

