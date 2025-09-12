
'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { MoreHorizontal, File, Truck } from "lucide-react";
import { OrderDetailsDialog } from "@/components/admin/order-details-dialog";
import type { Order } from "@/lib/types";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function OrdersPage() {
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

     const fetchOrders = async () => {
        setLoading(true);
        try {
            const ordersQuery = query(collection(db, "orders"), orderBy("date", "desc"));
            const querySnapshot = await getDocs(ordersQuery);
            const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
            setOrders(ordersData);
        } catch (error) {
            console.error("Error fetching orders: ", error);
            toast({
                variant: "destructive",
                title: "Error fetching orders",
                description: "Could not load orders from the database.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleMarkAsShipped = async (orderId: string) => {
        const orderRef = doc(db, "orders", orderId);
        try {
            await updateDoc(orderRef, { status: 'Shipped' });
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: 'Shipped' } : order
                )
            );
            toast({
                title: "Order Updated",
                description: `Order #${orderId} has been marked as shipped.`,
            });
            // Here you would also trigger an API call to send an email.
        } catch (error) {
            console.error("Error updating order status: ", error);
            toast({
                variant: "destructive",
                title: "Update failed",
                description: "Failed to update order status.",
            });
        }
    };
    
    const exportOrdersToCSV = () => {
        const headers = ["Order ID", "Customer Name", "Customer Email", "Date", "Status", "Total"];
        const rows = orders.map(order => [
            order.id,
            order.customer.name,
            order.customer.email,
            new Date(order.date).toISOString().split('T')[0],
            order.status,
            order.total.toFixed(2)
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: "Orders Exported", description: "The order list has been exported to CSV." });
    };

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Orders</h1>
                <Button onClick={exportOrdersToCSV} disabled={orders.length === 0}>
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">Loading orders...</TableCell>
                                </TableRow>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">#{order.id.slice(0, 7)}</TableCell>
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
                                ))
                             ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">No orders found.</TableCell>
                                </TableRow>
                            )}
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
