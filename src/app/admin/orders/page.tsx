
'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { MoreHorizontal, File, Truck, Ban } from "lucide-react";
import { OrderDetailsDialog } from "@/components/admin/order-details-dialog";
import type { Order } from "@/lib/types";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type ActionType = 'ship' | 'cancel';

export default function OrdersPage() {
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [actionOrder, setActionOrder] = useState<{order: Order, type: ActionType} | null>(null);

     const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            const ordersData = data.map(o => ({...o, id: String(o.id)})) as Order[];
            setOrders(ordersData);
        } catch (error: any) {
            console.error("Error fetching orders: ", error);
            toast({
                variant: "destructive",
                title: "Error fetching orders",
                description: error.message || "Could not load orders from the database.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async () => {
        if (!actionOrder) return;
        
        const { order, type } = actionOrder;
        const newStatus = type === 'ship' ? 'Shipped' : 'Canceled';

        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', order.id);

            if (error) throw error;

            setOrders(prevOrders => 
                prevOrders.map(o => 
                    o.id === order.id ? { ...o, status: newStatus } : o
                )
            );
            toast({
                title: "Order Updated",
                description: `Order #${String(order.id).slice(0, 7)} has been marked as ${newStatus.toLowerCase()}.`,
            });
        } catch (error: any) {
            console.error("Error updating order status: ", error);
            toast({
                variant: "destructive",
                title: "Update failed",
                description: error.message || "Failed to update order status.",
            });
        } finally {
            setActionOrder(null);
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
                                        <TableCell className="font-medium">#{String(order.id).slice(0, 7)}</TableCell>
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
                                                        <DropdownMenuItem onSelect={() => setActionOrder({ order, type: 'ship'})}>
                                                            <Truck className="mr-2 h-4 w-4" />
                                                            Mark as Shipped
                                                        </DropdownMenuItem>
                                                    )}
                                                    {order.status === 'Pending' || order.status === 'Shipped' ? (
                                                    <DropdownMenuItem 
                                                        className="text-red-500 focus:text-red-500" 
                                                        onSelect={() => setActionOrder({ order, type: 'cancel' })}>
                                                        <Ban className="mr-2 h-4 w-4" />
                                                        Cancel Order
                                                    </DropdownMenuItem>
                                                    ) : null}
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
             <AlertDialog open={!!actionOrder} onOpenChange={() => setActionOrder(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will update the order status to "{actionOrder?.type === 'ship' ? 'Shipped' : 'Canceled'}". An email notification may be sent to the customer.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleUpdateStatus}>
                        Confirm
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
