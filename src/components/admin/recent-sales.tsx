
'use client'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";
  
  export function RecentSales() {
    const [recentSales, setRecentSales] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentSales = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "orders"), orderBy("date", "desc"), limit(5));
                const querySnapshot = await getDocs(q);
                const salesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
                setRecentSales(salesData);
            } catch (error) {
                console.error("Error fetching recent sales: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentSales();
    }, []);

    if (loading) {
        return <div className="text-sm text-center text-muted-foreground">Loading recent sales...</div>
    }

    if (recentSales.length === 0) {
        return <div className="text-sm text-center text-muted-foreground">No recent sales.</div>
    }

    return (
      <div className="space-y-8">
        {recentSales.map((sale, index) => (
            <div key={sale.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://picsum.photos/seed/avatar${index+1}/40/40`} alt="Avatar" />
                    <AvatarFallback>{sale.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                    {sale.customer.email}
                    </p>
                </div>
                <div className="ml-auto font-medium">+Ksh {sale.total.toFixed(2)}</div>
            </div>
        ))}
      </div>
    )
  }
