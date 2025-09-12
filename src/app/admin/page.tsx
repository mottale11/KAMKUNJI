
'use client'
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
import { Users, CreditCard, Activity, DollarSign, Bell, ShoppingBag, BarChart } from "lucide-react";
import { Overview } from "@/components/admin/overview";
import { RecentSales } from "@/components/admin/recent-sales";
import { NewOrders } from "@/components/admin/new-orders";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order } from "@/lib/types";

interface DashboardStats {
    totalRevenue: number;
    totalSales: number;
    totalCustomers: number;
    revenueChange: number;
    salesChange: number;
    customerChange: number;
}


  export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const ordersSnapshot = await getDocs(collection(db, "orders"));
                const orders = ordersSnapshot.docs.map(doc => doc.data() as Order);
                
                const now = new Date();
                const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

                const currentMonthOrders = orders.filter(o => {
                    const orderDate = (o.date as unknown as Timestamp).toDate();
                    return orderDate > oneMonthAgo;
                });

                const previousMonthOrders = orders.filter(o => {
                    const orderDate = (o.date as unknown as Timestamp).toDate();
                    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
                    return orderDate > twoMonthsAgo && orderDate <= oneMonthAgo;
                });

                const totalRevenue = currentMonthOrders.reduce((acc, order) => acc + order.total, 0);
                const prevMonthRevenue = previousMonthOrders.reduce((acc, order) => acc + order.total, 0);

                const totalSales = currentMonthOrders.length;
                const prevMonthSales = previousMonthOrders.length;

                const customerEmails = new Set(currentMonthOrders.map(o => o.customer.email));
                const totalCustomers = customerEmails.size;
                const prevCustomerEmails = new Set(previousMonthOrders.map(o => o.customer.email));
                const prevTotalCustomers = prevCustomerEmails.size;
                
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

        fetchDashboardData();
    }, []);

    const formatChange = (change: number) => {
        if (change === 0) return `+0% from last month`;
        const sign = change > 0 ? '+' : '';
        return `${sign}${change.toFixed(1)}% from last month`;
    };


    return (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" asChild><a href="/admin/analytics">Analytics</a></TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">
              Notifications
              <Badge className="ml-2 bg-red-500 text-white">0</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
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
                    {stats ? formatChange(stats.revenueChange) : '+0% from last month'}
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
                    {stats ? formatChange(stats.customerChange) : '+0% from last month'}
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
                    {stats ? formatChange(stats.salesChange) : '+0% from last month'}
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
                    +0 since last hour
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
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle>New Orders</CardTitle>
                        <CardDescription>A list of the most recent orders to be processed.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <NewOrders />
                    </CardContent>
                </Card>
             </div>
          </TabsContent>
           <TabsContent value="analytics" className="space-y-4">
            <p className="text-muted-foreground">Analytics will be displayed here. Click the tab to navigate to the main analytics page.</p>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4 text-center py-16">
             <div className="mx-auto max-w-sm">
                <BarChart className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold mt-4">No Reports Generated</h3>
                <p className="text-muted-foreground text-sm mt-2">You haven't generated any reports yet. When you do, they will appear here.</p>
                <Button className="mt-4">Generate Report</Button>
            </div>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Recent activity from your store.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="text-center text-muted-foreground py-8">
                     No new notifications.
                   </div>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    )
  }

    