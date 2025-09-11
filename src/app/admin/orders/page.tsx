
'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockOrders } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { MoreHorizontal, File, Truck } from "lucide-react";
import { OrderDetailsDialog } from "@/components/admin/order-details-dialog";
import type { Order } from "@/lib/types";
import { useState } from "react";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const handleMarkAsShipped = (orderId: string) => {
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId ? { ...order, status: 'Shipped' } : order
            )
        );
        // Here you would also trigger an API call to update the backend and send an email.
    };

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Orders</h1>
                <Button>
                    <File className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>Manage and view recent orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.id}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{order.customer.name}</div>
                                        <div className="text-sm text-muted-foreground hidden md:inline">{order.customer.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant="outline"
                                            className={cn({
                                                "text-green-600 border-green-600 bg-green-50": order.status === "Delivered",
                                                "text-blue-600 border-blue-600 bg-blue-50": order.status === "Shipped",
                                                "text-yellow-600 border-yellow-600 bg-yellow-50": order.status === "Pending",
                                                "text-red-600 border-red-600 bg-red-50": order.status === "Canceled",
                                            })}
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">Ksh {order.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onSelect={() => setSelectedOrder(order)}>View Details</DropdownMenuItem>
                                                {order.status === 'Pending' && (
                                                    <DropdownMenuItem onSelect={() => handleMarkAsShipped(order.id)}>
                                                        <Truck className="mr-2 h-4 w-4" />
                                                        Mark as Shipped
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem className="text-red-500 focus:text-red-500">Cancel Order</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            {selectedOrder && (
                <OrderDetailsDialog 
                    order={selectedOrder}
                    open={!!selectedOrder}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setSelectedOrder(null);
                        }
                    }}
                />
            )}
        </>
    );
}
