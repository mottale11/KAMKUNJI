
'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { mockProducts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { MoreVertical, Truck, PackageCheck, Ban, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/lib/types";

const statusIcons = {
    "Pending": <Truck className="h-4 w-4" />,
    "Shipped": <Truck className="h-4 w-4" />,
    "Delivered": <PackageCheck className="h-4 w-4" />,
    "Canceled": <Ban className="h-4 w-4" />,
};


export default function AccountOrdersPage() {
    const { user, loading: userLoading } = useAuth();
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('customer->>email', user.email)
                    .order('date', { ascending: false });

                if (error) throw error;
                
                const userOrders = data.map(order => ({ ...order, id: String(order.id) })) as Order[];
                setOrders(userOrders);
            } catch(e: any) {
                console.error("Error fetching user orders: ", e);
                toast({ variant: 'destructive', title: "Error", description: e.message || "Could not fetch your orders."})
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, toast]);

     const handleCancelOrder = async (orderId: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'Canceled' })
                .eq('id', orderId);

            if (error) throw error;

            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: 'Canceled' } : order
                )
            );
            toast({
                title: "Order Canceled",
                description: `Your order #${orderId.slice(0,7)} has been canceled.`,
            });
        } catch (error: any) {
            console.error("Error canceling order: ", error);
            toast({
                variant: "destructive",
                title: "Update failed",
                description: error.message || "Failed to cancel your order.",
            });
        }
    };


    if (loading || userLoading) {
        return <div>Loading your orders...</div>
    }
    
    if (!user) {
        return <div>Please log in to see your orders.</div>
    }

    return (
        <div className="space-y-6">
             <h2 className="text-2xl font-bold">Order History</h2>
             {orders.length === 0 ? (
                 <p className="text-muted-foreground">You haven't placed any orders yet.</p>
             ) : (
                orders.map((order) => {
                    return (
                        <Card key={order.id}>
                            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
                                <div className="grid gap-1.5">
                                    <CardTitle>Order #{String(order.id).slice(0, 7)}</CardTitle>
                                    <CardDescription>Date: {new Date(order.date).toLocaleDateString()}</CardDescription>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge
                                        variant="outline"
                                        className={cn("flex items-center gap-2", {
                                            "text-green-600 border-green-600 bg-green-50": order.status === "Delivered",
                                            "text-blue-600 border-blue-600 bg-blue-50": order.status === "Shipped",
                                            "text-yellow-600 border-yellow-600 bg-yellow-50": order.status === "Pending",
                                            "text-red-600 border-red-600 bg-red-50": order.status === "Canceled",
                                        })}
                                    >
                                        {statusIcons[order.status]}
                                        <span>{order.status}</span>
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem disabled>Track Order</DropdownMenuItem>
                                            <DropdownMenuItem disabled>View Details</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            {order.status === "Pending" && (
                                            <DropdownMenuItem 
                                                className="text-red-500 focus:text-red-500" 
                                                onSelect={() => handleCancelOrder(order.id)}
                                            >
                                                <Ban className="mr-2 h-4 w-4" />
                                                Cancel Order
                                            </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                            {(order.items as any[]).map(item => (
                                    <div key={item.productId} className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Link href={`/product/${item.productId}`} className="font-semibold hover:underline">{item.title}</Link>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">Ksh {(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                            ))}
                            </CardContent>
                            <CardFooter className="bg-muted/50 p-4 rounded-b-lg flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total</span>
                                <span className="font-bold text-lg">Ksh {order.total.toFixed(2)}</span>
                            </CardFooter>
                        </Card>
                    )
                })
            )}
        </div>
    );
}
