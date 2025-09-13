
'use client'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";
  

  export function NewOrders() {
    const [newOrders, setNewOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewOrders = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('status', 'Pending')
                    .order('date', { ascending: false })
                    .limit(5);

                if (error) throw error;
                const ordersData = data.map(o => ({...o, id: String(o.id)})) as Order[];
                setNewOrders(ordersData);
            } catch (error) {
                console.error("Error fetching new orders: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNewOrders();
    }, []);


    if (loading) {
        return <p className="text-sm text-muted-foreground text-center py-4">Loading new orders...</p>;
    }

    return (
      <div className="space-y-6">
        {newOrders.map((order, index) => (
            <div key={order.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://picsum.photos/seed/avatar${index+3}/40/40`} alt="Avatar" />
                    <AvatarFallback>{order.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{order.customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                    {order.customer.email}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-50">{order.status}</Badge>
                    <div className="font-medium">Ksh {order.total.toFixed(2)}</div>
                    <Button variant="outline" size="sm">View Order</Button>
                </div>
            </div>
        ))}
        {newOrders.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No new orders to process.</p>
        )}
      </div>
    )
  }
