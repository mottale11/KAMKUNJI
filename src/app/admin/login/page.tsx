'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const KamkunjiLogo = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
    >
      <circle cx="16" cy="16" r="16" fill="#1E90FF" />
      <path
        d="M10 10V22H13.2571L22 10.4375V10H10Z"
        fill="white"
      />
      <path
        d="M13.2571 22L22 13.75V22H13.2571Z"
        fill="white"
      />
    </svg>
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

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Double check after login
      if (auth.currentUser?.email === adminEmail) {
        toast({
            title: "Admin Login Successful",
            description: "Welcome back, Admin!",
        });
        router.push('/admin');
      } else {
        await signOut(auth); // Sign out if it's not the admin user
        throw new Error("Invalid credentials for admin access.");
      }
    } catch (error: any) {
      console.error("Error signing in as admin:", error);
       toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
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
