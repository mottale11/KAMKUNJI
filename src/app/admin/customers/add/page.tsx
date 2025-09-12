

'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

const customerSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function AddCustomerPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormValues>({
        resolver: zodResolver(customerSchema),
    });

    const onSubmit = async (data: CustomerFormValues) => {
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "customers"), {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                phone: data.phone,
                createdAt: new Date().toISOString(),
            });

            toast({
                title: "Customer Added",
                description: "The new customer has been successfully added.",
            });
            router.push('/admin/customers');
        } catch (error) {
             console.error("Error adding customer:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to add customer. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-4 mb-4">
                <Link href="/admin/customers">
                    <Button variant="outline" size="icon" className="h-7 w-7">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Add New Customer</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                    <CardDescription>Fill out the form to add a new customer.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" placeholder="John" {...register("firstName")} />
                                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" placeholder="Doe" {...register("lastName")} />
                                 {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john.doe@example.com" {...register("email")} />
                             {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" placeholder="+254 712 345 678" {...register("phone")} />
                        </div>
                        <div className="pt-4 flex justify-end gap-2">
                           <Button variant="outline" asChild>
                               <Link href="/admin/customers">Cancel</Link>
                           </Button>
                           <Button type="submit" disabled={isSubmitting}>
                               {isSubmitting ? 'Adding...' : 'Add Customer'}
                           </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}

    