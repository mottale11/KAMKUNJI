
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download } from "lucide-react";

const billingHistory = [
    { id: 'INV-2023-001', date: '2023-10-28', amount: 'Ksh 2,500.00', status: 'Paid' },
    { id: 'INV-2023-002', date: '2023-09-28', amount: 'Ksh 2,500.00', status: 'Paid' },
    { id: 'INV-2023-003', date: '2023-08-28', amount: 'Ksh 2,500.00', status: 'Paid' },
]

export default function AdminBillingPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Billing</CardTitle>
                    <CardDescription>Manage your subscription and billing details.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                             <CardHeader className="flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-normal">Current Plan</CardTitle>
                                <Badge variant="secondary">Pro</Badge>
                             </CardHeader>
                             <CardContent>
                                <p className="text-2xl font-bold">Ksh 2,500 / month</p>
                                <p className="text-xs text-muted-foreground">Billed monthly. Your next payment is on November 28, 2023.</p>
                             </CardContent>
                             <CardFooter>
                                <Button>Upgrade Plan</Button>
                             </CardFooter>
                        </Card>
                         <Card>
                             <CardHeader className="flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-normal">Payment Method</CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                             </CardHeader>
                             <CardContent>
                                <p className="font-medium">Visa ending in 1234</p>
                                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                             </CardContent>
                              <CardFooter>
                                <Button variant="outline">Update Payment Method</Button>
                             </CardFooter>
                        </Card>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>View your past invoices and payment history.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {billingHistory.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell>{invoice.amount}</TableCell>
                                    <TableCell>
                                        <Badge variant={invoice.status === 'Paid' ? 'outline' : 'destructive'} className="text-green-600 border-green-600 bg-green-50">
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <Download className="h-4 w-4" />
                                            <span className="sr-only">Download Invoice</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
