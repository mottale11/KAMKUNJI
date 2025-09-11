
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/lib/types";
import { mockProducts } from "@/lib/mock-data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, User, Mail, Phone } from "lucide-react";

interface OrderDetailsDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
    const orderProducts = order.items.map(item => {
        const product = mockProducts.find(p => p.id === item.productId);
        return product ? { ...product, quantity: item.quantity } : null;
    }).filter(p => p !== null);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        Order #{order.id} - {new Date(order.date).toLocaleDateString()}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6">
                    <div>
                        <h3 className="font-semibold mb-2">Items</h3>
                        <div className="space-y-3">
                            {orderProducts.map(product => (
                                product && (
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
                                )
                            ))}
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-end items-center">
                            <span className="text-lg font-bold">Total: Ksh {order.total.toFixed(2)}</span>
                        </div>
                    </div>
                     <Separator />
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                             <h3 className="font-semibold mb-2 flex items-center gap-2"><User className="h-4 w-4" /> Customer Details</h3>
                             <p className="text-sm">{order.customer.name}</p>
                             <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                <Mail className="h-3 w-3" />
                                {order.customer.email}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><MapPin className="h-4 w-4" /> Shipping Address</h3>
                            <address className="text-sm not-italic text-muted-foreground">
                                {order.deliveryInfo.address}<br />
                                {order.deliveryInfo.city}, {order.deliveryInfo.state} {order.deliveryInfo.zip}
                            </address>
                        </div>
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
