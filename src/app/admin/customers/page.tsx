
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockOrders } from "@/lib/mock-data";
import { MoreHorizontal, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const customers = mockOrders.map(order => order.customer);
const uniqueCustomers = Array.from(new Set(customers.map(c => c.email)))
  .map(email => {
    return customers.find(c => c.email === email)!;
  });

export default function CustomersPage() {
    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Customers</h1>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Customer List</CardTitle>
                    <CardDescription>View and manage your customers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="hidden md:table-cell">Total Spent</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {uniqueCustomers.map((customer, index) => (
                                <TableRow key={customer.email}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={`https://picsum.photos/seed/avatar${index+1}/40/40`} />
                                                <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{customer.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell className="hidden md:table-cell">Ksh {
                                        mockOrders
                                        .filter(o => o.customer.email === customer.email)
                                        .reduce((acc, o) => acc + o.total, 0)
                                        .toFixed(2)
                                    }</TableCell>
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
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Send Message</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}

