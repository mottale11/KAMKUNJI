
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { supabase } from "@/lib/supabase";
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
            const { data: orders, error } = await supabase.from('orders').select('date, total');

            if (error || !orders) {
                console.error('Error fetching sales data', error);
                return;
            }

            const monthlySales: { [key: string]: number } = {
                "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0,
                "Jul": 0, "Aug": 0, "Sep": 0, "Oct": 0, "Nov": 0, "Dec": 0
            };

            orders.forEach(order => {
                const orderDate = new Date(order.date);
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
