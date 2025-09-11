
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
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

  export default function DashboardPage() {
    return (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" asChild><a href="/admin/analytics">Analytics</a></TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">
              Notifications
              <Badge className="ml-2 bg-red-500 text-white">2</Badge>
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
                  <div className="text-2xl font-bold">Ksh 4,523,189</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscriptions
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
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
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
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
                    You made 265 sales this month.
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
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 border border-green-200">
                        <div className="bg-green-100 p-2 rounded-full">
                            <ShoppingBag className="h-5 w-5 text-green-600"/>
                        </div>
                        <div>
                            <p className="font-medium">New Order #ORD006</p>
                            <p className="text-sm text-muted-foreground">A new order for Ksh 1599.00 was placed by Alex Johnson.</p>
                            <Button variant="link" className="p-0 h-auto mt-1" onClick={() => toast({ title: "Navigating to order..."})}>View Order</Button>
                        </div>
                    </div>
                     <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <Users className="h-5 w-5 text-blue-600"/>
                        </div>
                        <div>
                            <p className="font-medium">New Customer Signup</p>
                            <p className="text-sm text-muted-foreground">A new customer account was created for "jane.doe@example.com".</p>
                             <Button variant="link" className="p-0 h-auto mt-1" onClick={() => toast({ title: "Viewing customer..."})}>View Customer</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    )
  }
