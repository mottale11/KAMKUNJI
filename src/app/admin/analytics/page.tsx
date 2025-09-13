
'use client'
import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { Users, CreditCard, Activity, DollarSign, TrafficCone, LineChart, Loader2 } from "lucide-react";
import { Overview } from "@/components/admin/overview";
import { RecentSales } from "@/components/admin/recent-sales";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
    totalRevenue: number;
    totalSales: number;
    totalCustomers: number;
    revenueChange: number;
    salesChange: number;
    customerChange: number;
}

  export default function AnalyticsPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const { data: orders, error: ordersError } = await supabase.from('orders').select('created_at, total');
            if (ordersError) throw ordersError;
            
            const { data: customers, error: customersError } = await supabase.from('customers').select('created_at');
            if (customersError) throw customersError;

            const now = new Date();
            const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

            const currentMonthOrders = orders.filter(o => new Date(o.created_at) > oneMonthAgo);
            const previousMonthOrders = orders.filter(o => new Date(o.created_at) > twoMonthsAgo && new Date(o.created_at) <= oneMonthAgo);
            
            const currentMonthCustomers = customers.filter(c => new Date(c.created_at) > oneMonthAgo);
            const previousMonthCustomers = customers.filter(c => new Date(c.created_at) > twoMonthsAgo && new Date(c.created_at) <= oneMonthAgo);

            const totalRevenue = currentMonthOrders.reduce((acc, order) => acc + order.total, 0);
            const prevMonthRevenue = previousMonthOrders.reduce((acc, order) => acc + order.total, 0);

            const totalSales = currentMonthOrders.length;
            const prevMonthSales = previousMonthOrders.length;

            const totalCustomers = currentMonthCustomers.length;
            const prevTotalCustomers = previousMonthCustomers.length;
            
            const calculateChange = (current: number, previous: number) => {
                if (previous === 0) return current > 0 ? 100 : 0;
                return ((current - previous) / previous) * 100;
            };

            setStats({
                totalRevenue,
                totalSales,
                totalCustomers,
                revenueChange: calculateChange(totalRevenue, prevMonthRevenue),
                salesChange: calculateChange(totalSales, prevMonthSales),
                customerChange: calculateChange(totalCustomers, prevTotalCustomers),
            });

        } catch (error) {
            console.error("Error fetching dashboard data: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const formatChange = (change: number | undefined) => {
        if (change === undefined || change === 0 || !isFinite(change)) return `+0% from last month`;
        const sign = change > 0 ? '+' : '';
        return `${sign}${change.toFixed(1)}% from last month`;
    };
    
    return (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
           {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
            <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Ksh {stats?.totalRevenue.toFixed(2) ?? '0.00'}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatChange(stats?.revenueChange)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Customers
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{stats?.totalCustomers ?? 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatChange(stats?.customerChange)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{stats?.totalSales ?? 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatChange(stats?.salesChange)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Now
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+0</div>
                  <p className="text-xs text-muted-foreground">
                    (real-time data coming soon)
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made {stats?.totalSales ?? 0} sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
            </>
            )}
          </TabsContent>
           <TabsContent value="sales" className="space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle>Sales Analytics</CardTitle>
                    <CardDescription>A detailed breakdown of sales performance.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-16">
                     <div className="mx-auto max-w-sm">
                        <LineChart className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h3 className="text-lg font-semibold mt-4">Sales Data Coming Soon</h3>
                        <p className="text-muted-foreground text-sm mt-2">Check back later for a detailed sales analysis.</p>
                        <Button className="mt-4" variant="outline" onClick={fetchDashboardData}>Refresh Data</Button>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="traffic" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Website Traffic</CardTitle>
                    <CardDescription>Analysis of visitor sources and behavior.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-16">
                    <div className="mx-auto max-w-sm">
                        <TrafficCone className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h3 className="text-lg font-semibold mt-4">Traffic Analysis Under Construction</h3>
                        <p className="text-muted-foreground text-sm mt-2">We are currently setting up traffic analytics. Please check back soon.</p>
                        <Button className="mt-4" variant="outline">Refresh Data</Button>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    )
  }
