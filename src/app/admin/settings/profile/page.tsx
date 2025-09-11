
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function AdminProfilePage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Profile Updated",
            description: "Your profile information has been saved.",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Manage your administrator profile details.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src="https://picsum.photos/seed/admin/100/100" />
                            <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                        <Button variant="outline">Change Photo</Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue="Admin" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue="User" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="admin@kamkunji.com" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input id="password" type="password" placeholder="Leave blank to keep current password" />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
