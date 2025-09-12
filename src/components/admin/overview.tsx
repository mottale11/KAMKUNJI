
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order } from "@/lib/types";
import { useEffect, useState } from "react";

interface MonthlySales {
    name: string;
    total: number;
}

export function Overview() {
    const [data, setData] = useState<MonthlySales[]>([]);

    useEffect(() => {
        const fetchSalesData = async () => {
            const ordersSnapshot = await getDocs(collection(db, "orders"));
            const orders = ordersSnapshot.docs.map(doc => doc.data() as Order);

            const monthlySales: { [key: string]: number } = {
                "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0,
                "Jul": 0, "Aug": 0, "Sep": 0, "Oct": 0, "Nov": 0, "Dec": 0
            };

            orders.forEach(order => {
                const orderDate = (order.date as unknown as Timestamp).toDate();
                const monthName = orderDate.toLocaleString('default', { month: 'short' });
                monthlySales[monthName] += order.total;
            });
            
            const chartData = Object.entries(monthlySales).map(([name, total]) => ({ name, total }));
            setData(chartData);
        };

        fetchSalesData();
    }, []);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Ksh ${new Intl.NumberFormat('en-US').format(value as number)}`}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

    