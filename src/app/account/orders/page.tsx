
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { mockOrders, mockProducts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { MoreVertical, Truck, PackageCheck, Ban, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const statusIcons = {
    "Pending": <Truck className="h-4 w-4" />,
    "Shipped": <Truck className="h-4 w-4" />,
    "Delivered": <PackageCheck className="h-4 w-4" />,
    "Canceled": <Ban className="h-4 w-4" />,
};


export default function AccountOrdersPage() {
    return (
        <div className="space-y-6">
             <h2 className="text-2xl font-bold">Order History</h2>
            {mockOrders.map((order) => {
                 const orderProducts = order.items.map(item => {
                    const product = mockProducts.find(p => p.id === item.productId);
                    return product ? { ...product, quantity: item.quantity } : null;
                }).filter(p => p !== null);

                return (
                    <Card key={order.id}>
                        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
                            <div className="grid gap-1.5">
                                <CardTitle>Order #{order.id}</CardTitle>
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
                                        <DropdownMenuItem>Track Order</DropdownMenuItem>
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            Request Refund
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                                            <Ban className="mr-2 h-4 w-4" />
                                            Cancel Order
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {orderProducts.map(product => (
                                product && (
                                    <div key={product.id} className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                            <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <Link href={`/product/${product.id}`} className="font-semibold hover:underline">{product.title}</Link>
                                            <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                                        </div>
                                        <p className="font-medium">Ksh {(product.price * product.quantity).toFixed(2)}</p>
                                    </div>
                                )
                           ))}
                        </CardContent>
                        <CardFooter className="bg-muted/50 p-4 rounded-b-lg flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total</span>
                            <span className="font-bold text-lg">Ksh {order.total.toFixed(2)}</span>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    );
}