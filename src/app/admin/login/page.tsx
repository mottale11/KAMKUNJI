
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShoppingCart } from 'lucide-react';

const KamkunjiLogo = () => (
    <ShoppingCart className="h-8 w-8 text-primary" />
);

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const adminEmail = 'kamkunjin@gmail.com';

    if (email.toLowerCase() !== adminEmail) {
        toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You are not authorized to access this page.",
        });
        setLoading(false);
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        // If user does not exist, try to create it
        if (error.message === 'Invalid login credentials') {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signUpError) {
                 toast({
                    variant: "destructive",
                    title: "Admin Creation Failed",
                    description: signUpError.message,
                });
            } else {
                 toast({
                    title: "Admin Account Created",
                    description: "Your admin account has been set up. Logging in...",
                });
                router.push('/admin');
            }
        } else {
            toast({
                variant: "destructive",
                title: "Sign In Failed",
                description: error.message,
            });
        }
    } else {
        toast({
            title: "Admin Login Successful",
            description: "Welcome back, Admin!",
        });
        router.push('/admin');
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Card className="w-full max-w-sm mx-4">
            <CardHeader className="text-center">
                <Link href="/" className="flex items-center justify-center gap-2 font-bold text-xl mb-4">
                    <KamkunjiLogo />
                    <span className="font-headline">Kamkunji</span>
                </Link>
                <CardTitle className="text-2xl">Admin Access</CardTitle>
                <CardDescription>Enter your administrator credentials to continue.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleAdminSignIn} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="admin@example.com" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            type="password" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</> : 'Sign In'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
